import React from 'react';
import { Award, BookOpen, Target, Users, Briefcase, Shield, CheckCircle, GraduationCap, Building2 } from 'lucide-react';
import { getContentBlocks } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';

export default function About() {
  const { data: aboutContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'about'],
    queryFn: () => getContentBlocks({ page: 'about' }),
  });

  const getContentData = (section, fallback) => {
    const item = aboutContent.find(c => c.section === section);
    if (item?.content) {
      try {
        return JSON.parse(item.content);
      } catch {
        return fallback;
      }
    }
    return fallback;
  };

  const companyData = getContentData('company', {
    name: 'DBP "BioChem Safety & Health"',
    founder: 'נוסדה ע"י ד"ר דיאנה בלנק-פורת',
    fields: [
      'בטיחות כימית וחומרים מסוכנים',
      'בטיחות ביולוגית',
      'גהות (בריאות) תעסוקתית',
      'קורסים לנאמני בטיחות',
      'ניהול הבטיחות',
      'בטיחות בעבודה בגובה'
    ]
  });

  const defaultServices = [
    "יעוץ בניהול הסיכונים הביולוגיים והבטיחות הביולוגית",
    "יעוץ בניהול תחום החומרים המסוכנים והוצאת היתר רעלים",
    "הדרכות בטיחות וריענון בטיחות שנתי למפעלים, מעבדות, בתי חולים",
    "הדרכות בטיחות בעבודה בגובה",
    "סקרי סיכונים בהתאמה: כללי, כימיים, ביולוגיים ואחרים",
    "הסמכה לתקן ISO 45001 לניהול בטיחות וגהות בתעסוקה",
    "הערכות לחירום: תיק שטח, תיק מפעל, תרגילי חירום והדרכות צוות חירום"
  ];

  const defaultProfessionalism = [
    'ד"ר דיאנה בלנק-פורת משלבת ידע אקדמי וניסיון מעשי עשיר של <strong>מעל שלושים שנה</strong> בתחומי מעבדה שונים בצבא, בבתי חולים, בתעשיה ובמחקר ופיתוח חומרים שמקנים לה הבנה רבה בתהליכים ושיטות עבודה בתחומי המעבדה הכימית, הביולוגית והמעבדה הרפואית יחד עם מיקוד מיטבי ומענה הולם לדרישות ולאתגרים שמציבה המעבדה כיום',
    'ד"ר דיאנה מרצה בקורסי בטיחות העובד וניהול סיכונים לתלמידי תואר שני בבית הספר לבריאות הציבור שבאוניברסיטת חיפה וכמו כן מרצה בנושאי חומרים מסוכנים, גהות תעסוקתית ועוד במכללות שמכשירות ממוני בטיחות וגהות',
    'אנחנו <strong>מוסד מוכר מטעם מינהל הבטיחות והבריאות התעסוקתית</strong> להכשרת נאמני בטיחות בעבודה'
  ];

  // Handle both array format (legacy) and HTML string format (new)
  const servicesRaw = getContentData('services', defaultServices);
  const services = Array.isArray(servicesRaw) ? servicesRaw : null;
  const servicesHtml = typeof servicesRaw === 'string' ? servicesRaw : null;

  const professionalismRaw = getContentData('professionalism', defaultProfessionalism);
  const professionalism = Array.isArray(professionalismRaw) ? professionalismRaw : null;
  const professionalismHtml = typeof professionalismRaw === 'string' ? professionalismRaw : null;

  const education = getContentData('education', [
    { degree: "PHD", field: "מדעי החיים. מחקר באונקולוגיה ופרמקולוגיה", institution: "אוניברסיטת בר-אילן" },
    { degree: "MPH", field: "בריאות סביבתית וגהות תעסוקתית", institution: "אוניברסיטת חיפה" },
    { degree: "MHA", field: "ניהול מערכות בריאות ואפידמיולוגיה", institution: "אוניברסיטת בר אילן" },
    { degree: "MSC", field: "ביוכימיה", institution: "אוניברסיטת סנטה פה, ארגנטינה" },
    { degree: "הסמכה", field: "ממונה בטיחות וגהות", institution: "משרד הכלכלה זרוע עבודה, מנהל הבטיחות" }
  ]);

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6 text-[#4e1635]">אודות</h1>
                      </div>

        {/* About Company */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 border border-gray-100">
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-6 text-[#8c2b60]">{companyData.name}</h2>
            <p className="text-lg leading-relaxed mb-6 text-gray-700">
              {companyData.founder}
            </p>

            <h3 className="text-2xl font-bold mb-4 text-[#4e1635]">תחומי עיסוק</h3>
            <ul className="grid md:grid-cols-2 gap-3 mb-6">
              {companyData.fields.map((field, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#8c2b60] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{field}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-8 h-8 text-[#8c2b60]" />
            <h2 className="text-3xl font-bold text-[#4e1635]">השירותים שלנו</h2>
            </div>
            <div className="text-right">
            {servicesHtml ? (
              <div 
                className="text-gray-700 leading-relaxed prose prose-lg max-w-none [&_ul]:space-y-2 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:before:content-['•'] [&_li]:before:text-[#8c2b60] [&_li]:before:font-bold [&_li]:before:mt-0 [&_a]:text-[#8c2b60] [&_a]:font-bold [&_a]:no-underline [&_a:hover]:underline"
                dangerouslySetInnerHTML={{ __html: servicesHtml }}
              />
            ) : (
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-[#8c2b60] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{service}</p>
                  </div>
                ))}
              </div>
            )}
            </div>
        </div>

        {/* Professionalism */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-[#8c2b60]" />
            <h2 className="text-3xl font-bold text-[#4e1635]">מקצוענות היא העיקר</h2>
            </div>
            <div className="text-right">
            {professionalismHtml ? (
              <div 
                className="text-gray-700 leading-relaxed prose prose-lg max-w-none [&_ul]:space-y-4 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:before:content-['•'] [&_li]:before:text-[#8c2b60] [&_li]:before:font-bold [&_li]:before:mt-0 [&_a]:text-[#8c2b60] [&_a]:font-bold [&_a]:no-underline [&_a:hover]:underline"
                dangerouslySetInnerHTML={{ __html: professionalismHtml }}
              />
            ) : (
              <div className="space-y-6">
                {professionalism.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-[#8c2b60] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                ))}
              </div>
            )}
            </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-[#8c2b60]" />
            <h2 className="text-3xl font-bold text-[#4e1635]">השכלה</h2>
          </div>
          <div className="space-y-4 text-right">
            {education.map((edu, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#8c2b60] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-[#8c2b60] font-bold text-lg">{edu.degree}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#4e1635] mb-1">{edu.field}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {edu.institution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}