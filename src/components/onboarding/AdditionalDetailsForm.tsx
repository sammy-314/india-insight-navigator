
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserDetails } from '@/contexts/UserContext';

interface AdditionalDetailsFormProps {
  formData: UserDetails;
  updateFormData: (data: Partial<UserDetails>) => void;
}

const disabilityTypes = [
  "Visual Impairment",
  "Hearing Impairment",
  "Mobility Impairment",
  "Cognitive Disability",
  "Speech Impairment",
  "Multiple Disabilities",
  "Other"
];

const AdditionalDetailsForm: React.FC<AdditionalDetailsFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Additional Details</h2>
        <p className="text-sm text-gray-500">
          These details help us identify specialized schemes for persons with disabilities or those from economically weaker sections
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="disability-switch">Do you have any disability?</Label>
            <Switch 
              id="disability-switch"
              checked={formData.disability}
              onCheckedChange={(checked) => updateFormData({ 
                disability: checked,
                disabilityPercentage: checked ? formData.disabilityPercentage : undefined,
                disabilityType: checked ? formData.disabilityType : undefined
              })}
            />
          </div>
          {formData.disability && (
            <div className="pl-6 mt-4 space-y-4 border-l-2 border-blue-200">
              <div>
                <Label htmlFor="disability-type">Disability Type</Label>
                <Select 
                  value={formData.disabilityType} 
                  onValueChange={(value) => updateFormData({ disabilityType: value })}
                >
                  <SelectTrigger id="disability-type" className="mt-1">
                    <SelectValue placeholder="Select disability type" />
                  </SelectTrigger>
                  <SelectContent>
                    {disabilityTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="disability-percentage">Disability Percentage (%)</Label>
                <Input 
                  id="disability-percentage"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Enter disability percentage"
                  value={formData.disabilityPercentage || ''}
                  onChange={(e) => updateFormData({ disabilityPercentage: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="bpl-switch">Do you have a BPL (Below Poverty Line) card?</Label>
          <Switch 
            id="bpl-switch"
            checked={formData.bplCard}
            onCheckedChange={(checked) => updateFormData({ bplCard: checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetailsForm;
