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
import sortParticipants from '@/utils/sort-participants';
import getUserPanelConfig from '@/utils/get-user-panel-config';

const MeetingPanel: React.FC<{
  setShowUserPanel: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowUserPanel }) => {
  const state = useGlobalStore((d) => d);
  const meetingContext = useMeetingStore((d) => d);

  // Audio
  useMediaStream(
    meetingContext.meetingDeviceState.micLabel,
    meetingContext.setMeetingDeviceState.setMicLabel,
    meetingContext.meetingDeviceState.enableMic,
    meetingContext.selfState.audioStream,
    meetingContext.setSelfState.setAudioStream,
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
      getUserPanelConfig(participant, meetingContext, state)
    );
  }, [meetingContext, state]);

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
