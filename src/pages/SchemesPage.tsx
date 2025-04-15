
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

type SchemeCategory = 'All' | 'Health' | 'Education' | 'Financial' | 'Agriculture' | 'Employment' | 'Housing' | 'Social Welfare' | 'Technology' | 'Infrastructure';

// Dynamic color mapping for categories
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Health': 'bg-emerald-500 hover:bg-emerald-600',
    'Education': 'bg-blue-500 hover:bg-blue-600',
    'Financial': 'bg-amber-500 hover:bg-amber-600',
    'Agriculture': 'bg-green-600 hover:bg-green-700',
    'Employment': 'bg-purple-500 hover:bg-purple-600',
    'Housing': 'bg-orange-500 hover:bg-orange-600',
    'Social Welfare': 'bg-rose-500 hover:bg-rose-600',
    'Technology': 'bg-cyan-500 hover:bg-cyan-600',
    'Infrastructure': 'bg-violet-500 hover:bg-violet-600'
  };
  
  return colors[category] || 'bg-indigo-500 hover:bg-indigo-600';
};

const getCategoryBadgeColor = (category: string) => {
  const colors: Record<string, string> = {
    'Health': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    'Education': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'Financial': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    'Agriculture': 'bg-green-100 text-green-800 hover:bg-green-200',
    'Employment': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    'Housing': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    'Social Welfare': 'bg-rose-100 text-rose-800 hover:bg-rose-200',
    'Technology': 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
    'Infrastructure': 'bg-violet-100 text-violet-800 hover:bg-violet-200'
  };
  
  return colors[category] || 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
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
      // Filter schemes based on user details
      const filtered = schemes.filter(scheme => {
        // Check if the scheme matches the user's profile
        const matchesAge = !scheme.ageRange.min || userDetails.age >= scheme.ageRange.min;
        const matchesMaxAge = !scheme.ageRange.max || userDetails.age <= scheme.ageRange.max;
        const matchesGender = !scheme.gender || scheme.gender === 'Any' || scheme.gender === userDetails.gender;
        const matchesCategory = !scheme.casteCategory || 
          scheme.casteCategory === 'Any' || 
          scheme.casteCategory === userDetails.caste || 
          (scheme.casteCategory === 'Reserved' && userDetails.caste !== 'General');
        const matchesIncome = !scheme.maxIncome || userDetails.income <= scheme.maxIncome;
        const matchesOccupation = !scheme.occupation || 
          scheme.occupation === 'Any' || 
          scheme.occupation.includes(userDetails.occupation);
        
        return matchesAge && matchesMaxAge && matchesGender && matchesCategory && matchesIncome && matchesOccupation;
      });

      setEligibleSchemes(filtered);
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
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Government Schemes</h1>
        <p className="text-gray-600">
          Find government schemes that match your profile and eligibility
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors duration-200" />
          <Input
            placeholder="Search schemes..."
            className="pl-8 transition-all duration-200 border-gray-200 focus:border-primary"
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
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
            <IndianRupee className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium">No matching schemes found</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            Try adjusting your search criteria or check back later as new schemes are added regularly
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card 
              key={scheme.id} 
              className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-t-4 border-transparent group"
              style={{
                borderTopColor: hoveredScheme === scheme.id ? 'currentColor' : 'transparent'
              }}
              onMouseEnter={() => setHoveredScheme(scheme.id)}
              onMouseLeave={() => setHoveredScheme(null)}
            >
              <div className={`h-2 ${getCategoryColor(scheme.category)}`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`mb-2 transition-colors duration-200 ${getCategoryBadgeColor(scheme.category)}`}>
                    {scheme.category}
                  </Badge>
                  {scheme.isPopular && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 transition-colors duration-200">
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
                      <div className="bg-gray-50 p-2 rounded-md transition-all duration-200 hover:bg-gray-100">
                        <Label className="text-gray-500">Age</Label>
                        <p className="font-medium">
                          {scheme.ageRange.min ? `${scheme.ageRange.min}+ years` : ''}
                          {scheme.ageRange.min && scheme.ageRange.max ? ' to ' : ''}
                          {scheme.ageRange.max ? `${scheme.ageRange.max} years` : ''}
                        </p>
                      </div>
                    ) : null}
                    
                    {scheme.gender && scheme.gender !== 'Any' ? (
                      <div className="bg-gray-50 p-2 rounded-md transition-all duration-200 hover:bg-gray-100">
                        <Label className="text-gray-500">Gender</Label>
                        <p className="font-medium">{scheme.gender}</p>
                      </div>
                    ) : null}
                    
                    {scheme.maxIncome ? (
                      <div className="bg-gray-50 p-2 rounded-md transition-all duration-200 hover:bg-gray-100">
                        <Label className="text-gray-500">Max Income</Label>
                        <p className="font-medium">₹{(scheme.maxIncome / 100000).toFixed(0)} Lakh</p>
                      </div>
                    ) : null}
                    
                    {scheme.casteCategory && scheme.casteCategory !== 'Any' ? (
                      <div className="bg-gray-50 p-2 rounded-md transition-all duration-200 hover:bg-gray-100">
                        <Label className="text-gray-500">Category</Label>
                        <p className="font-medium">{scheme.casteCategory}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300" asChild>
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Learn More <ExternalLink size={14} className="ml-2 opacity-70" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemesPage;
