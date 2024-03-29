import { useState } from 'react';
import MeetingHeader from './meeting-header';
import UserPanle from './user-panel';
import MeetingPanel from './meeting-panel';

export default function Room() {
  const [showUserPanel, setShowUserPanel] = useState(false);

  return (
    <div className="flex h-dvh max-h-dvh flex-grow flex-col">
      <MeetingHeader />
      <main className="flex h-0 flex-grow gap-4 px-2 pb-2 transition-all">
        <section className="panel-classic flex w-full flex-shrink flex-grow flex-col shadow-none transition-all">
          <MeetingPanel />
        </section>
        <aside
          className={`panel-classic flex flex-shrink-0 flex-col shadow-none transition-all ${
            showUserPanel
              ? 'w-[33vmin] overflow-visible'
              : 'w-0 overflow-hidden'
          }`}
        >
          <UserPanle handleClose={() => setShowUserPanel(false)} />
        </aside>
      </main>
    </div>
  );
}
