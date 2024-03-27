import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';

const RTCPanel: React.FC<{
  data: MeetingRTCStatus;
}> = ({ data }) => {
  return (
    <>
      <h3 className="text-xl">{data.title}</h3>
      <section className="flex rounded-lg border border-dashed border-gray-300 p-3">
        {Object.keys(data).map((key) => {
          if (key === 'title') return null;
          const item = data[key] as MeetingRTCStatusItem;
          return (
            <div
              key={data.title + key}
              className="w-1/3 flex-shrink-0 text-gray-400"
            >
              <p>{key}</p>
              {item.value ? (
                <div>{item.value}</div>
              ) : (
                <div>
                  <p className="flex items-center gap-1">
                    <ArrowDownIcon className="h-4 w-4 text-green-500" />
                    {item.download}
                  </p>
                  <p className="flex items-center gap-1">
                    <ArrowUpIcon className="h-4 w-4 text-sky-500" />
                    {item.upload}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
};

export default RTCPanel;
