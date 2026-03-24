import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

export const Config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
} as const;

/** RevenueCat entitlement identifier for Pro tier */
export const ENTITLEMENT_PRO = 'pro';

/** RevenueCat product identifiers */
export const PRODUCT_MONTHLY = 'com.strine.pro.monthly';
export const PRODUCT_ANNUAL = 'com.strine.pro.annual';
