import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/home';
import Join from '@/pages/join';
import Create from '@/pages/create';
import Room from '@/pages/room';
import Exit from '@/pages/exit';
import Setting from '@/pages/setting';
import MainLayout from '@/layout/main-layout';
import ErrorPage from '@/pages/error';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/j/:id?',
        element: <Join />,
      },
      {
        path: '/join/:id?',
        element: <Join />,
      },
      {
        path: '/create/',
        element: <Create />,
      },
      {
        path: '/exit',
        element: <Exit />,
      },
      {
        path: '/setting',
        element: <Setting />,
      },
    ],
  },
  {
    path: '/room/:id',
    element: <Room />,
    errorElement: <ErrorPage />,
  },
]);

export default routes;
