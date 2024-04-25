import useGlobalStore from '@/context/global-context';
import { Fragment, useMemo, useState } from 'react';
import useMediaStream from '@/hooks/use-media-stream';
import useBgReplace from '@/hooks/use-background-replace';
import { BackgroundConfig } from '@/hooks/use-background-replace/helpers/backgroundHelper';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import { CubeTransparentIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { VideoPanel } from '@/components/video-panel';
import { getVideoBackgroundConfig, videoBackgrounds } from '@/utils/video-background-image';

function VideoBackgroundSetting() {
  const globalState = useGlobalStore((d) => d);
  const [currentBackground, setCurrentBackground] = useState<number>(
    globalState.user.videoBackground
  );

  const [selectedCameraLabel, setSelectedCameraLabel] = useState<string>(
    globalState.user.defaultCamera || ''
  );
  const [originVideoStream, setOriginVideoStream] =
    useState<MediaStream | null>(null);

  useMediaStream(
    selectedCameraLabel,
    setSelectedCameraLabel,
    true,
    () => {},
    originVideoStream,
    setOriginVideoStream,
    'video',
    'camera'
  );

  const backgroundConfig = useMemo<BackgroundConfig>(
    () => getVideoBackgroundConfig(currentBackground),
    [currentBackground]
  );

  const [canvasRef, backgroundImageRef, replacedStream] = useBgReplace(
    backgroundConfig,
    originVideoStream
  );

  const submitState = () => {
    useGlobalStore.setState((state) => ({
      ...state,
      user: {
        ...state.user,
        videoBackground: currentBackground,
      },
    }));
  };
  const initState = () => {
    setCurrentBackground(globalState.user.videoBackground);
  };

  return (
    <>
      <div className="flex h-full flex-shrink flex-col gap-2 overflow-auto">
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
                  {globalState.mediaDiveces.camera.find(
                    (camera) => camera.label === selectedCameraLabel
                  )?.label ||
                    (globalState.mediaDiveces.camera.length
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
                  {globalState.mediaDiveces.camera.map((camera) => (
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
        <div>
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
          <VideoPanel
            camStream={replacedStream}
            user={globalState.user}
            mirrroCamera={globalState.user.mirrorCamera}
            screenStream={null}
            className="rounded-lg"
            expandCamera={globalState.user.expandCamera}
            limitHeight
            audioStream={null}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['', ...videoBackgrounds].map((image, index) => (
            <div
              key={image}
              className={
                'relative aspect-video w-full cursor-pointer overflow-hidden rounded-md border-2 ' +
                (index === currentBackground
                  ? 'border-primary'
                  : 'border-gray-300')
              }
              onClick={() => setCurrentBackground(index)}
            >
              <img
                src={image}
                alt=""
                className={
                  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ' +
                  (index === 1 ? 'blur-lg' : '')
                }
              />
              <div className="flex h-full w-full items-center justify-center opacity-50">
                {index === 0 ? (
                  <XCircleIcon width={24} height={24} />
                ) : index === 1 ? (
                  <CubeTransparentIcon width={24} height={24} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-grow-0 justify-end gap-2 p-5 pb-0">
        <button
          className="btn btn-remove-focus btn-primary-outline"
          onClick={initState}
        >
          Reset
        </button>
        <button className="btn btn-primary" onClick={submitState}>
          Save
        </button>
      </div>
    </>
  );
}

export default VideoBackgroundSetting;
