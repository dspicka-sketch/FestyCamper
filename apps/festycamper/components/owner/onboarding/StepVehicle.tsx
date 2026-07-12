'use client';

import {
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  YEAR_OPTIONS,
} from '@/lib/owner/onboarding-constants';
import type { VehicleStepData } from '@/lib/owner/onboarding-types';
import { ownerInputClassName, ownerLabelClassName } from '@/components/owner/auth-ui';

type StepVehicleProps = {
  data: VehicleStepData;
  onChange: (data: VehicleStepData) => void;
};

export function StepVehicle({ data, onChange }: StepVehicleProps) {
  function update(field: keyof VehicleStepData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={ownerLabelClassName} htmlFor="year">
            Year
          </label>
          <select
            id="year"
            className={ownerInputClassName}
            value={data.year}
            onChange={(e) => update('year', e.target.value)}
            required
          >
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="make">
            Make
          </label>
          <input
            id="make"
            className={ownerInputClassName}
            value={data.make}
            onChange={(e) => update('make', e.target.value)}
            placeholder="Mercedes-Benz"
            required
          />
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="model">
            Model
          </label>
          <input
            id="model"
            className={ownerInputClassName}
            value={data.model}
            onChange={(e) => update('model', e.target.value)}
            placeholder="Sprinter"
            required
          />
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="trim">
            Trim
          </label>
          <input
            id="trim"
            className={ownerInputClassName}
            value={data.trim}
            onChange={(e) => update('trim', e.target.value)}
            placeholder="2500 High Roof"
          />
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="sleeps">
            Sleeps
          </label>
          <input
            id="sleeps"
            type="number"
            min={1}
            max={12}
            className={ownerInputClassName}
            value={data.sleeps}
            onChange={(e) => update('sleeps', e.target.value)}
            required
          />
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="seatbelts">
            Seatbelts
          </label>
          <input
            id="seatbelts"
            type="number"
            min={1}
            max={12}
            className={ownerInputClassName}
            value={data.seatbelts}
            onChange={(e) => update('seatbelts', e.target.value)}
            required
          />
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="transmission">
            Transmission
          </label>
          <select
            id="transmission"
            className={ownerInputClassName}
            value={data.transmission}
            onChange={(e) => update('transmission', e.target.value)}
          >
            {TRANSMISSION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="fuelType">
            Fuel Type
          </label>
          <select
            id="fuelType"
            className={ownerInputClassName}
            value={data.fuelType}
            onChange={(e) => update('fuelType', e.target.value)}
          >
            {FUEL_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export function validateVehicle(data: VehicleStepData): string | null {
  if (!data.year || !data.make.trim() || !data.model.trim()) {
    return 'Please fill in year, make, and model.';
  }
  const sleeps = parseInt(data.sleeps, 10);
  const seatbelts = parseInt(data.seatbelts, 10);
  if (Number.isNaN(sleeps) || sleeps < 1) return 'Sleeps must be at least 1.';
  if (Number.isNaN(seatbelts) || seatbelts < 1) return 'Seatbelts must be at least 1.';
  return null;
}
