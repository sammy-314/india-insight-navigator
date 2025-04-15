
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';

// Business tax calculator
export const BusinessTaxCalculator = () => {
  const [businessType, setBusinessType] = useState("proprietorship");
  const [turnover, setTurnover] = useState("");
  const [profit, setProfit] = useState("");
  const [expenses, setExpenses] = useState({
    operatingExpenses: "",
    depreciation: "",
    interestPaid: "",
    employeeBenefits: "",
    otherExpenses: ""
  });
  const [taxResults, setTaxResults] = useState<any>(null);

  const calculateTax = () => {
    if (!turnover || !profit) {
      toast.error("Please enter turnover and profit to calculate tax");
      return;
    }

    const turnoverValue = parseFloat(turnover);
    const profitValue = parseFloat(profit);

    if (isNaN(turnoverValue) || isNaN(profitValue)) {
      toast.error("Please enter valid numbers for turnover and profit");
      return;
    }

    let taxAmount = 0;
    let effectiveRate = 0;
    let alternativeTaxAmount = 0;
    let alternativeEffectiveRate = 0;
    let companyTaxAmount = 0;
    let companyEffectiveRate = 0;

    if (businessType === "proprietorship") {
      // For proprietorship, calculate both presumptive and regular tax
      
      // Regular tax calculation (personal income tax)
      if (profitValue <= 250000) {
        taxAmount = 0;
      } else if (profitValue <= 500000) {
        taxAmount = (profitValue - 250000) * 0.05;
      } else if (profitValue <= 1000000) {
        taxAmount = 12500 + (profitValue - 500000) * 0.2;
      } else {
        taxAmount = 112500 + (profitValue - 1000000) * 0.3;
      }
      
      // Add 4% cess
      taxAmount = taxAmount * 1.04;
      effectiveRate = (taxAmount / profitValue * 100);
      
      // Presumptive taxation scheme (Section 44AD - 6% or 8% of turnover)
      const presumptivetaxableIncome = turnoverValue <= 10000000 ? 
        (turnoverValue * 0.06) : 
        (turnoverValue * 0.08);
      
      let presumptiveTax = 0;
      
      if (presumptivetaxableIncome <= 250000) {
        presumptiveTax = 0;
      } else if (presumptivetaxableIncome <= 500000) {
        presumptiveTax = (presumptivetaxableIncome - 250000) * 0.05;
      } else if (presumptivetaxableIncome <= 1000000) {
        presumptiveTax = 12500 + (presumptivetaxableIncome - 500000) * 0.2;
      } else {
        presumptiveTax = 112500 + (presumptivetaxableIncome - 1000000) * 0.3;
      }
      
      // Add 4% cess
      presumptiveTax = presumptiveTax * 1.04;
      const presumptiveEffectiveRate = (presumptiveTax / turnoverValue * 100);
      
      alternativeTaxAmount = Math.round(presumptiveTax);
      alternativeEffectiveRate = presumptiveEffectiveRate;

    } else if (businessType === "partnership") {
      // For partnership firm, flat 30% + cess
      taxAmount = profitValue * 0.3 * 1.04;
      effectiveRate = (taxAmount / profitValue * 100);
    } else if (businessType === "llp" || businessType === "company") {
      // For LLP and company, flat 30% + cess
      taxAmount = profitValue * 0.3 * 1.04;
      effectiveRate = (taxAmount / profitValue * 100);
      
      // For company, there's also a concessional tax regime
      if (businessType === "company") {
        // Section 115BAA - 22% + cess (no exemptions/deductions)
        companyTaxAmount = profitValue * 0.22 * 1.04;
        companyEffectiveRate = (companyTaxAmount / profitValue * 100);
      }
    }

    setTaxResults({
      taxAmount: Math.round(taxAmount),
      effectiveRate: effectiveRate.toFixed(2),
      alternativeTaxAmount: alternativeTaxAmount,
      alternativeEffectiveRate: alternativeEffectiveRate.toFixed(2),
      companyTaxAmount: Math.round(companyTaxAmount),
      companyEffectiveRate: companyEffectiveRate.toFixed(2),
      businessType
    });
  };

  const handleExpenseChange = (field: string, value: string) => {
    setExpenses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total expenses
  const totalExpenses = Object.values(expenses)
    .reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

  // Prepare chart data
  const getChartData = () => {
    if (!taxResults) return [];
    
    if (businessType === "proprietorship") {
      return [
        { name: "Regular Tax", value: taxResults.taxAmount },
        { name: "Presumptive Tax", value: taxResults.alternativeTaxAmount }
      ];
    } else if (businessType === "company") {
      return [
        { name: "Regular Tax (30%)", value: taxResults.taxAmount },
        { name: "Concessional Tax (22%)", value: taxResults.companyTaxAmount }
      ];
    } else {
      return [
        { name: "Tax Amount", value: taxResults.taxAmount }
      ];
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <Select value={businessType} onValueChange={setBusinessType}>
            <SelectTrigger id="businessType" className="mt-1">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proprietorship">Proprietorship</SelectItem>
              <SelectItem value="partnership">Partnership Firm</SelectItem>
              <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
              <SelectItem value="company">Private Limited Company</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="turnover">Annual Turnover</Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <Input
              id="turnover"
              type="number"
              placeholder="Enter annual turnover"
              value={turnover}
              onChange={(e) => setTurnover(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="profit">Net Profit Before Tax</Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <Input
              id="profit"
              type="number"
              placeholder="Enter net profit before tax"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="expenses">
            <AccordionTrigger className="text-base">
              Business Expenses Details (Optional)
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <Label htmlFor="operatingExpenses">Operating Expenses</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="operatingExpenses"
                    type="number"
                    placeholder="Rent, utilities, supplies, etc."
                    value={expenses.operatingExpenses}
                    onChange={(e) => handleExpenseChange('operatingExpenses', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="depreciation">Depreciation</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="depreciation"
                    type="number"
                    placeholder="Depreciation on assets"
                    value={expenses.depreciation}
                    onChange={(e) => handleExpenseChange('depreciation', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="interestPaid">Interest Paid</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="interestPaid"
                    type="number"
                    placeholder="Interest on loans, etc."
                    value={expenses.interestPaid}
                    onChange={(e) => handleExpenseChange('interestPaid', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="employeeBenefits">Employee Benefits</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="employeeBenefits"
                    type="number"
                    placeholder="Salaries, benefits, etc."
                    value={expenses.employeeBenefits}
                    onChange={(e) => handleExpenseChange('employeeBenefits', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="otherExpenses">Other Expenses</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="otherExpenses"
                    type="number"
                    placeholder="Other business expenses"
                    value={expenses.otherExpenses}
                    onChange={(e) => handleExpenseChange('otherExpenses', e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t">
                <span>Total Expenses:</span>
                <span className="font-medium">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <Button onClick={calculateTax} className="w-full">Calculate Business Tax</Button>
      </div>

      {taxResults && (
        <Card className="mt-8 animate-scale-in">
          <CardContent className="pt-6">
            <h3 className="font-medium text-lg mb-4">Business Tax Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Business Type:</span>
                      <span className="font-medium">
                        {businessType === "proprietorship" ? "Proprietorship" :
                         businessType === "partnership" ? "Partnership Firm" :
                         businessType === "llp" ? "Limited Liability Partnership" :
                         "Private Limited Company"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Annual Turnover:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(turnover) || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Net Profit Before Tax:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(profit) || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Profit Margin:</span>
                      <span className="font-medium">
                        {parseFloat(turnover) ? ((parseFloat(profit) / parseFloat(turnover)) * 100).toFixed(2) + "%" : "0%"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tax Liability</h4>
                  <div className="space-y-2">
                    {businessType === "proprietorship" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">Regular Tax:</span>
                          <span className="font-medium text-sm">
                            {formatCurrency(taxResults.taxAmount)} <span className="text-gray-500">({taxResults.effectiveRate}%)</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Presumptive Tax (Section 44AD):</span>
                          <span className="font-medium text-sm">
                            {formatCurrency(taxResults.alternativeTaxAmount)} <span className="text-gray-500">({taxResults.alternativeEffectiveRate}%)</span>
                          </span>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <p className="font-medium text-blue-700">Recommended Option:</p>
                          <p className="text-blue-600">
                            {taxResults.taxAmount <= taxResults.alternativeTaxAmount ? 
                              "Regular Tax Regime" : 
                              "Presumptive Tax Scheme (Section 44AD)"}
                          </p>
                          <p className="text-xs text-blue-500 mt-1">
                            Choose the option with lower tax liability based on your inputs.
                          </p>
                        </div>
                      </>
                    )}

                    {businessType === "company" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">Regular Corporate Tax (30%):</span>
                          <span className="font-medium text-sm">
                            {formatCurrency(taxResults.taxAmount)} <span className="text-gray-500">({taxResults.effectiveRate}%)</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Concessional Rate (22%):</span>
                          <span className="font-medium text-sm">
                            {formatCurrency(taxResults.companyTaxAmount)} <span className="text-gray-500">({taxResults.companyEffectiveRate}%)</span>
                          </span>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <p className="font-medium text-blue-700">Recommended Option:</p>
                          <p className="text-blue-600">
                            Concessional Tax Regime (Section 115BAA)
                          </p>
                          <p className="text-xs text-blue-500 mt-1">
                            Lower rate, but you must forego certain exemptions/deductions.
                          </p>
                        </div>
                      </>
                    )}

                    {(businessType === "partnership" || businessType === "llp") && (
                      <div className="flex justify-between">
                        <span className="text-sm">Tax Amount (30%):</span>
                        <span className="font-medium text-sm">
                          {formatCurrency(taxResults.taxAmount)} <span className="text-gray-500">({taxResults.effectiveRate}%)</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <h4 className="font-medium mb-4 self-start">Tax Comparison Chart</h4>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {getChartData().map((entry, index) => (
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
