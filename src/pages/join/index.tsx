import { Context } from '@/context';
import MeetConfigLayout from '@/layout/meet-config-layout';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Join() {
  const { state } = useContext(Context);
  const { id } = useParams();
  const [meetingNumber, setMeetingNumber] = useState(
    id && id.match(/^[0-9]{9}$/) ? id : ''
  );
  const [userName, setUserName] = useState(state.user.name);
  const [canJoin, setCanJoin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setCanJoin(meetingNumber.length === 9 && userName.length > 0);
  }, [meetingNumber, userName]);

  return (
    <MeetConfigLayout
      titleBar={<></>}
      configForm={
        <>
          <h3 className="pb-7 text-xl font-semibold lg:pb-0">Join a Meeting</h3>
          <div className="flex w-min flex-col gap-8 lg:gap-3">
            <div className="flex flex-col gap-3">
              <input
                className="input"
                placeholder="Meeting ID"
                value={meetingNumber.replace(/(.{1,3})/g, '$1 ').trim()}
                maxLength={11}
                onChange={(e) =>
                  setMeetingNumber(e.target.value.trim().replace(/\D/g, ''))
                }
                required
              ></input>
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
              disabled={!canJoin}
              className={`btn btn-primary p-1 ${canJoin ? '' : 'btn-disabled'}`}
              onClick={() => {
                /* TODO logic & toast */
                navigate(`/room/${meetingNumber}`, {
                  state: {},
                });
              }}
            >
              Join
            </button>
          </div>
        </>
      }
    ></MeetConfigLayout>
  );
}
