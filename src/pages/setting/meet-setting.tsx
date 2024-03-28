import { Context } from '@/context';
import { Listbox, Switch, Transition } from '@headlessui/react';
import { Fragment, useContext, useState } from 'react';
import { pick } from 'lodash-es';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import MicrophoneVolume from '@/components/microphone-volume';
import { VideoPanel } from '@/components/video-panel';
import SpeakerVolume from '@/components/speaker-volume';
import useMediaStream from '@/utils/use-media-stream';
import useSpeakerStream from '@/utils/use-speaker-stream';

// TODO callback to session setting when default configuration is changed

export default function MeetSetting() {
  const { state, setState } = useContext(Context);
  const [musicLover, setMusicLover] = useState(false);

  const [selectedCameraLabel, setSelectedCameraLabel, videoStream] =
    useMediaStream(state.user.defaultCamera || '', 'video', 'camera');
  const [selectedMicrophoneLabel, setSelectedMicrophoneLabel, audioStream] =
    useMediaStream(state.user.defaultMic || '', 'audio', 'microphone');
  const [
    selectedSpeakerLabel,
    setSelectedSpeakerLabel,
    audioElementAnylist,
    handleSpeakerTest,
  ] = useSpeakerStream(state.user.defaultSpeaker || '');

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
              value={selectedSpeakerLabel}
              onChange={(d) => {
                setSelectedSpeakerLabel(d);
              }}
            >
              <div className="w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.speaker.find(
                      (speaker) => speaker.label === selectedSpeakerLabel
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
              handleSpeakerTest();
            }}
            onDoubleClick={() => {
              setMusicLover(true);
              handleSpeakerTest(true);
            }}
          >
            {musicLover ? 'Enjoy!' : 'Test'}
          </button>
          <div />
          <SpeakerVolume element={audioElementAnylist} relitive />
          <div />

          <p className="flex items-center">Microphone</p>
          <div className="flex">
            <Listbox
              value={selectedMicrophoneLabel}
              onChange={(d) => {
                setSelectedMicrophoneLabel(d);
              }}
            >
              <div className="w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.microphone.find(
                      (microphone) =>
                        microphone.label === selectedMicrophoneLabel
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
              value={selectedCameraLabel}
              onChange={(d) => {
                setSelectedCameraLabel(d);
              }}
            >
              <div className="w-full flex-shrink flex-grow">
                <Listbox.Button className="list-button">
                  <span className="block truncate">
                    {state.mediaDiveces.camera.find(
                      (camera) => camera.label === selectedCameraLabel
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
            className="rounded-lg"
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
                defaultCamera: selectedCameraLabel,
                defaultMic: selectedMicrophoneLabel,
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
