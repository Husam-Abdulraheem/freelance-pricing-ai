import { useEffect, useState, useRef } from 'react';
import { usePricing } from '../context/PricingContext';
import { generatePricing, generateReportNarrative } from '../services/aiPricing';
import { CheckCircle2, Copy, RotateCcw, ArrowRight, Sparkles, Search, Calculator, Globe, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PricingReportTemplate from './PricingReportTemplate';
import ReportConfigModal from './ReportConfigModal';
import type { ReportContent } from '../types/pricing';

interface AILoadingStateProps {
  onComplete: () => void;
  canFinish: boolean;
}

function AILoadingState({ onComplete, canFinish }: AILoadingStateProps) {
  const steps = [
    { text: 'تحليل متطلبات المشروع...', icon: Search },
    { text: 'دراسة حالة السوق والمنافسين...', icon: Globe },
    { text: 'تقدير الجهد والتعقيد التقني...', icon: Calculator },
    { text: 'صياغة باقات التسعير المثالية...', icon: Sparkles },
    { text: 'وضع اللمسات الأخيرة...', icon: CheckCircle2 },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        // If we are at the last step
        if (prev >= steps.length - 1) {
          // If data is ready, we can finish
          if (canFinish) {
            clearInterval(interval);
            onComplete();
            return prev;
          }
          // If data not ready, stay on last step
          return prev;
        }
        // Otherwise advance
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [canFinish, onComplete, steps.length]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg border border-blue-100">
          <CurrentIcon className="w-12 h-12 text-blue-600 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300 min-h-[32px]">
        {steps[currentStep].text}
      </h3>

      <div className="flex gap-1.5 mb-6">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${idx <= currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'
              }`}
          />
        ))}
      </div>

      <p className="text-gray-500 text-sm">يقوم الذكاء الاصطناعي بمعالجة بياناتك بدقة</p>
    </div>
  );
}

export default function PricingResults() {
  const { state, updateStep, updatePricingResult, resetPricing } = usePricing();
  // Initialize result from stored state if available
  const [loading, setLoading] = useState(!state.pricingResult);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // New state to coordinate animation
  const [dataReady, setDataReady] = useState(!!state.pricingResult);

  // Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportContent, setReportContent] = useState<ReportContent | null>(null);
  const [reportClientName, setReportClientName] = useState('');
  const [reportProjectName, setReportProjectName] = useState('');

  const isFetching = useRef(false);

  // Function to perform the fetch
  const performFetch = async () => {
    try {
      isFetching.current = true;
      setLoading(true);
      setDataReady(false);
      setError(null);
      const data = await generatePricing(state);

      // Update context but don't stop loading yet.
      // Wait for animation to finish.
      updatePricingResult(data);
      setDataReady(true);
    } catch (err: any) {
      console.error('Error generating pricing:', err);
      setError(err.message || 'حدث خطأ غير متوقع أثناء توليد التسعير');
      setLoading(false); // If error, stop immediately
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    // If we already have a result, just ensure we are ready
    if (state.pricingResult) {
      setDataReady(true);
      return;
    }

    // If already fetching, let it continue.
    if (isFetching.current) {
      return;
    }

    performFetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pricingResult]);

  const generatePDF = async () => {
    const input = document.getElementById('pricing-report-template');
    if (!input) return;

    try {
      // Small delay to ensure render
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // This calculation is tricky in loops, simpler approach:
        // Actually for simple top-down slicing:
        position = -(pageHeight * (Math.ceil((imgHeight - heightLeft) / pageHeight)));

        pdf.addPage();
        // We shift the image up to show the next section
        // Note: position needs to be negative to move image up
        // Cycle 1: -297, Cycle 2: -594...
        const currentCycle = Math.ceil((imgHeight - heightLeft) / pageHeight);
        pdf.addImage(imgData, 'PNG', 0, -(pageHeight * currentCycle), imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `عرض_سعر_${reportClientName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('حدث خطأ أثناء إنشاء ملف PDF');
    } finally {
      setIsGeneratingReport(false);
      setShowReportModal(false);
    }
  };

  useEffect(() => {
    if (reportContent && isGeneratingReport) {
      generatePDF();
    }
  }, [reportContent]);

  const handleGenerateReport = async (clientName: string, notes: string) => {
    if (!state.pricingResult) return;

    setIsGeneratingReport(true);
    setReportClientName(clientName);

    try {
      const content = await generateReportNarrative(
        state.pricingResult.packages,
        clientName,
        notes
      );
      setReportContent(content);
      // PDF generation triggered by useEffect when content is set
    } catch (err) {
      console.error('Report AI Error:', err);
      setIsGeneratingReport(false);
      alert('حدث خطأ أثناء توليد محتوى التقرير');
    }
  };

  const copyJustification = () => {
    if (state.pricingResult) {
      navigator.clipboard.writeText(state.pricingResult.justification);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <AILoadingState
        canFinish={dataReady}
        onComplete={() => setLoading(false)}
      />
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <RotateCcw className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">عذراً، حدث خطأ</h3>
        <p className="text-gray-500 max-w-md mb-8">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => updateStep(5)}
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            تعديل البيانات
          </button>
          <button
            onClick={performFetch}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const result = state.pricingResult;
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500">لا توجد نتائج لعرضها.</p>
        <button
          onClick={resetPricing}
          className="mt-4 text-blue-600 hover:underline"
        >
          العودة للبداية
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex gap-4 justify-between items-center bg-blue-50 p-4 border border-blue-200 rounded-xl mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-lg text-blue-900">تم حساب التسعير بنجاح</h3>
          </div>
          <p className="text-blue-700/80 text-sm">تم إنشاء 3 باقات تسعير مخصصة لاحتياجاتك</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => updateStep(5)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            تعديل الطلب
          </button>
          <button
            onClick={resetPricing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            حساب تسعير جديد
          </button>
        </div>

      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-all"
        >
          <FileText className="w-4 h-4" />
          تحميل العرض كملف PDF
        </button>
      </div>

      <ReportConfigModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onGenerate={handleGenerateReport}
        isGenerating={isGeneratingReport}
      />

      {/* Hidden Report Template */}
      {state.pricingResult && reportContent && (
        <PricingReportTemplate
          result={state.pricingResult}
          reportContent={reportContent}
          clientName={reportClientName}
          projectName={reportProjectName}
        />
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Economic */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-gray-300"></div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{result.packages.economic.name}</h3>
          <div className="text-2xl font-bold text-blue-600 mb-4 font-mono">
            {result.packages.economic.price.toLocaleString()} <span className="text-lg text-gray-500 font-normal">{result.currency}</span>
          </div>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed border-b border-gray-100 pb-4 min-h-[40px]">
            {result.packages.economic.description}
          </p>
          <ul className="space-y-3">
            {result.packages.economic.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Standard */}
        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-500 shadow-lg relative transform md:-translate-y-4">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-b-lg">
            موصى به
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{result.packages.standard.name}</h3>
          <div className="text-3xl font-bold text-blue-600 mb-4 font-mono">
            {result.packages.standard.price.toLocaleString()} <span className="text-lg text-gray-500 font-normal">{result.currency}</span>
          </div>
          <p className="text-gray-700 text-sm mb-6 leading-relaxed border-b border-blue-200 pb-4 min-h-[40px]">
            {result.packages.standard.description}
          </p>
          <ul className="space-y-3">
            {result.packages.standard.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{result.packages.premium.name}</h3>
          <div className="text-2xl font-bold text-purple-600 mb-4 font-mono">
            {result.packages.premium.price.toLocaleString()} <span className="text-lg text-gray-500 font-normal">{result.currency}</span>
          </div>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed border-b border-gray-100 pb-4 min-h-[40px]">
            {result.packages.premium.description}
          </p>
          <ul className="space-y-3">
            {result.packages.premium.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            تحليل الذكاء الاصطناعي
          </h3>
          <button
            onClick={copyJustification}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                تم النسخ
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                نسخ التحليل
              </>
            )}
          </button>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
          {result.justification}
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => updateStep(5)}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
          العودة لتعديل المدخلات
        </button>
      </div>

    </div>
  );
}
