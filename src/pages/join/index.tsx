import useGlobalStore from '@/context/global-context';
import useMeetingContext from '@/context/meeting-context';
import MeetConfigLayout from '@/layout/meet-config-layout';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Join() {
  const meetingContext = useMeetingContext((d) => d);
  const state = useGlobalStore((d) => d);
  const { id } = useParams();
  const navigate = useNavigate();
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    meetingContext.resetMeetingContext();
  }, []);

  function onJoin() {
    fetch(`/api/meeting?id=${meetingContext.meetingState.id}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${state.siteConfig.token}`,
      },
    })
      .then((d) => d.json())
      .then(({ code, data, msg }) => {
        if (code) console.error('error', msg);
        else {
          meetingContext.setMeetingState.setTitle(data.title);
          meetingContext.setMeetingState.setOrganizer({
            muid: data.organizer.muid,
            name: data.organizer.name,
          });
          meetingContext.setMeetingState.setMeetingStartTime(data.start_time);
          meetingContext.setMeetingState.setParticipants(data.participants); // todo
          navigate(`/room/${data.id}`);
        }
      })
      .catch((e) => console.error(e));
  }

  useEffect(() => {
    meetingContext.setMeetingState.setId(
      id && id.match(/^[0-9]{9}$/) ? id : ''
    );
  }, [id]);

  useEffect(() => {
    setCanJoin(
      meetingContext.meetingState.id.length === 9 &&
        meetingContext.meeetingUserName.length > 0
    );
  }, [meetingContext.meetingState.id, meetingContext.meeetingUserName]);

  return (
    <MeetConfigLayout
      meetingContext={meetingContext}
      titleBar={<></>}
      configForm={
        <>
          <h3 className="pb-7 text-xl font-semibold lg:pb-0">Join a Meeting</h3>
          <div className="flex w-min flex-col gap-8 lg:gap-3">
            <div className="flex flex-col gap-3">
              <input
                className="input"
                placeholder="Meeting ID"
                value={meetingContext.meetingState.id
                  .replace(/(.{1,3})/g, '$1 ')
                  .trim()}
                maxLength={11}
                onChange={(e) =>
                  meetingContext.setMeetingState.setId(
                    e.target.value.trim().replace(/\D/g, '')
                  )
                }
                required
              ></input>
              <input
                className="input"
                placeholder="Your Name"
                value={meetingContext.meeetingUserName}
                onChange={(e) => {
                  meetingContext.setMeetingUserName(e.target.value.trim());
                }}
                required
              ></input>
            </div>
            <button
              disabled={!canJoin}
              className={`btn btn-primary p-1 ${canJoin ? '' : 'btn-disabled'}`}
              onClick={onJoin}
            >
              Join
            </button>
          </div>
        </>
      }
    ></MeetConfigLayout>
  );
}
