const ProgressBar: React.FC<{
  progress: number;
  text?: boolean;
}> = ({ progress, text = false }) => {
  const progressPercent = `${Math.ceil(progress * 100)}%`;

  return (
    <div className="w-full rounded-full bg-gray-300">
      <div
        className="rounded-full bg-sky-600 p-0.5 text-center text-xs font-medium leading-none text-blue-100 transition-all"
        style={{ width: progressPercent }}
        id="progressBar"
      >
        {text && progressPercent}
      </div>
    </div>
  );
};

export default ProgressBar;
