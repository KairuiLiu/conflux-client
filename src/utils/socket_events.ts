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

function useHandleSocketEvents(initMeetingContext: MeetingContextType) {
  const navigate = useNavigate();

  useSocketListener(
    'RES_JOIN_MEETING',
    ({ data, message }) => {
      if (message !== 'SUCCESS') return;

      initMeetingContext.setMeetingState.setTitle(data.title);
      initMeetingContext.setMeetingState.setMeetingStartTime(data.start_time);
      initMeetingContext.setMeetingState.setOrganizer(data.organizer);
      initMeetingContext.setMeetingState.setParticipants(data.participants);
    },
    true,
    'UPDATE_USER_STATE'
  );

  useSyncSocket(
    'UPDATE_USER_STATE',
    {
      muid: initMeetingContext.selfMuid,
      state: getSt(initMeetingContext),
    },
    getSt(initMeetingContext),
    (d) => !!(d as { muid: string }).muid
  );

  useSocketListener('RES_UPDATE_USER_STATE', ({ message }) => {
    if (message !== 'SUCCESS') {
      initMeetingContext.setMeetingDeviceState.setEnableShare(false);
    }
  });

  useSocketListener('USER_STATE_UPDATE', ({ data }) => {
    const curMeetingContext = useMeetingStore.getState();
    const user = curMeetingContext.meetingState.participants.find(
      (user) => user.muid === data.muid
    );
    if (user) {
      user.state = data.state;
      initMeetingContext.setMeetingState.setParticipants([
        ...curMeetingContext.meetingState.participants,
      ]);
    }
    if (user?.muid === curMeetingContext.selfMuid) {
      data.state.mic !== undefined &&
        initMeetingContext.setMeetingDeviceState.setEnableMic(data.state.mic);
      data.state.camera !== undefined &&
        initMeetingContext.setMeetingDeviceState.setEnableCamera(data.state.camera);
      data.state.screen !== undefined &&
        initMeetingContext.setMeetingDeviceState.setEnableShare(data.state.screen);
    }
  });

  useSocketListener(
    'USER_UPDATE',
    ({ data }) => {
      const curMeetingContext = useMeetingStore.getState();
      initMeetingContext.setMeetingState.setParticipants(data.participants);
      initMeetingContext.setMeetingState.setOrganizer(data.organizer);
      initMeetingContext.setMeetingState.setTitle(data.title!);
      initMeetingContext.setMeetingState.setMeetingStartTime(data.start_time);

      const selfInfo = data.participants.find(
        (p: Participant) => p.muid === curMeetingContext.selfMuid
      );
      if (curMeetingContext.selfMuid && !selfInfo) {
        initMeetingContext.setExiting(true);
        navigate('/exit', {
          state: {
            reason: 'kicked',
            roomId: curMeetingContext.meetingState.id,
            userName: selfInfo.name || initMeetingContext.unactiveUserName,
          } as ExitInfo,
        });
      } else {
        selfInfo?.state?.mic !== undefined &&
          initMeetingContext.setMeetingDeviceState.setEnableMic(selfInfo.state.mic);
        selfInfo?.state?.camera !== undefined &&
          initMeetingContext.setMeetingDeviceState.setEnableCamera(
            selfInfo.state.camera
          );
        selfInfo?.state?.screen !== undefined &&
          initMeetingContext.setMeetingDeviceState.setEnableShare(
            selfInfo.state.screen
          );
      }
    },
    true
  );

  useSocketListener('FINISH_MEETING', () => {
    initMeetingContext.setExiting(true);
    navigate('/exit', {
      state: {
        reason: 'finish',
        roomId: initMeetingContext.meetingState.id,
        userName: initMeetingContext.unactiveUserName,
      } as ExitInfo,
    });
  });

  useSocketListener('disconnect', () => {
    const curMeetingContext = useMeetingStore.getState();
    const selfInfo = curMeetingContext.meetingState.participants.find(
      (p: Participant) => p.muid === curMeetingContext.selfMuid
    );

    initMeetingContext.setExiting(true);
    navigate('/exit', {
      state: {
        reason: 'network',
        roomId: initMeetingContext.meetingState.id,
        userName: selfInfo?.name || initMeetingContext.unactiveUserName,
      } as ExitInfo,
    });
  });
}

export default useHandleSocketEvents;
