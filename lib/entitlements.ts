import Purchases from 'react-native-purchases';
import { ENTITLEMENT_PRO } from '@/constants/Config';

/**
 * Returns true if the current user has an active Pro entitlement.
 * Always calls RevenueCat — do not cache locally.
 */
export async function isPro(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
  } catch {
    return false;
  }
}
