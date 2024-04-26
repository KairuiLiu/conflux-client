import MeetingInfoCard from '@/components/meeting-info-card';
import useMeetingStore from '@/context/meeting-context';
import { fillLeft } from '@/utils/fill-left';
import { genJoinInfo } from '@/utils/gen-join-info';
import { getLocalDateTime } from '@/utils/get-local-time';
import { writeClipboard } from '@/utils/write-clipboard';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

const MeetingHeader: React.FC = () => {
  const meetingContext = useMeetingStore((d) => d);
  const [pastTime, setPastTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const meetingTime = getLocalDateTime(
        meetingContext?.meetingState?.meetingStartTime || 0
      );

      const timePast = meetingContext?.meetingState?.meetingStartTime
        ? Date.now() - meetingContext?.meetingState?.meetingStartTime
        : 0;
      setPastTime(
        timePast > 0
          ? `${fillLeft(`${Math.floor(timePast / 1000 / 60)}`, 2)}:${fillLeft(
              `${Math.floor((timePast / 1000) % 60)}`,
              2
            )}`
          : meetingContext?.meetingState?.meetingStartTime
            ? 'The meeting will start at ' + meetingTime
            : ''
      );
    }, 500);

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <header className="flex content-stretch items-center gap-2 px-2 py-2 text-xs">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="btn btn-text flex items-center gap-1 px-1 py-0 font-normal ">
            {meetingContext?.meetingState?.title}
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
              <h3 className="pb-3 text-lg font-semibold">
                {meetingContext?.meetingState?.title || ''}
              </h3>
              <MeetingInfoCard withTopic={false} />
            </section>
            <footer className="border-t p-4">
              <button
                className="btn btn-primary-outline py-1"
                onClick={() => {
                  writeClipboard(
                    genJoinInfo(
                      meetingContext?.meetingState?.organizer?.name,
                      meetingContext?.meetingState?.title || '',
                      meetingContext.meetingState.id,
                      meetingContext?.meetingState?.meetingStartTime,
                      meetingContext?.meetingState?.passcode
                    )
                  );
                }}
              >
                Copy Join Info
              </button>
            </footer>
          </Menu.Items>
        </Transition>
      </Menu>
      <div className="h-4 border-r border-gray-200" />
      <span>{pastTime}</span>
    </header>
  );
};

export default MeetingHeader;
