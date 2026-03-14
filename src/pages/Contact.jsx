import React from 'react';
import { Phone, Mail, MessageCircle, Linkedin, Clock } from 'lucide-react';
import { getContentBlocks } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';

export default function Contact() {
  const { data: contactInfo = [] } = useQuery({
    queryKey: ['contentBlocks', 'global', 'contact-info'],
    queryFn: () => getContentBlocks({ page: 'global', section: 'contact-info' }),
  });

  const { data: contactPageContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'contact'],
    queryFn: () => getContentBlocks({ page: 'contact' }),
  });

  const getContactInfo = (key, fallback) => {
    const item = contactInfo.find(c => c.title === key);
    return item?.content || fallback;
  };

  const getPageContent = (section, fallback) => {
    const item = contactPageContent.find(c => c.section === section);
    return item?.content || fallback;
  };

  const phone = getContactInfo('phone', '053-735-8888');
  const email = getContactInfo('email', 'blankporat@gmail.com');
  const whatsapp = getContactInfo('whatsapp', '053-735-8888');
  const linkedin = getContactInfo('linkedin', 'https://www.linkedin.com/in/dr-diana-blank-porat-896645111/');

  const pageTitle = getPageContent('page-title', 'יצירת קשר');
  const pageSubtitle = getPageContent('page-subtitle', 'נשמח לעמוד לשירותכם ולענות על כל שאלה');
  const contactDetailsTitle = getPageContent('contact-details-title', 'פרטי התקשרות');
  const businessHours = getPageContent('business-hours', 'ראשון - חמישי: 9:00 - 18:00');
  const aboutSectionHtml = getPageContent('about-section', '');

  const defaultAboutHtml = `<h3 class="text-xl font-semibold text-[#8c2b60]">ד"ר דיאנה בלנק-פורת</h3>
<p>ביוכימאית בכירה עם ניסיון רב בתחומי הבטיחות והבריאות התעסוקתית.</p>
<p>מוסמכת בריאות תעסוקתית וסביבתית, ממונה בטיחות וגהות בעבודה.</p>
<p><strong>התמחויות:</strong></p>
<ul><li>בטיחות כימית וביולוגית</li><li>גהות תעסוקתית</li><li>הסמכת נאמני בטיחות</li><li>ניהול בטיחות ואיכות</li></ul>`;

  const aboutHtml = aboutSectionHtml || defaultAboutHtml;

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-5xl font-bold mb-6 text-[#4e1635] prose max-w-none [&_p]:my-0 [&_*]:!text-[#4e1635]" dangerouslySetInnerHTML={{ __html: pageTitle }} />
          <div className="text-xl text-gray-700 prose max-w-none [&_p]:my-0" dangerouslySetInnerHTML={{ __html: pageSubtitle }} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-2xl font-bold mb-8 text-[#4e1635] text-right prose max-w-none [&_p]:my-0 [&_*]:!text-[#4e1635]" dangerouslySetInnerHTML={{ __html: contactDetailsTitle }} />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#8c2b60] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-[#8c2b60]" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm text-gray-600 mb-1">טלפון</p>
                  <a href={`tel:${phone}`} className="text-xl font-semibold text-[#4e1635] hover:text-[#8c2b60] transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#8c2b60] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-7 h-7 text-[#8c2b60]" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm text-gray-600 mb-1">אימייל</p>
                  <a href={`mailto:${email}`} className="text-lg font-semibold text-[#4e1635] hover:text-[#8c2b60] transition-colors break-all">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#8c2b60] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-7 h-7 text-[#8c2b60]" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm text-gray-600 mb-1">WhatsApp</p>
                  <a href={`https://wa.me/${whatsapp.replace(/-/g, '').replace(/^0/, '972')}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-[#4e1635] hover:text-[#8c2b60] transition-colors">
                    שלח הודעה בוואטסאפ
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#8c2b60] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-7 h-7 text-[#8c2b60]" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-[#4e1635] hover:text-[#8c2b60] transition-colors">
                    פרופיל מקצועי
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#8c2b60] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-7 h-7 text-[#8c2b60]" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm text-gray-600 mb-1">שעות פעילות</p>
                  <div className="text-lg font-semibold text-[#4e1635] prose prose-sm max-w-none [&_p]:my-0" dangerouslySetInnerHTML={{ __html: businessHours }} />
                </div>
              </div>
              </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-[#4e1635] text-right">אודות</h2>
            <div
              className="text-right text-gray-700 prose prose-lg max-w-none [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#8c2b60] [&_ul]:space-y-2 [&_li]:text-gray-700 [&_strong]:text-[#4e1635]"
              dangerouslySetInnerHTML={{ __html: aboutHtml }}
            />
                </div>
                </div>
      </div>
    </div>
  );
}
