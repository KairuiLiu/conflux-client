import { RouterProvider } from 'react-router-dom';
import routes from '@/router';
import { ContextProvider } from '@/context';

function App() {
  return (
    <>
      <ContextProvider>
        <RouterProvider router={routes} />
      </ContextProvider>
    </>
  );
}

export default App;
