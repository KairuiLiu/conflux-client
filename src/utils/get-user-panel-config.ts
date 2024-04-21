import { MeetingContextType, UserPanelConfig } from '@/types/meeting';

function getUserPanelConfig(
  participant: Participant[],
  meetingContext: MeetingContextType,
  globalState: StateType
): UserPanelConfig[] {
  const newConfig: UserPanelConfig[] = [];

  participant.forEach((participant) => {
    const remoteStream = meetingContext.meetingStream.get(participant.muid!);

    const remoteStreamTracks = remoteStream?.stream?.getTracks();

    if (participant.state.screen) {
      if (participant.muid === meetingContext.selfState.muid)
        newConfig.push({
          isScreenShareControlPanel: true,
          screenStream: meetingContext.selfState.screenStream,
        });
      else {
        const screenStreamTrack = remoteStreamTracks?.filter((track) =>
          remoteStream?.metadata?.screenStream?.includes(track.id)
        );
        // ! TEMP: GUESS SCREEN STREAM TRACK IF NOT FOUND [TODO]
        const guessScreenStreamTrack = remoteStreamTracks
          ?.filter((track) => track.kind === 'video')
          .at(0);
        if (screenStreamTrack?.length === 0 && guessScreenStreamTrack)
          screenStreamTrack.push(guessScreenStreamTrack);

        if (screenStreamTrack?.length)
          newConfig.push({
            user: {
              name: meetingContext.selfState.name,
              avatar: globalState.user.avatar || '',
            },
            camStream: null,
            screenStream: new MediaStream(screenStreamTrack),
            mirrroCamera: globalState.user.mirrorCamera,
            expandCamera: globalState.user.expandCamera,
          });
      }
    }
    if (participant.muid === meetingContext.selfState.muid) {
      newConfig.push({
        user: {
          name: participant.name,
          avatar: participant.avatar,
        },
        camStream: meetingContext.selfState.camStream,
        screenStream: null,
        mirrroCamera: globalState.user.mirrorCamera,
        expandCamera: globalState.user.expandCamera,
      });
    } else {
      const videoAndAudioTracks =
        remoteStreamTracks?.filter(
          (track) => !remoteStream?.metadata?.screenStream.includes(track.id)
        ) || [];

      // ! TEMP: GUESS SCREEN STREAM TRACK IF NOT FOUND [TODO]
      const guessScreenStreamTrack = remoteStreamTracks
        ?.filter((track) => track.kind === 'video')
        .at(-1);
      if (!videoAndAudioTracks?.length && guessScreenStreamTrack)
        videoAndAudioTracks.push(guessScreenStreamTrack);

      const camStream = videoAndAudioTracks
        ? new MediaStream(videoAndAudioTracks)
        : null;

      newConfig.push({
        user: {
          name: participant.name,
          avatar: participant.avatar,
        },
        camStream: camStream,
        screenStream: null,
        mirrroCamera: participant.mirrorCamera,
        expandCamera: participant.expandCamera,
      });
    }
  });

  console.log('newConfig', newConfig)

  return newConfig;
}

export default getUserPanelConfig;
