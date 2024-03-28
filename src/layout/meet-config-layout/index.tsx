import { aspRange, VideoPanel } from '@/components/video-panel';
import { Context } from '@/context';
import { ReactNode, useContext, useState } from 'react';

// const maxHeight = 75;
// const maxWidth = (maxHeight / 2) * aspRange[1];

const MeetConfigLayout = ({
  titleBar,
  configForm,
}: {
  titleBar: ReactNode;
  configForm: ReactNode;
}) => {
  const { state } = useContext(Context);
  const [cameraStream, setCameraStream] = useState(null);

  return (
    <main className="flex flex-grow -translate-y-8 flex-col items-center justify-center gap-6 px-4">
      {titleBar}
      <div
        className={
          'flex w-full flex-wrap gap-0 lg:max-h-fit lg:max-w-[calc(1024px-2rem)] lg:flex-nowrap lg:gap-4 ' +
          'overflow-hidde overflow-hidden rounded-lg shadow-panel transition-all lg:overflow-visible lg:rounded-none lg:shadow-none ' +
          'max-h-[75dvh] max-w-[min(67.5dvh,_100vw)]'
        }
      >
        <div
          className={
            'lg:flex-basis-[calc(100%-8rem)] w-full flex-grow ' +
            'overflow-visible rounded-none shadow-none transition-all lg:flex-grow-0 lg:overflow-hidden lg:rounded-lg lg:shadow-panel '
          }
        >
          <VideoPanel
            user={state.user}
            mirrroCamera={state.user.mirrorCamera}
            camStream={cameraStream}
            screenStream={null}
            limitHeight
          />
        </div>
        <div
          className={
            'flex w-full flex-shrink-0 flex-col items-center justify-around bg-panel-white p-7 lg:items-start ' +
            'overflow-auto rounded-none shadow-none transition-shadow lg:w-fit lg:overflow-hidden lg:rounded-lg lg:shadow-panel'
          }
        >
          {configForm}
        </div>
      </div>
    </main>
  );
};

export default MeetConfigLayout;
