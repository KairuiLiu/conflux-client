import {
  CheckIcon,
  InformationCircleIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from '@heroicons/react/24/solid';
import MicroPhoneMuteIcon from '@/assets/MicrophoneMuteIcon.svg?react';
import React, { Fragment } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import { MeetingContextType } from '@/types/meeting';
import useGlobalStore from '@/context/global-context';

const MediaControlBar: React.FC<{
  meetingContext: MeetingContextType;
  iconColor?: string;
  optionsAside?: boolean;
}> = ({ meetingContext, iconColor = 'text-white', optionsAside = true }) => {
  const state = useGlobalStore((d) => d);

  return (
    <>
      <div className="relative flex flex-nowrap overflow-y-visible">
        <button
          className="btn btn-gray-glass flex-shrink-0 rounded-r-none"
          onClick={() =>
            meetingContext.setMeetingDeviceState.setEnableMic(
              !meetingContext.meetingDeviceState.enableMic
            )
          }
          onMouseDown={(e) => e.preventDefault()}
        >
          {meetingContext.meetingDeviceState.enableMic ? (
            <MicrophoneIcon className={`h-4 w-4 ${iconColor}`} />
          ) : (
            <MicroPhoneMuteIcon className="h-4 w-4 text-red-500" />
          )}
        </button>
        <Listbox
          value={meetingContext.meetingDeviceState.micLabel}
          onChange={(d) => {
            meetingContext.setMeetingDeviceState.setMicLabel(d);
          }}
        >
          <div className="w-full flex-shrink flex-grow">
            <Listbox.Button
              className="btn btn-gray-glass rounded-l-none"
              title={
                state.mediaDiveces.microphone.length
                  ? 'Select a microphone'
                  : 'No permission / no microphone found'
              }
            >
              <span>
                {state.mediaDiveces.microphone.length ? (
                  <ChevronUpIcon
                    strokeWidth="2px"
                    className={`h-4 w-4 ${iconColor}`}
                    aria-hidden="true"
                  />
                ) : (
                  <InformationCircleIcon
                    className="h-4 w-4 text-amber-500"
                    aria-hidden="true"
                  />
                )}
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={`list-options list-options-top ${
                  optionsAside ? '' : 'list-options-middle'
                } absolute`}
              >
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
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
      <div className="relative flex flex-nowrap overflow-y-visible">
        <button
          className="btn btn-gray-glass flex-shrink-0 rounded-r-none"
          onClick={() =>
            meetingContext.setMeetingDeviceState.setEnableCamera(
              !meetingContext.meetingDeviceState.enableCamera
            )
          }
          onMouseDown={(e) => e.preventDefault()}
        >
          {meetingContext.meetingDeviceState.enableCamera ? (
            <VideoCameraIcon className={`h-4 w-4 ${iconColor}`} />
          ) : (
            <VideoCameraSlashIcon className="h-4 w-4 text-red-500" />
          )}
        </button>
        <Listbox
          value={meetingContext.meetingDeviceState.cameraLabel}
          onChange={(d) => {
            meetingContext.setMeetingDeviceState.setCameraLabel(d);
          }}
        >
          <div className="w-full flex-shrink flex-grow">
            <Listbox.Button
              className="btn btn-gray-glass rounded-l-none"
              title={
                state.mediaDiveces.camera.length
                  ? 'Select a camera'
                  : 'No permission / no camera found'
              }
            >
              <span>
                {state.mediaDiveces.camera.length ? (
                  <ChevronUpIcon
                    strokeWidth="2px"
                    className={`h-4 w-4 ${iconColor}`}
                    aria-hidden="true"
                  />
                ) : (
                  <InformationCircleIcon
                    className="h-4 w-4 text-amber-500"
                    aria-hidden="true"
                  />
                )}
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={`list-options list-options-top ${
                  optionsAside ? '' : 'list-options-middle'
                } absolute`}
              >
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
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
      <div className="relative flex flex-nowrap overflow-y-visible">
        <button
          className="btn btn-gray-glass flex-shrink-0 rounded-r-none"
          onClick={() =>
            meetingContext.setMeetingDeviceState.setEnableSpeaker(
              !meetingContext.meetingDeviceState.enableSpeaker
            )
          }
          onMouseDown={(e) => e.preventDefault()}
        >
          {meetingContext.meetingDeviceState.enableSpeaker ? (
            <SpeakerWaveIcon className={`h-4 w-4 ${iconColor}`} />
          ) : (
            <SpeakerXMarkIcon className="h-4 w-4 text-red-500" />
          )}
        </button>
        <Listbox
          value={meetingContext.meetingDeviceState.speakerLabel}
          onChange={(d) => {
            meetingContext.setMeetingDeviceState.setSpeakerLabel(d);
          }}
        >
          <div className="w-full flex-shrink flex-grow">
            <Listbox.Button
              className="btn btn-gray-glass rounded-l-none"
              title={
                state.mediaDiveces.speaker.length
                  ? 'Select a speaker'
                  : 'No permission / no speaker found'
              }
            >
              <span>
                {state.mediaDiveces.speaker.length ? (
                  <ChevronUpIcon
                    strokeWidth="2px"
                    className={`h-4 w-4 ${iconColor}`}
                    aria-hidden="true"
                  />
                ) : (
                  <InformationCircleIcon
                    className="h-4 w-4 text-amber-500"
                    aria-hidden="true"
                  />
                )}
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={`list-options list-options-top ${
                  optionsAside ? 'list-options-right' : 'list-options-middle'
                } absolute`}
              >
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
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
    </>
  );
};

export default MediaControlBar;
