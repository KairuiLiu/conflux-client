import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex flex-grow items-center justify-center px-2">
      <section className="panel-classic flex flex-col items-center gap-16 px-6 py-10 transition-all sm:px-8 sm:py-16 md:px-16 md:py-24 lg:px-32 xl:px-48">
        <h2 className="text-center text-3xl font-semibold">
          Begin your idea conflux adventure
        </h2>
        <div className="flex w-min flex-col items-stretch justify-center gap-3 text-center">
          <Link to="/create">
            <div className="btn btn-primary w-full px-2 sm:px-3 md:px-4 lg:px-5">
              Start a meeting
            </div>
          </Link>
          <Link to="/join">
            <div className="btn btn-primary w-full px-2 sm:px-3 md:px-4 lg:px-5">
              Join a meeting
            </div>
          </Link>
          <Link to="/setting">
            <div className="btn btn-primary-outline w-full px-2 sm:px-3 md:px-4 lg:px-5">
              Setting
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
