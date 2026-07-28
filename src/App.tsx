import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import StorefrontPage from './pages/StorefrontPage';

// Code-split admin — public visitors never download admin bundle
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorefrontPage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-dark flex items-center justify-center">
                  <div className="text-white/60 text-sm tracking-label uppercase">
                    Loading admin…
                  </div>
                </div>
              }
            >
              <AdminLayout />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
