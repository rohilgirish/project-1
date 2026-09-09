export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumberINR(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount);
}

export function calculateEMI(principal: number, annualRatePercent: number = 8.5, tenureYears: number = 20): {
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
} {
  const monthlyRate = (annualRatePercent / 12) / 100;
  const totalMonths = tenureYears * 12;
  
  if (monthlyRate === 0) {
    const monthlyEMI = principal / totalMonths;
    return {
      monthlyEMI: Math.round(monthlyEMI),
      totalInterest: 0,
      totalPayable: Math.round(principal)
    };
  }

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayable = emi * totalMonths;
  const totalInterest = totalPayable - principal;

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable)
  };
}

/**
 * Color codes requested:
 * Green (#22c55e): Available
 * Blue (#3b82f6): Booked / Reserved
 * Red (#f43f5e): Sold
 */
export function getStatusColor(status: string) {
  switch (status) {
    case 'available':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        dot: 'bg-[#22c55e]',
        hex: 0x22c55e,
        hexCss: '#22c55e',
        label: 'Available'
      };
    case 'reserved':
    case 'booked':
      return {
        bg: 'bg-blue-500/15',
        text: 'text-blue-400',
        border: 'border-blue-500/40',
        dot: 'bg-[#3b82f6]',
        hex: 0x3b82f6,
        hexCss: '#3b82f6',
        label: 'Booked'
      };
    case 'sold':
    default:
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        dot: 'bg-[#f43f5e]',
        hex: 0xf43f5e,
        hexCss: '#f43f5e',
        label: 'Sold Out'
      };
  }
}

export function getWhatsAppLink(plotNumber?: string, size?: string, facing?: string): string {
  const phone = '919886012345';
  let message = `Hello Anuragh Foundation team, I am exploring Anurag Enclave (Sakrayapatna, Kadur Taluk, Chikkamagaluru).`;
  if (plotNumber) {
    message = `Hello! I am interested in Plot ${plotNumber}${size ? ` (${size} ft)` : ''}${facing ? `, ${facing}-facing` : ''} at Anurag Enclave, Sakrayapatna. Please share CAD layout plan, exact pricing breakdown, and schedule my site visit.`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
