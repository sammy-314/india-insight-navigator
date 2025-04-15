
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Search, Filter, ExternalLink, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { schemes } from '@/data/schemes';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { motion } from 'framer-motion';

type SchemeCategory = 'All' | 'Health' | 'Education' | 'Financial' | 'Agriculture' | 'Employment' | 'Housing' | 'Social Welfare' | 'Technology' | 'Infrastructure';

// Dynamic color mapping for categories with navy blue theme
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Health': 'bg-sky-600 hover:bg-sky-700',
    'Education': 'bg-blue-700 hover:bg-blue-800',
    'Financial': 'bg-amber-600 hover:bg-amber-700',
    'Agriculture': 'bg-green-700 hover:bg-green-800',
    'Employment': 'bg-slate-600 hover:bg-slate-700',
    'Housing': 'bg-orange-600 hover:bg-orange-700',
    'Social Welfare': 'bg-rose-600 hover:bg-rose-700',
    'Technology': 'bg-cyan-600 hover:bg-cyan-700',
    'Infrastructure': 'bg-indigo-600 hover:bg-indigo-700'
  };
  
  return colors[category] || 'bg-navy-700 hover:bg-navy-800';
};

const getCategoryBadgeColor = (category: string) => {
  const colors: Record<string, string> = {
    'Health': 'bg-sky-100 text-sky-800 hover:bg-sky-200',
    'Education': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'Financial': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    'Agriculture': 'bg-green-100 text-green-800 hover:bg-green-200',
    'Employment': 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    'Housing': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    'Social Welfare': 'bg-rose-100 text-rose-800 hover:bg-rose-200',
    'Technology': 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
    'Infrastructure': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
};

const SchemesPage = () => {
  const { userDetails } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory>('All');
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredScheme, setHoveredScheme] = useState<number | null>(null);

  useEffect(() => {
    if (userDetails) {
      // Enhanced filter schemes based on user details
      const filtered = schemes.filter(scheme => {
        // Check if the scheme matches the user's profile with more specific matching
        const matchesAge = !scheme.ageRange.min || userDetails.age >= scheme.ageRange.min;
        const matchesMaxAge = !scheme.ageRange.max || userDetails.age <= scheme.ageRange.max;
        
        // More specific gender matching
        const matchesGender = !scheme.gender || 
                             scheme.gender === 'Any' || 
                             scheme.gender === userDetails.gender;
        
        // More specific caste category matching
        const matchesCategory = !scheme.casteCategory || 
                               scheme.casteCategory === 'Any' || 
                               scheme.casteCategory === userDetails.caste || 
                               (scheme.casteCategory === 'Reserved' && 
                                ['SC', 'ST', 'OBC', 'EWS'].includes(userDetails.caste));
        
        // More specific income matching
        const matchesIncome = !scheme.maxIncome || userDetails.income <= scheme.maxIncome;
        
        // Enhanced occupation matching
        let matchesOccupation = false;
        if (!scheme.occupation || scheme.occupation === 'Any') {
          matchesOccupation = true;
        } else if (Array.isArray(scheme.occupation)) {
          matchesOccupation = scheme.occupation.some(occ => 
            userDetails.occupation.toLowerCase().includes(occ.toLowerCase())
          );
        } else {
          matchesOccupation = userDetails.occupation.toLowerCase().includes(scheme.occupation.toLowerCase());
        }
        
        // Check for education level if specified in the scheme
        const matchesEducation = !scheme.educationLevel || 
                               scheme.educationLevel === 'Any' || 
                               scheme.educationLevel === userDetails.education;
        
        // Check for state specific schemes
        const matchesState = !scheme.states || 
                            scheme.states.includes('All') || 
                            scheme.states.includes(userDetails.state);
        
        // Check for marital status if applicable
        const matchesMaritalStatus = !scheme.maritalStatus || 
                                    scheme.maritalStatus === 'Any' || 
                                    scheme.maritalStatus === userDetails.maritalStatus;
        
        // Check for disability specific schemes
        const matchesDisability = !scheme.disability || 
                                 (scheme.disability === true && userDetails.disability === true);
        
        // Check BPL criteria if specified
        const matchesBPL = !scheme.bplRequired || userDetails.bplCard === true;
        
        // Consider document requirements
        const hasRequiredDocuments = !scheme.requiredDocuments || 
          scheme.requiredDocuments.every(doc => {
            if (doc === 'PAN Card') return userDetails.panCard;
            if (doc === 'Aadhaar Card') return userDetails.aadharCard;
            if (doc === 'Bank Account') return userDetails.bankAccount;
            return true;
          });
        
        return matchesAge && matchesMaxAge && matchesGender && matchesCategory && 
               matchesIncome && matchesOccupation && matchesEducation && 
               matchesState && matchesMaritalStatus && matchesDisability &&
               matchesBPL && hasRequiredDocuments;
      });

      // Add relevance scoring for sorting
      const scoredSchemes = filtered.map(scheme => {
        let score = 0;
        
        // Calculate relevance score based on how closely it matches user profile
        if (scheme.category === 'Financial' && userDetails.income < 500000) score += 3;
        if (scheme.category === 'Education' && userDetails.age < 30) score += 2;
        if (scheme.category === 'Health' && userDetails.age > 50) score += 2;
        if (scheme.category === 'Agriculture' && userDetails.occupation.includes('Farmer')) score += 5;
        if (scheme.category === 'Social Welfare' && userDetails.income < 300000) score += 3;
        if (scheme.casteCategory === userDetails.caste) score += 4;
        if (scheme.gender === userDetails.gender) score += 2;
        
        // Disability specific scoring
        if (userDetails.disability && scheme.disability) score += 5;
        
        // Higher scores for state-specific matches
        if (scheme.states && scheme.states.includes(userDetails.state)) score += 3;
        
        return { ...scheme, relevanceScore: score };
      });
      
      // Sort schemes by relevance score
      scoredSchemes.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      setEligibleSchemes(scoredSchemes);
      setIsLoading(false);
    }
  }, [userDetails]);

  // Filter schemes based on search query and category
  const filteredSchemes = eligibleSchemes.filter(scheme => {
    const matchesSearch = searchQuery === '' || 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/30 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-primary/30 rounded mb-4"></div>
          <div className="h-2 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-primary">Government Schemes</h1>
        <p className="text-gray-600">
          Find government schemes that match your profile and eligibility
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors duration-200" />
          <Input
            placeholder="Search schemes..."
            className="pl-8 transition-all duration-200 border-gray-200 focus:border-primary input-focus"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as SchemeCategory)}
          >
            <SelectTrigger className="w-full border-gray-200 transition-all duration-200 hover:border-primary">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Category</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Financial">Financial</SelectItem>
              <SelectItem value="Agriculture">Agriculture</SelectItem>
              <SelectItem value="Employment">Employment</SelectItem>
              <SelectItem value="Housing">Housing</SelectItem>
              <SelectItem value="Social Welfare">Social Welfare</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredSchemes.length === 0 ? (
        <motion.div 
          className="text-center py-12 bg-gray-50 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
            <IndianRupee className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium">No matching schemes found</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            Try adjusting your search criteria or check back later as new schemes are added regularly
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredSchemes.map((scheme) => (
            <motion.div 
              key={scheme.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card 
                className="overflow-hidden border-t-4 border-transparent group rounded-xl hover:shadow-lg transition-all duration-300"
                style={{
                  borderTopColor: hoveredScheme === scheme.id ? 'currentColor' : 'transparent'
                }}
                onMouseEnter={() => setHoveredScheme(scheme.id)}
                onMouseLeave={() => setHoveredScheme(null)}
              >
                <div className={`h-2 ${getCategoryColor(scheme.category)}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className={`mb-2 transition-colors duration-200 ${getCategoryBadgeColor(scheme.category)} badge-hover`}>
                      {scheme.category}
                    </Badge>
                    {scheme.isPopular && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 transition-colors duration-200 badge-hover">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                    {scheme.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-600 text-sm">{scheme.description}</p>

                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      {scheme.ageRange.min || scheme.ageRange.max ? (
                        <div className="bg-gray-50 p-2 rounded-md transition-all duration-200 hover:bg-gray-100 hover-scale">
                          <Label className="text-gray-500">Age</Label>
                          <p className="font-medium">
                            {scheme.ageRange.min ? `${scheme.ageRange.min}+ years` : ''}
                            {scheme.ageRange.min && scheme.ageRange.max ? ' to ' : ''}
                            {scheme.ageRange.max ? `${scheme.ageRange.max} years` : ''}
                          </p>
                        </div>
                      ) : null}
                      
                      {scheme.gender && scheme.gender !== 'Any' ? (
                        <div className="bg-gray-50 p-2 rounded-md transition-all duration-200 hover:bg-gray-100 hover-scale">
                          <Label className="text-gray-500">Gender</Label>
                          <p className="font-medium">{scheme.gender}</p>
                        </div>
                      ) : null}
                      
                      {scheme.maxIncome ? (
                        <div className="bg-gray-50 p-2 rounded-md transition-all duration-200 hover:bg-gray-100 hover-scale">
                          <Label className="text-gray-500">Max Income</Label>
                          <p className="font-medium">₹{(scheme.maxIncome / 100000).toFixed(0)} Lakh</p>
                        </div>
                      ) : null}
                      
                      {scheme.casteCategory && scheme.casteCategory !== 'Any' ? (
                        <div className="bg-gray-50 p-2 rounded-md transition-all duration-200 hover:bg-gray-100 hover-scale">
                          <Label className="text-gray-500">Category</Label>
                          <p className="font-medium">{scheme.casteCategory}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full button-hover group-hover:bg-primary group-hover:text-white transition-all duration-300" 
                        asChild
                      >
                        <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          Learn More <ExternalLink size={14} className="ml-2 opacity-70" />
                        </a>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4 shadow-lg rounded-lg">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Application Process:</h4>
                        <ol className="list-decimal list-inside text-sm text-gray-600">
                          <li>Visit the official website</li>
                          <li>Create an account or log in</li>
                          <li>Complete the application form</li>
                          <li>Upload required documents</li>
                          <li>Submit and track your application</li>
                        </ol>
                        
                        {/* Show specific eligibility for this user */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <h4 className="font-semibold text-sm">Eligibility Match:</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            This scheme matches {scheme.relevanceScore > 8 ? 'excellently' : 
                              scheme.relevanceScore > 5 ? 'very well' :
                              scheme.relevanceScore > 3 ? 'well' : 'partially'} with your profile
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SchemesPage;
