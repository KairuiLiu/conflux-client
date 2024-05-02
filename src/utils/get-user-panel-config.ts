import { MeetingContextType, UserPanelConfig } from '@/types/meeting';

function getUserPanelConfig(
  participant: Participant[],
  meetingContext: MeetingContextType,
  user: UserInfo
): UserPanelConfig[] {
  const newConfig: UserPanelConfig[] = [];

  participant.forEach((participant) => {
    const remoteStream = meetingContext.meetingStream.get(participant.muid!);

    if (participant.state.screen) {
      if (participant.muid === meetingContext.selfState.muid)
        newConfig.push({
          user: {
            name: meetingContext.selfState.name,
            avatar: user.avatar || '',
            muid: participant.muid,
          },
          isScreenShareControlPanel: true,
          screenStream: meetingContext.selfState.screenStream,
          type: 'CONTROL'
        });
      else {
        const screenVideoTracks = remoteStream?.screenStream?.getVideoTracks();
        const screenAudioTracks = remoteStream?.screenStream?.getAudioTracks();

        if (screenVideoTracks?.length)
          newConfig.push({
            user: {
              name: meetingContext.selfState.name,
              avatar: user.avatar || '',
              muid: participant.muid,
            },
            camStream: null,
            screenStream: new MediaStream(screenVideoTracks),
            audioStream: screenAudioTracks?.length
              ? new MediaStream(screenAudioTracks)
              : null,
            mirrroCamera: user.mirrorCamera,
            expandCamera: user.expandCamera,
            type: 'SCREEN'
          });
      }
    }
    if (participant.muid === meetingContext.selfState.muid) {
      newConfig.push({
        user: {
          name: participant.name,
          avatar: participant.avatar,
          muid: participant.muid,
        },
        camStream: meetingContext.selfState.camStream,
        screenStream: null,
        mirrroCamera: user.mirrorCamera,
        expandCamera: user.expandCamera,
        type: 'CAMERA'
      });
    } else {
      const videoTracks = remoteStream?.mediaStream?.getVideoTracks();
      const audioTracks = remoteStream?.mediaStream?.getAudioTracks();

      const camStream =
        videoTracks?.length && participant.state.camera
          ? new MediaStream(videoTracks)
          : null;

      const audioStream =
        audioTracks?.length && participant.state.mic
          ? new MediaStream(audioTracks)
          : null;

      newConfig.push({
        user: {
          name: participant.name,
          avatar: participant.avatar,
          muid: participant.muid,
        },
        camStream: camStream,
        audioStream: audioStream,
        screenStream: null,
        mirrroCamera: participant.mirrorCamera,
        expandCamera: participant.expandCamera,
        type: 'CAMERA'
      });
    }
  });



  return newConfig;
}

export default getUserPanelConfig;
