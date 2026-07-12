export default function About() {
  return (
    <section id="about" className="bg-slate-950 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-black text-white">كيف تعمل الآلية؟</h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            تعتمد المكتبة على مبدأ بسيط وأنيق:
          </p>
          <ol className="mt-6 space-y-4 text-sm leading-relaxed text-slate-400">
            <li className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <span className="font-bold text-emerald-400">① الانعكاس الخارجي:</span>{" "}
              المعادلة بالكامل تُغلَّف بـ <code dir="ltr" className="text-emerald-300">transform: scaleX(-1)</code>.{" "}
              هذا يقلب <strong className="text-white">الرموز البنيوية فقط</strong>: 
              رمز التكامل ∫، الجذر √، المجموع Σ، الانتماء ∈، الجزئي ⊂، الأسهم ←→، الأقواس ( ) [ ] — 
              تلقائياً بدون أي تدخل.
            </li>
            <li className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <span className="font-bold text-emerald-400">② إلغاء الانعكاس للنصوص:</span>{" "}
              كل نص عربي مُترجَم (أرقام ٠-٩، متغيرات س ص ع، دوال جا لغ لو نهــا مجــ حا، 
              ونصوص مثل صفر نق م) يُغلَّف بانعكاس ثانٍ <code dir="ltr" className="text-emerald-300">scaleX(-1)</code> يُلغي الأول — 
              فيظهر النص العربي <strong className="text-white">بشكل طبيعي غير مقلوب</strong>.
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="font-bold text-emerald-400">③ خط الرقعة:</span>{" "}
              النصوص العربية في المعادلات تُعرض بخط <span className="font-['Aref_Ruqaa'] text-lg text-white">Aref Ruqaa</span> — 
              أقرب ما يكون لخط الرقعة في الكتب المدرسية العربية.
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="font-bold text-emerald-400">④ الاستقلالية:</span>{" "}
              الآلية تستخدم فقط أمر TeX الرسمي{" "}
              <code dir="ltr" className="text-emerald-300">\class{"{}"}{"{}"}</code>{" "}
              من حزمة <code dir="ltr">html</code> — بلا أي تعديل على ملفات MathJax الداخلية. 
              متوافقة مع أي إصدار مستقبلي.
            </li>
          </ol>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="mb-3 font-bold text-white">المقارنة مع النسخة الأصلية</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="py-2 text-start font-medium">الخاصية</th>
                  <th className="py-2 text-start font-medium">v2 (الأصلية)</th>
                  <th className="py-2 text-start font-medium">v4 (هذه)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 pe-2">MathJax</td>
                  <td className="py-2 pe-2 text-slate-500">v2.5 – v2.7</td>
                  <td className="py-2 text-emerald-400">v4.1.3+</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 pe-2">الكشف</td>
                  <td className="py-2 pe-2 text-slate-500">يدوي (\ar فقط)</td>
                  <td className="py-2 text-emerald-400">تلقائي + يدوي</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 pe-2">الخط</td>
                  <td className="py-2 pe-2 text-slate-500">Amiri فقط</td>
                  <td className="py-2 text-emerald-400">Aref Ruqaa (الرقعة)</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 pe-2">log</td>
                  <td className="py-2 pe-2 text-slate-500">لو</td>
                  <td className="py-2 text-emerald-400">لغ (تصحيح)</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 pe-2">ln</td>
                  <td className="py-2 pe-2 text-slate-500">—</td>
                  <td className="py-2 text-emerald-400">لو</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 pe-2">sum</td>
                  <td className="py-2 pe-2 text-slate-500">—</td>
                  <td className="py-2 text-emerald-400">مجــ</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 pe-2">احتمال</td>
                  <td className="py-2 pe-2 text-slate-500">—</td>
                  <td className="py-2 text-emerald-400">حا</td>
                </tr>
                <tr>
                  <td className="py-2 pe-2">آلية القلب</td>
                  <td className="py-2 pe-2 text-slate-500">تعديل داخلي هش</td>
                  <td className="py-2 text-emerald-400">\class رسمي</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-sm leading-relaxed text-slate-400">
            مشروع مستوحى من فكرة مكتبة{" "}
            <a href="https://github.com/OmarIthawi/arabic-mathjax" target="_blank" rel="noreferrer" className="text-emerald-400 underline">
              arabic-mathjax
            </a>{" "}
            للمطوّر <strong className="text-white">Omar Al-Ithawi</strong> ومؤسسة <strong className="text-white">Edraak.org</strong>، 
            مع تصحيحات لغوية وترجمات جديدة. رخصة MIT.
          </div>
        </div>
      </div>
    </section>
  );
}
