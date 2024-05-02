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
import { isEqual } from 'lodash-es';

const MeetingPanel: React.FC<{
  setShowUserPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChatPanel: React.Dispatch<React.SetStateAction<boolean>>;
  layout: 'grid' | 'list';
}> = ({ setShowUserPanel, setShowChatPanel, layout }) => {
  const user = useGlobalStore((d) => d.user);
  const meetingContext = useMeetingStore((d) => d);

  // Media Stream

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
    () => getVideoBackgroundConfig(user.videoBackground || 0),
    [user.videoBackground]
  );

  const [canvasRef, backgroundImageRef, replacedStream] = useBgReplace(
    backgroundConfig,
    originVideoStream
  );

  useEffect(() => {
    if (!originVideoStream || !user.videoBackground)
      meetingContext.setSelfState.setCamStream(originVideoStream);
    else meetingContext.setSelfState.setCamStream(replacedStream);
  }, [replacedStream, meetingContext.setSelfState, originVideoStream, user]);

  // layout

  const itemCount = useMemo(
    () =>
      meetingContext.meetingState.participants.length +
      (meetingContext.meetingState.participants.find((d) => d.state.screen)
        ? 1
        : 0),
    [meetingContext.meetingState.participants]
  );

  const [videoPanelRef, videoPanelGridSize, videoPanelMainSize] =
    useVideoPanelSize(itemCount);
  const [userPanelConfigArr, setUserPanelConfigArr] = useState<
    UserPanelConfig[]
  >([]);
  const [pined, setPined] = useState<UserPanelConfig>();
  const [userPined, setUserPined] = useState<string | null>(null);

  useEffect(() => {
    const participant = sortParticipants(
      meetingContext.meetingState.participants,
      meetingContext.selfState.muid,
      true
    );
    const config = getUserPanelConfig(participant, meetingContext, user);
    setUserPanelConfigArr((old) => (isEqual(old, config) ? old : config));
    let userPinedConfig: UserPanelConfig | undefined = undefined;
    if (userPined) {
      const [userPinedMuid, userPinedType] = userPined.split('@');
      userPinedConfig = config.find(
        (d) =>
          d.user.muid === userPinedMuid &&
          ((userPinedType === 'S' &&
            (d.type === 'CONTROL' || d.type === 'SCREEN')) ||
            (userPinedType === 'C' && d.type === 'CAMERA'))
      );
      setPined((old) =>
        !userPinedConfig || isEqual(userPinedConfig, old)
          ? old
          : userPinedConfig
      );
    }
    if (!userPinedConfig) {
      setUserPined(null);
      setPined(config[0]);
    }
  }, [meetingContext, user, userPined]);

  const handleDoubleClick = (config: UserPanelConfig) => {
    const index = config.user.muid + (config.type === 'CAMERA' ? '@C' : '@S');
    if (userPined === index) setUserPined(null);
    else setUserPined(index);
  };

  // const addMockUser = () => {
  //   const muid = v4();
  //   meetingContext.setMeetingState.setParticipants([
  //     ...meetingContext.meetingState.participants,
  //     {
  //       muid: 'mock' + muid,
  //       name: 'mock' + muid,
  //       state: {
  //         audio: false,
  //         video: false,
  //         screen: false,
  //       },
  //     },
  //   ]);
  // };
  // window.addMockUser = addMockUser;

  return (
    <>
      <section
        ref={videoPanelRef}
        className={
          'flex flex-grow rounded-lg ' +
          (layout === 'grid'
            ? 'flex-row overflow-x-auto'
            : 'flex-col-reverse justify-between gap-4 overflow-hidden p-4 lg:flex-row ')
        }
      >
        {layout === 'grid' ? (
          <>
            {videoPanelGridSize.col * videoPanelGridSize.row ? (
              Array.from({
                length: Math.ceil(
                  userPanelConfigArr.length /
                    (videoPanelGridSize.col * videoPanelGridSize.row)
                ),
              }).map((_, pageIndex) => (
                <div
                  key={`G ${pageIndex}`}
                  className="flex h-full w-full shrink-0 flex-grow flex-col items-center justify-center gap-4 overflow-hidden rounded-lg"
                >
                  {Array.from({ length: videoPanelGridSize.row }).map(
                    (_, rowIndex) => (
                      <div
                        key={`G ${pageIndex} ${rowIndex}`}
                        className="flex flex-nowrap content-center items-center justify-center gap-4 overflow-hidden rounded-lg"
                      >
                        {Array.from({ length: videoPanelGridSize.col }).map(
                          (_, colIndex) => {
                            const panelIndex =
                              pageIndex *
                                videoPanelGridSize.col *
                                videoPanelGridSize.row +
                              rowIndex * videoPanelGridSize.col +
                              colIndex;
                            if (panelIndex >= userPanelConfigArr.length)
                              return null;
                            const panelConfig = userPanelConfigArr[panelIndex];

                            return (
                              <div
                                key={`G ${pageIndex} ${rowIndex} ${colIndex}`}
                                style={{
                                  width:
                                    videoPanelGridSize.width -
                                    ((videoPanelGridSize.col + 1) * 16) /
                                      videoPanelGridSize.col,
                                  height:
                                    videoPanelGridSize.height -
                                    ((videoPanelGridSize.row + 1) * 16) /
                                      videoPanelGridSize.row,
                                }}
                                className="flex-shrink-0 overflow-hidden rounded-lg"
                                onDoubleClick={() =>
                                  handleDoubleClick(panelConfig)
                                }
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
                                      Math.min(
                                        videoPanelGridSize.width,
                                        videoPanelGridSize.height
                                      ) / 2 || 32
                                    }
                                    mirrroCamera={panelConfig.mirrroCamera!}
                                    expandCamera={panelConfig.expandCamera!}
                                  />
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <main className="flex flex-1 items-center justify-center align-middle">
              {pined && (
                <div
                  key={`LP ${pined.user?.muid}`}
                  className="overflow-hidden rounded-lg"
                  onDoubleClick={() => handleDoubleClick(pined)}
                  style={{
                    width: videoPanelMainSize.width,
                    height: videoPanelMainSize.height,
                  }}
                >
                  {pined.isScreenShareControlPanel ? (
                    <ScreenShareControlPanel
                      handleStopSharing={() =>
                        meetingContext.setMeetingDeviceState.setEnableShare(
                          false
                        )
                      }
                      enableAudio={enableScreenShareAudio}
                      setEnableAudio={setEnableScreenShareAudio}
                      screenStream={pined.screenStream!}
                    />
                  ) : (
                    <VideoPanel
                      user={pined.user!}
                      camStream={pined.camStream!}
                      screenStream={pined.screenStream!}
                      audioStream={pined.audioStream!}
                      fixAvatarSize={
                        Math.min(
                          videoPanelMainSize.width,
                          videoPanelMainSize.height
                        ) / 2 || 32
                      }
                      mirrroCamera={pined.mirrroCamera!}
                      expandCamera={pined.expandCamera!}
                    />
                  )}
                </div>
              )}
            </main>
            <aside className="flex h-1/6 w-full items-center justify-start gap-2 overflow-auto lg:h-full lg:w-1/6 lg:flex-col">
              {userPanelConfigArr.map((config) => {
                return (
                  <div
                    key={`LA ${config.user?.muid}`}
                    onDoubleClick={() => handleDoubleClick(config)}
                    className="flex-shrink-0 overflow-hidden rounded-lg"
                    style={{
                      width: videoPanelMainSize.width / 6,
                      height: videoPanelMainSize.height / 6,
                    }}
                  >
                    {config.isScreenShareControlPanel ? (
                      <ScreenShareControlPanel
                        handleStopSharing={() =>
                          meetingContext.setMeetingDeviceState.setEnableShare(
                            false
                          )
                        }
                        enableAudio={enableScreenShareAudio}
                        setEnableAudio={setEnableScreenShareAudio}
                        screenStream={config.screenStream!}
                      />
                    ) : (
                      <VideoPanel
                        user={config.user!}
                        camStream={config.camStream!}
                        screenStream={config.screenStream!}
                        audioStream={config.audioStream!}
                        fixAvatarSize={
                          Math.min(
                            videoPanelMainSize.width,
                            videoPanelMainSize.height
                          ) / 12 || 32
                        }
                        mirrroCamera={config.mirrroCamera!}
                        expandCamera={config.expandCamera!}
                      />
                    )}
                  </div>
                );
              })}
            </aside>
          </>
        )}
      </section>
      <section className=""></section>
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
        className="canvas-gpu-enhance"
      />
    </>
  );
};

export default MeetingPanel;
