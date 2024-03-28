import { useLocation, useNavigate } from 'react-router-dom';

export default function Exit() {
  const location = useLocation();
  const navigate = useNavigate();
  const exitInfo = location.state as ExitInfo;
  return (
    <main className="flex flex-grow items-center justify-center px-2">
      <section className="flex flex-col items-center gap-16 ">
        <h2 className="text-center text-3xl font-semibold">
          {exitInfo.reason === 'exit'
            ? 'You have left the meeting'
            : 'The meeting has ended'}
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
          {exitInfo.reason === 'exit' ? (
            <button
              className="btn btn-primary-outline w-full px-2 sm:px-3 md:px-4 lg:px-5"
              onClick={() => {
                navigate(`/join/${exitInfo.roomId}`);
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
