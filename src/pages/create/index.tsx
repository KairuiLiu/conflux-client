import useGlobalStore from '@/context/global-context';
import useMeetingContext from '@/context/meeting-context';
import MeetConfigLayout from '@/layout/meet-config-layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const state = useGlobalStore((d) => d);
  const meetingContext = useMeetingContext((d) => d);
  const [canCreate, setCanCreate] = useState(false);
  const navigate = useNavigate();
  const [meetingUserName, setMeetingUserName] = useState(state.user.name);

  useEffect(() => {
    meetingContext.resetMeetingContext();
  }, []);

  async function onCreate() {
    fetch('/api/meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${state.siteConfig.token}`,
      },
      body: JSON.stringify({
        organizer_name: meetingUserName,
        title: meetingContext.meetingState.title,
      }),
    })
      .then((d) => d.json())
      .then(({ code, data, msg }) => {
        if (code) console.error('fetch token error', msg);
        else {
          meetingContext.setMeetingState.setOrganizer({
            ...meetingContext.meetingState.organizer,
            name: meetingUserName,
          });
          meetingContext.setMeetingState.setId(`${data.id}`);
          meetingContext.setMeetingState.setMeetingStartTime(Date.now());
          navigate(`/room/${data.id}`, {
            state: {
              name: meetingUserName,
            },
          });
        }
      })
      .catch((e) => console.error(e));
  }

  useEffect(() => {
    setCanCreate(
      meetingUserName.length > 0 &&
        meetingContext.meetingState.title!.length > 0
    );
  }, [meetingUserName, meetingContext.meetingState.title]);

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
                value={meetingUserName}
                onChange={(e) => {
                  setMeetingUserName(e.target.value.trim());
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
