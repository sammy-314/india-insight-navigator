
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { toast } from 'sonner';

interface TaxDeductions {
  standardDeduction: number;
  section80C: number;
  section80D: number;
  section80G: number;
  homeLoanInterest: number;
  nps: number;
  educationLoan: number;
  otherDeductions: number;
}

interface TaxIncomeDetails {
  salary: number;
  rentalIncome: number;
  businessIncome: number;
  capitalGains: number;
  otherIncome: number;
  agriculturalIncome: number;
}

export const IndividualTaxCalculator = () => {
  const [ageGroup, setAgeGroup] = useState<string>("below60");
  const [incomeDetails, setIncomeDetails] = useState<TaxIncomeDetails>({
    salary: 0,
    rentalIncome: 0,
    businessIncome: 0,
    capitalGains: 0,
    otherIncome: 0,
    agriculturalIncome: 0
  });
  const [deductions, setDeductions] = useState<TaxDeductions>({
    standardDeduction: 50000,
    section80C: 0,
    section80D: 0,
    section80G: 0,
    homeLoanInterest: 0,
    nps: 0,
    educationLoan: 0,
    otherDeductions: 0
  });
  const [taxResults, setTaxResults] = useState<any>({
    oldRegime2024: { taxAmount: 0, effectiveRate: 0 },
    newRegime2024: { taxAmount: 0, effectiveRate: 0 },
    newRegime2025: { taxAmount: 0, effectiveRate: 0 },
    bestOption: ""
  });
  const [showResults, setShowResults] = useState(false);

  const totalIncome = Object.values(incomeDetails).reduce((a, b) => a + b, 0);

  const totalDeductions = 
    deductions.standardDeduction + 
    deductions.section80C + 
    deductions.section80D +
    deductions.section80G +
    deductions.homeLoanInterest +
    deductions.nps +
    deductions.educationLoan +
    deductions.otherDeductions;

  const updateIncomeDetails = (field: keyof TaxIncomeDetails, value: string) => {
    const numValue = value ? parseFloat(value) : 0;
    setIncomeDetails(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const updateDeductions = (field: keyof TaxDeductions, value: string) => {
    const numValue = value ? parseFloat(value) : 0;
    setDeductions(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Calculate taxes under different regimes
  const calculateTax = () => {
    if (totalIncome <= 0) {
      toast.error("Please enter income details to calculate tax.");
      return;
    }
    
    // Calculate taxable income for old regime
    const taxableIncomeOld = Math.max(0, totalIncome - totalDeductions);
    
    // Calculate taxable income for new regime
    const taxableIncomeNew = Math.max(0, totalIncome - 50000); // Only standard deduction in new regime
    
    // Old Regime 2024-25
    let oldRegimeTax = calculateOldRegimeTax(taxableIncomeOld, ageGroup);
    
    // New Regime 2024-25
    let newRegimeTax2024 = calculateNewRegimeTax2024(taxableIncomeNew, ageGroup);
    
    // New Regime 2025-26
    let newRegimeTax2025 = calculateNewRegimeTax2025(taxableIncomeNew, ageGroup);
    
    // Add education cess (4%)
    oldRegimeTax = oldRegimeTax * 1.04;
    newRegimeTax2024 = newRegimeTax2024 * 1.04;
    newRegimeTax2025 = newRegimeTax2025 * 1.04;
    
    // Determine best option
    let bestOption = "Old Regime (2024-25)";
    let minTax = oldRegimeTax;
    
    if (newRegimeTax2024 < minTax) {
      minTax = newRegimeTax2024;
      bestOption = "New Regime (2024-25)";
    }
    
    if (newRegimeTax2025 < minTax) {
      bestOption = "New Regime (2025-26)";
    }
    
    setTaxResults({
      oldRegime2024: { 
        taxAmount: Math.round(oldRegimeTax), 
        effectiveRate: (oldRegimeTax / totalIncome * 100).toFixed(2)
      },
      newRegime2024: { 
        taxAmount: Math.round(newRegimeTax2024), 
        effectiveRate: (newRegimeTax2024 / totalIncome * 100).toFixed(2)
      },
      newRegime2025: { 
        taxAmount: Math.round(newRegimeTax2025), 
        effectiveRate: (newRegimeTax2025 / totalIncome * 100).toFixed(2)
      },
      bestOption
    });
    
    setShowResults(true);
  };
  
  const calculateOldRegimeTax = (income: number, ageGroup: string) => {
    let tax = 0;
    
    if (ageGroup === "below60") {
      if (income <= 250000) {
        tax = 0;
      } else if (income <= 500000) {
        tax = (income - 250000) * 0.05;
      } else if (income <= 1000000) {
        tax = 12500 + (income - 500000) * 0.2;
      } else {
        tax = 112500 + (income - 1000000) * 0.3;
      }
    } else if (ageGroup === "60to80") {
      if (income <= 300000) {
        tax = 0;
      } else if (income <= 500000) {
        tax = (income - 300000) * 0.05;
      } else if (income <= 1000000) {
        tax = 10000 + (income - 500000) * 0.2;
      } else {
        tax = 110000 + (income - 1000000) * 0.3;
      }
    } else { // above80
      if (income <= 500000) {
        tax = 0;
      } else if (income <= 1000000) {
        tax = (income - 500000) * 0.2;
      } else {
        tax = 100000 + (income - 1000000) * 0.3;
      }
    }
    
    return tax;
  };
  
  const calculateNewRegimeTax2024 = (income: number, ageGroup: string) => {
    let tax = 0;
    
    if (income <= 300000) {
      tax = 0;
    } else if (income <= 600000) {
      tax = (income - 300000) * 0.05;
    } else if (income <= 900000) {
      tax = 15000 + (income - 600000) * 0.1;
    } else if (income <= 1200000) {
      tax = 45000 + (income - 900000) * 0.15;
    } else if (income <= 1500000) {
      tax = 90000 + (income - 1200000) * 0.2;
    } else {
      tax = 150000 + (income - 1500000) * 0.3;
    }
    
    return tax;
  };
  
  const calculateNewRegimeTax2025 = (income: number, ageGroup: string) => {
    let tax = 0;
    
    if (income <= 300000) {
      tax = 0;
    } else if (income <= 700000) {
      tax = (income - 300000) * 0.05;
    } else if (income <= 1000000) {
      tax = 20000 + (income - 700000) * 0.1;
    } else if (income <= 1300000) {
      tax = 50000 + (income - 1000000) * 0.15;
    } else if (income <= 1600000) {
      tax = 95000 + (income - 1300000) * 0.2;
    } else {
      tax = 155000 + (income - 1600000) * 0.3;
    }
    
    return tax;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Data for charts
  const chartData = [
    { name: 'Old Regime (2024-25)', value: taxResults.oldRegime2024.taxAmount },
    { name: 'New Regime (2024-25)', value: taxResults.newRegime2024.taxAmount },
    { name: 'New Regime (2025-26)', value: taxResults.newRegime2025.taxAmount }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-8">
      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="income">Income Details</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="income" className="mt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="ageGroup">Age Group</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger id="ageGroup">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below60">Below 60 years</SelectItem>
                  <SelectItem value="60to80">60 to 80 years</SelectItem>
                  <SelectItem value="above80">Above 80 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary">Salary Income</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <Input
                  id="salary"
                  type="number"
                  placeholder="Annual salary income"
                  value={incomeDetails.salary || ''}
                  onChange={(e) => updateIncomeDetails('salary', e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rentalIncome">Rental Income</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="rentalIncome"
                    type="number"
                    placeholder="Rental income"
                    value={incomeDetails.rentalIncome || ''}
                    onChange={(e) => updateIncomeDetails('rentalIncome', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="businessIncome">Business Income</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="businessIncome"
                    type="number"
                    placeholder="Business income"
                    value={incomeDetails.businessIncome || ''}
                    onChange={(e) => updateIncomeDetails('businessIncome', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capitalGains">Capital Gains</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="capitalGains"
                    type="number"
                    placeholder="Capital gains"
                    value={incomeDetails.capitalGains || ''}
                    onChange={(e) => updateIncomeDetails('capitalGains', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="otherIncome">Other Income</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="otherIncome"
                    type="number"
                    placeholder="Other income"
                    value={incomeDetails.otherIncome || ''}
                    onChange={(e) => updateIncomeDetails('otherIncome', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="agriculturalIncome">Agricultural Income</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <Input
                  id="agriculturalIncome"
                  type="number"
                  placeholder="Agricultural income (exempt from tax)"
                  value={incomeDetails.agriculturalIncome || ''}
                  onChange={(e) => updateIncomeDetails('agriculturalIncome', e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="deductions" className="mt-6 space-y-6">
          <Card className="border-dashed border-amber-300">
            <CardContent className="pt-4">
              <p className="text-amber-700 text-sm">
                Note: These deductions are only applicable for the Old Tax Regime. The New Regime offers a standard deduction of ₹50,000 but does not allow most other deductions.
              </p>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="standardDeduction">Standard Deduction</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <Input
                  id="standardDeduction"
                  type="number"
                  placeholder="Standard deduction"
                  value={deductions.standardDeduction}
                  readOnly
                  className="pl-7 bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Fixed at ₹50,000 for salaried individuals</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="section80c">
                <AccordionTrigger className="text-base">Section 80C Deductions</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">
                    Includes PPF, ELSS, LIC premiums, Home Loan Principal, etc. (Max: ₹1,50,000)
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Section 80C deductions"
                      value={deductions.section80C || ''}
                      onChange={(e) => updateDeductions('section80C', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="section80d">
                <AccordionTrigger className="text-base">Section 80D Deductions</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">
                    Medical Insurance Premiums (Max: ₹50,000 for individual & parents)
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Section 80D deductions"
                      value={deductions.section80D || ''}
                      onChange={(e) => updateDeductions('section80D', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="homeLoanInterest">
                <AccordionTrigger className="text-base">Home Loan Interest</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">
                    Interest paid on housing loan (Max: ₹2,00,000)
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Home loan interest"
                      value={deductions.homeLoanInterest || ''}
                      onChange={(e) => updateDeductions('homeLoanInterest', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="nps">
                <AccordionTrigger className="text-base">NPS Contribution</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">
                    Additional deduction for NPS contribution (Max: ₹50,000)
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="NPS contribution"
                      value={deductions.nps || ''}
                      onChange={(e) => updateDeductions('nps', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="otherDeductions">
                <AccordionTrigger className="text-base">Other Deductions</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">
                    Including Section 80G (donations), education loan interest, etc.
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Other deductions"
                      value={deductions.otherDeductions || ''}
                      onChange={(e) => updateDeductions('otherDeductions', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <Button onClick={calculateTax} className="w-full">Calculate Tax</Button>
      </div>

      {showResults && (
        <Card className="mt-8 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-lg">Tax Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Income:</span>
                      <span className="font-medium">{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Deductions (Old Regime):</span>
                      <span className="font-medium">{formatCurrency(totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxable Income (Old Regime):</span>
                      <span className="font-medium">{formatCurrency(Math.max(0, totalIncome - totalDeductions))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxable Income (New Regime):</span>
                      <span className="font-medium">{formatCurrency(Math.max(0, totalIncome - 50000))}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Tax Liability Comparison</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Old Regime (2024-25):</span>
                      <span className="font-medium text-sm">{formatCurrency(taxResults.oldRegime2024.taxAmount)} <span className="text-gray-500">({taxResults.oldRegime2024.effectiveRate}%)</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">New Regime (2024-25):</span>
                      <span className="font-medium text-sm">{formatCurrency(taxResults.newRegime2024.taxAmount)} <span className="text-gray-500">({taxResults.newRegime2024.effectiveRate}%)</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">New Regime (2025-26):</span>
                      <span className="font-medium text-sm">{formatCurrency(taxResults.newRegime2025.taxAmount)} <span className="text-gray-500">({taxResults.newRegime2025.effectiveRate}%)</span></span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                  <p className="font-medium text-blue-700">Recommended Option:</p>
                  <p className="text-blue-600">{taxResults.bestOption}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    This option results in the lowest tax liability based on your inputs.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <h3 className="font-medium mb-4 self-start">Tax Comparison Chart</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
