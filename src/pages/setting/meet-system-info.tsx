import RTCPanel from '@/components/rtc-info-panel';
import { Context } from '@/context';
import { useContext } from 'react';

export default function MeetSystemInfo() {
  const { state } = useContext(Context);

  return (
    <div className="flex flex-col gap-2">
      {state.rtcStatus.map((data) => (
        <RTCPanel key={data.title} data={data} />
      ))}
      <mark>TODO Reactivity Component</mark>
    </div>
  );
}
