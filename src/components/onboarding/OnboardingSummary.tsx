
import React from 'react';
import { UserDetails } from '@/contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface OnboardingSummaryProps {
  formData: UserDetails;
  updateFormData: (data: Partial<UserDetails>) => void;
}

const OnboardingSummary: React.FC<OnboardingSummaryProps> = ({ formData }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderBoolean = (value: boolean) => {
    return value ? (
      <CheckCircle2 className="text-green-500" size={18} />
    ) : (
      <XCircle className="text-red-500" size={18} />
    );
  };

  const sections = [
    {
      title: 'Personal Details',
      items: [
        { label: 'Name', value: formData.name },
        { label: 'Age', value: formData.age },
        { label: 'Gender', value: formData.gender },
        { label: 'Caste Category', value: formData.caste },
        { label: 'State', value: formData.state },
      ]
    },
    {
      title: 'Financial Information',
      items: [
        { label: 'Annual Income', value: formatCurrency(formData.income) },
        { label: 'Occupation', value: formData.occupation },
        { label: 'Education', value: formData.education },
      ]
    },
    {
      title: 'Family Status',
      items: [
        { label: 'Marital Status', value: formData.maritalStatus },
        { label: 'Number of Dependents', value: formData.dependents },
      ]
    },
    {
      title: 'Special Categories',
      items: [
        { label: 'Person with Disability', value: renderBoolean(formData.disability) },
        formData.disability && { label: 'Disability Type', value: formData.disabilityType },
        formData.disability && { label: 'Disability Percentage', value: `${formData.disabilityPercentage}%` },
        { label: 'BPL Card Holder', value: renderBoolean(formData.bplCard) },
      ].filter(Boolean)
    },
    {
      title: 'Documents Available',
      items: [
        { label: 'PAN Card', value: renderBoolean(formData.panCard) },
        { label: 'Aadhaar Card', value: renderBoolean(formData.aadharCard) },
        { label: 'Bank Account', value: renderBoolean(formData.bankAccount) },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Profile Summary</h2>
        <p className="text-sm text-gray-500">
          Review your information before completing your profile
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="text-lg font-medium mb-2">{section.title}</h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between py-1">
                      <span className="text-gray-600">{item.label}:</span>
                      <span className="font-medium flex items-center">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingSummary;
