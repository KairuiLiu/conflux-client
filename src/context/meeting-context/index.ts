import { MeetingContextType } from '@/types/meeting';
import { create } from 'zustand';
import initState from './init-state';
import useGlobalStore from '../global-context';

const useMeetingStore = create<MeetingContextType>((set) => {
  return {
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
      setOrganizer: (organizer) =>
        set((state) => ({
          meetingState: { ...state.meetingState, organizer },
        })),
      setParticipants: (participants) =>
        set((state) => ({
          meetingState: { ...state.meetingState, participants },
        })),
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
    setSelfMuid: (selfMuid: string) => set({ selfMuid }),
    setUnactiveUserName: (unactiveUserName: string) =>
      set({ unactiveUserName }),
    setExiting: (exiting: boolean) => set({ exiting }),
    resetMeetingContext: () =>
      set((pre) => ({
        ...pre,
        ...initState(),
      })),
  };
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
