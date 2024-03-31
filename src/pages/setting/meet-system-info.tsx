import RTCPanel from '@/components/rtc-info-panel';
import useGlobalStore from '@/context/global-context';

export default function MeetSystemInfo() {
  const state = useGlobalStore((d) => d);

  return (
    <div className="flex flex-col gap-2">
      {state.rtcStatus.map((data) => (
        <RTCPanel key={data.title} data={data} />
      ))}
      <mark>TODO Reactivity Component</mark>
    </div>
  );
}
