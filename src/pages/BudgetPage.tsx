
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, AlertTriangle, TrendingUp, TrendingDown, MinusCircle } from 'lucide-react';
import { budgetProvisions } from '@/data/budget';
import { motion } from 'framer-motion';

type ImpactType = 'All' | 'Positive' | 'Negative' | 'Neutral';
type SectorType = 'All' | 'Healthcare' | 'Education' | 'Agriculture' | 'Infrastructure' | 'Taxation' | 'Social Welfare' | 'Defense' | 'Technology' | 'Financial' | 'Housing';

// Dynamic color mapping for impact types - updated for navy/grey theme
const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Positive':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    case 'Negative':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  }
};

// Get icon based on impact
const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'Positive':
      return <TrendingUp className="w-4 h-4 mr-1" />;
    case 'Negative':
      return <TrendingDown className="w-4 h-4 mr-1" />;
    default:
      return <MinusCircle className="w-4 h-4 mr-1" />;
  }
};

// Get sector color - updated for navy/grey theme
const getSectorColor = (sector: string) => {
  const colors: Record<string, string> = {
    'Healthcare': 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200',
    'Education': 'bg-sky-100 text-sky-800 hover:bg-sky-200 border-sky-200',
    'Agriculture': 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
    'Infrastructure': 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200',
    'Taxation': 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200',
    'Social Welfare': 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200',
    'Defense': 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200',
    'Technology': 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200 border-cyan-200',
    'Financial': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200',
    'Housing': 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200',
  };
  
  return colors[sector] || 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200';
};

const BudgetPage = () => {
  const { userDetails } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImpact, setSelectedImpact] = useState<ImpactType>('All');
  const [selectedSector, setSelectedSector] = useState<SectorType>('All');
  const [relevantProvisions, setRelevantProvisions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProvision, setHoveredProvision] = useState<number | null>(null);

  useEffect(() => {
    if (userDetails) {
      // Enhanced filter budget provisions based on user profile with more detailed matching
      const filtered = budgetProvisions.filter(provision => {
        // Check income eligibility - if max is 0, it means no limit
        const matchesIncome = provision.applicableIncomeRange.max === 0 || 
          (userDetails.income >= provision.applicableIncomeRange.min && 
           (provision.applicableIncomeRange.max === 0 || userDetails.income <= provision.applicableIncomeRange.max));
        
        // More granular occupation match
        const matchesOccupation = provision.applicableOccupations.includes('All') ||
          provision.applicableOccupations.some(occ => 
            userDetails.occupation.toLowerCase().includes(occ.toLowerCase())
          );
            
        // Enhanced age group match with actual age numbers
        const matchesAge = provision.applicableAgeGroups.includes('All') ||
          provision.applicableAgeGroups.some(group => {
            if (group === 'All') return true;
            if (group === 'Youth' && userDetails.age >= 18 && userDetails.age <= 35) return true;
            if (group === 'Middle-aged' && userDetails.age > 35 && userDetails.age <= 60) return true;
            if (group === 'Senior' && userDetails.age > 60) return true;
            return false;
          });

        // Match education level if applicable
        const matchesEducation = !provision.educationLevel || 
          provision.educationLevel === 'Any' || 
          provision.educationLevel === userDetails.education;
          
        // Match gender if applicable
        const matchesGender = !provision.gender ||
          provision.gender === 'Any' ||
          provision.gender === userDetails.gender;
          
        // Match state if applicable
        const matchesState = !provision.applicableStates ||
          provision.applicableStates.includes('All') ||
          provision.applicableStates.includes(userDetails.state);
          
        // Match marital status if applicable
        const matchesMaritalStatus = !provision.maritalStatus ||
          provision.maritalStatus === 'Any' ||
          provision.maritalStatus === userDetails.maritalStatus;

        // Additional filtering based on special categories with more granular checks
        let matchesSpecialCategory = true;
        
        if (provision.specialCategory) {
          matchesSpecialCategory = false;
          
          if (provision.specialCategory === 'Farmer' && 
              userDetails.occupation.toLowerCase().includes('farm')) {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'Government Employee' && 
                  userDetails.occupation.includes('Government')) {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'Tribal Groups' && 
                  userDetails.caste === 'ST') {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'Reserved Categories' && 
                  ['SC', 'ST', 'OBC'].includes(userDetails.caste)) {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'EWS' && 
                  userDetails.caste === 'EWS') {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'Artisans' && 
                  userDetails.occupation.toLowerCase().includes('self-employed')) {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'Fisheries' && 
                  userDetails.occupation.toLowerCase().includes('fish')) {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'Gig Workers' && 
                  (userDetails.occupation === 'Self-employed Professional' || 
                   userDetails.occupation === 'Freelancer')) {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'PwD' && 
                  userDetails.disability === true) {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'BPL' && 
                  userDetails.bplCard === true) {
            matchesSpecialCategory = true;
          }
          else if (provision.specialCategory === 'Any') {
            matchesSpecialCategory = true;
          }
        }
        
        // Match document requirements if specified
        const hasDocuments = !provision.requiredDocuments ||
          provision.requiredDocuments.every(doc => {
            if (doc === 'PAN Card') return userDetails.panCard;
            if (doc === 'Aadhaar Card') return userDetails.aadharCard;
            if (doc === 'Bank Account') return userDetails.bankAccount;
            return true;
          });
        
        return matchesIncome && matchesOccupation && matchesAge && 
               matchesSpecialCategory && matchesEducation && 
               matchesGender && matchesState && matchesMaritalStatus &&
               hasDocuments;
      });

      // Enhanced personalized relevance score calculation for each provision
      const scoredProvisions = filtered.map(provision => {
        let relevanceScore = 0;
        
        // Calculate income relevance - more points for provisions closely matching income
        if (userDetails.income <= provision.applicableIncomeRange.max || provision.applicableIncomeRange.max === 0) {
          // Higher score for provisions that target user's income bracket more specifically
          const incomeRange = provision.applicableIncomeRange.max - provision.applicableIncomeRange.min;
          if (incomeRange > 0 && incomeRange < 500000) relevanceScore += 4;  // Very targeted
          else if (incomeRange >= 500000 && incomeRange < 1000000) relevanceScore += 3;
          else relevanceScore += 2;
        }
        
        // Occupation direct match - higher points for exact match
        if (provision.applicableOccupations.some(occ => 
          userDetails.occupation.toLowerCase() === occ.toLowerCase())) {
          relevanceScore += 5;
        } else if (provision.applicableOccupations.includes('All')) {
          relevanceScore += 1;
        }
        
        // Impact score
        if (provision.impact === 'Positive') {
          relevanceScore += 2;
        } else if (provision.impact === 'Negative') {
          relevanceScore -= 1;
        }
        
        // Special category match gives high relevance
        if (provision.specialCategory && 
            ((provision.specialCategory === 'Farmer' && userDetails.occupation === 'Farmer') ||
             (provision.specialCategory === 'Government Employee' && userDetails.occupation === 'Salaried Employee (Government)') ||
             (provision.specialCategory === 'Tribal Groups' && userDetails.caste === 'ST') ||
             (provision.specialCategory === 'Reserved Categories' && ['SC', 'ST', 'OBC'].includes(userDetails.caste)) ||
             (provision.specialCategory === 'EWS' && userDetails.caste === 'EWS') ||
             (provision.specialCategory === 'PwD' && userDetails.disability === true) ||
             (provision.specialCategory === 'BPL' && userDetails.bplCard === true))) {
          relevanceScore += 6;
        }
        
        // Education level match
        if (provision.educationLevel && provision.educationLevel === userDetails.education) {
          relevanceScore += 3;
        }
        
        // State match
        if (provision.applicableStates && provision.applicableStates.includes(userDetails.state)) {
          relevanceScore += 4;
        }
        
        // Gender match
        if (provision.gender && provision.gender === userDetails.gender) {
          relevanceScore += 2;
        }
        
        // Generate a personalized relevance message based on user profile
        let relevanceMessage = provision.relevance;
        if (!relevanceMessage) {
          if (provision.impact === 'Positive') {
            relevanceMessage = `As ${userDetails.occupation} with an income of ₹${userDetails.income.toLocaleString()}, this budget provision directly benefits your financial situation.`;
          } else if (provision.impact === 'Negative') {
            relevanceMessage = `Based on your occupation (${userDetails.occupation}) and income level (₹${userDetails.income.toLocaleString()}), this may increase your financial burden.`;
          } else {
            relevanceMessage = `For someone with your profile, this budget provision has a neutral effect on your finances.`;
          }
          
          // Add special category information if relevant
          if (provision.specialCategory === 'Farmer' && userDetails.occupation === 'Farmer') {
            relevanceMessage += " This provision specifically targets farmers like you.";
          } else if (provision.specialCategory === 'Government Employee' && userDetails.occupation === 'Salaried Employee (Government)') {
            relevanceMessage += " This is particularly relevant for government employees like yourself.";
          } else if (provision.specialCategory === 'BPL' && userDetails.bplCard) {
            relevanceMessage += " As a BPL cardholder, you are specifically targeted by this provision.";
          }
        }
        
        return {
          ...provision,
          relevanceScore,
          relevance: relevanceMessage
        };
      });
      
      // Sort by relevance score (highest first)
      scoredProvisions.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      setRelevantProvisions(scoredProvisions);
      setIsLoading(false);
    }
  }, [userDetails]);

  // Filter provisions based on search query, impact and sector
  const filteredProvisions = relevantProvisions.filter(provision => {
    const matchesSearch = searchQuery === '' || 
      provision.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      provision.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesImpact = selectedImpact === 'All' || provision.impact === selectedImpact;
    
    const matchesSector = selectedSector === 'All' || provision.sector === selectedSector;
    
    return matchesSearch && matchesImpact && matchesSector;
  });

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
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2 text-primary">Budget Impact Analysis</h1>
        <p className="text-gray-600">
          Understand how the Union Budget affects you based on your profile
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors duration-200" />
          <Input
            placeholder="Search budget provisions..."
            className="pl-8 transition-all duration-200 border-gray-200 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            value={selectedImpact}
            onValueChange={(value) => setSelectedImpact(value as ImpactType)}
          >
            <SelectTrigger className="border-gray-200 transition-all duration-200 hover:border-primary">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Impact</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Impacts</SelectItem>
              <SelectItem value="Positive">Positive</SelectItem>
              <SelectItem value="Negative">Negative</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48">
          <Select
            value={selectedSector}
            onValueChange={(value) => setSelectedSector(value as SectorType)}
          >
            <SelectTrigger className="border-gray-200 transition-all duration-200 hover:border-primary">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Sector</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sectors</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Agriculture">Agriculture</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Taxation">Taxation</SelectItem>
              <SelectItem value="Social Welfare">Social Welfare</SelectItem>
              <SelectItem value="Defense">Defense</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Financial">Financial</SelectItem>
              <SelectItem value="Housing">Housing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProvisions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-medium">No relevant budget provisions found</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            Based on your profile, we couldn't find budget provisions that match your criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProvisions.map((provision, index) => (
            <motion.div
              key={provision.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card 
                key={provision.id} 
                className="overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 group"
                style={{
                  borderLeftColor: provision.impact === 'Positive' ? 'rgb(16, 185, 129)' : 
                                  provision.impact === 'Negative' ? 'rgb(239, 68, 68)' : 
                                  'rgb(107, 114, 128)'
                }}
                onMouseEnter={() => setHoveredProvision(provision.id)}
                onMouseLeave={() => setHoveredProvision(null)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className={`mb-2 transition-all duration-200 ${getSectorColor(provision.sector)}`}
                    >
                      {provision.sector}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center transition-all duration-200 ${getImpactColor(provision.impact)}`}
                    >
                      {getImpactIcon(provision.impact)}
                      {provision.impact} Impact
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                    {provision.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{provision.description}</p>
                  
                  {provision.relevance && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-100 group-hover:border-primary/20 transition-colors duration-300">
                      <h4 className="font-medium text-sm mb-1 text-primary">How this affects you</h4>
                      <p className="text-sm text-gray-600">{provision.relevance}</p>
                      
                      {/* Relevance Score Indicator */}
                      <div className="mt-3 flex items-center">
                        <span className="text-xs text-gray-500 mr-2">Relevance:</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                              key={i}
                              className={`w-2 h-6 mx-0.5 rounded-sm ${
                                i < Math.min(Math.round(provision.relevanceScore / 2), 5) 
                                  ? 'bg-primary' 
                                  : 'bg-gray-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Show specific criteria that made this provision relevant */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {provision.applicableOccupations.includes(userDetails.occupation) && (
                      <div className="bg-blue-50 text-blue-700 p-2 rounded">
                        Matches your occupation
                      </div>
                    )}
                    
                    {provision.applicableIncomeRange.min <= userDetails.income && 
                     (provision.applicableIncomeRange.max === 0 || provision.applicableIncomeRange.max >= userDetails.income) && (
                      <div className="bg-green-50 text-green-700 p-2 rounded">
                        Matches your income level
                      </div>
                    )}
                    
                    {provision.specialCategory && 
                     ((provision.specialCategory === 'Farmer' && userDetails.occupation === 'Farmer') ||
                      (provision.specialCategory === 'Government Employee' && userDetails.occupation.includes('Government')) ||
                      (provision.specialCategory === 'Tribal Groups' && userDetails.caste === 'ST') ||
                      (provision.specialCategory === 'BPL' && userDetails.bplCard === true)) && (
                      <div className="bg-amber-50 text-amber-700 p-2 rounded">
                        Specific to your category
                      </div>
                    )}
                    
                    {provision.applicableStates && provision.applicableStates.includes(userDetails.state) && (
                      <div className="bg-indigo-50 text-indigo-700 p-2 rounded">
                        Applicable in your state
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
