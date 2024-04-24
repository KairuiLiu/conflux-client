import useGlobalStore from '@/context/global-context';
import { useEffect, useMemo, useRef, useState } from 'react';
import useMediaStream from '@/hooks/use-media-stream';
import useBgReplace from '@/hooks/use-background-replace';
import { BackgroundConfig } from '@/hooks/use-background-replace/helpers/backgroundHelper';
import videoBackgroundImage from '@/utils/video-background-image';

function VideoBackgroundSetting() {
  const globalState = useGlobalStore((d) => d);
  const [currentBackground] = useState<number>(
    // globalState.user.videoBackground
    3
  );

  const [selectedCameraLabel, setSelectedCameraLabel] = useState<string>(
    globalState.user.defaultCamera || ''
  );
  const [originVideoStream, setOriginVideoStream] =
    useState<MediaStream | null>(null);

  useMediaStream(
    selectedCameraLabel,
    setSelectedCameraLabel,
    true,
    () => {},
    originVideoStream,
    setOriginVideoStream,
    'video',
    'camera'
  );

  const backgroundConfig = useMemo<BackgroundConfig>(() => {
    return currentBackground < 2
      ? {
          type: currentBackground === 0 ? 'none' : 'blur',
        }
      : {
          type: 'image',
          url: videoBackgroundImage[currentBackground - 2],
        };
  }, [currentBackground]);

  const [canvasRef, backgroundImageRef, replacedStream] = useBgReplace(
    backgroundConfig,
    originVideoStream
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const instance = videoRef.current;
    instance.srcObject = replacedStream;
    return () => {
      instance.srcObject = null;
    };
  }, [replacedStream, videoRef, originVideoStream]);

  // const submitState = () => {};

  return (
    <>
      <div>
        {backgroundConfig.type === 'image' && (
          <img
            ref={backgroundImageRef}
            src={backgroundConfig.url}
            alt=""
            hidden={true}
          />
        )}
        <canvas
          key={'webgl2'}
          ref={canvasRef}
          width={originVideoStream?.getVideoTracks()[0].getSettings().width}
          height={originVideoStream?.getVideoTracks()[0].getSettings().height}
          hidden={true}
        />
        <video autoPlay muted ref={videoRef} />
      </div>
    </>
  );
}

export default VideoBackgroundSetting;
