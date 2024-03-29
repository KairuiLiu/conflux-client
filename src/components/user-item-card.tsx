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
import { useState } from 'react';

const UserItemCard = () => {
  const [isOpen, setIsOpen] = useState(false);
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
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary-outline py-1"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary py-1"
                      onClick={() => setIsOpen(false)}
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            user={{
              name: 'Demo',
              avatar: null,
            }}
          />
          <div className="flex flex-col">
            <h4 className="text-sm">Demo</h4>
            <span className="text-xs text-gray-500">Host</span>
          </div>
        </div>
        <div className='whitespace-nowrap'>
          <button className="btn btn-remove-focus btn-text p-1">
            <MicrophoneIcon className="h-4 w-4 " />
          </button>
          <button className="btn btn-remove-focus btn-text p-1">
            <MicroPhoneMuteIcon className="h-4 w-4 text-red-500" />
          </button>
          <button className="btn btn-remove-focus btn-text p-1">
            <VideoCameraIcon className="h-4 w-4 " />
          </button>
          <button className="btn btn-remove-focus btn-text p-1">
            <WindowIcon className="h-4 w-4" />
          </button>

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
                  <Menu.Item>
                    <button className={'px-2 py-2 text-left'}>
                      Enable Microphone
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className={'px-2 py-2 text-left'}>
                      Disable Camera
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className={'px-2 py-2 text-left'}>
                      Disable Screensharing
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      className={'px-2 py-2 text-left'}
                      onClick={() => setIsOpen(true)}
                    >
                      Change Username
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className={'px-2 py-2 text-left'}>
                      Remove from Meeting
                    </button>
                  </Menu.Item>
                </section>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default UserItemCard;
