import { useEffect, useRef } from 'react';
import Avatar from '../avatar';
import { useElementSize } from '@/utils/use-element-size';
import { aspRange } from '@/utils/use-panel-size';
import useAudioStreamPlayer from '@/utils/use-audio-stream-player';

export const VideoPanel: React.FC<{
  limitWidth?: boolean;
  limitHeight?: boolean;
  camStream: MediaStream | null;
  screenStream: MediaStream | null;
  audioStream: MediaStream | null;
  user: {
    name: string;
    avatar?: string | null;
  };
  mirrroCamera?: boolean;
  fixAsp?: number;
  className?: string;
  fixAvatarSize?: number;
  expandCamera: boolean;
}> = ({
  camStream,
  screenStream,
  audioStream,
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
  const setAudioStream = useAudioStreamPlayer();

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

  useEffect(() => {
    if (audioStream) setAudioStream(audioStream);
    return () => setAudioStream(null);
  }, [audioStream, setAudioStream]);

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
      {!!screenStream || !!camStream ? (
        <video
          className={`${!screenStream ? 'scale-X-[-1]' : ''} h-full w-full ${expandCamera && !screenStream ? 'object-cover' : 'object-contain'}`}
          autoPlay
          playsInline
          ref={videoRef}
          style={{
            transform: `scaleX(${mirrroCamera && !screenStream ? -1 : 1})`,
          }}
          muted={true}
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
