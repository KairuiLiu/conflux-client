import { useLocation, useNavigate } from 'react-router-dom';

export default function Exit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reason, roomId } = location.state as ExitInfo;

  return (
    <main className="flex flex-grow items-center justify-center px-2">
      <section className="flex flex-col items-center gap-16 ">
        <h2 className="text-center text-3xl font-semibold">
          {reason === 'exit'
            ? 'You have left the meeting'
            : reason === 'kicked'
              ? 'You have been kicked from the meeting'
              : 'Meeting has ended'}
        </h2>
        <div className="flex w-min flex-col items-stretch justify-center gap-3 text-center">
          <button
            className="btn btn-primary w-full px-4 sm:px-5 md:px-6 lg:px-7"
            onClick={() => {
              navigate('/');
            }}
          >
            Back to home
          </button>
          {reason === 'exit' || reason === 'kicked' ? (
            <button
              className="btn btn-primary-outline w-full px-2 sm:px-3 md:px-4 lg:px-5"
              onClick={() => {
                navigate(`/join/${roomId}`);
              }}
            >
              Rejoin
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
