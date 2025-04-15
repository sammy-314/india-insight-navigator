
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from './SidebarProvider';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  BarChart3, 
  Calculator, 
  ChevronLeft, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
  const { isSidebarOpen } = useSidebar();
  
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
        isActive ? 
          "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : 
          "text-sidebar-foreground/80 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon size={18} />
      <span className={cn("transition-opacity duration-200", 
        isSidebarOpen ? "opacity-100" : "opacity-0 md:hidden w-0 md:w-auto overflow-hidden")}>{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { userDetails } = useUser();

  if (!userDetails) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-primary transition-transform transform duration-300 ease-in-out",
          isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-accent/30">
            <div className={cn("transition-opacity duration-200", isSidebarOpen ? "opacity-100" : "opacity-0 md:hidden")}>
              <h2 className="font-semibold text-sidebar-foreground text-lg">
                Navigation
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-sidebar-foreground hover:bg-sidebar-accent/50 ml-auto hidden md:flex"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>
          
          {/* User info */}
          <div className={cn(
            "p-4 border-b border-sidebar-accent/30",
            !isSidebarOpen && "hidden md:block md:p-2"
          )}>
            <div className="flex items-center space-x-3">
              <div className="min-w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-primary font-medium">
                {userDetails.name.charAt(0)}
              </div>
              <div className={cn("transition-opacity duration-200", isSidebarOpen ? "opacity-100" : "opacity-0 md:hidden")}>
                <p className="font-medium text-sidebar-foreground truncate max-w-[140px]">{userDetails.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{userDetails.state}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 px-3 py-4 space-y-1">
            <NavItem to="/dashboard/schemes" icon={ClipboardList} label="Schemes" />
            <NavItem to="/dashboard/budget" icon={BarChart3} label="Budget Impact" />
            <NavItem to="/dashboard/tax-calculator" icon={Calculator} label="Tax Calculator" />
            <NavItem to="/dashboard/resources" icon={BookOpen} label="Resources" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
