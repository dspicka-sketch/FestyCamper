'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardNav, WizardShell } from '@/components/owner/onboarding/WizardShell';
import { StepVehicle, validateVehicle } from '@/components/owner/onboarding/StepVehicle';
import { StepPhotos, validatePhotos } from '@/components/owner/onboarding/StepPhotos';
import { StepAmenities, validateAmenities } from '@/components/owner/onboarding/StepAmenities';
import { StepFestivals, validateFestivals } from '@/components/owner/onboarding/StepFestivals';
import { StepPricing, validatePricing } from '@/components/owner/onboarding/StepPricing';
import { StepReview } from '@/components/owner/onboarding/StepReview';
import { emptyOnboardingData } from '@/lib/owner/onboarding-types';
import type { VanOnboardingData } from '@/lib/owner/onboarding-types';
import { ownerErrorClassName } from '@/components/owner/auth-ui';

const STEP_META = [
  {
    title: 'Tell us about your van',
    subtitle: 'Start with the basics — year, make, model, and capacity.',
  },
  {
    title: 'Show off your build',
    subtitle: 'Great photos get booked. Upload at least one and pick a cover image.',
  },
  {
    title: 'What comes included?',
    subtitle: 'Help renters find the perfect festival-ready setup.',
  },
  {
    title: 'Where can you go?',
    subtitle: 'Pick the festivals where your van is available to rent.',
  },
  {
    title: 'Set your rates',
    subtitle: 'Competitive pricing wins bookings. See your estimated earnings below.',
  },
  {
    title: 'Ready to publish?',
    subtitle: 'Review everything before your listing goes live on FestyCamper.',
  },
] as const;

type VanOnboardingWizardProps = {
  userId: string;
  userEmail: string;
};

export function VanOnboardingWizard({ userId, userEmail }: VanOnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<VanOnboardingData>(emptyOnboardingData);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const meta = STEP_META[step - 1];

  function validateCurrentStep(): string | null {
    switch (step) {
      case 1:
        return validateVehicle(data.vehicle);
      case 2:
        return validatePhotos(data.photos);
      case 3:
        return validateAmenities(data.amenities);
      case 4:
        return validateFestivals(data.festivals);
      case 5:
        return validatePricing(data.pricing);
      default:
        return null;
    }
  }

  function goNext() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, 6));
  }

  function goBack() {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  }

  async function publish() {
    setError('');
    setPublishing(true);

    try {
      const res = await fetch('/api/owner/vans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ownerEmail: userEmail }),
      });

      const body = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(body.error ?? 'Failed to publish listing.');
        setPublishing(false);
        return;
      }

      router.push('/owner/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setPublishing(false);
    }
  }

  return (
    <WizardShell
      currentStep={step}
      title={meta.title}
      subtitle={meta.subtitle}
      footer={
        <>
          {error && <p className={`mb-4 ${ownerErrorClassName}`}>{error}</p>}
          <WizardNav
            showBack={step > 1}
            onBack={goBack}
            onNext={step < 6 ? goNext : publish}
            nextLabel={step === 6 ? 'Publish Listing' : 'Continue'}
            loading={publishing}
            nextDisabled={publishing}
          />
        </>
      }
    >
      {step === 1 && (
        <StepVehicle
          data={data.vehicle}
          onChange={(vehicle) => setData((d) => ({ ...d, vehicle }))}
        />
      )}
      {step === 2 && (
        <StepPhotos
          photos={data.photos}
          userId={userId}
          onChange={(photos) => setData((d) => ({ ...d, photos }))}
        />
      )}
      {step === 3 && (
        <StepAmenities
          selected={data.amenities}
          onChange={(amenities) => setData((d) => ({ ...d, amenities }))}
        />
      )}
      {step === 4 && (
        <StepFestivals
          selected={data.festivals}
          onChange={(festivals) => setData((d) => ({ ...d, festivals }))}
        />
      )}
      {step === 5 && (
        <StepPricing
          data={data.pricing}
          festivalCount={data.festivals.length}
          onChange={(pricing) => setData((d) => ({ ...d, pricing }))}
        />
      )}
      {step === 6 && <StepReview data={data} />}
    </WizardShell>
  );
}
