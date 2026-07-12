# Arabic MathJax v4 — إمتداد الرياضيات العربية لِـ MathJax

> إعادة بناء كاملة لمكتبة [`arabic-mathjax`](https://github.com/OmarIthawi/arabic-mathjax)
> لتعمل مع **MathJax v4.1.3** باستخدام أفضل الممارسات الحديثة.

## ✨ الميزات الرئيسية

### 🔮 كشف تلقائي
في الصفحات العربية (`lang="ar"`)، **كل المعادلات تُكتشف وتُترجم تلقائياً** — لا حاجة لأي أمر خاص!

```tex
x^2 + y^2 = r^2
```
↓ تصبح تلقائياً ↓
```
س² + ص² = ر²
```

### 🔢 ترجمة تلقائية

| النوع | الإنجليزية | العربية |
|-------|-----------|---------|
| أرقام | 0-9 | ٠-٩ |
| متغيرات | x, y, z, a, b... | س، ص، ع، أ، ب... |
| دوال مثلثية | sin, cos, tan | جا، جتا، ظا |
| دوال أخرى | log, ln, lim | لو، لن، نهــا |
| ترقيم | , ; | ، ؛ |

### ↔️ اتجاه صحيح RTL
انعكاس بصري للهيكل الرياضي (الأقواس، الجذور، التكامل) مع الحفاظ على قراءة النص العربي بشكل طبيعي.

### 🖋️ خط Amiri
النصوص العربية في المعادلات تُعرض بخط **Amiri** الجميل والمناسب للرياضيات.

---

## 🚀 التثبيت السريع

### عبر CDN (الأسهل)

```html
<!-- خط Amiri -->
<link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet">

<!-- أنماط CSS -->
<style>
  .mjx-ar-flip {
    display: inline-block !important;
    transform: scaleX(-1);
  }
  .mjx-ar-text {
    font-family: "Amiri", serif !important;
    font-style: normal !important;
  }
  mjx-mtext {
    font-family: "Amiri", serif !important;
  }
</style>

<!-- إعداد MathJax -->
<script>
  window.MathJax = {
    loader: { load: ["[tex]/html"] },
    tex: { packages: { "[+]": ["html"] } },
    chtml: { mtextInheritFont: true },
    startup: { typeset: false }
  };
</script>

<!-- MathJax v4 -->
<script src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js" async></script>
```

ثم استخدم المكتبة في JavaScript/TypeScript:

```js
import ArabicMathJax from "./arabic-mathjax.js";

// معالجة معادلة
const processed = ArabicMathJax.preprocess("x^2 + 1 = 0");
// النتيجة: صياغة TeX مترجمة للعربية

// عرضها مع MathJax
element.textContent = `\\[${processed}\\]`;
await MathJax.typesetPromise([element]);
```

---

## 📖 مرجع الأوامر

### الكشف التلقائي (الافتراضي)
```tex
x = 1
```
في الصفحات العربية، هذا يُترجم تلقائياً إلى: **س = ١**

### أوامر يدوية

| الأمر | الوصف | مثال |
|-------|-------|------|
| `\ar{...}` | يترجم فقط في الصفحات العربية | `\ar{x = 1}` |
| `\alwaysar{...}` | يترجم دائماً | `\alwaysar{a + b}` |
| `\transx{EN}{AR}` | صياغة مختلفة حسب اللغة | `\transx{f(x)}{ق(س)}` |
| `\transt{EN}{AR}` | نص مختلف حسب اللغة | `\transt{where}{حيث}` |
| `\transn{NUM}` | ترجمة رقم كامل | `\transn{1,234.56}` |

### قاموس المصطلحات

| الأمر | الإنجليزية | العربية |
|-------|-----------|---------|
| `\zero` | 0 | صفر |
| `\radius` | r | نق |
| `\Area` | A | م |
| `\charge` | C | ش |

---

## ⚙️ الإعدادات

```js
import ArabicMathJax from "./arabic-mathjax.js";

// إيقاف الكشف التلقائي
ArabicMathJax.config.autoArabic = false;

// تغيير منطق اكتشاف اللغة
ArabicMathJax.config.isArabicPage = () => {
  return location.pathname.startsWith("/ar/");
};

// إضافة ترجمة متغير جديد
ArabicMathJax.config.identifiers.p = "ع";

// إضافة دالة جديدة
ArabicMathJax.config.functions.arcsin = "قوس جا";
```

---

## 🔧 كيف تعمل الآلية؟

1. **معالجة نصية مسبقة**: المكتبة تحلل صياغة TeX وتوسّع الأوامر قبل إرسالها لـ MathJax.

2. **انعكاس بصري**: تستخدم `\class{mjx-ar-flip}{...}` (أمر TeX رسمي) لتطبيق `transform: scaleX(-1)` على الهيكل الرياضي.

3. **حماية النص العربي**: النصوص العربية تُغلّف بصنف إضافي يُلغي الانعكاس البصري للحروف مع الحفاظ على موضعها.

4. **استقلالية تامة**: لا يعدّل أي ملف داخلي في MathJax — يعتمد فقط على الواجهات الرسمية الموثّقة.

---

## 📄 الترخيص

رخصة MIT — مستوحاة من مكتبة [`arabic-mathjax`](https://github.com/OmarIthawi/arabic-mathjax) 
للمطوّر **Omar Al-Ithawi** ومؤسسة **Edraak.org**.

---

## 🙏 شكر وتقدير

- [Omar Al-Ithawi](https://github.com/OmarIthawi) على الفكرة والعمل الأصلي
- [فريق MathJax](https://www.mathjax.org) على محرّك الرياضيات الرائع
- [خط Amiri](https://www.amirifont.org) لجماله في عرض النصوص العربية
