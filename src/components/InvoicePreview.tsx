import * as React from 'react';
import { InvoiceData, DesignOptions } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  design: DesignOptions;
  layout: string;
  logoUrl: string | null;
  previewRef?: React.Ref<HTMLDivElement>;
}

export function InvoicePreview({ data, design, layout, logoUrl, previewRef }: InvoicePreviewProps) {
  
  const getSubtotal = () => data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const total = data.amount || getSubtotal();

  const Num = ({children}: {children: React.ReactNode}) => <span style={{fontFamily: design.fontNum}}>{children}</span>;

  const renderTable = (headerBg: string, headerText: string, borderCol: string, isMinimal: boolean = false) => (
    <table className="w-full text-left border-collapse mt-8">
      <thead>
        <tr style={{ backgroundColor: headerBg !== 'transparent' ? headerBg : 'transparent', color: headerText, borderBottom: isMinimal ? `2px solid ${borderCol}` : 'none' }}>
          <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider">Description</th>
          <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider w-24 text-right">Qty</th>
          <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider w-32 text-right">Price</th>
          <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider w-32 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {data.items.map((item, i) => (
          <tr key={item.id} style={{ borderBottom: isMinimal ? `1px solid ${borderCol}40` : `1px solid ${borderCol}`, backgroundColor: i % 2 === 0 ? 'transparent' : (headerBg !== 'transparent' ? `${headerBg}15` : `${design.textColor}05`) }}>
            <td className="py-3 px-4 text-sm">{item.description}</td>
            <td className="py-3 px-4 text-sm text-right"><Num>{item.quantity}</Num></td>
            <td className="py-3 px-4 text-sm text-right"><Num>{data.currency}{item.price.toFixed(2)}</Num></td>
            <td className="py-3 px-4 text-sm text-right"><Num>{data.currency}{(item.quantity * item.price).toFixed(2)}</Num></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderTotals = (accent: string) => (
    <div className="flex justify-end mt-8">
      <div className="w-72">
        <div className="flex justify-between py-2 border-b" style={{ borderColor: `${accent}40` }}>
          <span className="text-sm font-bold uppercase tracking-wider opacity-60 text-[10px]">Subtotal</span>
          <span className="text-sm"><Num>{data.currency}{getSubtotal().toFixed(2)}</Num></span>
        </div>
        <div className="flex justify-between py-4 font-bold text-xl" style={{ color: accent }}>
          <span>Total</span>
          <span><Num>{data.currency}{total.toFixed(2)}</Num></span>
        </div>
        {data.amountWords && (
          <p className="text-xs text-right mt-1 opacity-70 italic capitalize">
             {data.amountWords}
          </p>
        )}
      </div>
    </div>
  );

  const renderFooter = (borderCol: string) => (
    <div className="mt-auto pt-8 text-sm opacity-80 border-t" style={{ borderColor: `${borderCol}40` }}>
      {data.notes && (
        <div className="mb-4">
          <p className="font-bold mb-1 uppercase tracking-wider text-[10px] opacity-70">Notes</p>
          <p className="whitespace-pre-wrap">{data.notes}</p>
        </div>
      )}
      {data.customFields.length > 0 && (
         <div className="grid grid-cols-2 gap-x-8 gap-y-4">
           {data.customFields.map(cf => (
             <div key={cf.id}>
               <span className="font-bold block uppercase tracking-wider text-[10px] opacity-70">{cf.key}</span>
               <span>{cf.value}</span>
             </div>
           ))}
         </div>
      )}
    </div>
  );

  const renderLayout = () => {
    switch (layout) {
      case 'modern':
        return (
          <div className="flex min-h-full w-full" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontText }}>
             <div className="w-1/3 p-8 flex flex-col justify-between" style={{ backgroundColor: design.primaryColor, color: design.bgColor }}>
                <div>
                   {logoUrl && <img src={logoUrl} alt="Logo" className="max-w-[140px] max-h-[80px] object-contain mb-8 p-3 bg-white/10 rounded-xl mix-blend-luminosity" referrerPolicy="no-referrer" />}
                   {!logoUrl && <h2 className="text-2xl font-bold mb-8">{data.businessInfo.name}</h2>}
                   <div className="space-y-1 mb-8 opacity-90 text-sm">
                      <p className="whitespace-pre-line">{data.businessInfo.address}</p>
                      <p>{data.businessInfo.email}</p>
                      <p><Num>{data.businessInfo.phone}</Num></p>
                   </div>
                   
                   <div className="mt-12 pt-8 border-t border-white/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Billed To</p>
                      <p className="font-bold text-lg">{data.clientInfo.name}</p>
                      <p className="opacity-90 text-sm whitespace-pre-line mt-1">{data.clientInfo.address}</p>
                      <p className="opacity-90 text-sm">{data.clientInfo.email}</p>
                   </div>
                </div>
             </div>
             <div className="w-2/3 p-10 flex flex-col">
                <div className="flex justify-between items-end mb-12 border-b-2 pb-6" style={{ borderColor: `${design.primaryColor}30` }}>
                   <h1 className="text-4xl font-light uppercase tracking-widest" style={{color: design.primaryColor}}>Invoice</h1>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-bold opacity-50 tracking-wider">Invoice No.</p>
                      <p className="text-xl font-bold"><Num>#{data.referenceNumber}</Num></p>
                   </div>
                </div>
                <div className="flex gap-12 mb-10 text-sm">
                   <div><p className="uppercase text-[10px] font-bold opacity-50 tracking-wider mb-1">Date</p><p className="font-semibold"><Num>{data.date}</Num></p></div>
                   <div><p className="uppercase text-[10px] font-bold opacity-50 tracking-wider mb-1">Due Date</p><p className="font-semibold"><Num>{data.dueDate}</Num></p></div>
                </div>
                
                {renderTable(design.primaryColor, design.bgColor, `${design.primaryColor}40`)}
                {renderTotals(design.primaryColor)}
                <div className="mt-16">
                  {renderFooter(design.primaryColor)}
                </div>
             </div>
          </div>
        );
      
      case 'bold':
        return (
          <div className="min-h-full w-full flex flex-col relative" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontText }}>
             <div className="h-[240px] px-12 py-10 flex justify-between items-start overflow-hidden relative" style={{ backgroundColor: design.primaryColor, color: design.bgColor }}>
                <div className="z-10">
                   <h1 className="text-7xl font-black uppercase tracking-tighter mix-blend-overlay opacity-20 absolute -top-4 -left-4 pointer-events-none">INVOICE</h1>
                   <h1 className="text-5xl font-black mt-8 z-10 relative tracking-tight">INVOICE</h1>
                   <p className="opacity-80 mt-2 font-bold text-lg"><Num>#{data.referenceNumber}</Num></p>
                </div>
                {logoUrl ? <img src={logoUrl} alt="Logo" className="max-w-[180px] max-h-[90px] object-contain rounded bg-white/10 p-4 z-10 relative backdrop-blur-sm" referrerPolicy="no-referrer" /> : <h2 className="text-3xl font-black z-10 relative tracking-tight">{data.businessInfo.name}</h2>}
             </div>
             
             <div className="mx-8 -mt-16 bg-white p-10 shadow-2xl z-20 border-t-8 flex flex-col flex-1 mb-8" style={{ borderColor: design.secondaryColor, color: '#09090b', backgroundColor: '#ffffff' }}>
                <div className="flex justify-between mb-8 pb-8 border-b border-gray-100">
                   <div className="w-1/2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Invoice To</p>
                      <p className="font-black text-2xl mb-1">{data.clientInfo.name}</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.clientInfo.address}</p>
                   </div>
                   <div className="w-1/2 text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Invoice Details</p>
                      <div className="inline-block text-left">
                         <p className="text-sm text-gray-600"><span className="inline-block w-20 font-bold">Date:</span> <Num>{data.date}</Num></p>
                         <p className="text-sm text-gray-600"><span className="inline-block w-20 font-bold">Due:</span> <Num>{data.dueDate}</Num></p>
                      </div>
                   </div>
                </div>
                
                {renderTable(design.secondaryColor, '#000000', design.secondaryColor)}
                {renderTotals(design.primaryColor)}
                <div className="mt-12">
                   {renderFooter('#e5e7eb')}
                </div>
             </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="min-h-full w-full p-16 flex flex-col" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontText }}>
             <div className="flex justify-between items-end mb-20">
                <h1 className="text-6xl font-light tracking-tight">Invoice<span style={{ color: design.primaryColor }}>.</span></h1>
                {logoUrl && <img src={logoUrl} alt="Logo" className="max-w-[140px] max-h-[60px] object-contain grayscale opacity-80" referrerPolicy="no-referrer" />}
             </div>
             
             <div className="grid grid-cols-2 gap-16 text-sm mb-16">
                <div>
                  <p className="opacity-40 uppercase tracking-widest text-[10px] font-bold mb-3">From</p>
                  <p className="font-medium text-lg leading-tight mb-2">{data.businessInfo.name}</p>
                  <p className="opacity-70 whitespace-pre-wrap leading-relaxed">{data.businessInfo.address}</p>
                </div>
                <div>
                  <p className="opacity-40 uppercase tracking-widest text-[10px] font-bold mb-3">To</p>
                  <p className="font-medium text-lg leading-tight mb-2">{data.clientInfo.name}</p>
                  <p className="opacity-70 whitespace-pre-wrap leading-relaxed">{data.clientInfo.address}</p>
                </div>
             </div>
             
             <div className="flex gap-16 text-sm mb-16 border-t pt-8" style={{ borderColor: `${design.textColor}20` }}>
                 <div><span className="opacity-40 uppercase text-[10px] font-bold tracking-widest block mb-1">Invoice No</span><p className="font-light text-lg"><Num>{data.referenceNumber}</Num></p></div>
                 <div><span className="opacity-40 uppercase text-[10px] font-bold tracking-widest block mb-1">Date</span><p className="font-light text-lg"><Num>{data.date}</Num></p></div>
             </div>
             
             {renderTable('transparent', design.textColor, design.textColor, true)}
             {renderTotals(design.primaryColor)}
             
             <div className="mt-16">
                 {renderFooter(design.textColor)}
             </div>
          </div>
        );

      case 'executive':
        return (
          <div className="min-h-full w-full p-8" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontText }}>
             <div className="min-h-[calc(100%-0px)] border-[8px] border-double p-10 flex flex-col" style={{ borderColor: design.primaryColor }}>
                 <div className="text-center border-b-2 pb-8 mb-10" style={{ borderColor: design.primaryColor }}>
                    {logoUrl ? <img src={logoUrl} alt="Logo" className="mx-auto max-h-[80px] mb-6 object-contain" referrerPolicy="no-referrer" /> : <h2 className="text-3xl font-black uppercase tracking-widest mb-3">{data.businessInfo.name}</h2>}
                    <p className="text-sm opacity-80 whitespace-pre-wrap leading-relaxed max-w-md mx-auto">{data.businessInfo.address}</p>
                 </div>
                 
                 <div className="flex justify-between items-start mb-10 text-sm">
                   <div>
                      <h3 className="font-bold uppercase tracking-widest text-[10px] mb-2" style={{ color: design.primaryColor }}>Billed To</h3>
                      <p className="font-bold text-lg mb-1">{data.clientInfo.name}</p>
                      <p className="opacity-80 whitespace-pre-wrap">{data.clientInfo.address}</p>
                   </div>
                   <div className="text-right">
                      <h1 className="text-3xl font-bold uppercase tracking-widest mb-4" style={{ color: design.primaryColor }}>Statement</h1>
                      <div className="inline-block text-left text-sm p-3 bg-opacity-5" style={{ backgroundColor: `${design.primaryColor}10` }}>
                          <p className="mb-1"><span className="opacity-70 inline-block w-16 uppercase text-[10px] font-bold">No:</span> <strong><Num>{data.referenceNumber}</Num></strong></p>
                          <p><span className="opacity-70 inline-block w-16 uppercase text-[10px] font-bold">Date:</span> <strong><Num>{data.date}</Num></strong></p>
                      </div>
                   </div>
                 </div>
                 
                 {renderTable(design.secondaryColor !== design.bgColor ? design.secondaryColor : `${design.primaryColor}20`, design.textColor, design.primaryColor, true)}
                 {renderTotals(design.primaryColor)}
                 
                 <div className="mt-16">
                     {renderFooter(design.primaryColor)}
                 </div>
             </div>
          </div>
        );

      case 'classic':
      default:
        return (
          <div className="min-h-full w-full flex flex-col" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontText }}>
             <div className="px-12 py-10 flex justify-between items-center bg-opacity-10 border-b-4" style={{ backgroundColor: `${design.primaryColor}10`, borderColor: design.primaryColor }}>
                {logoUrl ? <img src={logoUrl} alt="Logo" className="max-w-[180px] max-h-[90px] object-contain" referrerPolicy="no-referrer" /> : <h2 className="text-4xl font-bold tracking-tight" style={{ color: design.primaryColor }}>{data.businessInfo.name}</h2>}
                <div className="text-right">
                   <h1 className="text-4xl font-bold uppercase tracking-wider mb-2" style={{ color: design.primaryColor }}>Invoice</h1>
                   <p className="text-sm font-bold opacity-70">#<Num>{data.referenceNumber}</Num></p>
                </div>
             </div>
             
             <div className="px-12 py-10 flex justify-between" style={{ backgroundColor: `${design.secondaryColor}10` }}>
                <div className="w-1/2 text-sm pr-8">
                   <h3 className="font-bold uppercase text-[10px] tracking-widest mb-2 opacity-60">Company Details</h3>
                   <p className="font-bold text-lg mb-1" style={{ color: design.primaryColor }}>{data.businessInfo.name}</p>
                   <p className="opacity-80 whitespace-pre-wrap">{data.businessInfo.address}</p>
                </div>
                <div className="w-1/2 text-sm text-right pl-8 border-l" style={{ borderColor: `${design.primaryColor}30` }}>
                   <h3 className="font-bold uppercase text-[10px] tracking-widest mb-2 opacity-60">Bill To</h3>
                   <p className="font-bold text-lg mb-1">{data.clientInfo.name}</p>
                   <p className="opacity-80 whitespace-pre-wrap">{data.clientInfo.address}</p>
                </div>
             </div>
             
             <div className="px-12 py-8 flex-1 flex flex-col justify-between">
                <div>
                   {renderTable(`${design.primaryColor}20`, design.textColor, `${design.primaryColor}30`)}
                   {renderTotals(design.primaryColor)}
                </div>
                {renderFooter(design.primaryColor)}
             </div>
          </div>
        );
    }
  };

  return (
    <div ref={previewRef} className="shadow-lg relative overflow-hidden transition-all bg-white" style={{ minHeight: '100%', display: 'flex' }}>
      {renderLayout()}
    </div>
  );
}
