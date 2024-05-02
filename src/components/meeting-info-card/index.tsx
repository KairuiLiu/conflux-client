import useMeetingStore from '@/context/meeting-context';
import { getLocalDateTime } from '@/utils/get-local-time';
import { writeClipboard } from '@/utils/write-clipboard';
import { Square2StackIcon } from '@heroicons/react/24/outline';
const MeetingInfoCard: React.FC<{
  withTopic: boolean;
}> = ({ withTopic }) => {
  const meetingContext = useMeetingStore((d) => d);

  return (
    <div className="grid grid-cols-[min-content_1fr] gap-3 whitespace-nowrap">
      <div className="flex  items-center">
        <span>Meeting ID</span>
      </div>
      <div className="flex  items-center gap-1">
        <span>
          {meetingContext?.meetingState?.id
            ?.replace(/(.{1,3})/g, '$1 ')
            ?.trim() || ''}
        </span>
        <button
          className="btn btn-text -scale-x-100 p-1"
          onClick={() => {
            writeClipboard(meetingContext.meetingState.id);
          }}
        >
          <Square2StackIcon className="h-4 w-4" />
        </button>
      </div>
      {withTopic && (
        <>
          <div className="flex  items-center">
            <span>Topic</span>
          </div>
          <div>{meetingContext.meetingState.title}</div>
        </>
      )}
      <div className="flex  items-center">
        <span>Organizer</span>
      </div>
      <div>{meetingContext.meetingState.organizer.name}</div>
      <div>Meeting Time</div>
      <div>
        {getLocalDateTime(
          meetingContext?.meetingState?.meetingStartTime || 0,
          true
        )}
      </div>
      {meetingContext.meetingState.passcode !== '' && (
        <>
          <div className="flex  items-center">
            <span>Passcode</span>
          </div>
          <div className="flex  items-center gap-1">
            <span>{meetingContext.meetingState.passcode}</span>
            <span>
              <button
                className="btn btn-text -scale-x-100 p-1"
                onClick={() => {
                  writeClipboard(meetingContext.meetingState.passcode);
                }}
              >
                <Square2StackIcon className="h-4 w-4" />
              </button>
            </span>
          </div>
        </>
      )}
      <div className="flex  items-center">
        <span>Meeting Link</span>
      </div>
      <div className="flex  items-center gap-1">
        <span>
          {window.location.origin}/j/
          {meetingContext.meetingState.id}
        </span>
        <button
          className="btn btn-text -scale-x-100 p-1"
          onClick={() => {
            writeClipboard(
              `${window.location.origin}/j/${meetingContext.meetingState.id}`
            );
          }}
        >
          <Square2StackIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MeetingInfoCard;
