
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
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
      // Filter budget provisions based on user profile
      const filtered = budgetProvisions.filter(provision => {
        // Check eligibility based on user details
        const matchesIncome = !provision.applicableIncomeRange.min || userDetails.income >= provision.applicableIncomeRange.min;
        const matchesMaxIncome = !provision.applicableIncomeRange.max || userDetails.income <= provision.applicableIncomeRange.max;
        
        const matchesOccupation = !provision.applicableOccupations.length || 
          provision.applicableOccupations.includes('All') ||
          provision.applicableOccupations.includes(userDetails.occupation);
            
        const matchesAge = !provision.applicableAgeGroups.length ||
          provision.applicableAgeGroups.some(group => {
            if (group === 'All') return true;
            if (group === 'Youth' && userDetails.age >= 18 && userDetails.age <= 35) return true;
            if (group === 'Middle-aged' && userDetails.age > 35 && userDetails.age <= 60) return true;
            if (group === 'Senior' && userDetails.age > 60) return true;
            return false;
          });
        
        return matchesIncome && matchesMaxIncome && matchesOccupation && matchesAge;
      });

      setRelevantProvisions(filtered);
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v6.5M12 22v-6.5M4.93 4.93l4.6 4.6M14.47 14.47l4.6 4.6M2 12h6.5M22 12h-6.5M4.93 19.07l4.6-4.6M14.47 9.53l4.6-4.6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No relevant budget provisions found</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            Try adjusting your filters or check back later as new budget provisions are added
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
