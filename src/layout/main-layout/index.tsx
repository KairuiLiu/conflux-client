import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <>
      <div>Layout</div>
      <Outlet></Outlet>
    </>
  );
}

export default MainLayout;
