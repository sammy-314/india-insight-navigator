
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserDetails } from '@/contexts/UserContext';

interface FinancialDetailsFormProps {
  formData: UserDetails;
  updateFormData: (data: Partial<UserDetails>) => void;
}

const occupations = [
  "Salaried Employee (Private)",
  "Salaried Employee (Government)",
  "Business Owner",
  "Self-employed Professional",
  "Freelancer",
  "Farmer",
  "Retired",
  "Homemaker",
  "Student",
  "Unemployed",
  "Other"
];

const FinancialDetailsForm: React.FC<FinancialDetailsFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Financial Details</h2>
        <p className="text-sm text-gray-500">Please provide your financial information</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Select 
            value={formData.occupation} 
            onValueChange={(value) => updateFormData({ occupation: value })}
          >
            <SelectTrigger id="occupation" className="mt-1">
              <SelectValue placeholder="Select your occupation" />
            </SelectTrigger>
            <SelectContent>
              {occupations.map((occupation) => (
                <SelectItem key={occupation} value={occupation}>{occupation}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="income">Annual Income (₹)</Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <Input
              id="income"
              type="number"
              placeholder="Enter your annual income"
              value={formData.income || ''}
              onChange={(e) => updateFormData({ income: parseInt(e.target.value) || 0 })}
              className="pl-7"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="education">Highest Education</Label>
          <Select 
            value={formData.education} 
            onValueChange={(value) => updateFormData({ education: value })}
          >
            <SelectTrigger id="education" className="mt-1">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Below 10th">Below 10th</SelectItem>
              <SelectItem value="10th Pass">10th Pass</SelectItem>
              <SelectItem value="12th Pass">12th Pass</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Graduate">Graduate</SelectItem>
              <SelectItem value="Post Graduate">Post Graduate</SelectItem>
              <SelectItem value="Doctorate">Doctorate</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select 
            value={formData.maritalStatus} 
            onValueChange={(value) => updateFormData({ maritalStatus: value })}
          >
            <SelectTrigger id="maritalStatus" className="mt-1">
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dependents">Number of Dependents</Label>
          <Input 
            id="dependents"
            type="number"
            min={0}
            placeholder="Enter number of dependents"
            value={formData.dependents || ''}
            onChange={(e) => updateFormData({ dependents: parseInt(e.target.value) || 0 })}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialDetailsForm;
