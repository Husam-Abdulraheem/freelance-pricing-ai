export interface BrandingSettings {
  companyName: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string; // Base64 encoded image
}

export const DEFAULT_BRANDING: BrandingSettings = {
  companyName: 'ArabixDev',
  email: 'arabixdev@gmail.com',
  phone: '',
  website: '',
  logo: '',
};
