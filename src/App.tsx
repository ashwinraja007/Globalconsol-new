
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import CountryRedirect from '@/components/CountryRedirect';
import Popup from "./components/popup";

// Page imports
import Index from '@/pages/Index';
import SriLankaHome from '@/pages/SriLankaHome';
import MyanmarHome from '@/pages/MyanmarHome';
import BangladeshHome from '@/pages/BangladeshHome';
import PakistanHome from '@/pages/PakistanHome';
import Contact from '@/pages/Contact';
import Services from '@/pages/Services';
import GlobalPresence from '@/pages/GlobalPresence';
import GlobalPresenceM from '@/pages/GlobalPresenceM';
import GlobalPresenceB from '@/pages/GlobalPresenceB';
import AboutUs from '@/pages/aboutus';
import Gallery from '@/pages/Gallery';
import Career from '@/pages/Career';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLogin from '@/pages/AdminLogin';
import BlogEditor from '@/pages/BlogEditor';
import Blog from '@/pages/Blog';
import BlogDetail from '@/components/BlogDetail';
import NewsDetailPage from '@/pages/NewsDetailPage';
import NewsOverviewPage from '@/pages/NewsOverviewPage';
import Projects from '@/pages/Projects';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsAndConditions from '@/pages/TermsAndConditions';
import NotFound from '@/pages/NotFound';

// Service pages
import SeaFreight from '@/pages/services/SeaFreight';
import AirFreight from '@/pages/services/AirFreight';
import CustomsClearance from '@/pages/services/CustomsClearance';
import Warehousing from '@/pages/services/Warehousing';
import Consolidation from '@/pages/services/Consolidation';
import ProjectCargo from '@/pages/services/ProjectCargo';
import Transhipment from '@/pages/services/Transhipment';
import LiquidCargo from '@/pages/services/LiquidCargo';
import ThirdPartyLogistics from '@/pages/services/ThirdPartyLogistics';
import LinerAgency from '@/pages/services/LinerAgency';

import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import Meta from '@/components/Meta';

// Dashboard components
import DashboardOverview from '@/pages/dashboard/Overview';
import DashboardShipments from '@/pages/dashboard/Shipments';
import DashboardDocuments from '@/pages/dashboard/Documents';
import DashboardPayments from '@/pages/dashboard/Payments';
import DashboardSettings from '@/pages/dashboard/Settings';

// Admin components
import AdminOverview from '@/pages/admin/Overview';
import AdminUsers from '@/pages/admin/Users';
import AdminSystemSettings from '@/pages/admin/SystemSettings';
import HeroAdmin from '@/pages/admin/HeroAdmin';
import AboutAdmin from '@/pages/admin/AboutAdmin';
import VisionMissionAdmin from '@/pages/admin/VisionMissionAdmin';
import UniqueAdmin from '@/pages/admin/UniqueAdmin';
import ServicesAdmin from '@/pages/admin/ServicesAdmin';
import ServicePagesAdmin from '@/pages/admin/ServicePagesAdmin';
import GlobalPresenceAdmin from '@/pages/admin/GlobalPresenceAdmin';
import ContactAdmin from '@/pages/admin/ContactAdmin';
import AboutUsAdmin from '@/pages/AboutUsAdmin';
import PopupAdmin from '@/pages/admin/PopupAdmin';
import FooterAdmin from '@/pages/admin/FooterAdmin';
import CareerAdmin from '@/pages/admin/CareerAdmin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Services array type
type ServiceRoute = {
  path: string;
  component: React.ComponentType;
};

// All services
const serviceRoutes: ServiceRoute[] = [
  { path: 'sea-freight', component: SeaFreight },
  { path: 'air-freight', component: AirFreight },
  { path: 'customs-clearance', component: CustomsClearance },
  { path: 'warehousing', component: Warehousing },
  { path: 'consolidation', component: Consolidation },
  { path: 'project-cargo', component: ProjectCargo },
  { path: 'transhipment', component: Transhipment },
  { path: 'liquid-cargo', component: LiquidCargo },
  { path: 'third-party-logistics', component: ThirdPartyLogistics },
  { path: 'liner-agency', component: LinerAgency },
];

// Country prefixes
const countries = ['singapore', 'sri-lanka', 'myanmar', 'bangladesh', 'pakistan', 'home'];

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CountryRedirect />
          <Popup />
          <Meta />
          <div className="App">
            <Routes>
              {/* Home routes */}
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />
              <Route path="/sri-lanka/home" element={<SriLankaHome />} />
              <Route path="/myanmar/home" element={<MyanmarHome />} />
              <Route path="/bangladesh/home" element={<BangladeshHome />} />
              <Route path="/pakistan/home" element={<PakistanHome />} />
              <Route path="/sri-lanka" element={<SriLankaHome />} />
              <Route path="/myanmar" element={<MyanmarHome />} />
              <Route path="/bangladesh" element={<BangladeshHome />} />
              <Route path="/pakistan" element={<PakistanHome />} />

              {/* Global pages */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/contact-us" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/service/7" element={<Services />} />
              <Route path="/where-we-are" element={<GlobalPresence />} />
              <Route path="/global-presence" element={<GlobalPresence />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/career" element={<Career />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/news" element={<NewsOverviewPage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/blog-editor" element={<BlogEditor />} />
              <Route path="/global-presence" element={<GlobalPresence />} />
              <Route path="/sri-lanka/global-presence" element={<GlobalPresence />} />
              <Route path="/pakistan/global-presence" element={<GlobalPresence />} />
              <Route path="/myanmar/global-presence" element={<GlobalPresenceM />} />
              <Route path="/bangladesh/global-presence" element={<GlobalPresenceB />} />

              {/* Simple Admin Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />

              {/* Country-specific pages */}
              {countries.map((country) => (
                <React.Fragment key={country}>
                  <Route path={`/${country}/contact`} element={<Contact />} />
                  <Route path={`/${country}/about-us`} element={<AboutUs />} />
                  <Route path={`/${country}/gallery`} element={<Gallery />} />
                  <Route path={`/${country}/career`} element={<Career />} />
                  <Route path={`/${country}/services`} element={<Services />} />
                  <Route path={`/${country}/blog`} element={<Blog />} />
                  <Route path={`/${country}/blogs`} element={<Blog />} />
                  <Route path={`/${country}/blog/:slug`} element={<BlogDetail />} />
                  <Route path={`/${country}/projects`} element={<Projects />} />
                </React.Fragment>
              ))}

              {/* Service detail pages for global and each country */}
              {serviceRoutes.map((service) => (
                <React.Fragment key={service.path}>
                  {/* Global route */}
                  <Route path={`/services/${service.path}`} element={<service.component />} />

                  {/* Country-specific routes */}
                  {countries.map((country) => (
                    <Route
                      key={`${country}-${service.path}`}
                      path={`/${country}/services/${service.path}`}
                      element={<service.component />}
                    />
                  ))}
                </React.Fragment>
              ))}

              {/* Auth routes */}
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* User Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="overview" element={<DashboardOverview />} />
                <Route path="shipments" element={<DashboardShipments />} />
                <Route path="documents" element={<DashboardDocuments />} />
                <Route path="payments" element={<DashboardPayments />} />
                <Route path="settings" element={<DashboardSettings />} />
              </Route>

              {/* Admin Dashboard */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="overview" element={<AdminOverview />} />
                <Route path="hero" element={<HeroAdmin />} />
                <Route path="about" element={<AboutAdmin />} />
                <Route path="about-page" element={<AboutUsAdmin />} />
                <Route path="vision" element={<VisionMissionAdmin />} />
                <Route path="unique" element={<UniqueAdmin />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="popup" element={<PopupAdmin />} />
                <Route path="footer" element={<FooterAdmin />} />
                <Route path="career" element={<CareerAdmin />} />
                <Route path="service-pages/:slug" element={<ServicePagesAdmin />} />
                <Route path="global-presence" element={<GlobalPresenceAdmin />} />
                <Route path="contact" element={<ContactAdmin />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSystemSettings />} />
                <Route path="blog" element={<BlogEditor />} />
                <Route path="seo" element={<SeoAdmin />} />
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<Index />} />
            </Routes>
          </div>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
