
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserDetails } from '@/contexts/UserContext';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentsFormProps {
  formData: UserDetails;
  updateFormData: (data: Partial<UserDetails>) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Document Information</h2>
        <p className="text-sm text-gray-500">
          Having these documents allows you to access more government schemes
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label htmlFor="pan-switch" className="mr-2">PAN Card</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80">Permanent Account Number (PAN) is required for tax-related schemes and financial services.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch 
            id="pan-switch"
            checked={formData.panCard}
            onCheckedChange={(checked) => updateFormData({ panCard: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label htmlFor="aadhar-switch" className="mr-2">Aadhaar Card</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80">Aadhaar is required for most government schemes and subsidies.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch 
            id="aadhar-switch"
            checked={formData.aadharCard}
            onCheckedChange={(checked) => updateFormData({ aadharCard: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label htmlFor="bank-switch" className="mr-2">Bank Account</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80">A bank account is needed for direct benefit transfers from government schemes.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch 
            id="bank-switch"
            checked={formData.bankAccount}
            onCheckedChange={(checked) => updateFormData({ bankAccount: checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentsForm;
