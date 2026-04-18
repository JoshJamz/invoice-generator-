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

      case 'contemporary':
        return (
          <div className="flex min-h-full w-full" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontText }}>
             <div className="w-[30%] p-10 border-r" style={{ borderColor: `${design.primaryColor}20` }}>
                {logoUrl ? <img src={logoUrl} alt="Logo" className="max-w-[120px] max-h-[60px] object-contain mb-12" referrerPolicy="no-referrer" /> : <h2 className="text-xl font-bold mb-12" style={{color: design.primaryColor}}>{data.businessInfo.name}</h2>}
                <div className="space-y-8 text-sm">
                   <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">From</p>
                       <p className="font-semibold">{data.businessInfo.name}</p>
                       <p className="opacity-80 whitespace-pre-line mt-1">{data.businessInfo.address}</p>
                   </div>
                   <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">To</p>
                       <p className="font-semibold">{data.clientInfo.name}</p>
                       <p className="opacity-80 whitespace-pre-line mt-1">{data.clientInfo.address}</p>
                   </div>
                   <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Invoice Facts</p>
                       <p className="flex justify-between border-b pb-1 mb-1" style={{ borderColor: `${design.textColor}10`, opacity: 0.8 }}><span>No:</span> <Num>{data.referenceNumber}</Num></p>
                       <p className="flex justify-between border-b pb-1 mb-1" style={{ borderColor: `${design.textColor}10`, opacity: 0.8 }}><span>Date:</span> <Num>{data.date}</Num></p>
                       <p className="flex justify-between border-b pb-1 mb-1" style={{ borderColor: `${design.textColor}10`, opacity: 0.8 }}><span>Due:</span> <Num>{data.dueDate}</Num></p>
                   </div>
                </div>
             </div>
             <div className="w-[70%] p-12 flex flex-col justify-between">
                <div>
                   <h1 className="text-5xl font-light mb-12" style={{color: design.primaryColor}}>Invoice</h1>
                   {renderTable('transparent', design.textColor, `${design.primaryColor}40`)}
                   {renderTotals(design.primaryColor)}
                </div>
                {renderFooter(design.primaryColor)}
             </div>
          </div>
        );

      case 'elegant':
        return (
          <div className="min-h-full w-full p-16 flex flex-col items-center justify-center text-center" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontText }}>
             <div className="w-full max-w-2xl mx-auto border-t border-b py-12 mb-12" style={{ borderColor: `${design.primaryColor}30` }}>
                 {logoUrl ? <img src={logoUrl} alt="Logo" className="mx-auto max-h-[80px] mb-8 object-contain mix-blend-multiply" referrerPolicy="no-referrer" /> : <h1 className="text-3xl font-serif tracking-widest uppercase mb-8" style={{color: design.primaryColor}}>{data.businessInfo.name}</h1>}
                 <p className="text-sm opacity-70 whitespace-pre-line leading-loose max-w-xs mx-auto">{data.businessInfo.address}</p>
             </div>
             
             <div className="w-full max-w-2xl grid grid-cols-2 gap-12 text-sm text-left mb-12">
                 <div>
                     <p className="italic text-[11px] opacity-60 mb-2">Prepared for:</p>
                     <p className="font-semibold text-lg">{data.clientInfo.name}</p>
                     <p className="opacity-80 whitespace-pre-line leading-relaxed">{data.clientInfo.address}</p>
                 </div>
                 <div className="text-right">
                     <p className="italic text-[11px] opacity-60 mb-2">Invoice Details:</p>
                     <p>Ref: <span className="font-semibold"><Num>{data.referenceNumber}</Num></span></p>
                     <p>Date: <span className="font-semibold"><Num>{data.date}</Num></span></p>
                     <p>Due: <span className="font-semibold"><Num>{data.dueDate}</Num></span></p>
                 </div>
             </div>
             
             <div className="w-full max-w-2xl text-left">
                {renderTable('transparent', design.textColor, `${design.primaryColor}20`, true)}
                {renderTotals(design.primaryColor)}
                <div className="mt-16 text-center">
                    {renderFooter(design.primaryColor)}
                </div>
             </div>
          </div>
        );

      case 'tech':
        return (
          <div className="min-h-full w-full p-12 flex flex-col border-[16px]" style={{ backgroundColor: design.bgColor, color: design.textColor, borderColor: design.primaryColor, fontFamily: design.fontText }}>
             <div className="flex justify-between items-start mb-12 p-6 rounded" style={{ backgroundColor: `${design.secondaryColor}10`, border: `1px solid ${design.secondaryColor}30` }}>
                 <div>
                    {logoUrl ? <img src={logoUrl} alt="Logo" className="max-w-[140px] max-h-[50px] object-contain mb-4" referrerPolicy="no-referrer" /> : <h2 className="text-xl font-mono mb-4 text-[#0ff]" style={{color: design.primaryColor}}>{data.businessInfo.name}</h2>}
                    <p className="text-xs font-mono opacity-80 whitespace-pre-line leading-relaxed">{data.businessInfo.address}</p>
                 </div>
                 <div className="text-right font-mono">
                    <h1 className="text-3xl font-bold tracking-widest mb-4 uppercase" style={{ color: design.primaryColor, textShadow: `0 0 10px ${design.primaryColor}60` }}>INVOICE_</h1>
                    <div className="text-xs space-y-1 opacity-80 bg-black/20 p-3 rounded border border-white/10 text-left inline-block">
                        <p><span className="text-[#888] inline-block w-12">ID:</span> <Num>{data.referenceNumber}</Num></p>
                        <p><span className="text-[#888] inline-block w-12">DT:</span> <Num>{data.date}</Num></p>
                        <p><span className="text-[#888] inline-block w-12">DUE:</span> <Num>{data.dueDate}</Num></p>
                    </div>
                 </div>
             </div>

             <div className="mb-12 font-mono text-xs">
                <p className="text-[#888] mb-2 uppercase tracking-widest">{`> `}Target_Client</p>
                <div className="pl-4 border-l-2" style={{ borderColor: design.primaryColor }}>
                   <p className="font-bold text-sm text-white mb-1" style={{ color: design.textColor }}>{data.clientInfo.name}</p>
                   <p className="opacity-70 whitespace-pre-line p-2 bg-black/10 inline-block rounded">{data.clientInfo.address}</p>
                </div>
             </div>

             <div className="flex-1 font-mono">
                 {renderTable(`${design.secondaryColor}20`, design.textColor, `${design.secondaryColor}40`)}
                 {renderTotals(design.primaryColor)}
                 <div className="mt-12 opacity-60">
                     {renderFooter(design.secondaryColor)}
                 </div>
             </div>
          </div>
        );

      case 'retro':
        return (
          <div className="min-h-full w-full p-12 bg-opacity-30 relative" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontText, backgroundImage: `repeating-linear-gradient(45deg, ${design.secondaryColor}10 25%, transparent 25%, transparent 75%, ${design.secondaryColor}10 75%, ${design.secondaryColor}10), repeating-linear-gradient(45deg, ${design.secondaryColor}10 25%, ${design.bgColor} 25%, ${design.bgColor} 75%, ${design.secondaryColor}10 75%, ${design.secondaryColor}10)`, backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
              <div className="bg-white p-12 shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] border-2 border-black flex flex-col h-full relative" style={{ boxShadow: `12px 12px 0 0 ${design.primaryColor}`, borderColor: design.primaryColor }}>
                 <div className="absolute top-0 right-12 w-16 h-24 bg-red-500 opacity-20 -translate-y-4 shadow-sm z-0" style={{ backgroundColor: design.secondaryColor }}></div>
                 
                 <div className="flex justify-between items-end border-b-4 border-dashed pb-8 mb-10 z-10 relative" style={{ borderColor: design.primaryColor }}>
                     {logoUrl ? <img src={logoUrl} alt="Logo" className="max-w-[160px] max-h-[80px] object-contain filter drop-shadow-md" referrerPolicy="no-referrer" /> : <h1 className="text-4xl font-extrabold uppercase tracking-tighter" style={{ color: design.primaryColor }}>{data.businessInfo.name}</h1>}
                     <div className="text-right p-4 border-2 -mr-4 bg-[#fff8e7] rotate-2 shadow-sm" style={{ borderColor: design.primaryColor, backgroundColor: design.bgColor }}>
                         <h2 className="text-2xl font-black uppercase tracking-widest mb-1" style={{ color: design.primaryColor }}>Invoice</h2>
                         <p className="font-bold font-mono text-sm">No. <Num>{data.referenceNumber}</Num></p>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-12 text-sm mb-12">
                     <div className="p-4 border-2 border-l-8" style={{ borderColor: design.primaryColor }}>
                         <p className="font-black uppercase mb-2 bg-black text-white inline-block px-2 text-[10px]" style={{ backgroundColor: design.primaryColor }}>Bill To</p>
                         <p className="font-bold text-lg leading-none mb-2">{data.clientInfo.name}</p>
                         <p className="opacity-90 whitespace-pre-wrap">{data.clientInfo.address}</p>
                     </div>
                     <div className="flex flex-col justify-end text-right font-mono p-4 border-2 border-dotted" style={{ borderColor: design.primaryColor }}>
                         <p>Date: <Num>{data.date}</Num></p>
                         <p>Due: <Num>{data.dueDate}</Num></p>
                     </div>
                 </div>

                 <div className="flex-1 font-mono">
                     {renderTable(`${design.secondaryColor}40`, design.textColor, design.primaryColor)}
                     {renderTotals(design.primaryColor)}
                     <div className="mt-16 text-xs text-center border-t-2 border-dashed pt-8" style={{ borderColor: design.primaryColor }}>
                         {renderFooter(design.primaryColor)}
                     </div>
                 </div>
              </div>
          </div>
        );

      case 'receipt':
        return (
          <div className="min-h-full w-full p-8 flex justify-center items-start overflow-auto" style={{ backgroundColor: design.bgColor, color: design.textColor, fontFamily: design.fontNum }}>
             <div className="w-[380px] bg-white text-black p-8 shadow-2xl relative border border-gray-200" style={{ color: design.textColor, fontFamily: design.fontNum, borderTop: `8px solid ${design.primaryColor}` }}>
                {/* Thermal receipt zig-zag bottom */}
                <div className="absolute -bottom-2 -left-2 -right-2 h-4 bg-white" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
                
                <div className="text-center mb-8 border-b-2 border-dashed pb-6" style={{ borderColor: `${design.primaryColor}40` }}>
                    {logoUrl ? <img src={logoUrl} alt="Logo" className="mx-auto max-w-[120px] max-h-[60px] object-contain mb-4 filter grayscale" referrerPolicy="no-referrer" /> : <h2 className="text-2xl font-black uppercase mb-3 text-center">{data.businessInfo.name}</h2>}
                    <p className="text-xs whitespace-pre-line tracking-tight opacity-80">{data.businessInfo.address}</p>
                    <p className="text-xs mt-1">{data.businessInfo.phone}</p>
                </div>
                
                <div className="text-xs mb-6 border-b-2 border-dashed pb-6" style={{ borderColor: `${design.primaryColor}40` }}>
                    <p className="flex justify-between mb-1"><span>ORDER #</span> <span><Num>{data.referenceNumber}</Num></span></p>
                    <p className="flex justify-between mb-1"><span>DATE</span> <span><Num>{data.date}</Num></span></p>
                    <p className="flex justify-between"><span>DUE</span> <span><Num>{data.dueDate}</Num></span></p>
                </div>

                <div className="text-xs mb-6">
                    <p className="font-bold mb-2">CUSTOMER</p>
                    <p className="font-bold text-sm mb-1">{data.clientInfo.name}</p>
                    <p className="opacity-80 whitespace-pre-line">{data.clientInfo.address}</p>
                </div>

                <div className="text-xs border-b-2 border-black pb-4 mb-4 border-dashed" style={{ borderColor: `${design.primaryColor}40` }}>
                   <div className="flex justify-between font-bold mb-2 uppercase opacity-60"><span>Item</span> <span>Total</span></div>
                   {data.items.map(item => (
                     <div key={item.id} className="mb-3">
                         <div className="flex justify-between mb-1"><span className="font-bold truncate pr-4">{item.description}</span></div>
                         <div className="flex justify-between opacity-80"><span><Num>{item.quantity}</Num> x <Num>{data.currency}{item.price.toFixed(2)}</Num></span> <span><Num>{data.currency}{(item.quantity * item.price).toFixed(2)}</Num></span></div>
                     </div>
                   ))}
                </div>

                <div className="text-sm border-b-2 border-dashed pb-6 mb-6" style={{ borderColor: `${design.primaryColor}40` }}>
                   <div className="flex justify-between mb-2"><span>SUBTOTAL</span> <span><Num>{data.currency}{getSubtotal().toFixed(2)}</Num></span></div>
                   <div className="flex justify-between font-black text-xl mt-4" style={{ color: design.primaryColor }}><span>TOTAL</span> <span><Num>{data.currency}{total.toFixed(2)}</Num></span></div>
                </div>

                <div className="text-xs text-center opacity-70 italic whitespace-pre-wrap">
                    {data.notes || "THANK YOU - PLEASE COME AGAIN"}
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
