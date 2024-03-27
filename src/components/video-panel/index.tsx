import { useEffect, useRef } from 'react';
import Avatar from '../avatar';

const VideoPanel: React.FC<{
  stream: MediaStream | null;
  user: Pick<UserInfo, 'avatar' | 'name'>;
}> = ({ stream, user }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);

  return (
    <div className="relative h-[600px] w-1/2 bg-gray-700">
      {stream ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          playsInline
          ref={videoRef}
        />
      ) : (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center p-2">
          <Avatar user={user} />
        </div>
      )}
    </div>
  );
};

export default VideoPanel;
