import type { PricingResult, ReportContent } from '../types/pricing';
import { CheckCircle2 } from 'lucide-react';

interface PricingReportTemplateProps {
  result: PricingResult;
  reportContent: ReportContent;
  clientName: string;
  projectName: string;
}

export default function PricingReportTemplate({
  result,
  reportContent,
  clientName,
  projectName,
}: PricingReportTemplateProps) {
  return (
    <div
      id="pricing-report-template"
      className="font-sans text-right"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        direction: 'rtl',
        position: 'absolute',
        top: '-10000px',
        left: '-10000px',
        backgroundColor: '#ffffff',
        color: '#1f2937',
      }}
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-end pb-4 mb-8" style={{ borderBottom: '2px solid #22c55e' }}>
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#16a34a' }}>
            تقرير {projectName}
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            تقرير تطوير {projectName} لعرض المنتجات والخدمات
          </p>
        </div>
        <div className="text-left">
          <div
            className="px-3 py-1 rounded-full text-sm font-medium inline-block mb-1"
            style={{ backgroundColor: '#dcfce7', color: '#166534' }}
          >
            {new Date().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <div className="font-bold" style={{ color: '#4b5563' }}>
            {clientName}
          </div>
        </div>
      </div>

      {/* ================= INTRO ================= */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 pr-3" style={{ borderRight: '4px solid #22c55e' }}>
          مقدمة
        </h2>
        <p className="leading-relaxed text-justify" style={{ color: '#374151' }}>
          {reportContent.introduction}
        </p>
      </div>

      {/* ================= PROJECT DETAILS ================= */}
      <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
        <h2 className="text-xl font-bold mb-4">تفاصيل المشروع</h2>
        <p className="leading-relaxed whitespace-pre-line">
          {result.justification.split('\n\n')[0]}
        </p>
      </div>

      {/* ================= STANDARD PACKAGE (PAGE 1) ================= */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 pr-3" style={{ borderRight: '4px solid #22c55e' }}>
          باقات التسعير المقترحة
        </h2>

        <div className="rounded-xl overflow-hidden shadow-sm break-inside-avoid" style={{ border: '2px solid #22c55e' }}>
          <div className="p-4 flex justify-between items-center" style={{ backgroundColor: '#f0fdf4' }}>
            <h3 className="text-xl font-bold" style={{ color: '#166534' }}>
              {result.packages.standard.name} (الموصى بها)
            </h3>
            <div className="text-2xl font-bold" style={{ color: '#16a34a' }}>
              {result.packages.standard.price.toLocaleString()}{' '}
              <span className="text-sm" style={{ color: '#6b7280' }}>
                {result.currency}
              </span>
            </div>
          </div>

          <div className="p-4">
            <p className="mb-4 text-sm" style={{ color: '#4b5563' }}>
              {result.packages.standard.description}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {result.packages.standard.features.slice(0, 8).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 color="#22c55e" size={16} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= PAGE BREAK ================= */}
      <div style={{ pageBreakBefore: 'always' }} />

      {/* ================= ECONOMIC + PREMIUM (PAGE 2) ================= */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Economic */}
        <div className="rounded-xl p-4 break-inside-avoid" style={{ border: '1px solid #e5e7eb' }}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{result.packages.economic.name}</h3>
            <div className="font-bold text-sm">
              {result.packages.economic.price.toLocaleString()} {result.currency}
            </div>
          </div>
          <ul className="text-sm space-y-1">
            {result.packages.economic.features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        </div>

        {/* Premium */}
        <div className="rounded-xl p-4 break-inside-avoid" style={{ border: '1px solid #e5e7eb' }}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{result.packages.premium.name}</h3>
            <div className="font-bold text-sm">
              {result.packages.premium.price.toLocaleString()} {result.currency}
            </div>
          </div>
          <ul className="text-sm space-y-1">
            {result.packages.premium.features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= CUSTOM SECTIONS ================= */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 pr-3" style={{ borderRight: '4px solid #22c55e' }}>
          تحليل مخصص لكم
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {reportContent.customSections.map((section, idx) => (
            <div key={idx} className="p-5 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
              <h3 className="font-bold mb-2">{section.title}</h3>
              <p className="text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="pt-8 text-center text-sm" style={{ borderTop: '1px solid #e5e7eb', color: '#6b7280' }}>
        <p>{reportContent.conclusion}</p>
        <div className="mt-4 flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#111827', color: '#ffffff' }}>
          <div className="font-bold text-lg">ArabixDev</div>
          <div className="text-left">
            <div>arabixdev@gmail.com</div>
            <div className="text-xs text-right" style={{ color: '#9ca3af' }}>
              تم التوليد بواسطة منصة التسعير الذكي
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
