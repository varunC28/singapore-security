import { useState, Suspense, lazy } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginPage from './LoginPage';
import { Menu, X, LogOut, Package, FolderTree, MessageSquare } from 'lucide-react';

const ProductsPage = lazy(() => import('./ProductsPage'));
const CategoriesPage = lazy(() => import('./CategoriesPage'));
const EnquiriesPage = lazy(() => import('./EnquiriesPage'));

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { to: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#171717] text-white
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Singapore Security</h2>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={closeMenu}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navLinks.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname.startsWith(to) || (to === '/admin/products' && location.pathname === '/admin');
            return (
              <NavLink
                key={to}
                to={to}
                onClick={closeMenu}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={20} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center shrink-0">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-semibold text-gray-900">Admin</span>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Navigate to="/admin/products" replace />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/enquiries" element={<EnquiriesPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
