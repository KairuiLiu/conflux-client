import RTCPanel from '@/components/rtc-info-panel';
import useGlobalStore from '@/context/global-context';

export default function MeetSystemInfo() {
  const state = useGlobalStore((d) => d);

  return (
    <>
      <div className="flex h-full flex-col gap-2 overflow-auto">
        {state.rtcStatus.map((data) => (
          <RTCPanel key={data.title} data={data} />
        ))}
      </div>
    </>
  );
}
