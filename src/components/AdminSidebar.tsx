import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Shield,
  Home,
  Info,
  Eye,
  Sparkles,
  Briefcase,
  Globe,
  PhoneCall,
  BookOpen,
  FileText,
  Newspaper,
  Megaphone,
  PanelBottom
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === `/admin${path}` || location.pathname.startsWith(`/admin${path}/`);

  const contentMenuItems = [
    { path: "/hero", label: "Hero Section", icon: Home },
    { path: "/about", label: "About Section", icon: Info },
    { path: "/about-page", label: "About Us Page", icon: BookOpen },
    { path: "/vision", label: "Vision/Mission", icon: Eye },
    { path: "/unique", label: "Unique Features", icon: Sparkles },
    { path: "/services", label: "Services Section", icon: Briefcase },
    { path: "/global-presence", label: "Global Presence", icon: Globe },
    { path: "/contact", label: "Contact Info & Maps", icon: PhoneCall },
    { path: "/blog", label: "Blog & Gallery", icon: Newspaper },
    { path: "/career", label: "Career Page", icon: Briefcase },
    { path: "/popup", label: "Popup Management", icon: Megaphone },
  ];

  const serviceDetailsItems = [
    { path: "/service-pages/sea-freight", label: "Sea Freight" },
    { path: "/service-pages/air-freight", label: "Air Freight" },
    { path: "/service-pages/customs-clearance", label: "Customs Clearance" },
    { path: "/service-pages/warehousing", label: "Warehousing" },
    { path: "/service-pages/consolidation", label: "Consolidation" },
    { path: "/service-pages/project-cargo", label: "Project Cargo" },
    { path: "/service-pages/transhipment", label: "Transhipment" },
    { path: "/service-pages/liquid-cargo", label: "Liquid Cargo" },
    { path: "/service-pages/third-party-logistics", label: "3PL" },
    { path: "/service-pages/liner-agency", label: "Liner Agency" },
  ];

  const systemMenuItems = [
    { path: "/overview", label: "Dashboard", icon: LayoutDashboard },
    { path: "/users", label: "Users", icon: Users },
  ];

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-fit">
      <div className="flex flex-col items-center mb-6 pt-2">
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="font-medium">Admin Portal</h3>
        <p className="text-sm text-gray-500">Content & System</p>
      </div>
      
      <div className="space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content Management</p>
        {contentMenuItems.map((item) => (
          <Link to={`/admin${item.path}`} key={item.path}>
            <Button
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive(item.path) ? "bg-blue-600 hover:bg-blue-700" : ""
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="space-y-1 mt-4 pt-4 border-t">
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service Pages</p>
        {serviceDetailsItems.map((item) => (
          <Link to={`/admin${item.path}`} key={item.path}>
            <Button
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start pl-8 text-sm ${
                isActive(item.path) ? "bg-blue-600 hover:bg-blue-700" : ""
              }`}
            >
              <FileText className="mr-2 h-3 w-3" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="space-y-1 mt-4 pt-4 border-t">
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">System Management</p>
        {systemMenuItems.map((item) => (
          <Link to={`/admin${item.path}`} key={item.path}>
            <Button
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive(item.path) ? "bg-blue-600 hover:bg-blue-700" : ""
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
      
      <div className="pt-6 mt-6 border-t border-gray-100">
        <Button onClick={signOut} variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
