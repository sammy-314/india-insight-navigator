
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, FileText, ExternalLink, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { resources } from '@/data/resources';

type ResourceCategory = 'All' | 'Policy' | 'Finance' | 'Education' | 'Health' | 'Agriculture' | 'Technology';

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('All');
  const [selectedTab, setSelectedTab] = useState('articles');

  // Filter resources based on search query, category and tab
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    
    const matchesTab = resource.type === selectedTab;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-2">Resources</h1>
        <p className="text-gray-600">
          Explore articles, guides, and educational content about government policies, schemes, and financial planning
        </p>
      </div>

      <Tabs defaultValue="articles" value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as ResourceCategory)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <span>Category</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Policy">Policy</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="articles" className="mt-0">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {resource.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{resource.category}</Badge>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(resource.date)}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        Read More <ExternalLink size={14} className="ml-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="mt-0">
          {/* Render guides with similar layout but different card styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.length === 0 ? (
              <div className="text-center py-12 col-span-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium">No guides found</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden flex">
                  <div className="flex-1 p-6">
                    <Badge variant="outline" className="mb-2">{resource.category}</Badge>
                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {formatDate(resource.date)}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={resource.link} target="_blank" rel="noopener noreferrer">
                          View Guide <ExternalLink size={12} className="ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-0">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium">No videos found</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                    {resource.image ? (
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                        <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-blue-600 ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <Badge variant="outline">{resource.category}</Badge>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-600 text-sm line-clamp-2">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        Watch Video <ExternalLink size={14} className="ml-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourcesPage;
