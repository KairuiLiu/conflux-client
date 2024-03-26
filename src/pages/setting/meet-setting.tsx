import { Context } from '@/context';
import { Listbox, Switch, Transition } from '@headlessui/react';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { pick } from 'lodash-es';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import ProgressBar from '@/components/progress';
import MicrophoneVolume from '@/components/microphone-volume';
import { refreshMediaDevice } from '@/utils/media-devices';
import { setStreamWithId } from '@/utils/media-stream';
import { stopStream } from '@/utils/media-stream';

// todo auto set speaker
// todo device change
// todo sound level
// todo mobile

export default function MeetSetting() {
  const { state, setState } = useContext(Context);

  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [meetingConfig, setMeetingConfig] = useState<MeetingConfig>(
    pick(state.user, [
      'autoEnableCamera',
      'defaultCamera',
      'autoEnableMic',
      'defaultMic',
      'autoEnableSpeaker',
      'defaultSpeaker',
    ])
  );

  // [INIT] refresh media devices
  useEffect(() => {
    refreshMediaDevice('audio', setState);
    refreshMediaDevice('video', setState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [INIT & UPDATE] rebind stream when meeting config camera | device list changed => rebind stream
  useEffect(() => {
    if (state.mediaDiveces.camera.length === 0) return;

    let camera = state.mediaDiveces.camera.find(
      (d) => d.label === meetingConfig.defaultCamera
    );

    if (!camera) {
      camera = state.mediaDiveces.camera[0];
      setMeetingConfig((prev) => ({
        ...prev,
        defaultCamera: camera?.label || '',
      }));
    } else {
      setStreamWithId(videoStream, setVideoStream, camera.deviceId, 'video');
    }

    return () => {
      stopStream(videoStream);
    };
  }, [state.mediaDiveces.camera, meetingConfig.defaultCamera]);

  // [INIT & UPDATE] rebind stream when meeting config mic | device list changed => rebind stream
  useEffect(() => {
    if (state.mediaDiveces.microphone.length === 0) return;

    let miceophone = state.mediaDiveces.microphone.find(
      (d) => d.label === meetingConfig.defaultMic
    );
    if (!miceophone) {
      miceophone = state.mediaDiveces.microphone[0];
      setMeetingConfig((prev) => ({
        ...prev,
        defaultMic: miceophone?.label || '',
      }));
    } else
      setStreamWithId(
        audioStream,
        setAudioStream,
        miceophone.deviceId,
        'audio'
      );

    return () => {
      stopStream(audioStream);
    };
  }, [state.mediaDiveces.microphone, meetingConfig.defaultMic]);

  // [INIT & UPDATE] inject stream to video element
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoRef, videoStream]);

  return (
    <>
      <section className="flex flex-col">
        <div className="grid flex-grow grid-cols-[min-content_1fr] gap-3 p-5">
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
        </div>
        <div className="grid flex-grow grid-cols-[min-content_minmax(0px,_1fr)_min-content] items-center gap-3 p-5">
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
              <div className="relative w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.speaker.find(
                      (speaker) =>
                        speaker.label === meetingConfig.defaultSpeaker
                    )?.label || 'Select a speaker'}
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
          <button className="btn btn-primary-outline flex-shrink-0 flex-grow-0 px-4 py-1">
            Test
          </button>

          <div />
          <ProgressBar progress={0.5} />
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
              <div className="relative w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.microphone.find(
                      (microphone) =>
                        microphone.label === meetingConfig.defaultMic
                    )?.label || 'Select a microphone'}
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
          <MicrophoneVolume stream={audioStream} />
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
              <div className="relative w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.camera.find(
                      (camera) => camera.label === meetingConfig.defaultCamera
                    )?.label || 'Select a camera'}
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
        </div>
        <div></div>
      </section>
      <video ref={videoRef} autoPlay playsInline></video>

      <div className="flex justify-end p-5">
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
