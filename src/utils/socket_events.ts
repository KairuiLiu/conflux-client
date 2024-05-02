import { useSocketListener, useSyncSocket } from '@/hooks/use-socket';
import { Chat, MeetingContextType } from '@/types/meeting';
import useMeetingStore from '@/context/meeting-context';
import { useNavigate } from 'react-router-dom';

function getSt(meetingContext: MeetingContextType) {
  return {
    mic: meetingContext.meetingDeviceState.enableMic,
    camera: meetingContext.meetingDeviceState.enableCamera,
    screen: meetingContext.meetingDeviceState.enableShare,
  };
}

function getGSt(user: UserInfo) {
  return {
    mirrorCamera: user.mirrorCamera,
    expandCamera: user.expandCamera,
  };
}

function useHandleSocketEvents(
  initMeetingContext: MeetingContextType,
  initUser: UserInfo,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) {
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
      muid: initMeetingContext.selfState.muid,
      state: getSt(initMeetingContext),
    },
    getSt(initMeetingContext),
    (d) => !!(d as { muid: string }).muid
  );

  useSyncSocket(
    'UPDATE_USER_STATE',
    {
      muid: initMeetingContext.selfState.muid,
      ...getGSt(initUser),
    },
    getGSt(initUser),
    (d) => !!(d as { muid: string }).muid
  );

  useSocketListener('RES_UPDATE_USER_STATE', ({ message }) => {
    if (message !== 'SUCCESS') {
      initMeetingContext.setMeetingDeviceState.setEnableShare(false);
    }
  });

  useSocketListener('CHAT', ({ data }) => {
    setChats((prev) => [...prev, data]);
  });

  useSocketListener('USER_STATE_UPDATE', ({ data }) => {
    const curMeetingContext = useMeetingStore.getState();
    const user = curMeetingContext.meetingState.participants.find(
      (p) => p.muid === data.muid
    );
    if (user) {
      if (data.state) user.state = data.state;
      if (data.expandCamera !== undefined)
        user.expandCamera = data.expandCamera;
      if (data.mirrorCamera !== undefined)
        user.mirrorCamera = data.mirrorCamera;
      initMeetingContext.setMeetingState.setParticipants([
        ...curMeetingContext.meetingState.participants,
      ]);
    }
    if (user?.muid === curMeetingContext.selfState.muid) {
      data.state.mic !== undefined &&
        initMeetingContext.setMeetingDeviceState.setEnableMic(data.state.mic);
      data.state.camera !== undefined &&
        initMeetingContext.setMeetingDeviceState.setEnableCamera(
          data.state.camera
        );
      data.state.screen !== undefined &&
        initMeetingContext.setMeetingDeviceState.setEnableShare(
          data.state.screen
        );
    }
  });

  useSocketListener(
    'USER_UPDATE',
    ({ data }) => {
      const curMeetingContext = useMeetingStore.getState();
      initMeetingContext.setMeetingState.setParticipants(data.participants);
      const organizerName =
        data.participants.find(
          (d: Participant) => d.muid === data.organizer.muid
        )?.name || data.organizer.name;
      initMeetingContext.setMeetingState.setOrganizer({
        muid: data.organizer.muid,
        name: organizerName,
      });
      initMeetingContext.setMeetingState.setTitle(data.title!);
      initMeetingContext.setMeetingState.setMeetingStartTime(data.start_time);

      const selfInfo = data.participants.find(
        (p: Participant) => p.muid === curMeetingContext.selfState.muid
      );
      if (curMeetingContext.selfState.muid && !selfInfo) {
        initMeetingContext.setSelfState.setExiting(true);
        navigate('/exit', {
          state: {
            reason: 'kicked',
            roomId: curMeetingContext.meetingState.id,
            userName: curMeetingContext.selfState.name,
          } as ExitInfo,
        });
      } else {
        selfInfo?.state?.mic !== undefined &&
          initMeetingContext.setMeetingDeviceState.setEnableMic(
            selfInfo.state.mic
          );
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
    initMeetingContext.setSelfState.setExiting(true);
    navigate('/exit', {
      state: {
        reason: 'finish',
        roomId: initMeetingContext.meetingState.id,
        userName: initMeetingContext.selfState.name,
      } as ExitInfo,
    });
  });

  useSocketListener('disconnect', () => {
    const curMeetingContext = useMeetingStore.getState();

    initMeetingContext.setSelfState.setExiting(true);
    navigate('/exit', {
      state: {
        reason: 'network',
        roomId: initMeetingContext.meetingState.id,
        userName: curMeetingContext.selfState.name,
      } as ExitInfo,
    });
  });
}

export default useHandleSocketEvents;
