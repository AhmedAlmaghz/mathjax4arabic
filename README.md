# MathJax4Arabic

مكتبة جاهزة للاستخدام تعرض معادلات MathJax باتجاه عربي وتترجم الرموز الشائعة تلقائياً، بدون أن يكتب المستخدم إعدادات MathJax أو يضيف CSS يدوياً.

## الاستخدام الأسرع عبر CDN

انسخ سطراً واحداً فقط داخل الصفحة:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/mathjax4arabic@1/dist/browser.js"></script>
```

بعدها اكتب معادلاتك كالمعتاد:

```html
<p lang="ar" dir="rtl">
  حل المعادلة: \( x^2 + y^2 = r^2 \)
</p>
```

مدخل المتصفح يقوم تلقائياً بـ:

- ضبط `window.MathJax` بالحزم المطلوبة مثل `html` و `ams`.
- حقن أنماط الانعكاس العربية المطلوبة.
- تحميل MathJax v4 من CDN عند عدم وجوده.
- تحويل المعادلات داخل الصفحة ثم استدعاء MathJax لعرضها.

## الاستخدام عبر npm

```bash
npm install mathjax4arabic
```

للمتصفح أو تطبيقات React/Vite/Next التي تعمل على العميل:

```js
import "mathjax4arabic/browser";
```

ثم استخدم TeX داخل HTML أو JSX بدون إعدادات إضافية:

```jsx
export default function Formula() {
  return <div lang="ar" dir="rtl">\( a x^2 + b x + c = 0 \)</div>;
}
```

## الاستخدام المتقدم الاختياري

الاستخدام الافتراضي لا يتطلب شيئاً. إذا احتجت التحكم اليدوي، يمكنك استيراد المدخل الأساسي:

```js
import ArabicMathJax from "mathjax4arabic";

const tex = ArabicMathJax.preprocess("x = 12", { forceArabic: true });
```

وتتوفر دوال اختيارية:

- `preprocess(tex, options)` لمعالجة TeX فقط.
- `typesetArabic(target, options)` لمعالجة عنصر أو محدد CSS ثم عرضه.
- `renderPage(options)` لمعالجة الصفحة كاملة.
- `configureMathJax(overrides)` لإنشاء إعداد MathJax جاهز مع تعديلات اختيارية.
- `installAutoSetup(options)` لتفعيل التهيئة التلقائية يدوياً عند الحاجة.

## أوامر TeX المدعومة

يمكنك استخدام TeX عادي، أو أوامر المكتبة عند الحاجة:

| الأمر | الوصف | مثال |
| --- | --- | --- |
| `\ar{...}` | يترجم المحتوى في الصفحات العربية | `\ar{x = 1}` |
| `\alwaysar{...}` | يترجم دائماً | `\alwaysar{a + b}` |
| `\transx{EN}{AR}` | يختار فرعاً رياضياً حسب اللغة | `\transx{x}{س}` |
| `\transt{EN}{AR}` | يختار نصاً حسب اللغة مع دعم المزج مع رموز رياضية | `\transt{where x > 0}{حيث س > ٠}` |
| `\transn{123}` | يترجم الأرقام | `\transn{123}` |

## ما الذي يترجم تلقائياً؟

- الأرقام الغربية `0-9` إلى العربية الهندية `٠-٩`.
- المتغيرات الشائعة مثل `x`, `y`, `z`, `a`, `b` إلى رموز عربية.
- الدوال مثل `\sin`, `\cos`, `\tan`, `\log`, `\ln`, `\lim`.
- بعض الفواصل وعلامات الترقيم داخل السياق الرياضي.
- اتجاه البنية الرياضية عبر `\class{mjx-ar-flip}{...}` المدعوم رسمياً من MathJax.

## البناء والتطوير

```bash
npm test
npm run typecheck
npm run build
```

## الترخيص

MIT — مستوحاة من مكتبة `arabic-mathjax` الأصلية، مع إعادة بناء حديثة للعمل مع MathJax v4.
