
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, getDefaultUserDetails } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Step components
import BasicDetailsForm from '@/components/onboarding/BasicDetailsForm';
import FinancialDetailsForm from '@/components/onboarding/FinancialDetailsForm';
import DocumentsForm from '@/components/onboarding/DocumentsForm';
import AdditionalDetailsForm from '@/components/onboarding/AdditionalDetailsForm';
import OnboardingSummary from '@/components/onboarding/OnboardingSummary';

const steps = [
  { id: 1, name: 'Basic Details', component: BasicDetailsForm },
  { id: 2, name: 'Financial Details', component: FinancialDetailsForm },
  { id: 3, name: 'Additional Details', component: AdditionalDetailsForm },
  { id: 4, name: 'Documents', component: DocumentsForm },
  { id: 5, name: 'Summary', component: OnboardingSummary },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { setUserDetails } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getDefaultUserDetails());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setUserDetails(formData);
      toast.success('Profile created successfully!');
      navigate('/dashboard');
      setIsSubmitting(false);
    }, 1500);
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component || BasicDetailsForm;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Help us understand your details to provide personalized government schemes and insights
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{`Step ${currentStep} of ${steps.length}`}</span>
            <span className="text-sm font-medium">{`${Math.round(progress)}%`}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <CurrentStepComponent 
              formData={formData} 
              updateFormData={updateFormData} 
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={currentStep > 1 ? handlePrevious : () => navigate('/')}
          >
            {currentStep > 1 ? 'Previous' : 'Cancel'}
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Complete'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
