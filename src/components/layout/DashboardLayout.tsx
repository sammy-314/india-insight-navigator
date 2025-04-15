
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useSidebar } from './SidebarProvider';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';

const DashboardLayout = () => {
  const { userDetails, isProfileComplete } = useUser();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails) {
      toast.error('Please complete your profile first');
      navigate('/onboarding');
    }
  }, [userDetails, navigate]);

  if (!userDetails) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={toggleSidebar}
              >
                <MenuIcon size={20} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                India Insight Navigator
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-sm text-gray-600">
                Welcome, <span className="font-medium">{userDetails.name}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
