import MediaControlBar from '@/components/media-control-bar';
import { VideoPanel } from '@/components/video-panel';
import { useVideoPanelSize } from '@/utils/use-panel-size';
import { Dialog, Listbox, Menu, Transition } from '@headlessui/react';
import {
  Cog8ToothIcon,
  WindowIcon,
  PhoneXMarkIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import { Fragment, useContext, useState } from 'react';
import SettingPanel from '../setting/setting-panel';
import useMediaStream from '@/utils/use-media-stream';
import { Context } from '@/context';
import useSpeakerStream from '@/utils/use-speaker-stream';
import { useNavigate } from 'react-router-dom';

// TODO extract to component
const MeetingPanel: React.FC<{
  setShowUserPanel: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowUserPanel }) => {
  const [itemCount, setItemCount] = useState(1);
  const [showSetting, setShowSetting] = useState(false);
  const [videoPanelRef, videoPanelSize] = useVideoPanelSize(itemCount);
  const { state } = useContext(Context);
  const navigate = useNavigate();
  const [
    selectedMicrophoneLabel,
    setSelectedMicrophoneLabel,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
    enableMicrophoneStream,
    setEnableMicrophoneStream,
  ] = useMediaStream(
    state.user.defaultMic || '',
    'audio',
    'microphone',
    state.user.defaultMic !== '' && state.user.autoEnableMic
  );

  // never need audio stream (because it just a testing stream, not a real stream)
  const [enableSpeaker, setEnableSpeaker] = useState(
    state.user.defaultSpeaker !== '' && state.user.autoEnableSpeaker
  );
  const [selectedSpeakerLabel, setSelectedSpeakerLabel] = useSpeakerStream(
    state.user.defaultSpeaker || ''
  );

  const [
    selectedCameraLabel,
    setSelectedCameraLabel,
    videoStream,
    enableCamera,
    setEnableCameraStream,
  ] = useMediaStream(
    state.user.defaultCamera || '',
    'video',
    'camera',
    state.user.defaultCamera !== '' && state.user.autoEnableCamera
  );

  const itemLayout = new Array(videoPanelSize.row)
    .fill(0)
    .map((_, row) =>
      Math.min(itemCount - row * videoPanelSize.col, videoPanelSize.col)
    );

  return (
    <>
      <section
        ref={videoPanelRef}
        className="flex flex-grow flex-col items-center justify-center gap-4 overflow-hidden rounded-lg"
      >
        {itemLayout.map((col, row) => (
          <div
            key={row}
            className="flex flex-nowrap content-center items-center justify-center gap-4 overflow-hidden rounded-lg"
          >
            {new Array(col).fill(0).map((_, index) => (
              <div
                key={`${row} ${index}`}
                style={{
                  width:
                    videoPanelSize.width -
                    ((videoPanelSize.col + 1) * 16) / videoPanelSize.col,
                  height:
                    videoPanelSize.height -
                    ((videoPanelSize.row + 1) * 16) / videoPanelSize.row,
                }}
                className="flex-shrink-0 overflow-hidden rounded-lg"
              >
                <VideoPanel
                  user={{
                    name: 'Kairui liu',
                    avatar: null,
                  }}
                  camStream={videoStream}
                  screenStream={null}
                  fixAvatarSize={
                    Math.min(videoPanelSize.width, videoPanelSize.height) / 2 ||
                    32
                  }
                  mirrroCamera={state.user.mirrorCamera}
                  expandCamera={state.user.expandCamera}
                />
              </div>
            ))}
          </div>
        ))}
      </section>
      <section className="flex items-center justify-between gap-4 px-3 py-2">
        <div>
          <button
            className="btn btn-primary p-0"
            onClick={() => {
              setItemCount((pre) => pre + 1);
            }}
          >
            +1
          </button>
        </div>
        <div className="flex flex-shrink flex-wrap gap-4">
          <MediaControlBar
            iconColor="text-gray-600"
            isCameraEnabled={enableCamera}
            setCameraEnable={setEnableCameraStream}
            selectedCameraLabel={selectedCameraLabel}
            setSelectedCameraLabel={setSelectedCameraLabel}
            isMicrophoneEnabled={enableMicrophoneStream}
            setMicrophoneEnable={setEnableMicrophoneStream}
            selectedMicrophoneLabel={selectedMicrophoneLabel}
            setSelectedMicrophoneLabel={setSelectedMicrophoneLabel}
            isSpeakerEnabled={enableSpeaker}
            setSpeakerEnable={setEnableSpeaker}
            setSelectedSpeakerLabel={setSelectedSpeakerLabel}
            selectedSpeakerLabel={selectedSpeakerLabel}
            optionsAside={false}
          />
          <button
            className="btn btn-gray-glass flex-shrink-0"
            onClick={() => {}}
          >
            <WindowIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button
            className="btn btn-gray-glass flex-shrink-0"
            onClick={() => {
              setShowUserPanel((d) => !d);
            }}
          >
            <UsersIcon className="h-4 w-4 text-gray-600" />
          </button>

          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="btn btn-danger-secondary flex-shrink-0">
                <PhoneXMarkIcon className="h-4 w-4 text-white" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute bottom-full left-1/2 z-10 mb-2 flex w-min -translate-x-1/2 flex-col gap-4 rounded-md bg-white p-4 text-base shadow-panel">
                <Menu.Item>
                  <button
                    className={'btn btn-danger-secondary-outline w-full'}
                    onClick={() => {
                      navigate('/exit', {
                        state: {
                          reason: 'exit',
                          roomId: '123456789',
                          userName: '123',
                        } as ExitInfo,
                      });
                    }}
                  >
                    Leave Meeting
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className={'btn btn-danger-secondary-outline w-full'}
                    onClick={() => {
                      navigate('/exit', {
                        state: {
                          reason: 'finish',
                          roomId: '123456789',
                          userName: '123',
                        } as ExitInfo,
                      });
                    }}
                  >
                    Finish Meeting
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <div>
          <button
            className="btn btn-gray-glass flex-shrink-0"
            onClick={() => {
              setShowSetting(true);
            }}
          >
            <Cog8ToothIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </section>
      <Dialog open={showSetting} onClose={() => setShowSetting(false)}>
        <Dialog.Panel>
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="h-min w-min rounded-lg bg-slate-200">
              <SettingPanel
                handleClose={() => {
                  setShowSetting(false);
                }}
              />
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default MeetingPanel;
