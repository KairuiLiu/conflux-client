import { Context } from '@/context';
import { Listbox, Switch, Transition } from '@headlessui/react';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { pick } from 'lodash-es';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import MicrophoneVolume from '@/components/microphone-volume';
import { refreshMediaDevice } from '@/utils/media-devices';
import { setStreamWithId } from '@/utils/media-stream';
import { stopStream } from '@/utils/media-stream';
import VideoPanel from '@/components/video-panel';
import testSound from '@/assets/test-sound.mp3';
import SpeakerVolume from '@/components/speaker-volume';

export default function MeetSetting() {
  const { state, setState } = useContext(Context);

  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  const [audioElementAnylist, setAudioElementAnylist] =
    useState<HTMLAudioElement>();
  const [audioElement, setAudioElement] = useState<HTMLAudioElement>();

  const [meetingConfig, setMeetingConfig] = useState<MeetingConfig>(
    pick(state.user, [
      'autoEnableCamera',
      'defaultCamera',
      'autoEnableMic',
      'defaultMic',
      'autoEnableSpeaker',
      'defaultSpeaker',
      'mirrorCamera',
    ])
  );

  // Shit design: JS audio context API
  const speakerTestCallback = async (
    oldElem: HTMLAudioElement | undefined,
    setElem: React.Dispatch<React.SetStateAction<HTMLAudioElement | undefined>>
  ) => {
    if (oldElem !== undefined) {
      oldElem.pause();
      oldElem.src = '';
      setElem(undefined);
    } else {
      const speaker = state.mediaDiveces.speaker.find(
        (d) => d.label === meetingConfig.defaultSpeaker
      );
      if (speaker) {
        const element = document.createElement('audio');
        element.src = testSound;
        try {
          await element.setSinkId(speaker.deviceId);
          element.play();
          setElem(element);
        } catch (error) {
          console.error('Audio playback error:', error);
        }
      }
    }
  };

  function pauseAllAudioContext() {
    if (audioElementAnylist) {
      audioElementAnylist.pause();
      audioElementAnylist.src = '';
      setAudioElementAnylist(undefined);
    }
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setAudioElement(undefined);
    }
  }

  // [INIT] refresh media devices
  useEffect(() => {
    refreshMediaDevice('audio', setState);
    refreshMediaDevice('video', setState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [INIT & UPDATE] rebind stream when meeting config camera | device list changed => rebind stream
  useEffect(() => {
    // try to find the default camera
    const camera = state.mediaDiveces.camera.find(
      (d) => d.label === meetingConfig.defaultCamera
    );

    if (camera) {
      setStreamWithId(videoStream, setVideoStream, camera.deviceId, 'video');
    } else if (state.mediaDiveces.camera[0]) {
      setMeetingConfig((prev) => ({
        ...prev,
        defaultCamera: state.mediaDiveces.camera[0].label,
      }));
    } else {
      stopStream(videoStream);
      setVideoStream(null);
    }

    return () => {
      stopStream(videoStream);
    };
  }, [state.mediaDiveces.camera, meetingConfig.defaultCamera]);

  // [INIT & UPDATE] rebind stream when meeting config mic | device list changed => rebind stream
  useEffect(() => {
    // try to find the default microphone
    const microphone = state.mediaDiveces.microphone.find(
      (d) => d.label === meetingConfig.defaultMic
    );

    if (microphone) {
      setStreamWithId(
        audioStream,
        setAudioStream,
        microphone.deviceId,
        'audio'
      );
    } else if (state.mediaDiveces.microphone[0]) {
      setMeetingConfig((prev) => ({
        ...prev,
        defaultMic: state.mediaDiveces.microphone[0].label,
      }));
    } else {
      stopStream(audioStream);
      setAudioStream(null);
    }

    return () => {
      stopStream(audioStream);
    };
  }, [state.mediaDiveces.microphone, meetingConfig.defaultMic]);

  // [INIT & UPDATE] rebind stream when meeting config speaker | device list changed => rebind stream
  useEffect(() => {
    pauseAllAudioContext();

    // try to find the default speaker
    const speaker = state.mediaDiveces.speaker.find(
      (d) => d.label === meetingConfig.defaultSpeaker
    );

    if (speaker) {
      return;
    } else if (state.mediaDiveces.speaker[0]) {
      setMeetingConfig((prev) => ({
        ...prev,
        defaultSpeaker: state.mediaDiveces.speaker[0].label,
      }));
    } else {
      pauseAllAudioContext();
    }

    return () => {
      pauseAllAudioContext();
    };
  }, [state.mediaDiveces.speaker, meetingConfig.defaultSpeaker]);

  return (
    <>
      <section className="flex flex-shrink flex-col overflow-y-auto">
        <div className="grid flex-grow grid-cols-[min-content_1fr] gap-3 p-2">
          <Switch
            checked={meetingConfig.autoEnableCamera}
            onChange={(autoEnableCamera) =>
              setMeetingConfig({ ...meetingConfig, autoEnableCamera })
            }
            className={
              meetingConfig.autoEnableCamera
                ? 'switch-wapper-enable'
                : 'switch-wapper-disable'
            }
          >
            <span
              className={
                meetingConfig.autoEnableCamera
                  ? 'switch-core-enable'
                  : 'switch-core-disable'
              }
            />
          </Switch>
          <span>Auto-enable camera at meeting join</span>
          <Switch
            checked={meetingConfig.autoEnableSpeaker}
            onChange={(autoEnableSpeaker) =>
              setMeetingConfig({ ...meetingConfig, autoEnableSpeaker })
            }
            className={
              meetingConfig.autoEnableSpeaker
                ? 'switch-wapper-enable'
                : 'switch-wapper-disable'
            }
          >
            <span
              className={
                meetingConfig.autoEnableSpeaker
                  ? 'switch-core-enable'
                  : 'switch-core-disable'
              }
            />
          </Switch>
          <span>Auto-enable speaker at meeting join</span>
          <Switch
            checked={!meetingConfig.autoEnableMic}
            onChange={(autoMute) =>
              setMeetingConfig({
                ...meetingConfig,
                autoEnableMic: !autoMute,
              })
            }
            className={
              !meetingConfig.autoEnableMic
                ? 'switch-wapper-enable'
                : 'switch-wapper-disable'
            }
          >
            <span
              className={
                !meetingConfig.autoEnableMic
                  ? 'switch-core-enable'
                  : 'switch-core-disable'
              }
            />
          </Switch>
          <span>Auto-mute at meeting join</span>
          <Switch
            checked={meetingConfig.mirrorCamera}
            onChange={(mirrorCamera) =>
              setMeetingConfig({
                ...meetingConfig,
                mirrorCamera,
              })
            }
            className={
              meetingConfig.mirrorCamera
                ? 'switch-wapper-enable'
                : 'switch-wapper-disable'
            }
          >
            <span
              className={
                meetingConfig.mirrorCamera
                  ? 'switch-core-enable'
                  : 'switch-core-disable'
              }
            />
          </Switch>
          <span>Mirror camera</span>
        </div>
        <div className="grid flex-grow grid-cols-[min-content_minmax(0px,_1fr)_min-content] items-center gap-3 p-2">
          <p className="flex items-center">Speaker</p>
          <div className="flex">
            <Listbox
              value={meetingConfig.defaultSpeaker}
              onChange={(d) => {
                setMeetingConfig({
                  ...meetingConfig,
                  defaultSpeaker: d,
                });
              }}
            >
              <div className="w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.speaker.find(
                      (speaker) =>
                        speaker.label === meetingConfig.defaultSpeaker
                    )?.label ||
                      (state.mediaDiveces.speaker.length
                        ? 'Select a speaker'
                        : 'No permission / no speaker found')}
                  </span>
                  <span className="list-tailing-icon">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="list-options">
                    {state.mediaDiveces.speaker.map((speaker) => (
                      <Listbox.Option
                        key={speaker.label}
                        value={speaker.label}
                        className={({ active }) =>
                          `list-item ${active ? 'list-item-active' : ''}`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {speaker.label}
                            </span>
                            {selected ? (
                              <span className="list-prefix-icon">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <button
            className="btn btn-primary-outline flex-shrink-0 flex-grow-0 px-4 py-1"
            onClick={() => {
              speakerTestCallback(audioElement, setAudioElement);
              speakerTestCallback(audioElementAnylist, setAudioElementAnylist);
            }}
          >
            Test
          </button>

          <div />
          <SpeakerVolume element={audioElementAnylist} relitive />
          <div />

          <p className="flex items-center">Microphone</p>
          <div className="flex">
            <Listbox
              value={meetingConfig.defaultMic}
              onChange={(d) => {
                setMeetingConfig({
                  ...meetingConfig,
                  defaultMic: d,
                });
              }}
            >
              <div className="w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.microphone.find(
                      (microphone) =>
                        microphone.label === meetingConfig.defaultMic
                    )?.label ||
                      (state.mediaDiveces.microphone.length
                        ? 'Select a microphone'
                        : 'No permission / no microphone found')}
                  </span>
                  <span className="list-tailing-icon">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="list-options">
                    {state.mediaDiveces.microphone.map((microphone) => (
                      <Listbox.Option
                        key={microphone.label}
                        value={microphone.label}
                        className={({ active }) =>
                          `list-item ${active ? 'list-item-active' : ''}`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {microphone.label}
                            </span>
                            {selected ? (
                              <span className="list-prefix-icon">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div />
          <div />
          <MicrophoneVolume stream={audioStream} relativeVolume />
          <div />
          <p className="flex items-center">Camera</p>
          <div className="flex">
            <Listbox
              value={meetingConfig.defaultCamera}
              onChange={(d) => {
                setMeetingConfig({
                  ...meetingConfig,
                  defaultCamera: d,
                });
              }}
            >
              <div className="w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.camera.find(
                      (camera) => camera.label === meetingConfig.defaultCamera
                    )?.label ||
                      (state.mediaDiveces.camera.length
                        ? 'Select a camera'
                        : 'No permission / no camera found')}
                  </span>
                  <span className="list-tailing-icon">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="list-options">
                    {state.mediaDiveces.camera.map((camera) => (
                      <Listbox.Option
                        key={camera.label}
                        value={camera.label}
                        className={({ active }) =>
                          `list-item ${active ? 'list-item-active' : ''}`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {camera.label}
                            </span>
                            {selected ? (
                              <span className="list-prefix-icon">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div />
          <div />
          <VideoPanel
            camStream={videoStream}
            user={state.user}
            mirrroCamera={meetingConfig.mirrorCamera}
            screenStream={null}
            expendVideo={false}
          />
        </div>
      </section>

      <div className="flex flex-shrink-0 flex-grow-0 justify-end gap-3 p-5 pb-0">
        <button
          className="btn btn-remove-focus btn-primary-outline"
          onClick={() => {
            setMeetingConfig(
              pick(state.user, [
                'autoEnableCamera',
                'defaultCamera',
                'autoEnableMic',
                'defaultMic',
                'autoEnableSpeaker',
                'defaultSpeaker',
                'mirrorCamera',
              ])
            );
          }}
        >
          Reset
        </button>
        <button
          className="btn btn-primary"
          onClick={() =>
            setState((state) => ({
              ...state,
              user: {
                ...state.user,
                ...meetingConfig,
              },
            }))
          }
        >
          Save
        </button>
      </div>
    </>
  );
}
