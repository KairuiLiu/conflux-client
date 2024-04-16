import MediaControlBar from '@/components/media-control-bar';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Cog8ToothIcon,
  WindowIcon,
  PhoneXMarkIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import React, { Fragment, useState } from 'react';
import SettingPanel from '../setting/setting-panel';
import { useNavigate } from 'react-router-dom';
import useMeetingStore from '@/context/meeting-context';
import { v4 } from 'uuid';

const MeetingControlBar: React.FC<{
  setEnableScreenShareStream: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUserPanel: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setEnableScreenShareStream, setShowUserPanel }) => {
  const [showSetting, setShowSetting] = useState(false);
  const navigate = useNavigate();
  const meetingContext = useMeetingStore((d) => d);

  return (
    <>
      <section className="flex items-center justify-between gap-4 px-3 py-2">
        <div>
          <button
            className="btn btn-primary p-0"
            onClick={() => {
              const uuid = v4();
              meetingContext.setMeetingState.setParticipants([
                ...(meetingContext?.meetingState?.participants || []),
                {
                  id: uuid,
                  name: 'User_' + uuid.slice(0, 5),
                  avatar: null,
                },
              ]);
            }}
          >
            Add Mock User
          </button>
        </div>
        <div className="flex flex-shrink flex-wrap gap-4">
          <MediaControlBar
            iconColor="text-gray-600"
            meetingContext={meetingContext}
            optionsAside={false}
          />
          {navigator.mediaDevices.getDisplayMedia instanceof Function && (
            <button
              className="btn btn-gray-glass flex-shrink-0"
              onClick={() => {
                setEnableScreenShareStream((d) => !d);
              }}
            >
              <WindowIcon className="h-4 w-4 text-gray-600" />
            </button>
          )}
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
                          roomId: meetingContext.meetingState.id,
                          userName: meetingContext.meeetingUserName,
                        } as ExitInfo,
                      });
                    }}
                  >
                    Leave Meeting
                  </button>
                </Menu.Item>
                {meetingContext?.meeetingUserName ===
                  meetingContext?.meetingState?.organizer?.name && (
                  <Menu.Item>
                    <button
                      className={'btn btn-danger-secondary-outline w-full'}
                      onClick={() => {
                        navigate('/exit', {
                          state: {
                            reason: 'finish',
                            roomId: meetingContext.meetingState.id,
                            userName: meetingContext.meeetingUserName,
                          } as ExitInfo,
                        });
                      }}
                    >
                      Finish Meeting
                    </button>
                  </Menu.Item>
                )}
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

export default MeetingControlBar;
