import { useEffect, useState } from 'react';
import MeetingHeader from './meeting-header';
import UserPanle from './user-panel';
import MeetingPanel from './meeting-panel';
import { useNavigate, useParams } from 'react-router-dom';
import useMeetingStore from '@/context/meeting-context';
import { emitSocket, socket } from '@/utils/use-socket';
import { v4 } from 'uuid';
import useHandleSocketEvents from '../../utils/socket_events';
import useGlobalStore from '@/context/global-context';

export default function Room() {
  const [showUserPanel, setShowUserPanel] = useState(false);
  const { id } = useParams();
  const meetingContext = useMeetingStore((d) => d);
  const navigator = useNavigate();

  useEffect(() => {
    meetingContext.setExiting(true);
    if (id !== meetingContext.meetingState.id) {
      navigator('/join/' + id);
    }
  }, [id, meetingContext.meetingState.id, navigator]);

  useEffect(() => {
    if (!meetingContext.meetingState.id) return;

    // TODO: Replace with peerjs muid
    const muid = v4();
    meetingContext.setSelfMuid(muid);
    emitSocket('JOIN_MEETING', {
      muid,
      user_name: meetingContext.unactiveUserName,
      avatar: '' && useGlobalStore.getState().user.avatar, // TODO: Next version
      state: {
        mic: meetingContext.meetingDeviceState.enableMic,
        camera: meetingContext.meetingDeviceState.enableCamera,
        screen: meetingContext.meetingDeviceState.enableShare,
      },
    });
    return () => {
      emitSocket('LEAVE_MEETING', {
        muid,
      });
      const context = useMeetingStore.getState();
      socket.connected && !context.exiting && socket.disconnect();
      console.log('disconnect');
    };
  }, [meetingContext.meetingState.id]);

  useHandleSocketEvents(meetingContext);

  // TODO INTERVAL OF UPDATE USER STATE
  return (
    <div className="flex h-dvh max-h-dvh flex-grow flex-col">
      <MeetingHeader />
      <main
        className={`flex h-0 flex-grow gap-0 px-2 pb-2 transition-all ${
          showUserPanel ? 'sm:gap-4' : 'sm:gap-0'
        }`}
      >
        <section className="panel-classic flex w-0 flex-grow flex-col overflow-hidden shadow-none transition-all">
          <MeetingPanel setShowUserPanel={setShowUserPanel} />
        </section>
        <aside
          className={`panel-classic flex flex-shrink-0 flex-col shadow-none transition-all ${
            showUserPanel
              ? 'w-full overflow-visible sm:w-[33vmin] '
              : 'w-0 overflow-hidden'
          }`}
        >
          <UserPanle handleClose={() => setShowUserPanel(false)} />
        </aside>
      </main>
    </div>
  );
}
