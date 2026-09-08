import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';

// ─── Eager-loaded (critical path) ─────────────────────────────────────────────
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PublicBusinessPage from './pages/public/PublicBusinessPage';
import BusinessesPage from './pages/public/BusinessesPage';
import NotFoundPage from './pages/NotFoundPage';

// ─── Lazy-loaded layouts ───────────────────────────────────────────────────────
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// ─── Lazy-loaded dashboard pages ──────────────────────────────────────────────
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const MyBusiness = lazy(() => import('./pages/dashboard/MyBusiness'));
const BusinessSetup = lazy(() => import('./pages/dashboard/BusinessSetup'));
const Services = lazy(() => import('./pages/dashboard/Services'));
const Products = lazy(() => import('./pages/dashboard/Products'));
const Gallery = lazy(() => import('./pages/dashboard/Gallery'));
const Leads = lazy(() => import('./pages/dashboard/Leads'));
const Analytics = lazy(() => import('./pages/dashboard/Analytics'));
const QRCodePage = lazy(() => import('./pages/dashboard/QRCodePage'));
const SubscriptionPage = lazy(() => import('./pages/dashboard/SubscriptionPage'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));

// ─── Lazy-loaded admin pages ───────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminBusinesses = lazy(() => import('./pages/admin/AdminBusinesses'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));

// ─── Route Guards ─────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader fullScreen />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();
    if (loading) return <Loader fullScreen />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader fullScreen />;
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// ─── Routes ───────────────────────────────────────────────────────────────────
const AppRoutes = () => (
    <Suspense fallback={<Loader fullScreen />}>
        <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route path="/businesses/:category" element={<BusinessesPage />} />
            <Route path="/business/:slug" element={<PublicBusinessPage />} />

            {/* Auth */}
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

            {/* Dashboard */}
            <Route
                path="/dashboard"
                element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
            >
                <Route index element={<DashboardHome />} />
                <Route path="business" element={<MyBusiness />} />
                <Route path="business/setup" element={<BusinessSetup />} />
                <Route path="services" element={<Services />} />
                <Route path="products" element={<Products />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="leads" element={<Leads />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="qr" element={<QRCodePage />} />
                <Route path="subscription" element={<SubscriptionPage />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin */}
            <Route
                path="/admin"
                element={<AdminRoute><AdminLayout /></AdminRoute>}
            >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="businesses" element={<AdminBusinesses />} />
                <Route path="payments" element={<AdminPayments />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Suspense>
);

export default function App() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <AuthProvider>
                    <AppRoutes />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: { borderRadius: '12px', background: '#fff', color: '#1f2937' },
                            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
                            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                        }}
                    />
                </AuthProvider>
            </ErrorBoundary>
        </BrowserRouter>
    );
}
