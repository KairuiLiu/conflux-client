import { useEffect, useState } from 'react';
import MeetingHeader from './meeting-header';
import UserPanle from './user-panel';
import MeetingPanel from './meeting-panel';
import { useNavigate, useParams } from 'react-router-dom';
import useMeetingStore from '@/context/meeting-context';
import { emitSocket, socket } from '@/utils/use-socket';
import useHandleSocketEvents from '../../utils/socket_events';
import useGlobalStore from '@/context/global-context';
import usePeer from '@/utils/use-peer';

export default function Room() {
  const [showUserPanel, setShowUserPanel] = useState(false);
  const { id } = useParams();
  const meetingContext = useMeetingStore((d) => d);
  const navigator = useNavigate();
  const globalState = useGlobalStore((s) => s);

  useEffect(() => {
    if (id !== meetingContext.meetingState.id) {
      meetingContext.setSelfState.setExiting(true);
      navigator('/join/' + id);
    }
  }, [id, meetingContext.meetingState.id, navigator]);

  useEffect(() => {
    const { id } = meetingContext.meetingState;
    const { muid } = meetingContext.selfState;
    if (!id || !muid) return;
    emitSocket('JOIN_MEETING', {
      muid,
      user_name: meetingContext.selfState.name,
      avatar: '' && useGlobalStore.getState().user.avatar, // TODO: Next version
      state: {
        mic: meetingContext.meetingDeviceState.enableMic,
        camera: meetingContext.meetingDeviceState.enableCamera,
        screen: meetingContext.meetingDeviceState.enableShare,
      },
      expandCamera: globalState.user.expandCamera,
      mirrorCamera: globalState.user.mirrorCamera,
    });
    return () => {
      socket.connected &&
        emitSocket('LEAVE_MEETING', {
          muid,
        });
      const context = useMeetingStore.getState();
      socket.connected && !context.selfState.exiting && socket.disconnect();
      console.log('disconnect');
    };
  }, [meetingContext.meetingState.id, meetingContext.selfState.muid]);

  usePeer();
  useHandleSocketEvents(meetingContext, globalState);

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
