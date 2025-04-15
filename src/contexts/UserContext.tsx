
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Other';
export type Gender = 'Male' | 'Female' | 'Other';

export interface UserDetails {
  name: string;
  age: number;
  gender: Gender;
  caste: CasteCategory;
  state: string;
  income: number;
  occupation: string;
  education: string;
  maritalStatus: string;
  dependents: number;
  disability: boolean;
  disabilityPercentage?: number;
  disabilityType?: string;
  bplCard: boolean;
  panCard: boolean;
  aadharCard: boolean;
  bankAccount: boolean;
}

interface UserContextType {
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
  isProfileComplete: boolean;
}

const defaultUserDetails: UserDetails = {
  name: '',
  age: 0,
  gender: 'Male',
  caste: 'General',
  state: '',
  income: 0,
  occupation: '',
  education: '',
  maritalStatus: 'Single',
  dependents: 0,
  disability: false,
  bplCard: false,
  panCard: true,
  aadharCard: true,
  bankAccount: true,
};

const UserContext = createContext<UserContextType>({
  userDetails: null,
  setUserDetails: () => {},
  isProfileComplete: false,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  
  const isProfileComplete = !!userDetails && 
    !!userDetails.name &&
    userDetails.age > 0 &&
    !!userDetails.gender &&
    !!userDetails.caste &&
    !!userDetails.state &&
    userDetails.income >= 0;

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, isProfileComplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export const getDefaultUserDetails = () => ({ ...defaultUserDetails });
