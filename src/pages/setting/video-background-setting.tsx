import useGlobalStore from '@/context/global-context';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import useMediaStream from '@/hooks/use-media-stream';
import useBgReplace from '@/hooks/use-background-replace';
import { BackgroundConfig } from '@/hooks/use-background-replace/helpers/backgroundHelper';
import videoBackgroundImage from '@/utils/video-background-image';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';

function VideoBackgroundSetting() {
  const globalState = useGlobalStore((d) => d);
  const [currentBackground] = useState<number>(
    // globalState.user.videoBackground
    3
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

  const backgroundConfig = useMemo<BackgroundConfig>(() => {
    return currentBackground < 2
      ? {
          type: currentBackground === 0 ? 'none' : 'blur',
        }
      : {
          type: 'image',
          url: videoBackgroundImage[currentBackground - 2],
        };
  }, [currentBackground]);

  const [canvasRef, backgroundImageRef, replacedStream] = useBgReplace(
    backgroundConfig,
    originVideoStream
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const instance = videoRef.current;
    instance.srcObject = replacedStream;
    return () => {
      instance.srcObject = null;
    };
  }, [replacedStream, videoRef, originVideoStream]);

  // const submitState = () => {};
  return (
    <>
      <div>
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
          <video autoPlay muted ref={videoRef} />
          <div className="grid grid-cols-3 gap-2">
            {['', ...videoBackgroundImage].map((image, index) => (
              <div
                key={image}
                className="relative aspect-video w-full overflow-hidden"
              >
                <img
                  src={image}
                  alt=""
                  className={
                    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ' +
                    (index === 1 ? 'backdrop-blur-lg' : '')
                  }
                />
                <div className="h-full w-full opacity-50"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>save</div>
    </>
  );
}

export default VideoBackgroundSetting;
