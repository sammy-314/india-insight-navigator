
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndividualTaxCalculator } from '@/components/tax/IndividualTaxCalculator';
import { BusinessTaxCalculator } from '@/components/tax/BusinessTaxCalculator';

const TaxCalculatorPage = () => {
  const [activeTab, setActiveTab] = useState('individual');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-2">Income Tax Calculator</h1>
        <p className="text-gray-600">
          Calculate your income tax liability under different regimes for FY 2024-25 and FY 2025-26
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tax Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual" className="mt-0">
              <IndividualTaxCalculator />
            </TabsContent>
            
            <TabsContent value="business" className="mt-0">
              <BusinessTaxCalculator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxCalculatorPage;
