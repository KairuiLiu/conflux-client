import { useEffect, useRef } from 'react';
import Avatar from '../avatar';
import { useElementSize } from '@/utils/use-element-size';
import { aspRange } from '@/utils/use-panel-size';

export const VideoPanel: React.FC<{
  limitWidth?: boolean;
  limitHeight?: boolean;
  camStream: MediaStream | null;
  screenStream: MediaStream | null;
  user: Pick<UserInfo, 'avatar' | 'name'>;
  mirrroCamera?: boolean;
  fixAsp?: number;
  className?: string;
  fixAvatarSize?: number;
  expandCamera: boolean;
}> = ({
  camStream,
  screenStream,
  user,
  mirrroCamera = false,
  limitWidth = false,
  limitHeight = false,
  fixAsp,
  className = '',
  fixAvatarSize = 0,
  expandCamera,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [panelRef, panelSize] = useElementSize<HTMLDivElement>(!fixAvatarSize);

  useEffect(() => {
    console.log('limitHeight: ', limitHeight);
  }, [limitHeight]);

  // limit both, or none => fill panel
  const expandPanel = limitWidth === limitHeight;
  const asp = fixAsp || (limitWidth ? aspRange[0] : aspRange[1]);
  const avatarSize = fixAvatarSize
    ? fixAvatarSize
    : expandPanel
      ? Math.max(panelSize.height, panelSize.width) / asp
      : Math.min(panelSize.height, panelSize.width);

  useEffect(() => {
    const stream = screenStream || camStream;
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, screenStream, camStream]);

  return (
    <div
      className={
        'relative flex items-center overflow-hidden bg-gray-100 ' + className
      }
      style={{
        aspectRatio: expandPanel ? 'auto' : asp,
        width: expandPanel ? '100%' : 'auto',
        height: expandPanel ? '100%' : 'auto',
      }}
      ref={panelRef}
    >
      {screenStream || camStream ? (
        <video
          className={`${!screenStream ? 'scale-X-[-1]' : ''} h-full w-full ${expandCamera ? 'object-cover' : 'object-contain'}`}
          autoPlay
          playsInline
          ref={videoRef}
          style={{ transform: `scaleX(${mirrroCamera ? -1 : 1})` }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center p-2"
          style={{
            minHeight: avatarSize,
            minWidth: avatarSize,
          }}
        >
          <Avatar user={user} size={avatarSize * 0.5} />
        </div>
      )}
    </div>
  );
};
