import MediaControlBar from '@/components/media-control-bar';
import { VideoPanel } from '@/components/video-panel';
import useGlobalStore from '@/context/global-context';
import SettingPanel from '@/pages/setting/setting-panel';
import { MeetingContextType } from '@/types/meeting';
import useMediaStream from '@/utils/use-media-stream';
import { Dialog } from '@headlessui/react';
import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import { ReactNode, useState } from 'react';

// const maxHeight = 75;
// const maxWidth = (maxHeight / 2) * aspRange[1];

const MeetConfigLayout = ({
  titleBar,
  configForm,
  meetingContext,
}: {
  titleBar: ReactNode;
  configForm: ReactNode;
  meetingContext: MeetingContextType;
}) => {
  const state = useGlobalStore((d) => d);
  const [showSetting, setShowSetting] = useState(false);

  useMediaStream(
    meetingContext.meetingDeviceState.micLabel,
    meetingContext.setMeetingDeviceState.setMicLabel,
    meetingContext.meetingDeviceState.enableMic,
    'audio',
    'microphone'
  );

  // never need audio stream (because it just a testing stream, not a real stream)
  // useSpeakerStream(
  //   meetingContext.meetingDeviceState.speakerLabel,
  //   meetingContext.setMeetingDeviceState.setSpeakerLabel
  // );

  const [videoStream] = useMediaStream(
    meetingContext.meetingDeviceState.cameraLabel,
    meetingContext.setMeetingDeviceState.setCameraLabel,
    meetingContext.meetingDeviceState.enableCamera,
    'video',
    'camera'
  );

  const user = {
    name: meetingContext.selfState.name,
    avatar: state.user.avatar,
  };

  return (
    <main className="flex flex-grow -translate-y-8 flex-col items-center justify-center gap-6 px-4">
      {titleBar}
      <div
        className={
          'flex w-full flex-wrap gap-0 lg:max-h-fit lg:max-w-[calc(1024px-2rem)] lg:flex-nowrap lg:gap-4 ' +
          'overflow-hidde overflow-hidden rounded-lg shadow-panel transition-all lg:overflow-visible lg:rounded-none lg:shadow-none ' +
          'max-h-[75dvh] max-w-[min(67.5dvh,_100vw)]'
        }
      >
        <div
          className={
            'lg:flex-basis-[calc(100%-8rem)] relative w-full flex-grow ' +
            'overflow-visible rounded-none shadow-none transition-all lg:flex-grow-0 lg:overflow-hidden lg:rounded-lg lg:shadow-panel '
          }
        >
          <VideoPanel
            user={user}
            mirrroCamera={state.user.mirrorCamera}
            camStream={
              meetingContext.meetingDeviceState.enableCamera
                ? videoStream
                : null
            }
            screenStream={null}
            expandCamera={state.user.expandCamera}
            limitHeight
          />
          <div className="absolute bottom-4 flex w-full items-center justify-center gap-4 overflow-x-clip">
            <MediaControlBar meetingContext={meetingContext} />
            <button
              className="btn btn-gray-glass"
              onClick={() => {
                setShowSetting(true);
              }}
            >
              <Cog8ToothIcon className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
        <div
          className={
            'flex w-full flex-shrink-0 flex-col items-center justify-around bg-panel-white p-7 lg:items-start ' +
            'overflow-auto rounded-none shadow-none transition-shadow lg:w-fit lg:overflow-hidden lg:rounded-lg lg:shadow-panel'
          }
        >
          {configForm}
        </div>
      </div>

      <Dialog open={showSetting} onClose={() => setShowSetting(false)}>
        <Dialog.Panel>
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-gray-300 p-4">
            <SettingPanel
              handleClose={() => {
                setShowSetting(false);
              }}
            />
          </div>
        </Dialog.Panel>
      </Dialog>
    </main>
  );
};

export default MeetConfigLayout;
