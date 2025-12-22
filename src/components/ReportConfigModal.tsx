import { useState, useEffect } from 'react';
import { X, FileText, Wand2, Upload, Building2 } from 'lucide-react';
import type { BrandingSettings } from '../types/BrandingSettings';

interface ReportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (clientName: string, projectName: string, notes: string, branding: BrandingSettings) => void;
  isGenerating: boolean;
}

const BRANDING_STORAGE_KEY = 'pricing_branding_settings';

export default function ReportConfigModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: ReportConfigModalProps) {
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [notes, setNotes] = useState('');

  // Branding fields
  const [branding, setBranding] = useState<BrandingSettings>(() => {
    try {
      const stored = localStorage.getItem(BRANDING_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        companyName: 'ArabixDev',
        email: 'arabixdev@gmail.com',
        phone: '',
        website: '',
        logo: '',
      };
    } catch {
      return {
        companyName: 'ArabixDev',
        email: 'arabixdev@gmail.com',
        phone: '',
        website: '',
        logo: '',
      };
    }
  });

  // Save branding to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(branding));
  }, [branding]);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحد الأقصى 2 ميجابايت');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBranding(prev => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(clientName, projectName, notes, branding);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">إعداد التقرير</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            disabled={isGenerating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Project Info Section */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              معلومات المشروع
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم العميل / الشركة
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: شركة التقنية الحديثة"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المشروع
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="مثال: متجر إلكتروني متكامل"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نقاط للتركيز عليها (اختياري)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: ركز على الأمان، السرعة، والدعم الفني..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Wand2 className="w-3 h-3" />
                  سيستخدم الذكاء الاصطناعي هذه النقاط لصياغة محتوى التقرير
                </p>
              </div>
            </div>
          </div>

          {/* Branding Section */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              هوية شركتك (ستظهر في التقرير)
            </h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم شركتك
                  </label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) => setBranding(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="مثال: شركة التطوير الذكي"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={branding.email}
                    onChange={(e) => setBranding(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="info@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={branding.phone || ''}
                    onChange={(e) => setBranding(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+966 XX XXX XXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الموقع الإلكتروني (اختياري)
                  </label>
                  <input
                    type="url"
                    value={branding.website || ''}
                    onChange={(e) => setBranding(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شعار الشركة (اختياري)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">رفع شعار</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {branding.logo && (
                    <div className="flex items-center gap-2">
                      <img
                        src={branding.logo}
                        alt="Logo preview"
                        className="h-12 w-12 object-contain border border-gray-200 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setBranding(prev => ({ ...prev, logo: '' }))}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  الحد الأقصى: 2 ميجابايت (PNG, JPG, SVG)
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isGenerating || !clientName.trim() || !projectName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                'إنشاء التقرير'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
