export type PhotoUploadItem = {
  id: string;
  storagePath: string;
  publicUrl: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  isCover: boolean;
  errorMessage?: string;
};

export type VehicleStepData = {
  year: string;
  make: string;
  model: string;
  trim: string;
  sleeps: string;
  seatbelts: string;
  transmission: string;
  fuelType: string;
};

export type PricingStepData = {
  nightlyRate: string;
  cleaningFee: string;
  securityDeposit: string;
  minNights: string;
  weekendPricing: boolean;
  weekendPremium: string;
};

export type VanOnboardingData = {
  vehicle: VehicleStepData;
  photos: PhotoUploadItem[];
  amenities: string[];
  festivals: string[];
  pricing: PricingStepData;
};

export const emptyVehicleData = (): VehicleStepData => ({
  year: '',
  make: '',
  model: '',
  trim: '',
  sleeps: '2',
  seatbelts: '2',
  transmission: 'Automatic',
  fuelType: 'Gasoline',
});

export const emptyPricingData = (): PricingStepData => ({
  nightlyRate: '250',
  cleaningFee: '125',
  securityDeposit: '1500',
  minNights: '2',
  weekendPricing: false,
  weekendPremium: '50',
});

export const emptyOnboardingData = (): VanOnboardingData => ({
  vehicle: emptyVehicleData(),
  photos: [],
  amenities: [],
  festivals: [],
  pricing: emptyPricingData(),
});
