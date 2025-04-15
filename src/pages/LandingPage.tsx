
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check, ArrowRight, BookOpen, Mail, Shield, LineChart, Calculator, Users, Leaf, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">आ</span>
            </div>
            <span className="font-bold text-xl gradient-text">Aarthik Saathi</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={scrollToFeatures} 
              variant="ghost" 
              className="hidden md:flex hover-scale"
            >
              Features
            </Button>
            <Button 
              onClick={() => navigate('/onboarding')} 
              variant="default" 
              className="hover-scale button-hover"
            >
              Login / Register
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col">
        {/* Main Hero */}
        <section className="min-h-[80vh] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50"></div>
          <div className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
          
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="w-full md:w-1/2 text-center md:text-left space-y-6 md:pr-8"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1.5 rounded-full">Your Financial Guide</span>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="gradient-text">Aarthik Saathi</span>
                  <br />
                  <span>Your Financial Companion</span>
                </h1>
                <p className="text-gray-600 md:text-lg">
                  Discover personalized government schemes, budget impacts, and tax insights—all tailored to your unique financial profile.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4 justify-center md:justify-start">
                  <Button 
                    className="flex items-center group text-lg py-6 shadow-md hover:shadow-xl button-hover"
                    size="lg" 
                    onClick={() => navigate('/onboarding')}
                  >
                    Get Started
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-purple-300 hover:border-purple-500 flex items-center text-lg py-6 hover-scale"
                    size="lg"
                    onClick={scrollToFeatures}
                  >
                    Explore Features
                  </Button>
                </div>
                
                <div className="flex flex-col space-y-4 pt-6">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Check className="text-green-600" size={16} />
                    </div>
                    <span className="text-gray-700">100% Free Service</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Check className="text-green-600" size={16} />
                    </div>
                    <span className="text-gray-700">Updated with Latest Programs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Check className="text-green-600" size={16} />
                    </div>
                    <span className="text-gray-700">Verified Information</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="w-full md:w-1/2 mt-12 md:mt-0"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative h-[400px] w-full">
                  <div className="absolute top-0 right-0 w-full h-full rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 transform rotate-3 opacity-20"></div>
                  <div className="absolute top-4 right-4 w-full h-full rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100">
                    <img 
                      src="/placeholder.svg" 
                      alt="Dashboard Preview" 
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-semibold mb-2">Personalized Dashboard</h3>
                      <p className="text-white/90 text-sm">Access all your tailored insights in one place</p>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="absolute top-[10%] right-[10%] bg-white p-3 rounded-lg shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <Shield className="text-purple-600 h-6 w-6" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-[20%] left-[5%] bg-white p-3 rounded-lg shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <LineChart className="text-purple-600 h-6 w-6" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        </section>
        
        {/* Features Section */}
        <section 
          ref={featuresRef} 
          className="py-20 bg-white relative overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features of <span className="gradient-text">Aarthik Saathi</span></h2>
              <p className="text-gray-600 max-w-3xl mx-auto">Your comprehensive financial companion with all the tools you need to navigate government schemes and financial planning</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 staggered">
              <motion.div 
                className="bg-white rounded-xl shadow-md hover-scale p-6 border border-gray-100"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                  <Users size={24} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Government Schemes Explorer</h3>
                <p className="text-gray-600">Find schemes that match your profile and eligibility criteria from 100+ government programs.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md hover-scale p-6 border border-gray-100"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  <LineChart size={24} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Budget Impact Analysis</h3>
                <p className="text-gray-600">Understand how the union budget affects your financial situation with personalized insights.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md hover-scale p-6 border border-gray-100"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  <Calculator size={24} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Advanced Tax Calculator</h3>
                <p className="text-gray-600">Calculate your taxes under different regimes to maximize savings and financial planning.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md hover-scale p-6 border border-gray-100"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Educational Resources</h3>
                <p className="text-gray-600">Access articles, guides and videos on government policies and financial planning.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md hover-scale p-6 border border-gray-100"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="bg-rose-100 w-12 h-12 rounded-lg flex items-center justify-center text-rose-600 mb-4">
                  <Clock size={24} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Real-time Updates</h3>
                <p className="text-gray-600">Stay informed with the latest changes in government policies and financial regulations.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md hover-scale p-6 border border-gray-100"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                  <Leaf size={24} />
                </div>
                <h3 className="font-semibold text-xl mb-2">Sustainable Finance</h3>
                <p className="text-gray-600">Discover green investment opportunities and sustainable financial practices to build a better future.</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How <span className="gradient-text">Aarthik Saathi</span> Works</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">Three simple steps to get personalized financial insights and government scheme recommendations</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-600"></div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center text-purple-600 mb-6 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-xl mb-3">Complete Your Profile</h3>
                <p className="text-gray-600">Enter your personal details including age, income, occupation, and other relevant information to create your unique financial profile.</p>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-50 rounded-tl-full -z-10"></div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center text-indigo-600 mb-6 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-xl mb-3">Get Personalized Results</h3>
                <p className="text-gray-600">Our intelligent system analyzes your profile to match you with relevant government schemes, budget impacts, and tax optimization strategies.</p>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-indigo-50 rounded-tl-full -z-10"></div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-violet-600"></div>
                <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center text-violet-600 mb-6 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-xl mb-3">Apply & Benefit</h3>
                <p className="text-gray-600">Follow the guided steps to apply for eligible schemes, understand budget impacts, and implement tax-saving measures to improve your finances.</p>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-violet-50 rounded-tl-full -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">Join thousands of satisfied users who have improved their financial situations</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover-scale hover-glow"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"I discovered two schemes I was eligible for but never knew existed. The application process was straightforward with the guidance provided."</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-semibold text-purple-600">RS</div>
                  <div className="ml-3">
                    <h4 className="font-medium">Rahul S.</h4>
                    <p className="text-sm text-gray-500">Delhi</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover-scale hover-glow"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"The budget impact analysis helped me understand how government policies actually affect my finances. Very insightful for financial planning."</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">AP</div>
                  <div className="ml-3">
                    <h4 className="font-medium">Anita P.</h4>
                    <p className="text-sm text-gray-500">Bengaluru</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover-scale hover-glow"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"As a senior citizen, the tax calculator helped me optimize my returns. The interface is simple enough even for someone not tech-savvy."</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center font-semibold text-violet-600">MK</div>
                  <div className="ml-3">
                    <h4 className="font-medium">Mohan K.</h4>
                    <p className="text-sm text-gray-500">Chennai</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
              <path d="M0 4 H8 V0 H32 V24 H24 V32 H0 Z" fill="none" stroke="white"></path>
            </svg>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to discover your benefits?</h2>
              <p className="text-purple-100 mb-8 text-lg">Join thousands of Indians who are making informed decisions about government schemes and financial planning with Aarthik Saathi.</p>
              
              <Button 
                size="lg"
                variant="secondary"
                className="text-purple-700 hover:text-purple-800 hover:bg-white text-lg py-6 px-10 shadow-xl hover:shadow-2xl button-hover"
                onClick={() => navigate('/onboarding')}
              >
                Start Your Journey
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">आ</span>
                  </div>
                  <h3 className="font-bold text-white text-lg">Aarthik Saathi</h3>
                </div>
                <p className="text-sm">Empowering citizens through personalized insights on government schemes and policies.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Home</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Government Portals</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Financial Education</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Tax Guides</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">FAQs</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Connect With Us</h4>
                <p className="text-sm mb-3">Stay updated with our newsletter</p>
                <div className="flex">
                  <input type="email" placeholder="Your email" className="px-3 py-2 text-sm text-gray-900 rounded-l-md w-full" />
                  <button className="bg-purple-600 px-3 rounded-r-md hover:bg-purple-700 transition-colors">
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
              <p>© {new Date().getFullYear()} Aarthik Saathi - Empowering citizens through personalized insights</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
