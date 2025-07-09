
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, List, Plus, Calendar, Activity, TrendingUp, User, Menu, LogOut, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/trainings", label: "Trainings", icon: List },
    { path: "/add-training", label: "Add Training", icon: Plus },
    { path: "/weekly-plan", label: "Weekly Plan", icon: Calendar },
    { path: "/micro-cycle", label: "Micro Cycle", icon: TrendingUp },
    ...(user?.role === 'coach' ? [{ path: "/athletes", label: "Athletes", icon: Users }] : []),
  ];

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path} onClick={onItemClick}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className="flex items-center space-x-2 w-full justify-start"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          </Link>
        );
      })}
      
      <Link to="/profile" onClick={onItemClick}>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 w-full justify-start">
          <User className="h-4 w-4" />
          <span>{user?.firstName || 'Profile'}</span>
        </Button>
      </Link>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => {
          onItemClick?.();
          logout();
        }}
        className="flex items-center space-x-2 w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </>
  );

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Run Tasov</span>
          </div>
          
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-2 mt-8">
                  <NavItems onItemClick={() => setIsOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
              
              <div className="ml-4 flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.firstName || 'Profile'}</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => logout()}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
