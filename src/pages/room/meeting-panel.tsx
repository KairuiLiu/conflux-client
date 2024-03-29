import MediaControlBar from '@/components/media-control-bar';
import { VideoPanel } from '@/components/video-panel';
import { useVideoPanelSize } from '@/utils/use-panel-size';
import {
  Cog8ToothIcon,
  WindowIcon,
  PhoneXMarkIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';

const MeetingPanel: React.FC = () => {
  const [tmpCount, setTmpCount] = useState(2);
  const [videoPanelRef, videoPanelSize, setItemCount] =
    useVideoPanelSize(tmpCount);

  return (
    <>
      <section
        ref={videoPanelRef}
        className="flex flex-grow flex-wrap content-center items-center justify-center overflow-hidden rounded-lg"
      >
        {new Array(tmpCount).fill(0).map((_, index) => (
          <div
            key={index}
            style={{
              width: videoPanelSize.width - 32,
              height: videoPanelSize.height - 32,
            }}
            className="flex-shrink-0 p-2 transition-all"
          >
            <div className="h-full w-full overflow-hidden rounded-lg">
              <VideoPanel
                user={{
                  name: 'Kairui liu',
                  avatar: null,
                }}
                camStream={null}
                screenStream={null}
                fixAvatarSize={
                  Math.min(videoPanelSize.width, videoPanelSize.height) / 2 ||
                  32
                }
              />
            </div>
          </div>
        ))}
      </section>
      <section className="flex justify-between px-3 py-2 ">
        <div>
          <button
            className="btn btn-primary p-0"
            onClick={() => {
              setTmpCount((pre) => pre + 1);
              setItemCount((pre) => pre + 1);
            }}
          >
            +1
          </button>
        </div>
        <div className="flex gap-4">
          <MediaControlBar iconColor="text-gray-600" />
          <button className="btn btn-gray-glass" onClick={() => {}}>
            <WindowIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button className="btn btn-gray-glass" onClick={() => {}}>
            <UsersIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button className="btn btn-danger-secondary " onClick={() => {}}>
            <PhoneXMarkIcon className="h-4 w-4 text-white" />
          </button>
        </div>
        <div>
          <button className="btn btn-gray-glass" onClick={() => {}}>
            <Cog8ToothIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </section>
    </>
  );
};

export default MeetingPanel;

// TODO Camera clip
