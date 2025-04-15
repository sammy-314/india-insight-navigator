
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check, ArrowRight, BookOpen, Mail } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-full"></div>
            <span className="font-bold text-lg text-gray-900">India Insight Navigator</span>
          </div>
          <Button onClick={() => navigate('/onboarding')} variant="outline">
            Login / Register
          </Button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="bg-blue-50 w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 animate-fade-in">
          <div className="max-w-xl mx-auto">
            <div className="flex space-x-1 mb-4">
              <div className="w-3 h-8 bg-orange-500 rounded-sm"></div>
              <div className="w-3 h-8 bg-white rounded-sm border border-gray-200"></div>
              <div className="w-3 h-8 bg-green-500 rounded-sm"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">India Insight Navigator</h1>
            <p className="text-gray-600 mb-8 text-lg">Discover personalized government schemes, budget impacts, and tax insights—all tailored to your unique profile.</p>
            <div className="space-y-4">
              <Button 
                className="flex items-center group text-lg py-6" 
                size="lg" 
                onClick={() => navigate('/onboarding')}
              >
                Get Started
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
              
              <div className="flex flex-col space-y-3 mt-8">
                <div className="flex items-center space-x-2">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">100% Free Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">Regularly Updated with Latest Programs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">Curated & Verified Information</span>
                </div>
              </div>
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
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all card-hover">
                <h3 className="text-xl font-medium mb-2">Educational Resources</h3>
                <p className="text-blue-100">Access articles and guides on government policies and financial planning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">1</div>
              <h3 className="font-semibold text-xl mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">Enter your personal details including age, income, occupation, and other relevant information.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">2</div>
              <h3 className="font-semibold text-xl mb-2">Get Personalized Results</h3>
              <p className="text-gray-600">Our system analyses your profile to match you with relevant government schemes and budget impacts.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">3</div>
              <h3 className="font-semibold text-xl mb-2">Apply & Benefit</h3>
              <p className="text-gray-600">Follow the guidance to apply for eligible schemes and understand how budget changes affect you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-4">"I discovered two schemes I was eligible for but never knew existed. The application process was straightforward with the guidance provided."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">RS</div>
                <div className="ml-3">
                  <h4 className="font-medium">Rahul S.</h4>
                  <p className="text-sm text-gray-500">Delhi</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-4">"The budget impact analysis helped me understand how government policies actually affect my finances. Very insightful for financial planning."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">AP</div>
                <div className="ml-3">
                  <h4 className="font-medium">Anita P.</h4>
                  <p className="text-sm text-gray-500">Bengaluru</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-4">"As a senior citizen, the tax calculator helped me optimize my returns. The interface is simple enough even for someone not tech-savvy."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">MK</div>
                <div className="ml-3">
                  <h4 className="font-medium">Mohan K.</h4>
                  <p className="text-sm text-gray-500">Chennai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to discover your benefits?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of Indians who are making informed decisions about government schemes and financial planning.</p>
          
          <Button 
            size="lg"
            variant="outline" 
            className="bg-white text-blue-700 hover:bg-blue-50 text-lg py-6 px-8"
            onClick={() => navigate('/onboarding')}
          >
            Start Your Journey
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white text-lg mb-4">India Insight Navigator</h3>
              <p className="text-sm">Empowering citizens through personalized insights on government schemes and policies.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Government Portals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financial Education</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tax Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Connect With Us</h4>
              <p className="text-sm mb-3">Stay updated with our newsletter</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="px-3 py-2 text-sm text-gray-900 rounded-l-md w-full" />
                <button className="bg-blue-600 px-3 rounded-r-md hover:bg-blue-700 transition-colors">
                  <Mail size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>© 2025 India Insight Navigator - Empowering citizens through personalized insights</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
