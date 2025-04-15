
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { budgetProvisions } from '@/data/budget';

type ImpactType = 'All' | 'Positive' | 'Negative' | 'Neutral';
type SectorType = 'All' | 'Healthcare' | 'Education' | 'Agriculture' | 'Infrastructure' | 'Taxation' | 'Social Welfare' | 'Defense' | 'Technology';

const BudgetPage = () => {
  const { userDetails } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImpact, setSelectedImpact] = useState<ImpactType>('All');
  const [selectedSector, setSelectedSector] = useState<SectorType>('All');
  const [relevantProvisions, setRelevantProvisions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          (provision.specialCategory === 'Government Employee' && userDetails.occupation === 'Salaried Employee (Government)');
        
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Positive':
        return 'bg-positive/10 text-positive hover:bg-positive/10';
      case 'Negative':
        return 'bg-negative/10 text-negative hover:bg-negative/10';
      default:
        return 'bg-neutral/10 text-neutral hover:bg-neutral/10';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-200 rounded mb-4"></div>
          <div className="h-2 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-2">Budget Impact Analysis</h1>
        <p className="text-gray-600">
          Understand how the Union Budget affects you based on your profile
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search budget provisions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            value={selectedImpact}
            onValueChange={(value) => setSelectedImpact(value as ImpactType)}
          >
            <SelectTrigger>
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
            <SelectTrigger>
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
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProvisions.length === 0 ? (
        <div className="text-center py-12">
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
          {filteredProvisions.map((provision) => (
            <Card key={provision.id} className="overflow-hidden card-hover">
              <div className={`h-1 ${
                provision.impact === 'Positive' ? 'bg-positive' : 
                provision.impact === 'Negative' ? 'bg-negative' : 
                'bg-neutral'
              }`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">{provision.sector}</Badge>
                  <Badge variant="secondary" className={getImpactColor(provision.impact)}>
                    {provision.impact} Impact
                  </Badge>
                </div>
                <CardTitle className="text-lg">{provision.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{provision.description}</p>
                
                {provision.relevance && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-1">How this affects you</h4>
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
