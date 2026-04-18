import React, { useState, useRef, useEffect } from 'react';
import { useBranding } from './hooks/useBranding';
import { InvoicePreview } from './components/InvoicePreview';
import { TEMPLATES } from './presets';
import { InvoiceData, InvoiceItem, CustomField, BrandingInfo, DesignOptions } from './types';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { format } from 'date-fns';
import { toWords } from 'number-to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FONTS, GOOGLE_FONTS_URL } from './fonts';
import { Settings, Download, Loader2, Plus, Trash2, Wand2 } from 'lucide-react';

const CURRENCIES = [
  { code: 'AFN', symbol: '؋', name: 'Afghanistan Afghani', word: 'afghanis' },
  { code: 'ALL', symbol: 'L', name: 'Albania Lek', word: 'lek' },
  { code: 'DZD', symbol: 'د.ج', name: 'Algeria Dinar', word: 'dinars' },
  { code: 'AOA', symbol: 'Kz', name: 'Angola Kwanza', word: 'kwanzas' },
  { code: 'ARS', symbol: '$', name: 'Argentina Peso', word: 'pesos' },
  { code: 'AMD', symbol: '֏', name: 'Armenia Dram', word: 'drams' },
  { code: 'AWG', symbol: 'ƒ', name: 'Aruba Florin', word: 'florins' },
  { code: 'AUD', symbol: '$', name: 'Australia Dollar', word: 'dollars' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijan Manat', word: 'manats' },
  { code: 'BSD', symbol: '$', name: 'Bahamas Dollar', word: 'dollars' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahrain Dinar', word: 'dinars' },
  { code: 'BDT', symbol: '৳', name: 'Bangladesh Taka', word: 'taka' },
  { code: 'BBD', symbol: '$', name: 'Barbados Dollar', word: 'dollars' },
  { code: 'BYN', symbol: 'Br', name: 'Belarus Ruble', word: 'rubles' },
  { code: 'BZD', symbol: '$', name: 'Belize Dollar', word: 'dollars' },
  { code: 'XOF', symbol: 'CFA', name: 'Benin CFA Franc', word: 'francs' },
  { code: 'BTN', symbol: 'Nu.', name: 'Bhutan Ngultrum', word: 'ngultrums' },
  { code: 'BOB', symbol: 'Bs.', name: 'Bolivia Boliviano', word: 'bolivianos' },
  { code: 'BAM', symbol: 'KM', name: 'Bosnia & Herzegovina Convertible Mark', word: 'marks' },
  { code: 'BWP', symbol: 'P', name: 'Botswana Pula', word: 'pula' },
  { code: 'BRL', symbol: 'R$', name: 'Brazil Real', word: 'reais' },
  { code: 'BND', symbol: '$', name: 'Brunei Dollar', word: 'dollars' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgaria Lev', word: 'leva' },
  { code: 'BIF', symbol: 'Fr', name: 'Burundi Franc', word: 'francs' },
  { code: 'KHR', symbol: '៛', name: 'Cambodia Riel', word: 'riels' },
  { code: 'XAF', symbol: 'CFA', name: 'Cameroon CFA Franc', word: 'francs' },
  { code: 'CAD', symbol: '$', name: 'Canada Dollar', word: 'dollars' },
  { code: 'CLP', symbol: '$', name: 'Chile Peso', word: 'pesos' },
  { code: 'CNY', symbol: '¥', name: 'China Yuan', word: 'yuan' },
  { code: 'COP', symbol: '$', name: 'Colombia Peso', word: 'pesos' },
  { code: 'CDF', symbol: 'FC', name: 'Congo (DRC) Franc', word: 'francs' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rica Colón', word: 'colones' },
  { code: 'HRK', symbol: 'kn', name: 'Croatia Kuna', word: 'kunas' },
  { code: 'CUP', symbol: '₱', name: 'Cuba Peso', word: 'pesos' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Republic Koruna', word: 'koruny' },
  { code: 'DKK', symbol: 'kr', name: 'Denmark Krone', word: 'kroner' },
  { code: 'DJF', symbol: 'Fr', name: 'Djibouti Franc', word: 'francs' },
  { code: 'DOP', symbol: '$', name: 'Dominican Republic Peso', word: 'pesos' },
  { code: 'EGP', symbol: '£', name: 'Egypt Pound', word: 'pounds' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopia Birr', word: 'birr' },
  { code: 'EUR', symbol: '€', name: 'Euro', word: 'euros' },
  { code: 'FJD', symbol: '$', name: 'Fiji Dollar', word: 'dollars' },
  { code: 'GMD', symbol: 'D', name: 'Gambia Dalasi', word: 'dalasis' },
  { code: 'GEL', symbol: '₾', name: 'Georgia Lari', word: 'lari' },
  { code: 'GHS', symbol: '₵', name: 'Ghana Cedi', word: 'cedis' },
  { code: 'GTQ', symbol: 'Q', name: 'Guatemala Quetzal', word: 'quetzales' },
  { code: 'GNF', symbol: 'Fr', name: 'Guinea Franc', word: 'francs' },
  { code: 'HTG', symbol: 'G', name: 'Haiti Gourde', word: 'gourdes' },
  { code: 'HNL', symbol: 'L', name: 'Honduras Lempira', word: 'lempiras' },
  { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar', word: 'dollars' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungary Forint', word: 'forints' },
  { code: 'ISK', symbol: 'kr', name: 'Iceland Krona', word: 'kronor' },
  { code: 'INR', symbol: '₹', name: 'India Rupee', word: 'rupees' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesia Rupiah', word: 'rupiahs' },
  { code: 'IRR', symbol: '﷼', name: 'Iran Rial', word: 'rials' },
  { code: 'IQD', symbol: 'ع.د', name: 'Iraq Dinar', word: 'dinars' },
  { code: 'JMD', symbol: '$', name: 'Jamaica Dollar', word: 'dollars' },
  { code: 'JPY', symbol: '¥', name: 'Japan Yen', word: 'yen' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstan Tenge', word: 'tenge' },
  { code: 'KES', symbol: 'KSh', name: 'Kenya Shilling', word: 'shillings' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwait Dinar', word: 'dinars' },
  { code: 'LAK', symbol: '₭', name: 'Laos Kip', word: 'kip' },
  { code: 'LBP', symbol: 'ل.ل', name: 'Lebanon Pound', word: 'pounds' },
  { code: 'LSL', symbol: 'L', name: 'Lesotho Loti', word: 'maloti' },
  { code: 'LRD', symbol: '$', name: 'Liberia Dollar', word: 'dollars' },
  { code: 'LYD', symbol: 'ل.د', name: 'Libya Dinar', word: 'dinars' },
  { code: 'MGA', symbol: 'Ar', name: 'Madagascar Ariary', word: 'ariary' },
  { code: 'MWK', symbol: 'MK', name: 'Malawi Kwacha', word: 'kwacha' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysia Ringgit', word: 'ringgit' },
  { code: 'MVR', symbol: 'ރ', name: 'Maldives Rufiyaa', word: 'rufiyaa' },
  { code: 'MRU', symbol: 'UM', name: 'Mauritania Ouguiya', word: 'ouguiya' },
  { code: 'MUR', symbol: '₨', name: 'Mauritius Rupee', word: 'rupees' },
  { code: 'MXN', symbol: '$', name: 'Mexico Peso', word: 'pesos' },
  { code: 'MNT', symbol: '₮', name: 'Mongolia Tugrik', word: 'tugriks' },
  { code: 'MAD', symbol: 'د.م.', name: 'Morocco Dirham', word: 'dirhams' },
  { code: 'NAD', symbol: '$', name: 'Namibia Dollar', word: 'dollars' },
  { code: 'NPR', symbol: '₨', name: 'Nepal Rupee', word: 'rupees' },
  { code: 'NZD', symbol: '$', name: 'New Zealand Dollar', word: 'dollars' },
  { code: 'NIO', symbol: 'C$', name: 'Nicaragua Córdoba', word: 'córdobas' },
  { code: 'NGN', symbol: '₦', name: 'Nigeria Naira', word: 'naira' },
  { code: 'NOK', symbol: 'kr', name: 'Norway Krone', word: 'kroner' },
  { code: 'OMR', symbol: '﷼', name: 'Oman Rial', word: 'rials' },
  { code: 'PKR', symbol: '₨', name: 'Pakistan Rupee', word: 'rupees' },
  { code: 'PAB', symbol: 'B/.', name: 'Panama Balboa', word: 'balboas' },
  { code: 'PGK', symbol: 'K', name: 'Papua New Guinea Kina', word: 'kina' },
  { code: 'PYG', symbol: '₲', name: 'Paraguay Guarani', word: 'guaraníes' },
  { code: 'PEN', symbol: 'S/', name: 'Peru Sol', word: 'soles' },
  { code: 'PHP', symbol: '₱', name: 'Philippines Peso', word: 'pesos' },
  { code: 'PLN', symbol: 'zł', name: 'Poland Zloty', word: 'zloty' },
  { code: 'QAR', symbol: '﷼', name: 'Qatar Riyal', word: 'riyals' },
  { code: 'RON', symbol: 'lei', name: 'Romania Leu', word: 'lei' },
  { code: 'RUB', symbol: '₽', name: 'Russia Ruble', word: 'rubles' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Arabia Riyal', word: 'riyals' },
  { code: 'RSD', symbol: 'дин', name: 'Serbia Dinar', word: 'dinars' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar', word: 'dollars' },
  { code: 'ZAR', symbol: 'R', name: 'South Africa Rand', word: 'rand' },
  { code: 'KRW', symbol: '₩', name: 'South Korea Won', word: 'won' },
  { code: 'LKR', symbol: '₨', name: 'Sri Lanka Rupee', word: 'rupees' },
  { code: 'SEK', symbol: 'kr', name: 'Sweden Krona', word: 'kronor' },
  { code: 'CHF', symbol: 'CHF', name: 'Switzerland Franc', word: 'francs' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', word: 'dollars' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzania Shilling', word: 'shillings' },
  { code: 'THB', symbol: '฿', name: 'Thailand Baht', word: 'baht' },
  { code: 'TND', symbol: 'د.ت', name: 'Tunisia Dinar', word: 'dinars' },
  { code: 'TRY', symbol: '₺', name: 'Turkey Lira', word: 'lira' },
  { code: 'UGX', symbol: 'USh', name: 'Uganda Shilling', word: 'shillings' },
  { code: 'UAH', symbol: '₴', name: 'Ukraine Hryvnia', word: 'hryvnias' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', word: 'dirhams' },
  { code: 'GBP', symbol: '£', name: 'United Kingdom Pound', word: 'pounds' },
  { code: 'USD', symbol: '$', name: 'US Dollar', word: 'dollars' },
  { code: 'VES', symbol: 'Bs.', name: 'Venezuela Bolívar', word: 'bolívares' },
  { code: 'VND', symbol: '₫', name: 'Vietnam Dong', word: 'dong' },
  { code: 'YER', symbol: '﷼', name: 'Yemen Rial', word: 'rials' },
  { code: 'ZMW', symbol: 'ZK', name: 'Zambia Kwacha', word: 'kwacha' },
  { code: 'ZWL', symbol: '$', name: 'Zimbabwe Dollar', word: 'dollars' }
];

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1">
     <Label className="text-[10px] uppercase font-bold text-gray-500">{label}</Label>
     <div className="flex h-8 rounded-[4px] border border-[var(--border)] overflow-hidden bg-white hover:border-gray-400 transition-colors">
        <input type="color" className="w-10 h-10 -m-1 cursor-pointer" value={value || '#000000'} onChange={e => onChange(e.target.value)} />
        <Input className="flex-1 border-none h-full text-xs px-2 rounded-none shadow-none focus-visible:ring-0 uppercase font-mono" value={value} onChange={e => onChange(e.target.value)} />
     </div>
  </div>
);

export default function App() {
  const { fetchBranding, loading: brandingLoading, error: brandingError } = useBranding();
  
  const [website, setWebsite] = useState('');
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [templateLayout, setTemplateLayout] = useState(TEMPLATES[0].layout);
  
  const [design, setDesign] = useState<DesignOptions>({
    primaryColor: TEMPLATES[0].primaryColor,
    secondaryColor: TEMPLATES[0].secondaryColor,
    bgColor: TEMPLATES[0].bgColor,
    textColor: TEMPLATES[0].textColor,
    fontText: TEMPLATES[0].fontText,
    fontNum: TEMPLATES[0].fontNum,
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    referenceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    currency: '$',
    currencyCode: 'USD',
    amount: 0,
    amountWords: '',
    notes: 'Thank you for your business!',
    items: [{ id: '1', description: 'Web Development Services', quantity: 1, price: 1500 }],
    customFields: [],
    businessInfo: {
      name: 'Your Company',
      address: '123 Business Rd.\\nCity, State 12345',
      email: 'hello@company.com',
      phone: '+1 (555) 123-4567',
      website: '',
      uploadedLogo: null,
    },
    clientInfo: {
      name: 'Client Name',
      address: '456 Client Ave.\\nCity, State 67890',
      email: 'client@example.com',
    }
  });

  // Calculate total automatically
  useEffect(() => {
    const total = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const currObj = CURRENCIES.find(c => c.code === invoiceData.currencyCode) || CURRENCIES[0];
    if (!isNaN(total)) {
      setInvoiceData(prev => ({
        ...prev,
        amount: total,
        amountWords: toWords(Math.floor(total)) + ' ' + currObj.word
      }));
    }
  }, [invoiceData.items, invoiceData.currencyCode]);

  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    const tpl = TEMPLATES.find(t => t.id === id);
    if (tpl) {
       setTemplateLayout(tpl.layout);
       setDesign({
          primaryColor: tpl.primaryColor,
          secondaryColor: tpl.secondaryColor,
          bgColor: tpl.bgColor,
          textColor: tpl.textColor,
          fontText: tpl.fontText,
          fontNum: tpl.fontNum
       });
    }
  }

  const handleFetchBranding = async () => {
    if (!website) return;
    const res = await fetchBranding(website);
    if (res) {
      setInvoiceData(prev => ({
        ...prev,
        businessInfo: {
          ...prev.businessInfo,
          name: res.companyName,
          website: res.domain,
          uploadedLogo: prev.businessInfo.uploadedLogo || res.logoUrl || null
        }
      }));
      setDesign(prev => ({
         ...prev,
         primaryColor: res.primaryColor || prev.primaryColor,
         secondaryColor: res.secondaryColor || prev.secondaryColor,
         fontText: res.fontFamily || prev.fontText
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData(prev => ({
           ...prev,
           businessInfo: { ...prev.businessInfo, uploadedLogo: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${invoiceData.referenceNumber}.pdf`);
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { id: Math.random().toString(), description: '', quantity: 1, price: 0 }]
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (id: string) => {
     setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
     }));
  }

  const addCustomField = () => {
    setInvoiceData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { id: Math.random().toString(), key: 'New Field', value: '' }]
    }));
  };

  return (
    <div className="h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col overflow-hidden font-sans">
      <style dangerouslySetInnerHTML={{ __html: `@import url('${GOOGLE_FONTS_URL()}');` }} />
      <header className="h-[60px] bg-white border-b border-[var(--border)] flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3 font-bold text-xl text-[var(--primary)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>ProInvoice</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[var(--border)] text-[var(--primary)] bg-white h-[36px] px-4 font-medium">Save Draft</Button>
          <Button className="bg-[var(--accent)] text-white hover:opacity-90 border-none h-[36px] px-4 font-medium" onClick={downloadPDF}>
            Export to PDF
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-60px)]">
        {/* Sidebar / Editor */}
        <aside className="w-[360px] bg-white border-r border-[var(--border)] p-5 overflow-y-auto shrink-0 flex flex-col gap-8 shadow-sm">
          
          {/* Blueprint Chooser */}
          <section className="space-y-3">
             <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[var(--text-light)]">Template Blueprint</h3>
             <select 
                className="w-full p-2.5 border border-[var(--border)] rounded-[4px] text-[13px] bg-white focus-visible:outline-none focus:border-[var(--accent)] cursor-pointer"
                value={templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                {TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
          </section>

          {/* Design Section */}
          <section className="space-y-4">
             <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[var(--text-light)] pb-2 border-b border-[var(--border)]">Design Customization</h3>
             
             <div className="space-y-3">
                <Label className="text-[11px] font-bold text-gray-800">Color Palette</Label>
                <div className="grid grid-cols-2 gap-2">
                   <ColorPicker label="Primary" value={design.primaryColor} onChange={v => setDesign({...design, primaryColor: v})} />
                   <ColorPicker label="Secondary" value={design.secondaryColor} onChange={v => setDesign({...design, secondaryColor: v})} />
                   <ColorPicker label="Background" value={design.bgColor} onChange={v => setDesign({...design, bgColor: v})} />
                   <ColorPicker label="Text" value={design.textColor} onChange={v => setDesign({...design, textColor: v})} />
                </div>
             </div>

             <div className="space-y-3 pt-2">
                <Label className="text-[11px] font-bold text-gray-800">Typography</Label>
                <div className="grid grid-cols-2 gap-2">
                   <div className="flex flex-col gap-1">
                      <Label className="text-[10px] uppercase font-bold text-gray-500">Text Font</Label>
                      <select className="h-8 text-xs border border-[var(--border)] bg-white rounded-[4px] px-2 focus-visible:outline-none text-ellipsis" value={design.fontText} onChange={e => setDesign({...design, fontText: e.target.value})}>
                         {FONTS.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                      </select>
                   </div>
                   <div className="flex flex-col gap-1">
                      <Label className="text-[10px] uppercase font-bold text-gray-500">Numbers Font</Label>
                      <select className="h-8 text-xs border border-[var(--border)] bg-white rounded-[4px] px-2 focus-visible:outline-none text-ellipsis" value={design.fontNum} onChange={e => setDesign({...design, fontNum: e.target.value})}>
                         {FONTS.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                      </select>
                   </div>
                </div>
             </div>
          </section>

          {/* AI Branding Section */}
          <section className="space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[var(--text-light)] pb-2 border-b border-[var(--border)]">Theme Auto-fill</h3>
            <div className="space-y-2">
              <Label className="text-[11px] text-gray-600 block">Extract colors & fonts from website</Label> 
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. stripe.com"
                  className="p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto bg-gray-50"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFetchBranding()}
                />
                <Button className="bg-[var(--accent)] text-white hover:opacity-90 border-none h-auto px-4" onClick={handleFetchBranding} disabled={brandingLoading || !website}>
                  {brandingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch Base'}
                </Button>
              </div>
            </div>
            {brandingError && <p className="text-xs text-red-500 mt-1">{brandingError}</p>}
            
            <div className="pt-2">
              <Label className="text-[11px] block mb-2 text-gray-600">Upload Custom Logo (Overrides Fetch)</Label>
              <div className="flex items-center gap-2">
                 <Input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-xs p-1" />
                 {invoiceData.businessInfo.uploadedLogo && (
                   <Button variant="ghost" size="icon" onClick={() => setInvoiceData(prev => ({...prev, businessInfo: {...prev.businessInfo, uploadedLogo: null}}))}>
                     <Trash2 className="w-4 h-4 text-red-500" />
                   </Button>
                 )}
              </div>
            </div>
          </section>

          {/* Invoice Details */}
          <section className="space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[var(--text-light)] pb-2 border-b border-[var(--border)]">Invoice Content</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Reference No.</Label>
                <Input className="p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto" value={invoiceData.referenceNumber} onChange={e => setInvoiceData({...invoiceData, referenceNumber: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Currency</Label>
                <select className="w-full h-[33px] px-2 text-xs border border-[var(--border)] bg-gray-50 focus-visible:outline-none rounded-[4px]" value={invoiceData.currencyCode} onChange={e => {
                   const curr = CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0];
                   setInvoiceData({...invoiceData, currencyCode: curr.code, currency: curr.symbol});
                }}>
                   {CURRENCIES.map(c => (
                     <option key={c.code} value={c.code}>{c.code} ({c.symbol}) - {c.name}</option>
                   ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Date</Label>
                <Input type="date" className="p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto" value={invoiceData.date} onChange={e => setInvoiceData({...invoiceData, date: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Due Date</Label>
                <Input type="date" className="p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto" value={invoiceData.dueDate} onChange={e => setInvoiceData({...invoiceData, dueDate: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
               <Label className="text-[11px] font-semibold">Business Info</Label>
               <Input className="p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto" placeholder="Company Name" value={invoiceData.businessInfo.name} onChange={e => setInvoiceData({...invoiceData, businessInfo: {...invoiceData.businessInfo, name: e.target.value}})} />
               <Textarea className="p-2 border-[var(--border)] rounded-[4px] text-[13px]" placeholder="Address" rows={2} value={invoiceData.businessInfo.address} onChange={e => setInvoiceData({...invoiceData, businessInfo: {...invoiceData.businessInfo, address: e.target.value}})} />
            </div>

            <div className="space-y-2 pt-2">
               <Label className="text-[11px] font-semibold">Client Info</Label>
               <Input className="p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto" placeholder="Client Name" value={invoiceData.clientInfo.name} onChange={e => setInvoiceData({...invoiceData, clientInfo: {...invoiceData.clientInfo, name: e.target.value}})} />
               <Textarea className="p-2 border-[var(--border)] rounded-[4px] text-[13px]" placeholder="Address" rows={2} value={invoiceData.clientInfo.address} onChange={e => setInvoiceData({...invoiceData, clientInfo: {...invoiceData.clientInfo, address: e.target.value}})} />
            </div>
          </section>

          {/* Items */}
          <section className="space-y-3">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[var(--text-light)]">Line Items</h3>
              <Button variant="ghost" size="sm" onClick={addItem} className="h-6 text-[11px] px-2 text-blue-600"><Plus className="w-3 h-3 mr-1"/> Add Item</Button>
            </div>
            <div className="space-y-2">
              {invoiceData.items.map((item) => (
                 <div key={item.id} className="flex flex-col gap-2 border border-[var(--border)] p-3 rounded-[4px] bg-gray-50/50">
                    <div className="flex justify-between items-center">
                       <Input placeholder="Description" className="p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto bg-white flex-1" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                       <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 ml-1 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
                    </div>
                    <div className="flex gap-2">
                       <Input type="number" placeholder="Qty" className="w-20 p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto bg-white" value={item.quantity === 0 ? '' : item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                       <Input type="number" placeholder="Price" className="w-32 p-2 border-[var(--border)] rounded-[4px] text-[13px] h-auto bg-white" value={item.price === 0 ? '' : item.price} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                    </div>
                 </div>
              ))}
            </div>
          </section>

          {/* Custom Fields & Notes */}
          <section className="space-y-3">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[var(--text-light)]">Extra Fields & Notes</h3>
              <Button variant="ghost" size="sm" onClick={addCustomField} className="h-6 text-[11px] px-2 text-blue-600"><Plus className="w-3 h-3 mr-1"/> Add Field</Button>
            </div>
            {invoiceData.customFields.map((cf, idx) => (
                <div key={cf.id} className="flex gap-2 mb-2 items-center">
                  <Input placeholder="Label" className="w-1/3 p-2 border-[var(--border)] rounded-[4px] text-[13px] h-8" value={cf.key} onChange={e => {
                     const newCfs = [...invoiceData.customFields];
                     newCfs[idx].key = e.target.value;
                     setInvoiceData({...invoiceData, customFields: newCfs});
                  }} />
                  <Input placeholder="Value" className="flex-1 p-2 border-[var(--border)] rounded-[4px] text-[13px] h-8" value={cf.value} onChange={e => {
                     const newCfs = [...invoiceData.customFields];
                     newCfs[idx].value = e.target.value;
                     setInvoiceData({...invoiceData, customFields: newCfs});
                  }} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0" onClick={() => {
                     setInvoiceData({...invoiceData, customFields: invoiceData.customFields.filter(f => f.id !== cf.id)});
                  }}><Trash2 className="w-4 h-4"/></Button>
                </div>
            ))}

            <div className="pt-2 space-y-1">
               <Label className="text-[11px] font-semibold">Notes / Terms</Label>
               <Textarea rows={3} className="p-2 border-[var(--border)] rounded-[4px] text-[13px]" value={invoiceData.notes} onChange={e => setInvoiceData({...invoiceData, notes: e.target.value})} />
            </div>
          </section>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 overflow-y-auto w-full flex justify-center py-10 px-4 bg-[var(--preview-bg,var(--bg))]">
          {/* A4 roughly 210x297mm => 1:1.414 aspect. 800px width */ }
          <div className="w-full max-w-[800px] bg-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] rounded-sm shrink-0" style={{ transformOrigin: 'top center', minHeight: '1131px' }}>
            <InvoicePreview 
              data={invoiceData}
              design={design}
              layout={templateLayout}
              logoUrl={invoiceData.businessInfo.uploadedLogo}
              previewRef={previewRef}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
