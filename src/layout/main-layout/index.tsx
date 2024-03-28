import { Outlet } from 'react-router-dom';
import LogoColored from '@/assets/logo_color.svg?react';
import { useContext } from 'react';
import { Context } from '@/context';
import Avatar from '@/components/avatar';
import { Link } from 'react-router-dom';

function MainLayout() {
  const { state } = useContext(Context);

  return (
    <>
      <header className="flex h-16 flex-shrink-0 flex-grow-0 items-center z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold"
            >
              <LogoColored width={32} height={32} />
              <span>ConFlux</span>
            </Link>
            <nav>
              <Link to="/setting">
                <Avatar user={state.user} size={32} />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <Outlet />
    </>
  );
}

export default MainLayout;
