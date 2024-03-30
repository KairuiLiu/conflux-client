import { Context } from '@/context';
import MeetConfigLayout from '@/layout/meet-config-layout';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const { state } = useContext(Context);
  const [meetingTitle, setMeetingTitle] = useState(
    `${state.user.name}'s Meeting`
  );
  const [userName, setUserName] = useState(state.user.name);
  const [canCreate, setCanCreate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setCanCreate(userName.length > 0 && meetingTitle.length > 0);
  }, [userName, meetingTitle]);

  return (
    <MeetConfigLayout
      titleBar={
        <input
          className="input input-underline bg-transparent invalid:border-red-600"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
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
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value.trim());
                }}
                required
              ></input>
            </div>
            <button
              disabled={!canCreate}
              className={`btn btn-primary p-1 ${canCreate ? '' : 'btn-disabled'}`}
              onClick={() => {
                /* TODO logic & toast */
                /* TODO Context */
                navigate(`/room/123456789`, {
                  state: {},
                });
              }}
            >
              Start
            </button>
          </div>
        </>
      }
    ></MeetConfigLayout>
  );
}
