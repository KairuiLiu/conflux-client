const ProgressBar: React.FC<{
  progress: number; // 0.0 ~ 1.0
  text?: boolean;
}> = ({ progress, text = false }) => {
  const progressPercent = `${Math.ceil(progress * 100)}%`;

  return (
    <div className="w-full rounded-full bg-gray-300">
      <div
        className={`rounded-full  p-0.5 text-center text-xs font-medium leading-none text-blue-100 transition-all duration-75 ${progress ? 'bg-sky-600' : 'bg-gray-300'}`}
        style={{ width: progressPercent }}
        id="progressBar"
      >
        {text && progressPercent}
      </div>
    </div>
  );
};

export default ProgressBar;
