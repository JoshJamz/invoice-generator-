export interface CustomField {
  id: string;
  key: string;
  value: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface BusinessInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  uploadedLogo: string | null;
}

export interface ClientInfo {
  name: string;
  address: string;
  email: string;
}

export interface InvoiceData {
  referenceNumber: string;
  date: string;
  dueDate: string;
  currency: string;
  currencyCode: string;
  amount: number;
  amountWords: string;
  notes: string;
  items: InvoiceItem[];
  customFields: CustomField[];
  businessInfo: BusinessInfo;
  clientInfo: ClientInfo;
}

export interface BrandingInfo {
  companyName: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  accentStyle?: string;
}

export interface DesignOptions {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  fontText: string;
  fontNum: string;
}
