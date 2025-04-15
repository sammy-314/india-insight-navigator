
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

// Dynamic color mapping for impact types
const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Positive':
      return 'bg-positive/10 text-positive border-positive/20 hover:bg-positive/20';
    case 'Negative':
      return 'bg-negative/10 text-negative border-negative/20 hover:bg-negative/20';
    default:
      return 'bg-neutral/10 text-neutral border-neutral/20 hover:bg-neutral/20';
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

// Get sector color
const getSectorColor = (sector: string) => {
  const colors: Record<string, string> = {
    'Healthcare': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200',
    'Education': 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200',
    'Agriculture': 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
    'Infrastructure': 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200',
    'Taxation': 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200',
    'Social Welfare': 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200',
    'Defense': 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200',
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
      // Filter budget provisions based on user profile with more detailed matching
      const filtered = budgetProvisions.filter(provision => {
        // Check income eligibility - if max is 0, it means no limit
        const matchesIncome = provision.applicableIncomeRange.max === 0 || 
          (userDetails.income >= provision.applicableIncomeRange.min && 
           (provision.applicableIncomeRange.max === 0 || userDetails.income <= provision.applicableIncomeRange.max));
        
        // Check occupation match
        const matchesOccupation = provision.applicableOccupations.includes('All') ||
          provision.applicableOccupations.some(occ => userDetails.occupation.includes(occ));
            
        // Check age group match
        const matchesAge = provision.applicableAgeGroups.includes('All') ||
          provision.applicableAgeGroups.some(group => {
            if (group === 'All') return true;
            if (group === 'Youth' && userDetails.age >= 18 && userDetails.age <= 35) return true;
            if (group === 'Middle-aged' && userDetails.age > 35 && userDetails.age <= 60) return true;
            if (group === 'Senior' && userDetails.age > 60) return true;
            return false;
          });

        // Additional filtering based on gender or special categories if applicable
        const matchesSpecialCategory = !provision.specialCategory || 
          (provision.specialCategory === 'Farmer' && userDetails.occupation === 'Farmer') ||
          (provision.specialCategory === 'Government Employee' && userDetails.occupation === 'Salaried Employee (Government)') ||
          (provision.specialCategory === 'Tribal Groups' && userDetails.caste === 'ST') ||
          (provision.specialCategory === 'Artisans' && userDetails.occupation === 'Self-employed Professional') ||
          (provision.specialCategory === 'Fisheries' && userDetails.occupation === 'Farmer') ||
          (provision.specialCategory === 'Gig Workers' && userDetails.occupation === 'Self-employed Professional');
        
        return matchesIncome && matchesOccupation && matchesAge && matchesSpecialCategory;
      });

      // Calculate personalized relevance score for each provision
      const scoredProvisions = filtered.map(provision => {
        let relevanceScore = 0;
        
        // Income relevance
        if (provision.applicableIncomeRange.max > 0 && userDetails.income <= provision.applicableIncomeRange.max) {
          relevanceScore += 3;
        }
        
        // Occupation direct match
        if (provision.applicableOccupations.includes(userDetails.occupation)) {
          relevanceScore += 5;
        }
        
        // Impact score
        if (provision.impact === 'Positive') {
          relevanceScore += 2;
        } else if (provision.impact === 'Negative') {
          relevanceScore -= 1;
        }
        
        // Generate a personalized relevance message if not already present
        let relevanceMessage = provision.relevance;
        if (!relevanceMessage) {
          if (provision.impact === 'Positive') {
            relevanceMessage = `Based on your ${userDetails.occupation} occupation and income level, this budget provision likely benefits you.`;
          } else if (provision.impact === 'Negative') {
            relevanceMessage = `As ${userDetails.occupation} with your current income, this may negatively impact your finances.`;
          } else {
            relevanceMessage = `This budget provision has a neutral effect on your financial situation.`;
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
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Budget Impact Analysis</h1>
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
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
                    <h4 className="font-medium text-sm mb-1 text-gray-700">How this affects you</h4>
                    <p className="text-sm text-gray-600">{provision.relevance}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
