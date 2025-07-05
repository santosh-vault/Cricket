export const CRICKET_COUNTRIES = [
  { name: 'India', flag: '🇮🇳', code: 'IN' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  { name: 'England', flag: '🇬🇧', code: 'GB' },
  { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
  { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
  { name: 'Pakistan', flag: '🇵🇰', code: 'PK' },
  { name: 'Sri Lanka', flag: '🇱🇰', code: 'LK' },
  { name: 'Bangladesh', flag: '🇧🇩', code: 'BD' },
  { name: 'West Indies', flag: '🇧🇧', code: 'BB' }, // Barbados (WI is not a country code)
  { name: 'Afghanistan', flag: '🇦🇫', code: 'AF' },
  { name: 'Zimbabwe', flag: '🇿🇼', code: 'ZW' },
  { name: 'Ireland', flag: '🇮🇪', code: 'IE' },
  { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  { name: 'Scotland', flag: '🏴', code: 'SCT' },
  { name: 'Oman', flag: '🇴🇲', code: 'OM' },
  { name: 'Nepal', flag: '🇳🇵', code: 'NP' },
  { name: 'Namibia', flag: '🇳🇦', code: 'NA' },
  { name: 'United Arab Emirates', flag: '🇦🇪', code: 'AE' },
  { name: 'Hong Kong', flag: '🇭🇰', code: 'HK' },
  { name: 'Papua New Guinea', flag: '🇵🇬', code: 'PG' },
  { name: 'United States', flag: '🇺🇸', code: 'US' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'Bermuda', flag: '🇧🇲', code: 'BM' },
  { name: 'Kenya', flag: '🇰🇪', code: 'KE' },
  { name: 'Uganda', flag: '🇺🇬', code: 'UG' },
  { name: 'Malaysia', flag: '🇲🇾', code: 'MY' },
  { name: 'Qatar', flag: '🇶🇦', code: 'QA' },
  { name: 'Jersey', flag: '🇯🇪', code: 'JE' },
  { name: 'Singapore', flag: '🇸🇬', code: 'SG' },
  { name: 'Italy', flag: '🇮🇹', code: 'IT' },
];

// Function to get flag emoji from country code
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode) return '🏏';
  const country = CRICKET_COUNTRIES.find(c => c.code === countryCode.toUpperCase());
  return country ? country.flag : '🏏';
} 