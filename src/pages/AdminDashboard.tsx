import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, LogOut, MonitorPlay, Info, Bell, Target, Star, Briefcase, BookOpen, Globe, PhoneCall, Newspaper, Megaphone, PanelBottom, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<{message: string, time: string}[]>([]);

  useEffect(() => {
    // --- APPLY ROYAL BLUE & GOLDEN YELLOW THEME ---
    // RGB values automatically apply to all buttons/links in sub-pages
    document.documentElement.style.setProperty('--brand-primary', '21, 101, 192'); // #1565C0
    document.documentElement.style.setProperty('--brand-primary-dark', '13, 71, 161'); // #0D47A1
    document.documentElement.style.setProperty('--brand-secondary', '212, 166, 42'); // #D4A62A

    const loadNotifications = () => {
      const saved = localStorage.getItem('admin_notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    };
    loadNotifications();
    
    window.addEventListener('website_updated', loadNotifications);
    return () => window.removeEventListener('website_updated', loadNotifications);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

  const navItems = [
    { label: 'Hero Section', path: '/admin/hero', icon: <MonitorPlay className="w-5 h-5" /> },
    { label: 'About Section', path: '/admin/about', icon: <Info className="w-5 h-5" /> },
    { label: 'About Us Page', path: '/admin/about-page', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Vision & Mission', path: '/admin/vision', icon: <Target className="w-5 h-5" /> },
    { label: 'Unique Section', path: '/admin/unique', icon: <Star className="w-5 h-5" /> },
    { label: 'Services Section', path: '/admin/services', icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Global Presence', path: '/admin/global-presence', icon: <Globe className="w-5 h-5" /> },
    { label: 'Contact Info & Maps', path: '/admin/contact', icon: <PhoneCall className="w-5 h-5" /> },
    { label: 'Blog & Gallery', path: '/admin/blog', icon: <Newspaper className="w-5 h-5" /> },
    { label: 'Career Page', path: '/admin/career', icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Popup Management', path: '/admin/popup', icon: <Megaphone className="w-5 h-5" /> },
    { label: 'Footer Settings', path: '/admin/footer', icon: <PanelBottom className="w-5 h-5" /> },
    { label: 'SEO Meta Tags', path: '/admin/seo', icon: <Search className="w-5 h-5" /> },
  ];

  const serviceDetailsItems = [
    { label: 'Sea Freight', path: '/admin/service-pages/sea-freight' },
    { label: 'Air Freight', path: '/admin/service-pages/air-freight' },
    { label: 'Customs Clearance', path: '/admin/service-pages/customs-clearance' },
    { label: 'Warehousing', path: '/admin/service-pages/warehousing' },
    { label: 'Consolidation', path: '/admin/service-pages/consolidation' },
    { label: 'Project Cargo', path: '/admin/service-pages/project-cargo' },
    { label: 'Transhipment', path: '/admin/service-pages/transhipment' },
    { label: 'Liquid Cargo', path: '/admin/service-pages/liquid-cargo' },
    { label: 'Third Party Logistics', path: '/admin/service-pages/third-party-logistics' },
    { label: 'Liner Agency', path: '/admin/service-pages/liner-agency' },
  ];

  const systemItems = [
    { label: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative font-sans">
      {/* Ambient SaaS Background Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#1565C0]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4A62A]/10 blur-[120px] pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="w-[280px] bg-gradient-to-b from-[#1565C0] to-[#0D47A1] border-r border-[#1565C0]/50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-20 transition-all duration-300">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">
            <img src="/logo.png" alt="Logo" className="max-h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold text-white tracking-tight truncate">Admin<span className="text-[#D4A62A]">Panel</span></h1>
            <p className="text-[11px] font-medium text-blue-200 mt-0.5 truncate" title={user?.email}>{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-4 pb-2 pt-2 text-[11px] font-bold text-[#D4A62A] uppercase tracking-widest">Content</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-[#D4A62A] text-[#1F2937] shadow-lg shadow-[#D4A62A]/30' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</div>
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 pb-2">
            <p className="px-4 text-[11px] font-bold text-[#D4A62A] uppercase tracking-widest">Service Pages</p>
          </div>
          {serviceDetailsItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 ml-2 rounded-xl transition-all duration-300 group ${isActive ? 'bg-[#D4A62A]/90 text-[#1F2937] font-bold shadow-md shadow-[#D4A62A]/20' : 'text-blue-100 hover:bg-white/10 hover:text-white font-medium'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isActive ? 'bg-[#1F2937]' : 'bg-blue-300 group-hover:bg-white'}`} />
                <span className="text-[13px] tracking-wide">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 pb-2">
            <p className="px-4 text-[11px] font-bold text-[#D4A62A] uppercase tracking-widest">System</p>
          </div>
          {systemItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-[#D4A62A] text-[#1F2937] shadow-lg shadow-[#D4A62A]/30' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</div>
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-white/10 bg-black/10 backdrop-blur-md">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-transparent bg-white/10 text-white hover:bg-red-500 hover:text-white hover:shadow-sm rounded-2xl py-6 font-semibold transition-all duration-300" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        {/* Top Header with Notifications */}
        <header className="m-4 mb-0 h-20 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl flex items-center justify-between px-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] shrink-0">
          <div className="flex items-center gap-3">
             <span className="text-slate-400 font-medium">Dashboard</span>
             <span className="text-slate-300">/</span>
             <span className="text-slate-800 font-bold capitalize tracking-wide">{location.pathname.split('/').pop() || 'Overview'}</span>
          </div>
          
          <div className="flex items-center gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full w-12 h-12 bg-slate-100/80 hover:bg-[#1565C0]/10 hover:text-[#1565C0] transition-all duration-300">
                  <Bell className="w-5 h-5 text-slate-600 group-hover:text-[#1565C0]" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-white/60 bg-white/90 backdrop-blur-xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
                  <span className="font-bold text-slate-800 tracking-wide">Notifications</span>
                  {notifications.length > 0 && (
                    <button onClick={() => { localStorage.removeItem('admin_notifications'); setNotifications([]); }} className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-red-500 font-bold transition-colors">
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-400 font-medium flex flex-col items-center gap-2">
                      <Bell className="w-8 h-8 text-slate-200 mb-2" />
                      You're all caught up!
                    </div>
                  ) : (
                    notifications.map((notif, i) => (
                      <div key={i} className="p-4 px-5 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors cursor-default">
                        <p className="text-[13px] font-semibold text-slate-700 leading-snug">{notif.message}</p>
                        <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--brand-primary,37,99,235))] inline-block" /> 
                          {new Date(notif.time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="h-8 w-px bg-slate-200/60 mx-1"></div>
            
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1565C0] to-[#D4A62A] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#1565C0]/20 ring-2 ring-white cursor-pointer hover:scale-105 transition-transform duration-300">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-6">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
