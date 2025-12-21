import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PricingState, PricingResult } from '../types/pricing';

export async function generatePricing(
  state: PricingState
): Promise<PricingResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.'
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
  });

  const prompt = `
تصرف بصفتك "خبير استراتيجي في تسعير البرمجيات" (Senior Software Pricing Strategist) بخبرة 20 عاماً.

يجب أن تأخذ بعين الاعتبار وبجدية العوامل التالية:
1. القوة الشرائية: العميل في (${state.marketInfo.clientLocation}) والمستقل في (${state.marketInfo.freelancerLocation})
2. التعقيد التقني: ${state.technicalDetails.tools.join(', ')}
3. خبرة المستقل: ${state.freelancerProfile.yearsOfExperience} سنوات (${state.freelancerProfile.expertiseLevel})

--- تفاصيل المشروع ---
نوع الخدمة: ${state.serviceInfo.serviceType}
الوصف: ${state.serviceInfo.description}
المخرجات: ${state.serviceInfo.deliverables}

التعقيد: ${state.technicalDetails.complexity}
الميزات: ${state.technicalDetails.features.join(', ')}

الجهد: ${state.effortEstimation.estimatedHours} ساعة
سرعة التسليم: ${state.effortEstimation.deliverySpeed}

--- المطلوب ---
إنشاء ثلاث باقات (اقتصادية، قياسية، مميزة)

القواعد:
- أخرج النتيجة بصيغة JSON فقط
- بدون Markdown
- اتبع الهيكل التالي حرفياً:

{
  "range": { "min": number, "max": number },
  "level": "economic" | "standard" | "premium",
  "reasoning": "نص عربي",
  "packages": {
    "economic": { "name": "", "price": number, "description": "", "features": [] },
    "standard": { "name": "", "price": number, "description": "", "features": [] },
    "premium": { "name": "", "price": number, "description": "", "features": [] }
  },
  "justification": "نص عربي",
  "currency": "العملة (مثال: ر.س، USD، جنيه)"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response) {
      throw new Error('Empty response from Gemini API');
    }

    const text = response.text();

    // تنظيف أي نص زائد أو Markdown محتمل
    const jsonString = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(jsonString) as PricingResult;
    } catch (parseError) {
      console.error('Raw Gemini Response:', text);
      throw new Error('فشل تحليل JSON الناتج من Gemini');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(
      'فشل في توليد التسعير. يرجى التحقق من مفتاح API أو صيغة الطلب.'
    );
  }
}
