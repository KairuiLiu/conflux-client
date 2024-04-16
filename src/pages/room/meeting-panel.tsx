import { VideoPanel } from '@/components/video-panel';
import { useVideoPanelSize } from '@/utils/use-panel-size';
import { useEffect, useMemo, useState } from 'react';
import useMediaStream from '@/utils/use-media-stream';
import useGlobalStore from '@/context/global-context';
import useScreenshareStream from '@/utils/use-screenshare-stream';
import MeetingControlBar from './meeting-control-bar';
import useMeetingStore from '@/context/meeting-context';
import { ScreenShareControlPanel } from '@/components/screen-share-control-panel';

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
    'audio',
    'microphone'
  );

  // useSpeakerStream(
  //   meetingContext.meetingDeviceState.speakerLabel,
  //   meetingContext.setMeetingDeviceState.setSpeakerLabel
  // );

  // Video
  const [screenShareStream, enableScreenShareAudio, setEnableScreenShareAudio] =
    useScreenshareStream(
      meetingContext.meetingDeviceState.enableShare,
      meetingContext.setMeetingDeviceState.setEnableShare
    );

  const [videoStream] = useMediaStream(
    meetingContext.meetingDeviceState.cameraLabel,
    meetingContext.setMeetingDeviceState.setCameraLabel,
    meetingContext.meetingDeviceState.enableCamera,
    'video',
    'camera'
  );

  // participant
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
    {
      user?: Pick<UserInfo, 'name' | 'avatar'>;
      camStream?: MediaStream | null;
      screenStream?: MediaStream | null;
      mirrroCamera?: boolean;
      expandCamera?: boolean;
      isScreenShareControlPanel?: boolean;
    }[]
  >([]);

  useEffect(() => {
    const res = [];
    const userSelf = meetingContext.meetingState.participants.find(
      (d) => d.muid === meetingContext.selfMuid
    )!;
    res.push({
      user: {
        name: userSelf?.name || state.user.name,
        avatar: state.user.avatar,
      },
      camStream: videoStream,
      screenStream: null,
      mirrroCamera: state.user.mirrorCamera,
      expandCamera: state.user.expandCamera,
    });
    if (meetingContext.meetingDeviceState.enableShare) {
      res.push({
        user: {
          name: userSelf?.name || state.user.name,
          avatar: state.user.avatar,
        },
        camStream: null,
        screenStream: screenShareStream,
        mirrroCamera: state.user.mirrorCamera,
        expandCamera: state.user.expandCamera,
      });
      res.push({
        isScreenShareControlPanel: true,
      });
    }
    meetingContext.meetingState.participants.forEach((participant, i) => {
      if (i === 0) return;
      res.push({
        user: {
          name: participant.name,
          avatar: participant.avatar,
        },
        camStream: null,
        screenStream: null,
        mirrroCamera: state.user.mirrorCamera,
        expandCamera: state.user.expandCamera,
      });
    });
    setUsePanelConfigArr(res);
  }, [
    itemCount,
    state.user,
    meetingContext.meetingDeviceState.enableCamera,
    screenShareStream,
    videoStream,
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
