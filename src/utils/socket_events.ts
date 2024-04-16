import { useSocketListener, useSyncSocket } from '@/utils/use-socket';
import { useNavigate } from 'react-router-dom';
import { MeetingContextType } from '@/types/meeting';

function useHandleSocketEvents(
  meetingContext: MeetingContextType,
  joinerName: string
) {
  const navigate = useNavigate();

  useSocketListener('RES_JOIN_MEETING', ({ data, message }) => {
    if (message !== 'JOIN_SUCCESS') {
      console.error('join meeting failed');
      return;
    }
    meetingContext.setMeetingState.setTitle(data.title);
    meetingContext.setMeetingState.setMeetingStartTime(data.meetingStartTime);
    meetingContext.setMeetingState.setOrganizer(data.organizer);
    meetingContext.setMeetingState.setParticipants(data.participants);
  });

  const st = {
    mic: meetingContext.meetingDeviceState.enableMic,
    camera: meetingContext.meetingDeviceState.enableCamera,
    screen: meetingContext.meetingDeviceState.enableShare,
  };
  useSyncSocket(
    'UPDATE_USER_STATE',
    {
      muid: meetingContext.selfMuid,
      state: st,
    },
    st,
    (d) => !!(d as { muid: string }).muid
  );

  useSocketListener('RES_UPDATE_USER_STATE', ({ message }) => {
    if (message === 'MULTI_SCREEN_SHARE') {
      console.error('Other user is screen sharing');
      meetingContext.setMeetingDeviceState.setEnableShare(false);
    }
  });

  useSocketListener('USER_STATE_UPDATE', ({ data }) => {
    const user = meetingContext.meetingState.participants.find(
      (user) => user.muid === data.muid
    );
    if (user) {
      user.state = data.state;
      meetingContext.setMeetingState.setParticipants([
        ...meetingContext.meetingState.participants,
      ]);
    }
  });

  useSocketListener('USER_UPDATE', ({ data }) => {
    meetingContext.setMeetingState.setParticipants(data.participants);
    meetingContext.setMeetingState.setOrganizer(data.organizer);
    meetingContext.setMeetingState.setTitle(data.title);
    meetingContext.setMeetingState.setMeetingStartTime(data.meetingStartTime);
  });

  useSocketListener('FINISH_MEETING', () => {
    navigate('/exit', {
      state: {
        reason: 'finish',
        roomId: meetingContext.meetingState.id,
        userName: joinerName,
      } as ExitInfo,
    });
  });
}

export default useHandleSocketEvents;
