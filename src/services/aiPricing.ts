import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PricingState, PricingResult, ReportContent } from '../types/pricing';

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

export async function generateReportNarrative(
  packages: PricingResult['packages'],
  clientName: string,
  customNotes: string
): Promise<ReportContent> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('API Key is missing');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `
تصرف بصفتك مستشار أعمال محترف يكتب مقترحاً رسمياً لعميل.
العميل: ${clientName}
المشروع: تطوير برمجيات/موقع

الباقات المقترحة:
1. الاقتصادية: ${packages.economic.name} - ${packages.economic.price}
2. القياسية: ${packages.standard.name} - ${packages.standard.price}
3. المميزة: ${packages.premium.name} - ${packages.premium.price}

ملاحظات خاصة من المستخدم للتركيز عليها: "${customNotes}"

المطلوب:
كتابة محتوى لتقرير PDF احترافي يتكون من:
1. مقدمة: ترحيب احترافي وتمهيد للمقترح (حوالي 50 كلمة).
2. نقاط مخصصة (Custom Sections): بناءً على "الملاحظات الخاصة"، اكتب 2-3 أقسام قصيرة (عنوان + محتوى) توضح كيف سيلبي الحل احتياجات العميل. إذا لم توجد ملاحظات، اكتب عن "الجودة" و"الدعم الفني".
3. خاتمة: دعوة لاتخاذ إجراء وشكر (حوالي 30 كلمة).

المخرجات JSON فقط:
{
  "introduction": "...",
  "customSections": [
    { "title": "...", "content": "..." }
  ],
  "conclusion": "..."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonString = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString) as ReportContent;
  } catch (error) {
    console.error('Report Generation Error:', error);
    return {
      introduction: `يسعدنا تقديم عرض السعر هذا لـ ${clientName}. لقد قمنا بدراسة متطلباتكم بعناية واقترحنا الحلول التالية لتلبية احتياجاتكم بأفضل كفاءة وجودة.`,
      customSections: [
        { title: 'ضمان الجودة', content: 'نلتزم بأعلى معايير الجودة في كتابة الكود والتصميم لضمان استقرار النظام وسهولة صيانته مستقبلاً.' },
        { title: 'الدعم الفني', content: 'نوفر خدمة دعم فني متميز لضمان عمل النظام بكفاءة ومعالجة أي استفسارات قد تطرأ بعد التسليم.' }
      ],
      conclusion: 'نتطلع للعمل معكم وتحقيق رؤيتكم. لا تترددوا في مناقشة أي تفاصيل إضافية لتعديل العرض بما يناسبكم.'
    };
  }
}
