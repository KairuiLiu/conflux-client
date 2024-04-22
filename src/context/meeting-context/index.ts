import { MeetingContextType, PeerStream } from '@/types/meeting';
import { create } from 'zustand';
import initState from './init-state';
import useGlobalStore from '../global-context';

const useMeetingStore = create<MeetingContextType>((set, get) => {
  const res = {
    ...initState(),
    setMeetingState: {
      setId: (id: string) =>
        set((state) => ({ meetingState: { ...state.meetingState, id } })),
      setTitle: (title: string) =>
        set((state) => ({ meetingState: { ...state.meetingState, title } })),
      setMeetingStartTime: (meetingStartTime: number) =>
        set((state) => ({
          meetingState: { ...state.meetingState, meetingStartTime },
        })),
      setOrganizer: (organizer: { muid: string; name: string }) =>
        set((state) => ({
          meetingState: { ...state.meetingState, organizer },
        })),
      setParticipants: (participants: Participant[]) => {
        const { muid } = get().selfState;
        const newSelf = participants.find((p) => p.muid === muid);
        res.setSelfState.setParticipantSelf(newSelf);
        set((state) => ({
          meetingState: { ...state.meetingState, participants },
        }));
      },
    },
    setSelfState: {
      setRole: (role: 'HOST' | 'PARTICIPANT') =>
        set((state) => ({ selfState: { ...state.selfState, role } })),
      setMuid: (muid: string) =>
        set((state) => ({ selfState: { ...state.selfState, muid } })),
      setCamStream: (camStream: MediaStream | null) =>
        set((state) => ({ selfState: { ...state.selfState, camStream } })),
      setScreenStream: (screenStream: MediaStream | null) =>
        set((state) => ({ selfState: { ...state.selfState, screenStream } })),
      setAudioStream: (audioStream: MediaStream | null) =>
        set((state) => ({ selfState: { ...state.selfState, audioStream } })),
      setName: (name: string) =>
        set((state) => ({ selfState: { ...state.selfState, name } })),
      setExiting: (exiting: boolean) =>
        set((state) => ({ selfState: { ...state.selfState, exiting } })),
      setParticipantSelf: (participantSelf: Participant | undefined) => {
        const { setRole, setName } = res.setSelfState;
        participantSelf?.name && setName(participantSelf?.name || '');
        participantSelf?.role && setRole(participantSelf?.role);
        set((state) => ({
          selfState: { ...state.selfState, participantSelf },
        }));
      },
    },
    setMeetingDeviceState: {
      setEnableCamera: (enableCamera: boolean) =>
        set((state) => ({
          meetingDeviceState: { ...state.meetingDeviceState, enableCamera },
        })),
      setCameraLabel: (cameraLabel: string) =>
        set((state) => ({
          meetingDeviceState: { ...state.meetingDeviceState, cameraLabel },
        })),
      setEnableMic: (enableMic: boolean) =>
        set((state) => ({
          meetingDeviceState: { ...state.meetingDeviceState, enableMic },
        })),
      setMicLabel: (micLabel: string) =>
        set((state) => ({
          meetingDeviceState: { ...state.meetingDeviceState, micLabel },
        })),
      setEnableSpeaker: (enableSpeaker: boolean) =>
        set((state) => ({
          meetingDeviceState: { ...state.meetingDeviceState, enableSpeaker },
        })),
      setSpeakerLabel: (speakerLabel: string) =>
        set((state) => ({
          meetingDeviceState: { ...state.meetingDeviceState, speakerLabel },
        })),
      setEnableShare: (enableShare: boolean) =>
        set((state) => ({
          meetingDeviceState: { ...state.meetingDeviceState, enableShare },
        })),
    },
    setMeetingStream: (meetingStream: Map<string, PeerStream>) =>
      set({ meetingStream }),
    resetMeetingContext: () =>
      set((pre) => ({
        ...pre,
        ...initState(),
      })),
  };
  return res;
});

useGlobalStore.subscribe((cur, pre) => {
  if (cur.user.defaultCamera !== pre.user.defaultCamera) {
    useMeetingStore
      .getState()
      .setMeetingDeviceState.setCameraLabel(cur.user.defaultCamera || '');
  }
  if (cur.user.defaultMic !== pre.user.defaultMic) {
    useMeetingStore
      .getState()
      .setMeetingDeviceState.setMicLabel(cur.user.defaultMic || '');
  }
  if (cur.user.defaultSpeaker !== pre.user.defaultSpeaker) {
    useMeetingStore
      .getState()
      .setMeetingDeviceState.setSpeakerLabel(cur.user.defaultSpeaker || '');
  }
});

export default useMeetingStore;
