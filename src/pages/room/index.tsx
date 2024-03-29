import { useState } from 'react';
import MeetingHeader from './meeting-header';
import UserPanle from './user-panel';

export default function Room() {
  const [showUserPanel, setShowUserPanel] = useState(true);

  return (
    <div className="flex h-dvh max-h-dvh flex-grow flex-col">
      <MeetingHeader />
      <main className="flex h-0 flex-grow gap-4 px-2 pb-2 transition-all">
        <section className="panel-classic flex w-full flex-shrink flex-grow shadow-none transition-all">
          meeting
        </section>
        <aside
          className={`panel-classic flex-shrink-0 shadow-none transition-all flex flex-col ${
            showUserPanel ? 'w-1/4 overflow-visible' : 'w-0 overflow-hidden'
          }`}
        >
          <UserPanle handleClose={() => setShowUserPanel(false)} />
        </aside>
      </main>
    </div>
  );
}
