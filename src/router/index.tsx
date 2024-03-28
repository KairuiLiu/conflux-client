import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '@/pages/home';
import Join from '@/pages/join';
import Create from '@/pages/create';
import Room from '@/pages/room';
import Exit from '@/pages/exit';
import Setting from '@/pages/setting';
import MainLayout from '@/layout/main-layout';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/j/:id?',
        element: <Join />,
        errorElement: <div>TODO</div>,
      },
      {
        path: '/join/:id?',
        element: <Join />,
        errorElement: <div>TODO</div>,
      },
      {
        path: '/create/',
        element: <Create />,
        errorElement: <div>TODO</div>,
      },
      {
        path: '/exit',
        element: <Exit />,
        errorElement: <div>TODO</div>,
      },
      {
        path: '/setting',
        element: <Setting />,
        errorElement: <div>TODO</div>,
      },
    ],
  },
  {
    path: '/room/:id',
    element: <Room />,
    errorElement: <div>TODO</div>,
  },
]);

export default routes;
