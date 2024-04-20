import { VideoPanel } from '@/components/video-panel';
import { useVideoPanelSize } from '@/utils/use-panel-size';
import { useEffect, useMemo, useState } from 'react';
import useMediaStream from '@/utils/use-media-stream';
import useGlobalStore from '@/context/global-context';
import useScreenshareStream from '@/utils/use-screenshare-stream';
import MeetingControlBar from './meeting-control-bar';
import useMeetingStore from '@/context/meeting-context';
import { ScreenShareControlPanel } from '@/components/screen-share-control-panel';
import { UserPanelConfig } from '@/types/meeting';

const MeetingPanel: React.FC<{
  setShowUserPanel: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowUserPanel }) => {
  const state = useGlobalStore((d) => d);
  const meetingContext = useMeetingStore((d) => d);

  // Audio
  // TODO Audio Process
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  useMediaStream(
    meetingContext.meetingDeviceState.micLabel,
    meetingContext.setMeetingDeviceState.setMicLabel,
    meetingContext.meetingDeviceState.enableMic,
    audioStream,
    setAudioStream,
    'audio',
    'microphone'
  );

  // Video
  // TODO AUDIO PROCESS
  const [enableScreenShareAudio, setEnableScreenShareAudio] =
    useScreenshareStream(
      meetingContext.meetingDeviceState.enableShare,
      meetingContext.setMeetingDeviceState.setEnableShare,
      meetingContext.selfState.screenStream,
      meetingContext.setSelfState.setScreenStream
    );

  useMediaStream(
    meetingContext.meetingDeviceState.cameraLabel,
    meetingContext.setMeetingDeviceState.setCameraLabel,
    meetingContext.meetingDeviceState.enableCamera,
    meetingContext.selfState.camStream,
    meetingContext.setSelfState.setCamStream,
    'video',
    'camera'
  );

  // todo share participant
  const itemCount = useMemo(
    () =>
      meetingContext.meetingState.participants.length +
      (meetingContext.meetingDeviceState.enableShare ? 2 : 0),
    [
      meetingContext.meetingState.participants,
      meetingContext.meetingDeviceState.enableShare,
    ]
  );

  const [videoPanelRef, videoPanelSize] = useVideoPanelSize(itemCount);
  const [userPanelConfigArr, setUsePanelConfigArr] = useState<
    UserPanelConfig[]
  >([]);

  useEffect(() => {
    const newConfig: UserPanelConfig[] =
      meetingContext.meetingState.participants.map((participant) =>
        participant.muid === meetingContext.selfState.muid
          ? {
              user: {
                name: participant.name,
                avatar: participant.avatar,
              },
              camStream: meetingContext.selfState.camStream,
              screenStream: null,
              mirrroCamera: state.user.mirrorCamera,
              expandCamera: state.user.expandCamera,
            }
          : {
              user: {
                name: participant.name,
                avatar: participant.avatar,
              },
              camStream: meetingContext.meetingStream.get(participant.muid!)
                ?.stream,
              screenStream: null,
              mirrroCamera: participant.mirrorCamera,
              expandCamera: participant.expandCamera,
            }
      );

    if (meetingContext.meetingDeviceState.enableShare) {
      newConfig.push({
        user: {
          name: meetingContext.selfState.name,
          avatar: state.user.avatar || '',
        },
        camStream: null,
        screenStream: meetingContext.selfState.screenStream,
        mirrroCamera: state.user.mirrorCamera,
        expandCamera: state.user.expandCamera,
      });
      newConfig.push({
        isScreenShareControlPanel: true,
      });
    }

    setUsePanelConfigArr(newConfig);
  }, [
    meetingContext.meetingState.participants,
    state.user.expandCamera,
    state.user.mirrorCamera,
    meetingContext.meetingStream,
    meetingContext.meetingDeviceState.enableShare,
    meetingContext.selfState.camStream,
    meetingContext.selfState.screenStream,
    meetingContext.selfState.muid,
    meetingContext.selfState.name,
    state.user.avatar,
  ]);

  return (
    <>
      <section
        ref={videoPanelRef}
        className="flex flex-grow flex-col items-center justify-center gap-4 overflow-hidden rounded-lg"
      >
        {Array.from({ length: videoPanelSize.row }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-nowrap content-center items-center justify-center gap-4 overflow-hidden rounded-lg"
          >
            {Array.from({ length: videoPanelSize.col }).map((_, colIndex) => {
              const panelIndex = rowIndex * videoPanelSize.col + colIndex;
              if (panelIndex >= userPanelConfigArr.length) return null;
              const panelConfig = userPanelConfigArr[panelIndex];

              return (
                <div
                  key={`${rowIndex} ${colIndex}`}
                  style={{
                    width:
                      videoPanelSize.width -
                      ((videoPanelSize.col + 1) * 16) / videoPanelSize.col,
                    height:
                      videoPanelSize.height -
                      ((videoPanelSize.row + 1) * 16) / videoPanelSize.row,
                  }}
                  className="flex-shrink-0 overflow-hidden rounded-lg"
                >
                  {panelConfig.isScreenShareControlPanel ? (
                    <ScreenShareControlPanel
                      handleStopSharing={() =>
                        meetingContext.setMeetingDeviceState.setEnableShare(
                          false
                        )
                      }
                      enableAudio={enableScreenShareAudio}
                      setEnableAudio={setEnableScreenShareAudio}
                    />
                  ) : (
                    <VideoPanel
                      user={panelConfig.user!}
                      camStream={panelConfig.camStream!}
                      screenStream={panelConfig.screenStream!}
                      fixAvatarSize={
                        Math.min(videoPanelSize.width, videoPanelSize.height) /
                          2 || 32
                      }
                      mirrroCamera={panelConfig.mirrroCamera!}
                      expandCamera={panelConfig.expandCamera!}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>
      <MeetingControlBar
        setEnableScreenShareStream={
          meetingContext.setMeetingDeviceState.setEnableShare
        }
        setShowUserPanel={setShowUserPanel}
      ></MeetingControlBar>
    </>
  );
};

export default MeetingPanel;
