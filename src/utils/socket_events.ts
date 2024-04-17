import { useSocketListener, useSyncSocket } from '@/utils/use-socket';
import { MeetingContextType } from '@/types/meeting';
import useMeetingStore from '@/context/meeting-context';
import { useNavigate } from 'react-router-dom';

function getSt(meetingContext: MeetingContextType) {
  return {
    mic: meetingContext.meetingDeviceState.enableMic,
    camera: meetingContext.meetingDeviceState.enableCamera,
    screen: meetingContext.meetingDeviceState.enableShare,
  };
}

function useHandleSocketEvents(meetingContext: MeetingContextType) {
  const navigate = useNavigate();

  useSocketListener('RES_JOIN_MEETING', ({ data, message }) => {
    // const curMeetingContext = useMeetingStore.getState();
    if (message !== 'JOIN_SUCCESS') {
      console.info('join meeting failed');
      return;
    }
    meetingContext.setMeetingState.setTitle(data.title);
    meetingContext.setMeetingState.setMeetingStartTime(data.start_time);
    meetingContext.setMeetingState.setOrganizer(data.organizer);
    meetingContext.setMeetingState.setParticipants(data.participants);
    // emitSocket('UPDATE_USER_STATE', {
    //   muid: curMeetingContext.selfMuid,
    //   state: getSt(meetingContext),
    // });
  });

  useSyncSocket(
    'UPDATE_USER_STATE',
    {
      muid: meetingContext.selfMuid,
      state: getSt(meetingContext),
    },
    getSt(meetingContext),
    (d) => !!(d as { muid: string }).muid
  );

  useSocketListener('RES_UPDATE_USER_STATE', ({ message }) => {
    if (message === 'MULTI_SCREEN_SHARE') {
      console.info('Other user is screen sharing');
      meetingContext.setMeetingDeviceState.setEnableShare(false);
    }
  });

  useSocketListener('USER_STATE_UPDATE', ({ data }) => {
    const curMeetingContext = useMeetingStore.getState();
    const user = curMeetingContext.meetingState.participants.find(
      (user) => user.muid === data.muid
    );
    if (user) {
      user.state = data.state;
      meetingContext.setMeetingState.setParticipants([
        ...curMeetingContext.meetingState.participants,
      ]);
    }
    if (user?.muid === curMeetingContext.selfMuid) {
      data.state.mic !== undefined &&
        meetingContext.setMeetingDeviceState.setEnableMic(data.state.mic);
      data.state.camera !== undefined &&
        meetingContext.setMeetingDeviceState.setEnableCamera(data.state.camera);
      data.state.screen !== undefined &&
        meetingContext.setMeetingDeviceState.setEnableShare(data.state.screen);
    }
  });

  useSocketListener('USER_UPDATE', ({ data }) => {
    const curMeetingContext = useMeetingStore.getState();
    meetingContext.setMeetingState.setParticipants(data.participants);
    meetingContext.setMeetingState.setOrganizer(data.organizer);
    meetingContext.setMeetingState.setTitle(data.title!);
    meetingContext.setMeetingState.setMeetingStartTime(data.start_time);

    const selfInfo = data.participants.find(
      (p: Participant) => p.muid === curMeetingContext.selfMuid
    );
    if (curMeetingContext.selfMuid && !selfInfo) {
      meetingContext.setExiting(true);
      navigate('/exit', {
        state: {
          reason: 'kicked',
          roomId: curMeetingContext.meetingState.id,
          userName: selfInfo.name || meetingContext.unactiveUserName,
        } as ExitInfo,
      });
    } else {
      selfInfo?.state?.mic !== undefined &&
        meetingContext.setMeetingDeviceState.setEnableMic(selfInfo.state.mic);
      selfInfo?.state?.camera !== undefined &&
        meetingContext.setMeetingDeviceState.setEnableCamera(
          selfInfo.state.camera
        );
      selfInfo?.state?.screen !== undefined &&
        meetingContext.setMeetingDeviceState.setEnableShare(
          selfInfo.state.screen
        );
    }
  });

  useSocketListener('FINISH_MEETING', () => {
    meetingContext.setExiting(true);
    navigate('/exit', {
      state: {
        reason: 'finish',
        roomId: meetingContext.meetingState.id,
        userName: meetingContext.unactiveUserName,
      } as ExitInfo,
    });
  });

  useSocketListener('disconnect', () => {
    const curMeetingContext = useMeetingStore.getState();
    const selfInfo = curMeetingContext.meetingState.participants.find(
      (p: Participant) => p.muid === curMeetingContext.selfMuid
    );

    meetingContext.setExiting(true);
    navigate('/exit', {
      state: {
        reason: 'network',
        roomId: meetingContext.meetingState.id,
        userName: selfInfo?.name || meetingContext.unactiveUserName,
      } as ExitInfo,
    });
  });
}

export default useHandleSocketEvents;
