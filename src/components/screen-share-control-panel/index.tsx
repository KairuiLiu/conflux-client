import { aspRange } from '@/utils/use-panel-size';
import { Switch } from '@headlessui/react';
import { useEffect, useRef } from 'react';

export const ScreenShareControlPanel: React.FC<{
  limitWidth?: boolean;
  limitHeight?: boolean;
  fixAsp?: number;
  className?: string;
  handleStopSharing: () => void;
  enableAudio: boolean;
  setEnableAudio: React.Dispatch<React.SetStateAction<boolean>>;
  screenStream: MediaStream;
}> = ({
  limitWidth = false,
  limitHeight = false,
  fixAsp,
  className = '',
  handleStopSharing,
  enableAudio,
  setEnableAudio,
  screenStream,
}) => {
  const expandPanel = limitWidth === limitHeight;
  const asp = fixAsp || (limitWidth ? aspRange[0] : aspRange[1]);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && screenStream)
      videoRef.current.srcObject = screenStream;
  }, [videoRef, screenStream]);

  return (
    <div
      className={
        'relative flex h-full w-full items-center overflow-hidden bg-gray-100 ' +
        className
      }
      style={{
        aspectRatio: expandPanel ? 'auto' : asp,
        width: expandPanel ? '100%' : 'auto',
        height: expandPanel ? '100%' : 'auto',
      }}
    >
      <video
        className={`h-full w-full object-contain absolute`}
        autoPlay
        playsInline
        ref={videoRef}
      />
      <div className="flex h-full w-full flex-col items-center  justify-evenly p-2 text-center absolute backdrop-blur-md backdrop-brightness-90 rounded-lg overflow-hidden">
        <div className="flex flex-col gap-3">
          <p className="text-xl">You are Sharing the Screen</p>
          <div className="flex items-center justify-center gap-2">
            Share device audio
            <Switch
              checked={enableAudio}
              onChange={() => setEnableAudio((d) => !d)}
              className={
                enableAudio ? 'switch-wapper-enable' : 'switch-wapper-disable'
              }
            >
              <span
                className={
                  enableAudio ? 'switch-core-enable' : 'switch-core-disable'
                }
              />
            </Switch>
          </div>
        </div>
        <div>
          <button
            className="btn btn-danger-secondary"
            onClick={handleStopSharing}
          >
            Stop Sharing
          </button>
        </div>
      </div>
    </div>
  );
};
