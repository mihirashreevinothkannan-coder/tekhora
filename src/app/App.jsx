import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

const FallbackLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
