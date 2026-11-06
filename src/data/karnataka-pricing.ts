/**
 * Karnataka Department of Stamps & Registration (Kaveri 2.0)
 * Statutory Fee Configuration for Plotted Developments
 * Jurisdiction: Kadur / Sakrayapatna Sub-Registrar, Chikkamagaluru District
 */

export interface StampDutyConfig {
  baseDutyRate: number;        // Standard base stamp duty (5.0%)
  cessRateOnDuty: number;      // 10% Infrastructure Cess on duty amount (0.50% effective)
  ruralSurchargeOnDuty: number;// 2% Gram Panchayat Development surcharge on duty (0.10% effective)
  registrationFeeRate: number; // Flat 1.0% Sub-Registrar registration fee on higher of sale/guidance value
  effectiveTotalRate: number;  // ~6.60% (5.60% stamp duty + 1.0% registration)
  subRegistrarOffice: string;
  guidanceRuleNote: string;
  legalDisclaimer: string;
}

export const KARNATAKA_PRICING_CONFIG: StampDutyConfig = {
  baseDutyRate: 0.05,           // 5% Base Stamp Duty
  cessRateOnDuty: 0.10,         // 10% Cess on Stamp Duty (0.5% of value)
  ruralSurchargeOnDuty: 0.02,   // 2% Surcharge on Stamp Duty in Grama Panchayat limits (0.1% of value)
  registrationFeeRate: 0.01,    // 1% Sub-Registrar Registration Fee
  effectiveTotalRate: 0.066,    // 5.6% duty + 1.0% registration = ~6.6%

  subRegistrarOffice: 'Kadur Sub-Registrar Office, Chikkamagaluru District',

  guidanceRuleNote:
    'Under Karnataka Stamp Act Section 45-A, statutory stamp duty and registration fees are assessed on whichever is HIGHER: the agreed sale consideration or the Department of Stamps & Registration (Kaveri 2.0) gazetted guidance value.',

  legalDisclaimer:
    'Approximate arithmetic estimate for illustration only. Rates and panchayat surcharges must be verified independently with a Chartered Accountant or the Sub-Registrar Office, Kadur prior to deed registration.'
};

/**
 * Calculates statutory Karnataka government outflow for a given property value and optional guidance value.
 * Assesses duty strictly on max(propertyValue, guidanceValue).
 */
export function calculateKarnatakaRegistrationOutflow(propertyValue: number, guidanceValue = 0) {
  const safeProp = Math.max(0, propertyValue || 0);
  const safeGuide = Math.max(0, guidanceValue || 0);
  const taxableValue = Math.max(safeProp, safeGuide);
  const isGuidanceHigher = safeGuide > safeProp;

  const baseDuty = Math.round(taxableValue * KARNATAKA_PRICING_CONFIG.baseDutyRate);
  const cess = Math.round(baseDuty * KARNATAKA_PRICING_CONFIG.cessRateOnDuty);
  const surcharge = Math.round(baseDuty * KARNATAKA_PRICING_CONFIG.ruralSurchargeOnDuty);
  const totalStampDuty = baseDuty + cess + surcharge; // ~5.6%
  const registrationFee = Math.round(taxableValue * KARNATAKA_PRICING_CONFIG.registrationFeeRate); // 1.0%
  const totalGovtOutflow = totalStampDuty + registrationFee;

  return {
    propertyValue: safeProp,
    guidanceValue: safeGuide,
    taxableValue,
    isGuidanceHigher,
    baseDuty,
    cess,
    surcharge,
    totalStampDuty,
    registrationFee,
    totalGovtOutflow,
    effectivePercentage: ((totalGovtOutflow / (taxableValue || 1)) * 100).toFixed(2),
  };
}
