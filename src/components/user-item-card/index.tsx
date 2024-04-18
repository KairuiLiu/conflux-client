import Avatar from '@/components/avatar';
import {
  MicrophoneIcon,
  VideoCameraIcon,
  WindowIcon,
} from '@heroicons/react/24/solid';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import MicroPhoneMuteIcon from '@/assets/MicrophoneMuteIcon.svg?react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { emitSocket } from '@/utils/use-socket';
import useMeetingStore from '@/context/meeting-context';

const UserItemCard: React.FC<{
  user: Participant;
}> = ({ user }) => {
  const meetingContext = useMeetingStore((s) => s);
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState(user.name);

  const isSelfHost = meetingContext.selfState?.role === 'HOST';
  const canOperate = meetingContext.selfState.muid === user.muid || isSelfHost;

  useEffect(() => {
    setNewName(user.name);
  }, [user.name]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMidaState = (v: any) => {
    emitSocket('UPDATE_USER_STATE', { muid: user.muid, state: v });
  };

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-min transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Change Username
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="input "
                      placeholder="Enter your new username"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary-outline py-1"
                      onClick={() => {
                        setNewName(user.name);
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary py-1"
                      onClick={() => {
                        emitSocket('UPDATE_USER_STATE', {
                          muid: user.muid,
                          name: newName,
                        });
                        setIsOpen(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="flex w-full flex-shrink items-center justify-between">
        <div className="flex w-0 flex-grow items-center gap-3">
          <Avatar user={user} />
          <div className="flex w-0 flex-grow flex-col">
            <h4 className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
              {user.name}
            </h4>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
              {user.role}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 whitespace-nowrap">
          {
            <button
              className={
                'btn btn-remove-focus btn-text p-1 ' +
                (!user.state.mic || !canOperate
                  ? 'btn-disabled-icon-user-management'
                  : '')
              }
              disabled={!user.state.mic || !canOperate}
              onClick={() => updateMidaState({ mic: false })}
            >
              {user.state.mic ? (
                <MicrophoneIcon className="h-4 w-4 " />
              ) : (
                <MicroPhoneMuteIcon className="h-4 w-4 text-red-500" />
              )}
            </button>
          }
          {user.state.camera && (
            <button
              className={
                'btn btn-remove-focus btn-text p-1 ' +
                (!user.state.camera || !canOperate
                  ? 'btn-disabled-icon-user-management'
                  : '')
              }
              disabled={!user.state.camera || !canOperate}
              onClick={() => updateMidaState({ camera: false })}
            >
              <VideoCameraIcon className="h-4 w-4 " />
            </button>
          )}
          {user.state.screen && (
            <button
              className={
                'btn btn-remove-focus btn-text p-1 ' +
                (!user.state.screen || !canOperate
                  ? 'btn-disabled-icon-user-management'
                  : '')
              }
              disabled={!user.state.screen || !canOperate}
              onClick={() => updateMidaState({ screen: false })}
            >
              <WindowIcon className="h-4 w-4" />
            </button>
          )}
          {canOperate && (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="btn btn-remove-focus btn-text p-1">
                  <EllipsisHorizontalCircleIcon className="h-4 w-4" />
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
                <Menu.Items className=" felx absolute right-0 z-10 mt-2 w-min flex-col rounded-md bg-white text-base shadow-panel">
                  <section className="flex flex-col whitespace-nowrap p-1 text-sm ">
                    {user.state.mic && (
                      <Menu.Item>
                        <button
                          className={'px-2 py-2 text-left'}
                          onClick={() => updateMidaState({ mic: false })}
                        >
                          Disable Microphone
                        </button>
                      </Menu.Item>
                    )}
                    {user.state.camera && (
                      <Menu.Item>
                        <button
                          className={'px-2 py-2 text-left'}
                          onClick={() => updateMidaState({ camera: false })}
                        >
                          Disable Camera
                        </button>
                      </Menu.Item>
                    )}
                    {user.state.screen && (
                      <Menu.Item>
                        <button
                          className={'px-2 py-2 text-left'}
                          onClick={() => updateMidaState({ screen: false })}
                        >
                          Disable Screensharing
                        </button>
                      </Menu.Item>
                    )}
                    {isSelfHost && (
                      <Menu.Item>
                        <button
                          className={'px-2 py-2 text-left'}
                          onClick={() =>
                            emitSocket('UPDATE_USER_STATE', {
                              muid: user.muid,
                              role:
                                user.role === 'HOST' ? 'PARTICIPANT' : 'HOST',
                            })
                          }
                        >
                          {user.role === 'HOST' ? 'Remove Host' : 'Make Host'}
                        </button>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <button
                        className={'px-2 py-2 text-left'}
                        onClick={() => setIsOpen(true)}
                      >
                        Change Username
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className={'px-2 py-2 text-left'}
                        onClick={() =>
                          emitSocket('REMOVE_USER', { muid: user.muid })
                        }
                      >
                        Remove from Meeting
                      </button>
                    </Menu.Item>
                  </section>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserItemCard;
