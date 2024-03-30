import { Menu, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalCircleIcon,
  Square2StackIcon,
} from '@heroicons/react/24/outline';
import { Fragment } from 'react/jsx-runtime';

const MeetingHeader: React.FC = () => {
  return (
    <header className="flex content-stretch items-center gap-2 px-2 py-2 text-xs">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="btn btn-text flex items-center gap-1 px-1 py-0 font-normal ">
            Karry's Meeting
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
          <Menu.Items className="l-0 felx absolute z-10 mt-2 w-min flex-col rounded-md bg-white text-base shadow-panel">
            <section className="p-4">
              <h3 className="pb-3 text-lg font-semibold">Karry's Meeting</h3>
              <div className="grid grid-cols-[min-content_1fr] gap-3 whitespace-nowrap">
                <div>Meeting ID</div>
                <div className="flex  items-center gap-1">
                  <span>123 456 789</span>
                  <button className="btn btn-text -scale-x-100 p-1">
                    <Square2StackIcon className="h-4 w-4" />
                  </button>
                </div>
                <div>Organizer</div>
                <div>Karry</div>
                <div>Meeting Link</div>
                <div className="flex  items-center gap-1">
                  <span>conflux.liukairui.me/meet/123456789</span>
                  <button className="btn btn-text -scale-x-100 p-1">
                    <Square2StackIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>
            <footer className="border-t p-4">
              <button className="btn btn-primary-outline py-1">
                Copy Join Info
              </button>
            </footer>
          </Menu.Items>
        </Transition>
      </Menu>
      <div className="h-4 border-r border-gray-200" />
      <span>12:34</span>
    </header>
  );
};

export default MeetingHeader;
