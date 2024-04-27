import { VideoPanel } from '@/components/video-panel';
import { useVideoPanelSize } from '@/hooks/use-panel-size';
import { useEffect, useMemo, useState } from 'react';
import useMediaStream from '@/hooks/use-media-stream';
import useGlobalStore from '@/context/global-context';
import useScreenshareStream from '@/hooks/use-screenshare-stream';
import MeetingControlBar from './meeting-control-bar';
import useMeetingStore from '@/context/meeting-context';
import { ScreenShareControlPanel } from '@/components/screen-share-control-panel';
import { UserPanelConfig } from '@/types/meeting';
import sortParticipants from '@/utils/sort-participants';
import getUserPanelConfig from '@/utils/get-user-panel-config';
import useBgReplace from '@/hooks/use-background-replace';
import { getVideoBackgroundConfig } from '@/utils/video-background-image';

const MeetingPanel: React.FC<{
  setShowUserPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChatPanel: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowUserPanel, setShowChatPanel }) => {
  const state = useGlobalStore((d) => d);
  const meetingContext = useMeetingStore((d) => d);

  // Audio
  useMediaStream(
    meetingContext.meetingDeviceState.micLabel,
    meetingContext.setMeetingDeviceState.setMicLabel,
    meetingContext.meetingDeviceState.enableMic,
    meetingContext.setMeetingDeviceState.setEnableMic,
    meetingContext.selfState.audioStream,
    meetingContext.setSelfState.setAudioStream,
    'audio',
    'microphone'
  );

  // Video
  const [enableScreenShareAudio, setEnableScreenShareAudio] =
    useScreenshareStream(
      meetingContext.meetingDeviceState.enableShare,
      meetingContext.setMeetingDeviceState.setEnableShare,
      meetingContext.selfState.screenStream,
      meetingContext.setSelfState.setScreenStream
    );

  const [originVideoStream, setOriginVideoStream] =
    useState<MediaStream | null>(null);
  useMediaStream(
    meetingContext.meetingDeviceState.cameraLabel,
    meetingContext.setMeetingDeviceState.setCameraLabel,
    meetingContext.meetingDeviceState.enableCamera,
    meetingContext.setMeetingDeviceState.setEnableCamera,
    originVideoStream,
    setOriginVideoStream,
    'video',
    'camera'
  );

  const backgroundConfig = useMemo(
    () => getVideoBackgroundConfig(state.user.videoBackground || 0),
    [state.user.videoBackground]
  );

  const [canvasRef, backgroundImageRef, replacedStream] = useBgReplace(
    backgroundConfig,
    originVideoStream
  );

  useEffect(() => {
    if (!originVideoStream || !state.user.videoBackground)
      meetingContext.setSelfState.setCamStream(originVideoStream);
    else meetingContext.setSelfState.setCamStream(replacedStream);
  }, [
    replacedStream,
    meetingContext.setSelfState,
    originVideoStream,
    state.user,
  ]);

  const itemCount = useMemo(
    () =>
      meetingContext.meetingState.participants.length +
      (meetingContext.meetingState.participants.find((d) => d.state.screen)
        ? 1
        : 0),
    [meetingContext.meetingState.participants]
  );

  const [videoPanelRef, videoPanelSize] = useVideoPanelSize(itemCount);
  const [userPanelConfigArr, setUsePanelConfigArr] = useState<
    UserPanelConfig[]
  >([]);

  useEffect(() => {
    const participant = sortParticipants(
      meetingContext.meetingState.participants,
      meetingContext.selfState.muid,
      true
    );

    setUsePanelConfigArr(
      getUserPanelConfig(participant, meetingContext, state.user)
    );
  }, [meetingContext, state.user]);

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
                      screenStream={panelConfig.screenStream!}
                    />
                  ) : (
                    <VideoPanel
                      user={panelConfig.user!}
                      camStream={panelConfig.camStream!}
                      screenStream={panelConfig.screenStream!}
                      audioStream={panelConfig.audioStream!}
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
        setShowChatPanel={setShowChatPanel}
      ></MeetingControlBar>
      {backgroundConfig.type === 'image' && (
        <img
          ref={backgroundImageRef}
          src={backgroundConfig.url}
          alt=""
          hidden={true}
        />
      )}
      <canvas
        key={'webgl2'}
        ref={canvasRef}
        width={originVideoStream?.getVideoTracks()[0].getSettings().width}
        height={originVideoStream?.getVideoTracks()[0].getSettings().height}
        hidden={true}
      />
    </>
  );
};

export default MeetingPanel;
