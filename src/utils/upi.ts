import QRCode from 'qrcode';

/**
 * Standard UPI Deep Link URI Builder
 * Compliant with NPCI UPI 2.0 Linking Specifications
 */
export interface UpiPaymentParams {
  upiId: string; // Payee VPA / UPI ID (e.g., uzafa.shop@okhdfcbank)
  payeeName: string; // Business or Payee Name
  amount?: number; // Transaction Amount
  currency?: string; // Currency code, defaults to INR
  transactionNote?: string; // Reference note (e.g., Invoice INV-2026-01)
  invoiceNumber?: string;
}

/**
 * Generates the standard upi://pay URI
 */
export const buildUpiUri = ({
  upiId,
  payeeName,
  amount,
  currency = 'INR',
  transactionNote,
  invoiceNumber,
}: UpiPaymentParams): string => {
  const cleanUpiId = upiId.trim();
  const cleanPayee = payeeName.trim() || 'Merchant';
  const cleanNote =
    transactionNote?.trim() ||
    (invoiceNumber ? `Invoice ${invoiceNumber}` : 'Invoice Payment');

  const params = new URLSearchParams();
  params.set('pa', cleanUpiId);
  params.set('pn', cleanPayee);

  if (amount && amount > 0) {
    params.set('am', amount.toFixed(2));
  }

  params.set('cu', currency === '₹' ? 'INR' : currency || 'INR');
  params.set('tn', cleanNote);

  // Use upi://pay URI schema
  return `upi://pay?${params.toString()}`;
};

/**
 * Validates whether a string has valid UPI ID format (e.g., name@bank or phone@upi)
 */
export const isValidUpiId = (id: string): boolean => {
  if (!id) return false;
  const trimmed = id.trim();
  // Standard UPI ID format: username@provider
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(trimmed);
};

/**
 * Generates a base64 Data URL for a UPI QR Code
 */
export const generateUpiQrDataUrl = async (
  uri: string,
  size: number = 300
): Promise<string> => {
  try {
    return await QRCode.toDataURL(uri, {
      width: size,
      margin: 1,
      color: {
        dark: '#1e1b18',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate UPI QR code:', err);
    return '';
  }
};

/**
 * Generates an SVG string for a UPI QR Code
 */
export const generateUpiQrSvg = async (
  uri: string,
  size: number = 300
): Promise<string> => {
  try {
    return await QRCode.toString(uri, {
      type: 'svg',
      width: size,
      margin: 1,
      color: {
        dark: '#1e1b18',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate UPI QR SVG:', err);
    return '';
  }
};
