import { useEffect, useMemo, useState } from 'react';
import { BackgroundConfig } from './helpers/backgroundHelper';
import { SegmentationConfig } from './helpers/segmentationHelper';
import { SourcePlayback } from './helpers/sourceHelper';
import useRenderingPipeline from './hooks/useRenderingPipeline';
import useTFLite from './hooks/useTFLite';

function useBgReplace(
  backgroundConfig: BackgroundConfig,
  stream: MediaStream | null
): [
  React.RefObject<HTMLCanvasElement>,
  React.RefObject<HTMLImageElement>,
  MediaStream | null,
] {
  const [segmentationConfig, setSegmentationConfig] =
    useState<SegmentationConfig>({
      backend: 'wasm',
      targetFps: stream?.getVideoTracks()[0].getSettings().frameRate || 65, // 60 introduces fps drop and unstable fps on Chrome
    });

  const { tflite, isSIMDSupported } = useTFLite(segmentationConfig);
  const [sourcePlayback, setSourcePlayback] = useState<SourcePlayback>();
  const [replacedStream, setReplacedStream] = useState<MediaStream | null>(
    null
  );
  const videoElem = useMemo(() => document.createElement('video'), []);
  videoElem.autoplay = true;

  useEffect(() => {
    if (!stream) return;
    setSegmentationConfig((d) => {
      const trackFps = stream.getVideoTracks()[0].getSettings().frameRate || 60;
      const targetFps = Math.floor(trackFps * 1.1);

      return {
        ...d,
        targetFps,
      };
    });
    videoElem.srcObject = stream;
    setSourcePlayback({
      htmlElement: videoElem,
      width: stream.getVideoTracks()[0].getSettings().width!,
      height: stream.getVideoTracks()[0].getSettings().height!,
    });
    return () => {
      videoElem.srcObject = null;
      setSourcePlayback(undefined);
    };
  }, [stream]);

  const { pipeline, backgroundImageRef, canvasRef } = useRenderingPipeline(
    sourcePlayback,
    backgroundConfig,
    segmentationConfig,
    tflite!
  );

  useEffect(() => {
    setSegmentationConfig((previousSegmentationConfig) => {
      if (previousSegmentationConfig.backend === 'wasm' && isSIMDSupported) {
        return { ...previousSegmentationConfig, backend: 'wasmSimd' };
      } else {
        return previousSegmentationConfig;
      }
    });
  }, [isSIMDSupported]);

  useEffect(() => {
    if (pipeline) {
      pipeline.updatePostProcessingConfig({
        coverage: [0.5, 0.75],
      });
    }
  }, [pipeline]);

  useEffect(() => {
    if (!canvasRef.current) return;
    setReplacedStream(canvasRef.current.captureStream());
  }, [canvasRef]);

  return [canvasRef, backgroundImageRef, replacedStream];
}

export default useBgReplace;
