# ⚡ ProInvoice

**Turn mundane billing into an unforgettable brand experience.**

ProInvoice is not your average, spreadsheet-looking invoice generator. It's a next-generation aesthetic charging tool designed for freelancers, studios, and modern businesses who actually care about how they present themselves.

Whether you want a gritty 90s terminal read-out, a minimalistic editorial sheet, or a thermal receipt aesthetic, ProInvoice generates pixel-perfect billing documents that demand to be paid.

---

## ✨ What Makes It Special?

- 🤖 **AI Brand Auto-Fill:** Don't waste time hunting down hex codes. Paste your website URL, and our Gemini API-powered extractor will intelligently pull your brand colors, company name, and typography, instantly splashing them across your invoice template.
- 🎨 **Immersive Blueprints:** Swap between completely distinct architectural layouts (Tech, Retro, Receipt, Minimal, Classic) with a single click. The styles adapt dynamically to your custom colors.
- 📱 **Flawless Responsive Preview:** Whether you're generating invoices from the back of a cab on your phone or on a 4K studio monitor, the layout engine dynamically scales the A4 canvas to fit your screen perfectly without losing formatting.
- 📥 **Pixel-Perfect Export:** One-click, high-resolution PDF generation leveraging precise CSS rendering and canvas conversion.

---

## 🚀 How to Use the App

Follow these simple steps to generate your first masterpiece invoice:

### Step 1: Summon Your Brand
Head to the sidebar and enter your website URL in the **Theme Auto-Fill** box, then click "Fetch Base". Wait a few seconds while the AI extracts your brand's color palette, names, and fonts. *(Note: requires Gemini API key configuration).*
*Alternatively, you can manually tinker with your Primary/Secondary colors and upload a custom logo image!*

### Step 2: Choose Your Aesthetic
Under the **Template Blueprint** dropdown, pick a layout that matches your vibe:
- Charging for a software engineering contract? Use the **Tech** layout.
- Running an artisanal pop-up? Use the **Receipt** layout.
- Want that standard corporate polish? Use the **Classic** or **Minimal** layout.

### Step 3: Draft the Details
Scroll down the editor and fill in the blanks:
- **Company & Client Info**: Add addresses, names, and contact emails.
- **Line Items**: Itemize your hard work. Add quantities, prices, and descriptions. ProInvoice will automatically calculate totals and subtotals.
- **Custom Fields**: Add non-standard info (like "Project Code", "Tax ID", or "VAT Number").

### Step 4: Lock It In & Export
Review the live preview area—it updates in real-time as you type! Once everything looks pristine, hit the **"Export to PDF"** button at the top right of the navigation bar. Your browser will instantly compile the canvas and download a flawless, A4 PDF document ready to be emailed.

---

## 🛠️ Tech Stack 

- **Frontend Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Export Engine**: `html2canvas` & `jspdf`
- **AI Extraction**: `@google/genai` (Gemini API)
