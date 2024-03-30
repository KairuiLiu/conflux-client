import { VideoPanel } from '@/components/video-panel';
import { useVideoPanelSize } from '@/utils/use-panel-size';
import { useContext, useState } from 'react';
import useMediaStream from '@/utils/use-media-stream';
import { Context } from '@/context';
import useSpeakerStream from '@/utils/use-speaker-stream';
import useScreenshareStream from '@/utils/use-screenshare-stream';
import MeetingControlBar from './meeting-control-bar';

const MeetingPanel: React.FC<{
  setShowUserPanel: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowUserPanel }) => {
  const { state } = useContext(Context);

  // participant
  const [itemCount, setItemCount] = useState(1);
  const [videoPanelRef, videoPanelSize] = useVideoPanelSize(itemCount);
  const itemLayout = new Array(videoPanelSize.row)
    .fill(0)
    .map((_, row) =>
      Math.min(itemCount - row * videoPanelSize.col, videoPanelSize.col)
    );

  // Audio
  const [
    selectedMicrophoneLabel,
    setSelectedMicrophoneLabel,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
    enableMicrophoneStream,
    setEnableMicrophoneStream,
  ] = useMediaStream(
    state.user.defaultMic || '',
    'audio',
    'microphone',
    state.user.defaultMic !== '' && state.user.autoEnableMic
  );

  const [enableSpeaker, setEnableSpeaker] = useState(
    state.user.defaultSpeaker !== '' && state.user.autoEnableSpeaker
  );
  const [selectedSpeakerLabel, setSelectedSpeakerLabel] = useSpeakerStream(
    state.user.defaultSpeaker || ''
  );

  // Video
  const [
    screenShareStream,
    enableScreenShareStream,
    setEnableScreenShareStream,
    enableScreenShareAudio,
    setEnableScreenShareAudio,
  ] = useScreenshareStream();

  const [
    selectedCameraLabel,
    setSelectedCameraLabel,
    videoStream,
    enableCamera,
    setEnableCameraStream,
  ] = useMediaStream(
    state.user.defaultCamera || '',
    'video',
    'camera',
    state.user.defaultCamera !== '' && state.user.autoEnableCamera
  );

  return (
    <>
      <section
        ref={videoPanelRef}
        className="flex flex-grow flex-col items-center justify-center gap-4 overflow-hidden rounded-lg"
      >
        {itemLayout.map((col, row) => (
          <div
            key={row}
            className="flex flex-nowrap content-center items-center justify-center gap-4 overflow-hidden rounded-lg"
          >
            {new Array(col).fill(0).map((_, index) => (
              <div
                key={`${row} ${index}`}
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
                <VideoPanel
                  user={{
                    name: 'Kairui liu',
                    avatar: null,
                  }}
                  camStream={videoStream}
                  screenStream={screenShareStream}
                  fixAvatarSize={
                    Math.min(videoPanelSize.width, videoPanelSize.height) / 2 ||
                    32
                  }
                  mirrroCamera={state.user.mirrorCamera}
                  expandCamera={state.user.expandCamera}
                />
              </div>
            ))}
          </div>
        ))}
      </section>
      <MeetingControlBar
        setItemCount={setItemCount}
        enableCamera={enableCamera}
        setEnableCameraStream={setEnableCameraStream}
        selectedCameraLabel={selectedCameraLabel}
        setSelectedCameraLabel={setSelectedCameraLabel}
        enableMicrophoneStream={enableMicrophoneStream}
        setEnableMicrophoneStream={setEnableMicrophoneStream}
        selectedMicrophoneLabel={selectedMicrophoneLabel}
        setSelectedMicrophoneLabel={setSelectedMicrophoneLabel}
        enableSpeaker={enableSpeaker}
        setEnableSpeaker={setEnableSpeaker}
        setSelectedSpeakerLabel={setSelectedSpeakerLabel}
        selectedSpeakerLabel={selectedSpeakerLabel}
        setEnableScreenShareStream={setEnableScreenShareStream}
        setShowUserPanel={setShowUserPanel}
      ></MeetingControlBar>
    </>
  );
};

export default MeetingPanel;
