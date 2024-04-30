import { useEffect, useRef, useState } from 'react';
import MeetingHeader from './meeting-header';
import UserPanle from './user-panel';
import MeetingPanel from './meeting-panel';
import { useNavigate, useParams } from 'react-router-dom';
import useMeetingStore from '@/context/meeting-context';
import { emitSocket, socket } from '@/hooks/use-socket';
import useHandleSocketEvents from '../../utils/socket_events';
import useGlobalStore from '@/context/global-context';
import usePeer from '@/hooks/use-peer';
import ChatPanel from './chat-panel';
import { Chat } from '@/types/meeting';

export default function Room() {
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const showSidePanel = showUserPanel || showChatPanel;
  const [chats, setChats] = useState<Chat[]>([]);
  const { id } = useParams();
  const meetingContext = useMeetingStore((d) => d);
  const navigator = useNavigate();
  const globalState = useGlobalStore((s) => s);
  const holdingSpace = useRef(false);
  const meetingMainPanel = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

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
      avatar: useGlobalStore.getState().user.avatar || '',
      state: {
        mic: meetingContext.meetingDeviceState.enableMic,
        camera: meetingContext.meetingDeviceState.enableCamera,
        screen: meetingContext.meetingDeviceState.enableShare,
      },
      passcode: meetingContext.meetingState.passcode,
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
      console.log('[WS-DISCONNECT]');
    };
  }, [meetingContext.meetingState.id, meetingContext.selfState.muid]);

  useEffect(() => {
    if (!meetingMainPanel.current) return;
    const dom = meetingMainPanel.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      const enableMic = useMeetingStore.getState().meetingDeviceState.enableMic;
      if (e.code === 'Space' && !enableMic && !holdingSpace.current) {
        setTimeout(() => {
          meetingContext.setMeetingDeviceState.setEnableMic(true);
        });
        holdingSpace.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && holdingSpace.current) {
        setTimeout(() => {
          meetingContext.setMeetingDeviceState.setEnableMic(false);
        });
        holdingSpace.current = false;
      }
    };

    dom.addEventListener('keydown', handleKeyDown);
    dom.addEventListener('keyup', handleKeyUp);

    return () => {
      dom.removeEventListener('keydown', handleKeyDown);
      dom.removeEventListener('keyup', handleKeyUp);
    };
  }, [meetingMainPanel]);

  usePeer();
  useHandleSocketEvents(meetingContext, globalState, setChats);

  return (
    <div className="flex h-dvh max-h-dvh flex-grow flex-col">
      <MeetingHeader setLayour={setLayout} />
      <main
        className={`flex h-0 flex-grow gap-0 px-2 pb-2 transition-all ${
          showSidePanel ? 'sm:gap-4' : 'sm:gap-0'
        }`}
      >
        <section
          ref={meetingMainPanel}
          className="panel-classic flex w-0 flex-grow flex-col overflow-hidden shadow-none outline-none transition-all focus:outline-none"
          tabIndex={0}
        >
          <MeetingPanel
            setShowUserPanel={(v) => {
              setShowChatPanel(false);
              setShowUserPanel(v);
            }}
            setShowChatPanel={(v) => {
              setShowUserPanel(false);
              setShowChatPanel(v);
            }}
            layout={layout}
          />
        </section>
        <aside
          className={`panel-classic flex flex-shrink-0 flex-col shadow-none transition-all ${
            showSidePanel
              ? 'w-full overflow-visible sm:w-[33vmin] '
              : 'w-0 overflow-hidden'
          }`}
        >
          {showUserPanel && (
            <UserPanle
              handleClose={() => {
                setShowUserPanel(false);
                setShowChatPanel(false);
              }}
            />
          )}
          {showChatPanel && (
            <ChatPanel
              chats={chats}
              handleClose={() => {
                setShowChatPanel(false);
                setShowUserPanel(false);
              }}
            />
          )}
        </aside>
      </main>
    </div>
  );
}
