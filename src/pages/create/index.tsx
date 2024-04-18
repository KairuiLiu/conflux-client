import useGlobalStore from '@/context/global-context';
import useMeetingContext from '@/context/meeting-context';
import MeetConfigLayout from '@/layout/meet-config-layout';
import toastConfig from '@/utils/toast-config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Create() {
  const state = useGlobalStore((d) => d);
  const meetingContext = useMeetingContext((d) => d);
  const [canCreate, setCanCreate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    meetingContext.resetMeetingContext();
  }, []);

  async function onCreate() {
    const createFetch = fetch('/api/meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${state.siteConfig.token}`,
      },
      body: JSON.stringify({
        organizer_name: meetingContext.unactiveUserName,
        title: meetingContext.meetingState.title,
      }),
    })
      .then((d) => d.json())
      .then(({ code, data, msg }) => {
        if (code) throw msg;
        else {
          meetingContext.setMeetingState.setOrganizer({
            ...meetingContext.meetingState.organizer,
            name: meetingContext.unactiveUserName,
          });
          meetingContext.setMeetingState.setId(`${data.id}`);
          meetingContext.setMeetingState.setMeetingStartTime(Date.now());
          navigate(`/room/${data.id}`);
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
  }

  useEffect(() => {
    setCanCreate(
      meetingContext.unactiveUserName.length > 0 &&
        meetingContext.meetingState.title!.length > 0
    );
  }, [meetingContext.unactiveUserName, meetingContext.meetingState.title]);

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
                value={meetingContext.unactiveUserName}
                onChange={(e) => {
                  meetingContext.setUnactiveUserName(e.target.value.trim());
                }}
                required
              ></input>
            </div>
            <button
              disabled={!canCreate}
              className={`btn btn-primary p-1 ${canCreate ? '' : 'btn-disabled'}`}
              onClick={onCreate}
            >
              Start
            </button>
          </div>
        </>
      }
    ></MeetConfigLayout>
  );
}
