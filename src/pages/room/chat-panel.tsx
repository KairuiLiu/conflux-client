import UserChatCard from '@/components/user-chat-card';
import useMeetingStore from '@/context/meeting-context';
import { emitSocket } from '@/hooks/use-socket';
import { Chat } from '@/types/meeting';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

const ChatPanel: React.FC<{
  chats: Chat[];
  handleClose: () => void;
}> = ({ chats, handleClose }) => {
  const [message, setMessage] = useState('');
  const meetingContext = useMeetingStore((d) => d);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const sendMessage = () => {
    if (!message.trim()) return;
    emitSocket('BOARDCAST_CHAT', {
      muid: meetingContext.selfState.muid,
      message,
      time: Date.now(),
    });
    setMessage('');
  };

  return (
    <>
      <div className="flex max-h-full items-center justify-between whitespace-nowrap px-4 py-2 text-lg">
        <h3>Chats</h3>
        <button className="btn btn-remove-focus btn-text" onClick={handleClose}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex h-full flex-shrink flex-col gap-3 overflow-auto overflow-x-hidden p-4">
        {chats.map((chat, index) => (
          <UserChatCard chat={chat} key={chat.muid + '@' + index} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="flex gap-2 p-2">
        <input
          type="text"
          className="input w-0 flex-1"
          placeholder="Enter message"
          value={message}
          onChange={(d) => setMessage(d.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isComposing && sendMessage()}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
        />
        <button
          className="btn btn-primary shrink-0 px-3"
          onClick={sendMessage}
          onMouseDown={(e) => e.preventDefault()}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default ChatPanel;
