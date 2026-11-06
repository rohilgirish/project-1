'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateEMI, formatINR, formatNumberINR } from '@/lib/utils';
import {
  calculateKarnatakaRegistrationOutflow,
  KARNATAKA_PRICING_CONFIG
} from '@/data/karnataka-pricing';
import {
  Calculator, Landmark, ArrowRight, ShieldCheck, CheckCircle2, Percent, Calendar, FileText, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

const PRESETS = [
  {
    name: '30×40 Standard (₹15.6L)',
    plotPrice: 1560000,
    loanAmount: 1200000, // ~77% loan
    tenure: 15,
    rate: 8.5,
  },
  {
    name: 'Corner Plot (₹16.8L)',
    plotPrice: 1680000,
    loanAmount: 1300000,
    tenure: 15,
    rate: 8.5,
  },
  {
    name: 'Park Boulevard (₹17.4L)',
    plotPrice: 1740000,
    loanAmount: 1390000,
    tenure: 15,
    rate: 8.5,
  },
];

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(1200000);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [showKarnatakaFees, setShowKarnatakaFees] = useState<boolean>(true);
  const [guidanceValueInput, setGuidanceValueInput] = useState<number>(0);

  const emiResult = calculateEMI(loanAmount, interestRate, tenureYears);
  const principalPercent = Math.round((loanAmount / (emiResult.totalPayable || 1)) * 100);
  const interestPercent = 100 - principalPercent;

  // Estimated Property Value (assuming ~75-80% loan to value ratio)
  const estimatedPlotValue = Math.round(loanAmount / 0.77);
  
  // Calculate Statutory Karnataka Outflow using centralized configuration (assesses higher of price or guidance value)
  const statutoryOutflow = calculateKarnatakaRegistrationOutflow(estimatedPlotValue, guidanceValueInput);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setLoanAmount(preset.loanAmount);
    setTenureYears(preset.tenure);
    setInterestRate(preset.rate);
  };

  return (
    <div className="relative bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden space-y-8">
      {/* Ambient gold glow highlight */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calculator className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Villa Plot Financing Suite
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive EMI & Karnataka Total Outflow Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Simulate monthly bank EMIs and calculate full Karnataka registration & stamp duty (~6.6%) for zero hidden surprises.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs text-emerald-400 self-start sm:self-auto font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Nationalized Bank Tie-Ups</span>
        </div>
      </div>

      {/* Quick Config Presets (Emil Kowalski tactile feedback) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
            Fast Configuration Presets:
          </span>
          <span className="text-[11px] text-amber-400/80 font-medium">70–80% Bank Loan Approved</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESETS.map((preset, idx) => {
            const isSelected = loanAmount === preset.loanAmount;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-4 py-2.5 rounded-xl border text-left text-xs font-medium transition-all active:scale-95 duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="font-bold text-white text-xs">{preset.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Est. Loan: {formatINR(preset.loanAmount)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Range Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Loan Amount */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                Required Loan Amount
              </span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {formatINR(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min={300000}
              max={2500000}
              step={25000}
              value={loanAmount}
              onChange={e => setLoanAmount(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Min ₹3 Lakhs</span>
              <span>80% Max ₹25 Lakhs</span>
            </div>
          </div>

          {/* Slider 2: Tenure Years */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Loan Tenure (Years)
              </span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={25}
              step={1}
              value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3 Years</span>
              <span>15 Years (Ideal)</span>
              <span>25 Years</span>
            </div>
          </div>

          {/* Slider 3: Interest Rate */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                Annual Interest Rate (% p.a.)
              </span>
              <span className="text-sm font-black text-white font-mono">
                {interestRate.toFixed(1)}% p.a.
              </span>
            </div>
            <input
              type="range"
              min={7.0}
              max={11.5}
              step={0.1}
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>7.0%</span>
              <span>8.5% (Typical Real Estate)</span>
              <span>11.5%</span>
            </div>
          </div>

          {/* Karnataka Stamp Duty & Registration Accordion */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800/90 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowKarnatakaFees(!showKarnatakaFees)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  Karnataka Stamp Duty & Registration Estimator (~6.6%)
                </span>
              </div>
              <span className="text-slate-400 text-xs flex items-center gap-1">
                {showKarnatakaFees ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {showKarnatakaFees && (
              <div className="p-4 pt-0 border-t border-slate-800/80 space-y-3 text-xs">
                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  Statutory registration outflow under the Karnataka Department of Stamps & Registration ({KARNATAKA_PRICING_CONFIG.subRegistrarOffice}):
                </p>

                {/* Sub-Registrar Guidance Value Input */}
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="guidance-input" className="text-[11px] text-slate-400 font-semibold">
                      Sub-Registrar Guidance Value (Kaveri 2.0 Gazetted Rate):
                    </label>
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      {guidanceValueInput > 0 ? formatINR(guidanceValueInput) : 'Using Plot Consideration'}
                    </span>
                  </div>
                  <input
                    id="guidance-input"
                    type="number"
                    min={0}
                    step={25000}
                    placeholder={`e.g. ${estimatedPlotValue} (Enter custom guidance valuation)`}
                    value={guidanceValueInput || ''}
                    onChange={e => setGuidanceValueInput(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  {statutoryOutflow.isGuidanceHigher && (
                    <p className="text-[10px] text-amber-300 font-medium pt-0.5">
                      * Guidance value ({formatINR(statutoryOutflow.guidanceValue)}) is higher than estimated price ({formatINR(statutoryOutflow.propertyValue)}). Statutory fees assessed on guidance valuation under Sec 45-A.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-300">
                    <span>Taxable Base Value (Higher of Price or Guidance):</span>
                    <span className="font-mono font-bold text-white">{formatINR(statutoryOutflow.taxableValue)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Base Stamp Duty (5.0%):</span>
                    <span className="font-mono text-amber-300">{formatINR(statutoryOutflow.baseDuty)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Infrastructure Cess (10% on Duty):</span>
                    <span className="font-mono text-slate-300">{formatINR(statutoryOutflow.cess)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Grama Panchayat Surcharge (2% on Duty):</span>
                    <span className="font-mono text-slate-300">{formatINR(statutoryOutflow.surcharge)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sub-Registrar Registration Fee (1.0%):</span>
                    <span className="font-mono text-amber-300">{formatINR(statutoryOutflow.registrationFee)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-800 font-semibold text-emerald-400">
                    <span>Total Estimated Govt Outflow:</span>
                    <span className="font-mono font-bold">{formatINR(statutoryOutflow.totalGovtOutflow)} (~{statutoryOutflow.effectivePercentage}%)</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300/90 leading-tight">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-bold block">Approximate calculation for estimation only:</span>
                    {KARNATAKA_PRICING_CONFIG.guidanceRuleNote} {KARNATAKA_PRICING_CONFIG.legalDisclaimer}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Output Matrix Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
              Estimated Monthly Outflow
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight font-mono">
              ₹{formatNumberINR(emiResult.monthlyEMI)}
              <span className="text-xs font-sans font-normal text-slate-400 ml-1.5">/ month</span>
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>Affordable monthly EMIs starting under ₹13,000</span>
            </p>
          </div>

          {/* Visual Breakdown Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Repayment Distribution:</span>
              <span className="text-slate-300 font-mono text-[11px]">
                {principalPercent}% Principal • {interestPercent}% Interest
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${principalPercent}%` }}
                className="bg-emerald-500 transition-all duration-300"
                title={`Principal: ${principalPercent}%`}
              />
              <div
                style={{ width: `${interestPercent}%` }}
                className="bg-amber-400 transition-all duration-300"
                title={`Interest: ${interestPercent}%`}
              />
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="space-y-2.5 text-xs text-slate-300 pt-2">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Principal Loan Amount:</span>
              <span className="font-mono font-bold text-white">{formatINR(loanAmount)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Total Interest Payable:</span>
              <span className="font-mono font-bold text-amber-400">{formatINR(emiResult.totalInterest)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-semibold">Total Repayment Amount:</span>
              <span className="font-mono font-bold text-emerald-400">{formatINR(emiResult.totalPayable)}</span>
            </div>
          </div>

          {/* Action CTA */}
          <Link
            href="/contact"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <span>Check Bank Loan Eligibility With Our Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="text-[10px] text-center text-slate-500">
            * Indicative estimate based on reducing balance rate. Final interest rates determined by lending banks.
          </div>
        </div>
      </div>
    </div>
  );
}
