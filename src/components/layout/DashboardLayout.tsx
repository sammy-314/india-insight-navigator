
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useSidebar } from './SidebarProvider';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MenuIcon, LogOut, Bell, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!userDetails) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <motion.div 
        className="flex-1 flex flex-col transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          marginLeft: isSidebarOpen ? '16rem' : '4rem'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden hover-scale"
                onClick={toggleSidebar}
              >
                <MenuIcon size={20} />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                <span className="gradient-text">Aarthik Saathi</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-purple-600 hover-scale hidden sm:flex"
              >
                <Bell size={18} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-purple-600 hover-scale hidden sm:flex"
              >
                <Settings size={18} />
              </Button>
              
              <div className="hidden md:block text-sm">
                <span className="text-gray-500">Welcome, </span>
                <span className="font-medium text-gray-900">{userDetails.name}</span>
              </div>
              
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium hidden sm:flex">
                {userDetails.name.charAt(0)}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600 hover-scale"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
