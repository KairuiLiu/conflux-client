import Avatar from '@/components/avatar';
import useMeetingStore from '@/context/meeting-context';
import { Chat } from '@/types/meeting';
import { useEffect, useState } from 'react';

const UserChatCard: React.FC<{
  chat: Chat;
}> = ({ chat }) => {
  const meetingContext = useMeetingStore((d) => d);
  const [user, setUser] = useState<{
    avatar: string;
    name: string;
  }>({
    avatar: '',
    name: 'Unknown',
  });

  useEffect(() => {
    const selfParticipant = meetingContext.meetingState.participants.find(
      (p) => p.muid === chat.muid
    );
    if (
      selfParticipant &&
      (selfParticipant.avatar !== user.avatar ||
        selfParticipant.name !== user.name)
    )
      setUser({
        avatar: selfParticipant.avatar,
        name: selfParticipant.name,
      });
  }, [chat.muid, meetingContext.meetingState.participants, user]);

  return (
    <div>
      <div className="flex w-full flex-shrink items-start justify-between">
        <div className="flex w-0 flex-grow items-start gap-3">
          <Avatar user={user} />
          <div className="flex w-0 flex-grow flex-col">
            <h4 className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
              {user.name}
            </h4>
            <p className="whitespace-normal text-wrap break-all text-sm">
              {chat.message}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
          {new Date(chat.time).toLocaleTimeString('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
      </div>
    </div>
  );
};

export default UserChatCard;
