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

  // Page Title
  const [pageTitle, setPageTitle] = useState('');

  // Section Titles
  const [fieldsTitle, setFieldsTitle] = useState('תחומי עיסוק');
  const [servicesTitle, setServicesTitle] = useState('השירותים שלנו');
  const [professionalismTitle, setProfessionalismTitle] = useState('מקצוענות היא העיקר');
  const [educationTitle, setEducationTitle] = useState('השכלה');

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
    const pageTitleData = aboutContent.find(c => c.section === 'page-title');
    setPageTitle(pageTitleData?.content || '');

    const fieldsTitleData = aboutContent.find(c => c.section === 'fields-title');
    setFieldsTitle(fieldsTitleData?.content || 'תחומי עיסוק');

    const servicesTitleData = aboutContent.find(c => c.section === 'services-title');
    setServicesTitle(servicesTitleData?.content || 'השירותים שלנו');

    const profTitleData = aboutContent.find(c => c.section === 'professionalism-title');
    setProfessionalismTitle(profTitleData?.content || 'מקצוענות היא העיקר');

    const eduTitleData = aboutContent.find(c => c.section === 'education-title');
    setEducationTitle(eduTitleData?.content || 'השכלה');

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

  const saveRawMutation = useMutation({
    mutationFn: async ({ section, title, content }) => {
      const existing = aboutContent.find(c => c.section === section);
      if (existing) {
        return updateContentBlock(existing.id, { content });
      } else {
        return createContentBlock({ page: 'about', section, title, content });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentBlocks', 'about'] });
      toast.success('נשמר בהצלחה');
    },
  });

  const savePageTitle = () => {
    saveRawMutation.mutate({ section: 'page-title', title: 'כותרת עמוד', content: pageTitle });
  };

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
      {/* Page Title */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">כותרת עמוד אודות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextEditor
            value={pageTitle}
            onChange={setPageTitle}
            toolbarOptions="full"
          />
          <Button onClick={savePageTitle} disabled={saveRawMutation.isPending} className="bg-[#8c2b60] hover:bg-[#6B1028]">
            {saveRawMutation.isPending ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
            {saveRawMutation.isPending ? 'שומר...' : 'שמור כותרת'}
          </Button>
        </CardContent>
      </Card>

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
            <RichTextEditor
              value={companyName}
              onChange={setCompanyName}
              toolbarOptions="full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-right">מייסד/ת</label>
            <RichTextEditor
              value={companyFounder}
              onChange={setCompanyFounder}
              toolbarOptions="full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-right">כותרת תחומי עיסוק</label>
            <RichTextEditor
              value={fieldsTitle}
              onChange={setFieldsTitle}
              toolbarOptions="full"
            />
            <Button
              onClick={() => saveRawMutation.mutate({ section: 'fields-title', title: 'כותרת תחומי עיסוק', content: fieldsTitle })}
              disabled={saveRawMutation.isPending}
              size="sm"
              className="bg-[#8c2b60] hover:bg-[#6B1028] mt-2"
            >
              <Save className="w-4 h-4 ml-2" />
              שמור כותרת
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-right">תחומי עיסוק</label>
            {fields.map((field, idx) => (
              <div key={idx} className="mb-4 border rounded-lg p-3">
                <div className="flex justify-end mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFields(fields.filter((_, i) => i !== idx))}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <RichTextEditor
                  value={field}
                  onChange={(value) => {
                    const newFields = [...fields];
                    newFields[idx] = value;
                    setFields(newFields);
                  }}
                  toolbarOptions="full"
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
          <div>
            <label className="block text-sm font-medium mb-2 text-right">כותרת הסקשן</label>
            <RichTextEditor
              value={servicesTitle}
              onChange={setServicesTitle}
              toolbarOptions="full"
            />
            <Button
              onClick={() => saveRawMutation.mutate({ section: 'services-title', title: 'כותרת שירותים', content: servicesTitle })}
              disabled={saveRawMutation.isPending}
              size="sm"
              className="bg-[#8c2b60] hover:bg-[#6B1028] mt-2"
            >
              <Save className="w-4 h-4 ml-2" />
              שמור כותרת
            </Button>
          </div>
          <p className="text-sm text-gray-500 text-right">השתמשו בכפתור הרשימה בעורך כדי ליצור נקודות</p>
          <RichTextEditor
            value={servicesHtml}
            onChange={setServicesHtml}
            height="200px"
            toolbarOptions="full"
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
          <div>
            <label className="block text-sm font-medium mb-2 text-right">כותרת הסקשן</label>
            <RichTextEditor
              value={professionalismTitle}
              onChange={setProfessionalismTitle}
              toolbarOptions="full"
            />
            <Button
              onClick={() => saveRawMutation.mutate({ section: 'professionalism-title', title: 'כותרת מקצוענות', content: professionalismTitle })}
              disabled={saveRawMutation.isPending}
              size="sm"
              className="bg-[#8c2b60] hover:bg-[#6B1028] mt-2"
            >
              <Save className="w-4 h-4 ml-2" />
              שמור כותרת
            </Button>
          </div>
          <p className="text-sm text-gray-500 text-right">השתמשו בכפתור הרשימה בעורך כדי ליצור נקודות</p>
          <RichTextEditor
            value={professionalismHtml}
            onChange={setProfessionalismHtml}
            height="200px"
            toolbarOptions="full"
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
          <div>
            <label className="block text-sm font-medium mb-2 text-right">כותרת הסקשן</label>
            <RichTextEditor
              value={educationTitle}
              onChange={setEducationTitle}
              toolbarOptions="full"
            />
            <Button
              onClick={() => saveRawMutation.mutate({ section: 'education-title', title: 'כותרת השכלה', content: educationTitle })}
              disabled={saveRawMutation.isPending}
              size="sm"
              className="bg-[#8c2b60] hover:bg-[#6B1028] mt-2"
            >
              <Save className="w-4 h-4 ml-2" />
              שמור כותרת
            </Button>
          </div>
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
                  <RichTextEditor
                    value={edu.degree || ''}
                    onChange={(value) => {
                      const newEdu = [...education];
                      newEdu[idx] = { ...newEdu[idx], degree: value };
                      setEducation(newEdu);
                    }}
                    toolbarOptions="full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-right">תחום</label>
                  <RichTextEditor
                    value={edu.field || ''}
                    onChange={(value) => {
                      const newEdu = [...education];
                      newEdu[idx] = { ...newEdu[idx], field: value };
                      setEducation(newEdu);
                    }}
                    toolbarOptions="full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-right">מוסד</label>
                  <RichTextEditor
                    value={edu.institution || ''}
                    onChange={(value) => {
                      const newEdu = [...education];
                      newEdu[idx] = { ...newEdu[idx], institution: value };
                      setEducation(newEdu);
                    }}
                    toolbarOptions="full"
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