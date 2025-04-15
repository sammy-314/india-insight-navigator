
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="bg-blue-50 w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 animate-fade-in">
          <div className="max-w-xl mx-auto">
            <div className="tricolor-border w-24 mb-8"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">India Insight Navigator</h1>
            <p className="text-gray-600 mb-6 text-lg">Discover personalized government schemes, budget impacts, and tax insights—all tailored to your unique profile.</p>
            <div className="space-y-4">
              <Button 
                className="flex items-center group" 
                size="lg" 
                onClick={() => navigate('/onboarding')}
              >
                Get Started
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-8 animate-fade-in">
          <div className="max-w-md mx-auto text-white space-y-8 text-center">
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all card-hover">
                <h3 className="text-xl font-medium mb-2">Government Schemes Explorer</h3>
                <p className="text-blue-100">Find schemes that match your profile and eligibility criteria.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all card-hover">
                <h3 className="text-xl font-medium mb-2">Budget Impact Analysis</h3>
                <p className="text-blue-100">Understand how the union budget affects your financial situation.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all card-hover">
                <h3 className="text-xl font-medium mb-2">Advanced Tax Calculator</h3>
                <p className="text-blue-100">Calculate your taxes under different regimes to maximize savings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
        <p>© 2025 India Insight Navigator - Empowering citizens through personalized insights</p>
      </footer>
    </div>
  );
};

export default LandingPage;
