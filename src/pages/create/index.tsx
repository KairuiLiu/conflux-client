import useGlobalStore from '@/context/global-context';
import useMeetingStore from '@/context/meeting-context';
import MeetConfigLayout from '@/layout/meet-config-layout';
import toastConfig from '@/utils/toast-config';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookMeeting from './book-meeting';

export default function Create() {
  const state = useGlobalStore((d) => d);
  const meetingContext = useMeetingStore((d) => d);
  const [canCreate, setCanCreate] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    meetingContext.resetMeetingContext();
  }, []);

  async function onCreate(time: number = 0) {
    const start_time = time || Date.now();
    const createFetch = fetch('/api/meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${state.siteConfig.token}`,
      },
      body: JSON.stringify({
        organizer_name: meetingContext.selfState.name,
        title: meetingContext.meetingState.title,
        start_time,
      }),
    })
      .then((d) => d.json())
      .then(({ code, data, msg }) => {
        if (code) throw msg;
        else {
          meetingContext.setMeetingState.setOrganizer({
            ...meetingContext.meetingState.organizer,
            name: meetingContext.selfState.name,
          });
          meetingContext.setMeetingState.setId(`${data.id}`);
          meetingContext.setMeetingState.setMeetingStartTime(start_time);
          if (!time) navigate(`/room/${data.id}`);
        }
      });
    toast.promise(
      createFetch,
      {
        pending: 'Creating the meeting',
        error: 'Create Failed.',
      },
      toastConfig
    );
    return createFetch;
  }

  useEffect(() => {
    setCanCreate(
      meetingContext.selfState.name.length > 0 &&
        meetingContext.meetingState.title!.length > 0
    );
  }, [meetingContext.selfState.name, meetingContext.meetingState.title]);

  return (
    <MeetConfigLayout
      meetingContext={meetingContext}
      titleBar={
        <input
          className="input input-underline bg-transparent invalid:border-red-600"
          value={meetingContext.meetingState.title}
          onChange={(e) =>
            meetingContext.setMeetingState.setTitle(e.target.value)
          }
          placeholder="Meeting Title"
          required
        ></input>
      }
      configForm={
        <>
          <h3 className="pb-7 text-xl font-semibold lg:pb-0">
            Start a Meeting
          </h3>
          <div className="flex w-min flex-col gap-8 lg:gap-3">
            <div className="flex flex-col gap-3">
              <input
                className="input"
                placeholder="Your Name"
                value={meetingContext.selfState.name}
                onChange={(e) => {
                  meetingContext.setSelfState.setName(e.target.value.trim());
                }}
                required
              ></input>
            </div>
            <div className="flex">
              <button
                disabled={!canCreate}
                className={`btn btn-primary p-1 ${canCreate ? '' : 'btn-disabled'} w-full flex-shrink rounded-r-none`}
                onClick={() => onCreate()}
              >
                Start
              </button>
              <div className="relative flex flex-shrink-0 flex-nowrap overflow-y-visible">
                <Menu>
                  <div className="w-full flex-shrink flex-grow">
                    <Menu.Button
                      className={`btn btn-primary rounded-l-none ${canCreate ? '' : 'btn-disabled'}`}
                    >
                      <span>
                        <ChevronDownIcon
                          strokeWidth="2px"
                          className="h-4 w-4 rotate-180 lg:rotate-0 transition-all"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Menu.Items
                        className={`list-options list-options-right absolute px-2 bottom-full lg:bottom-auto`}
                      >
                        <Menu.Item key={'later'}>
                          {({ active }) => (
                            <button
                              className={`${
                                active && 'bg-primary text-white'
                              } btn flex px-2 py-2`}
                              onClick={() => setShowCalendar(true)}
                            >
                              <CalendarDaysIcon
                                className="mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                              Book for later
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </div>
                </Menu>
              </div>
            </div>
          </div>
          <BookMeeting
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            onBook={onCreate}
          />
        </>
      }
    ></MeetConfigLayout>
  );
}
