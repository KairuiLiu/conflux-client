import { useEffect, useRef } from 'react';
import Avatar from '../avatar';
import { useElementSize } from '@/utils/use-element-size';

const aspRange = [1.25, 1.8];

const VideoPanel: React.FC<{
  limitWidth?: boolean;
  limitHeight?: boolean;
  expendVideo?: boolean;
  camStream: MediaStream | null;
  screenStream: MediaStream | null;
  user: Pick<UserInfo, 'avatar' | 'name'>;
  mirrroCamera: boolean;
  fixAsp?: number;
}> = ({
  camStream,
  screenStream,
  user,
  mirrroCamera,
  limitWidth = false,
  limitHeight = false,
  expendVideo = true,
  fixAsp,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [panelRef, panelSize] = useElementSize<HTMLDivElement>();

  // limit both, or none => fill panel
  const expandPanel = limitWidth === limitHeight;
  const asp = fixAsp || (limitWidth ? aspRange[0] : aspRange[1]);

  useEffect(() => {
    const stream = screenStream || camStream;
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, screenStream, camStream]);

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-gray-100"
      style={{
        aspectRatio: expandPanel ? 'auto' : asp,
        width: expandPanel ? '100%' : 'auto',
        height: expandPanel ? '100%' : 'auto',
      }}
      ref={panelRef}
    >
      {screenStream || camStream ? (
        <video
          className={`${!screenStream ? 'scale-X-[-1]' : ''} h-full w-full ${expendVideo ? 'object-cover' : 'object-contain'}`}
          autoPlay
          playsInline
          ref={videoRef}
          style={{ transform: `scaleX(${mirrroCamera ? -1 : 1})` }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center p-2"
          style={{
            minHeight: Math.max(panelSize.height, panelSize.width) / asp,
            minWidth: Math.max(panelSize.height, panelSize.width) / asp,
          }}
        >
          <Avatar
            user={user}
            size={(Math.max(panelSize.height, panelSize.width) / asp) * 0.5}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPanel;
