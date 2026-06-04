
export interface CountryInfo {
  code: string;
  name: string;
  route: string;
  timezone?: string;
}

const countryMappings: Record<string, CountryInfo> = {
  'LK': { code: 'LK', name: 'Sri Lanka', route: '/sri-lanka/home' },
  'MM': { code: 'MM', name: 'Myanmar', route: '/myanmar/home' },
  'BD': { code: 'BD', name: 'Bangladesh', route: '/bangladesh/home' },
  'PK': { code: 'PK', name: 'Pakistan', route: '/pakistan/home' },
  'SG': { code: 'SG', name: 'Singapore', route: '/' },
};

const timezoneToCountry: Record<string, string> = {
  'Asia/Colombo': 'LK',
  'Asia/Yangon': 'MM',
  'Asia/Dhaka': 'BD',
  'Asia/Karachi': 'PK',
  'Asia/Singapore': 'SG',
};

export const detectCountryByTimezone = (): CountryInfo => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryCode = timezoneToCountry[timezone] || 'SG';
    return countryMappings[countryCode];
  } catch (error) {
    console.log('Timezone detection failed, defaulting to Singapore');
    return countryMappings['SG'];
  }
};

export const detectCountryByIP = async (): Promise<CountryInfo> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;
    
    if (countryMappings[countryCode]) {
      return countryMappings[countryCode];
    }
    
    // Fallback to timezone detection
    return detectCountryByTimezone();
  } catch (error) {
    console.log('IP detection failed, using timezone fallback');
    return detectCountryByTimezone();
  }
};

export const getCurrentCountryFromPath = (pathname: string): CountryInfo => {
  if (pathname.includes('/sri-lanka')) return countryMappings['LK'];
  if (pathname.includes('/myanmar')) return countryMappings['MM'];
  if (pathname.includes('/bangladesh')) return countryMappings['BD'];
  if (pathname.includes('/pakistan')) return countryMappings['PK'];
  return countryMappings['SG'];
};
