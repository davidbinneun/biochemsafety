import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContentBlocks, createContentBlock, updateContentBlock } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus, Trash2, GraduationCap, Briefcase, Award, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';

export default function AboutManager() {
  const queryClient = useQueryClient();

  const { data: aboutContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'about'],
    queryFn: () => getContentBlocks({ page: 'about' }),
  });

  // Company Info
  const [companyName, setCompanyName] = useState('');
  const [companyFounder, setCompanyFounder] = useState('');
  const [fields, setFields] = useState([]);

  // Services (stored as HTML string with bullet points)
  const [servicesHtml, setServicesHtml] = useState('');

  // Professionalism (stored as HTML string with bullet points)
  const [professionalismHtml, setProfessionalismHtml] = useState('');

  // Education
  const [education, setEducation] = useState([]);

  // Default values matching the About page
  const defaultCompany = {
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
  };

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

  const defaultEducation = [
    { degree: "PHD", field: "מדעי החיים. מחקר באונקולוגיה ופרמקולוגיה", institution: "אוניברסיטת בר-אילן" },
    { degree: "MPH", field: "בריאות סביבתית וגהות תעסוקתית", institution: "אוניברסיטת חיפה" },
    { degree: "MHA", field: "ניהול מערכות בריאות ואפידמיולוגיה", institution: "אוניברסיטת בר אילן" },
    { degree: "MSC", field: "ביוכימיה", institution: "אוניברסיטת סנטה פה, ארגנטינה" },
    { degree: "הסמכה", field: "ממונה בטיחות וגהות", institution: "משרד הכלכלה זרוע עבודה, מנהל הבטיחות" }
  ];

  useEffect(() => {
    const company = aboutContent.find(c => c.section === 'company');
    if (company?.content) {
      try {
        const data = JSON.parse(company.content);
        setCompanyName(data.name || defaultCompany.name);
        setCompanyFounder(data.founder || defaultCompany.founder);
        setFields(data.fields || defaultCompany.fields);
      } catch {
        setCompanyName(defaultCompany.name);
        setCompanyFounder(defaultCompany.founder);
        setFields(defaultCompany.fields);
      }
    } else {
      setCompanyName(defaultCompany.name);
      setCompanyFounder(defaultCompany.founder);
      setFields(defaultCompany.fields);
    }

    const servicesData = aboutContent.find(c => c.section === 'services');
    if (servicesData?.content) {
      try {
        const parsed = JSON.parse(servicesData.content);
        if (Array.isArray(parsed)) {
          setServicesHtml('<ul>' + parsed.map(s => `<li>${s}</li>`).join('') + '</ul>');
        } else {
          setServicesHtml(parsed);
        }
      } catch {
        setServicesHtml('<ul>' + defaultServices.map(s => `<li>${s}</li>`).join('') + '</ul>');
      }
    } else {
      setServicesHtml('<ul>' + defaultServices.map(s => `<li>${s}</li>`).join('') + '</ul>');
    }

    const profData = aboutContent.find(c => c.section === 'professionalism');
    if (profData?.content) {
      try {
        const parsed = JSON.parse(profData.content);
        if (Array.isArray(parsed)) {
          setProfessionalismHtml('<ul>' + parsed.map(s => `<li>${s}</li>`).join('') + '</ul>');
        } else {
          setProfessionalismHtml(parsed);
        }
      } catch {
        setProfessionalismHtml('<ul>' + defaultProfessionalism.map(s => `<li>${s}</li>`).join('') + '</ul>');
      }
    } else {
      setProfessionalismHtml('<ul>' + defaultProfessionalism.map(s => `<li>${s}</li>`).join('') + '</ul>');
    }

    const eduData = aboutContent.find(c => c.section === 'education');
    if (eduData?.content) {
      try {
        setEducation(JSON.parse(eduData.content));
      } catch {
        setEducation(defaultEducation);
      }
    } else {
      setEducation(defaultEducation);
    }
  }, [aboutContent]);

  const saveMutation = useMutation({
    mutationFn: async ({ section, content }) => {
      const existing = aboutContent.find(c => c.section === section);
      if (existing) {
        return updateContentBlock(existing.id, { content: JSON.stringify(content) });
      } else {
        return createContentBlock({
          page: 'about',
          section,
          title: section,
          content: JSON.stringify(content)
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentBlocks', 'about'] });
      toast.success('נשמר בהצלחה');
    },
  });

  const saveCompany = () => {
    saveMutation.mutate({
      section: 'company',
      content: { name: companyName, founder: companyFounder, fields }
    });
  };

  const saveServices = () => {
    saveMutation.mutate({ section: 'services', content: servicesHtml });
  };

  const saveProfessionalism = () => {
    saveMutation.mutate({ section: 'professionalism', content: professionalismHtml });
  };

  const saveEducation = () => {
    saveMutation.mutate({ section: 'education', content: education });
  };

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Building2 className="w-5 h-5 text-[#8c2b60]" />
            פרטי החברה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-right">שם החברה</label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-right">מייסד/ת</label>
            <Input
              value={companyFounder}
              onChange={(e) => setCompanyFounder(e.target.value)}
              className="text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-right">תחומי עיסוק</label>
            {fields.map((field, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFields(fields.filter((_, i) => i !== idx))}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Input
                  value={field}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[idx] = e.target.value;
                    setFields(newFields);
                  }}
                  className="text-right"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFields([...fields, ''])}
              className="mt-2"
            >
              <Plus className="w-4 h-4 ml-2" />
              הוסף תחום
            </Button>
          </div>
          <Button onClick={saveCompany} disabled={saveMutation.isPending} className="bg-[#8c2b60] hover:bg-[#6B1028]">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
            {saveMutation.isPending ? 'שומר...' : 'שמור פרטי חברה'}
          </Button>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Briefcase className="w-5 h-5 text-[#8c2b60]" />
            השירותים שלנו
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500 text-right">השתמשו בכפתור הרשימה בעורך כדי ליצור נקודות</p>
          <RichTextEditor
            value={servicesHtml}
            onChange={setServicesHtml}
            height="200px"
            toolbarOptions="simple"
          />
          <Button onClick={saveServices} disabled={saveMutation.isPending} className="bg-[#8c2b60] hover:bg-[#6B1028]">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
            {saveMutation.isPending ? 'שומר...' : 'שמור שירותים'}
          </Button>
        </CardContent>
      </Card>

      {/* Professionalism */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Award className="w-5 h-5 text-[#8c2b60]" />
            מקצוענות היא העיקר
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500 text-right">השתמשו בכפתור הרשימה בעורך כדי ליצור נקודות</p>
          <RichTextEditor
            value={professionalismHtml}
            onChange={setProfessionalismHtml}
            height="200px"
            toolbarOptions="simple"
          />
          <Button onClick={saveProfessionalism} disabled={saveMutation.isPending} className="bg-[#8c2b60] hover:bg-[#6B1028]">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
            {saveMutation.isPending ? 'שומר...' : 'שמור'}
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <GraduationCap className="w-5 h-5 text-[#8c2b60]" />
            השכלה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu, idx) => (
            <Card key={idx} className="bg-gray-50">
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-right">תואר/הסמכה</label>
                  <Input
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[idx] = { ...newEdu[idx], degree: e.target.value };
                      setEducation(newEdu);
                    }}
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-right">תחום</label>
                  <Input
                    value={edu.field || ''}
                    onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[idx] = { ...newEdu[idx], field: e.target.value };
                      setEducation(newEdu);
                    }}
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-right">מוסד</label>
                  <Input
                    value={edu.institution || ''}
                    onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[idx] = { ...newEdu[idx], institution: e.target.value };
                      setEducation(newEdu);
                    }}
                    className="text-right"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEducation([...education, { degree: '', field: '', institution: '' }])}
          >
            <Plus className="w-4 h-4 ml-2" />
            הוסף השכלה
          </Button>
          <div>
            <Button onClick={saveEducation} disabled={saveMutation.isPending} className="bg-[#8c2b60] hover:bg-[#6B1028]">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
              {saveMutation.isPending ? 'שומר...' : 'שמור השכלה'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}