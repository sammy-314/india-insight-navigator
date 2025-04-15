
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserDetails } from '@/contexts/UserContext';

// Indian states
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];

interface BasicDetailsFormProps {
  formData: UserDetails;
  updateFormData: (data: Partial<UserDetails>) => void;
}

const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Basic Details</h2>
        <p className="text-sm text-gray-500">Please provide your personal information</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input 
            id="age"
            type="number"
            min={0}
            max={120}
            placeholder="Enter your age"
            value={formData.age || ''}
            onChange={(e) => updateFormData({ age: parseInt(e.target.value) || 0 })}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Gender</Label>
          <RadioGroup 
            value={formData.gender} 
            onValueChange={(value) => updateFormData({ gender: value as UserDetails['gender'] })}
            className="flex mt-2 space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Male" id="male" />
              <Label htmlFor="male" className="cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Female" id="female" />
              <Label htmlFor="female" className="cursor-pointer">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Other" id="other-gender" />
              <Label htmlFor="other-gender" className="cursor-pointer">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="caste">Caste Category</Label>
          <Select 
            value={formData.caste} 
            onValueChange={(value) => updateFormData({ caste: value as UserDetails['caste'] })}
          >
            <SelectTrigger id="caste" className="mt-1">
              <SelectValue placeholder="Select caste category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="OBC">OBC (Other Backward Class)</SelectItem>
              <SelectItem value="SC">SC (Scheduled Caste)</SelectItem>
              <SelectItem value="ST">ST (Scheduled Tribe)</SelectItem>
              <SelectItem value="EWS">EWS (Economically Weaker Section)</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Select 
            value={formData.state} 
            onValueChange={(value) => updateFormData({ state: value })}
          >
            <SelectTrigger id="state" className="mt-1">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
