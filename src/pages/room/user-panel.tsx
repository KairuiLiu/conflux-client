import { Square2StackIcon, XMarkIcon } from '@heroicons/react/24/outline';
import UserItemCard from '@/components/user-item-card';
import useMeetingStore from '@/context/meeting-context';
import { writeClipboard } from '@/utils/write-clipboard';
import { genJoinInfo } from '@/utils/gen-join-info';
import { useMemo } from 'react';
import sortParticipants from '@/utils/sort-participants';

const UserPanle: React.FC<{
  handleClose: () => void;
}> = ({ handleClose }) => {
  const meetingContext = useMeetingStore((d) => d);

  const participants = useMemo(
    () =>
      sortParticipants(
        meetingContext.meetingState.participants,
        meetingContext.selfState.muid
      ),
    [meetingContext.meetingState.participants]
  );

  return (
    <>
      <div className="flex max-h-full items-center justify-between whitespace-nowrap px-4 py-2 text-lg">
        <h3>
          Participants ({meetingContext.meetingState.participants.length})
        </h3>
        <button className="btn btn-remove-focus btn-text" onClick={handleClose}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex h-full flex-shrink flex-col gap-3 overflow-auto overflow-x-hidden p-4">
        {participants.map((user) => (
          <UserItemCard user={user} key={user.muid} />
        ))}
      </div>
      <button
        className="btn btn-text flex items-center gap-2 rounded-t-none p-4 text-left font-normal"
        onClick={() => {
          writeClipboard(
            genJoinInfo(
              meetingContext.meetingState.organizer?.name,
              meetingContext.meetingState.title || '',
              meetingContext.meetingState.id
            )
          );
        }}
      >
        <Square2StackIcon className="h-4 w-4" />
        Copy Join Info
      </button>
    </>
  );
};

export default UserPanle;
