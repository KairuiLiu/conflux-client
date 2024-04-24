import { useEffect, useRef, useState } from 'react';
import { buildWebGL2Pipeline } from '../pipelines/webgl2Pipeline';
import { createTimerWorker } from '../helpers/timerHelper';
import { BackgroundConfig } from '../helpers/backgroundHelper';
import { RenderingPipeline } from '../helpers/renderingPipelineHelper';
import { SegmentationConfig } from '../helpers/segmentationHelper';
import { SourcePlayback } from '../helpers/sourceHelper';
import { TFLite } from './useTFLite';

function useRenderingPipeline(
  sourcePlayback: SourcePlayback | undefined,
  backgroundConfig: BackgroundConfig,
  segmentationConfig: SegmentationConfig,
  tflite: TFLite
) {
  const [pipeline, setPipeline] = useState<RenderingPipeline | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [fps, setFps] = useState(0);
  const [durations, setDurations] = useState<number[]>([]);

  useEffect(() => {
    if (!sourcePlayback || !tflite) return;
    const targetTimerTimeoutMs = 1000 / segmentationConfig.targetFps;
    let previousTime = 0;
    let beginTime = 0;
    let eventCount = 0;
    let frameCount = 0;
    const frameDurations: number[] = [];

    let renderTimeoutId: number;

    const timerWorker = createTimerWorker();

    const newPipeline = buildWebGL2Pipeline(
      sourcePlayback,
      backgroundImageRef.current,
      backgroundConfig,
      canvasRef.current,
      tflite,
      timerWorker,
      addFrameEvent
    );

    async function render() {
      const startTime = performance.now();

      beginFrame();
      await newPipeline.render();
      endFrame();

      renderTimeoutId = timerWorker.setTimeout(
        render,
        Math.max(0, targetTimerTimeoutMs - (performance.now() - startTime))
      );
    }

    function beginFrame() {
      beginTime = Date.now();
    }

    function addFrameEvent() {
      const time = Date.now();
      frameDurations[eventCount] = time - beginTime;
      beginTime = time;
      eventCount++;
    }

    function endFrame() {
      const time = Date.now();
      frameDurations[eventCount] = time - beginTime;
      frameCount++;
      if (time >= previousTime + 1000) {
        setFps((frameCount * 1000) / (time - previousTime));
        setDurations(frameDurations);
        previousTime = time;
        frameCount = 0;
      }
      eventCount = 0;
    }

    render();
    console.log(
      'Animation started:',
      sourcePlayback,
      backgroundConfig,
      segmentationConfig
    );

    setPipeline(newPipeline);

    return () => {
      timerWorker.clearTimeout(renderTimeoutId);
      timerWorker.terminate();
      newPipeline.cleanUp();
      console.log(
        'Animation stopped:',
        sourcePlayback,
        backgroundConfig,
        segmentationConfig
      );

      setPipeline(null);
    };
  }, [sourcePlayback, backgroundConfig, segmentationConfig, tflite]);

  return {
    pipeline,
    backgroundImageRef,
    canvasRef,
    fps,
    durations,
  };
}

export default useRenderingPipeline;
