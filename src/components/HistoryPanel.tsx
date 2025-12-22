import { useState } from 'react';
import { loadHistory, deleteHistoryItem, clearAllHistory, exportHistory, importHistory } from '../services/historyStorage';
import type { PricingHistoryItem } from '../types/PricingHistory';
import { X, Trash2, Download, Upload, FileText, Calendar, Building2 } from 'lucide-react';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const [history, setHistory] = useState<PricingHistoryItem[]>(loadHistory());

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه التسعيرة؟')) {
      deleteHistoryItem(id);
      setHistory(loadHistory());
    }
  };

  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع السجلات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  const handleExport = () => {
    const data = exportHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing_history_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const result = importHistory(content);

        if (result.success) {
          alert('تم استيراد البيانات بنجاح!');
          setHistory(loadHistory());
        } else {
          alert(`خطأ: ${result.error}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">سجل التسعيرات</h3>
              <p className="text-sm text-gray-500">جميع التسعيرات التي أنشأتها سابقاً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-b border-gray-100 bg-gray-50">
          <button
            onClick={handleExport}
            disabled={history.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            تصدير الكل
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            استيراد
          </button>
          <button
            onClick={handleClearAll}
            disabled={history.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            حذف الكل
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">لا توجد سجلات بعد</p>
              <p className="text-sm">ستظهر هنا جميع التسعيرات التي تنشئها</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <h4 className="font-bold text-gray-900">{item.clientName}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.projectName}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500 mb-1">اقتصادية</div>
                      <div className="font-bold text-sm text-gray-900">
                        {item.result.packages.economic.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-xs text-blue-600 mb-1">قياسية</div>
                      <div className="font-bold text-sm text-blue-900">
                        {item.result.packages.standard.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-xs text-purple-600 mb-1">مميزة</div>
                      <div className="font-bold text-sm text-purple-900">
                        {item.result.packages.premium.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
