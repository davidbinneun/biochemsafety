import React from 'react';
import { Phone, Mail, MessageCircle, Linkedin, MapPin, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getContentBlocks } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';

export default function Contact() {
  const { data: contactInfo = [] } = useQuery({
    queryKey: ['contentBlocks', 'global', 'contact-info'],
    queryFn: () => getContentBlocks({ page: 'global', section: 'contact-info' }),
  });

  const getContactInfo = (key, fallback) => {
    const item = contactInfo.find(c => c.title === key);
    return item?.content || fallback;
  };

  const phone = getContactInfo('phone', '053-735-8888');
  const email = getContactInfo('email', 'blankporat@gmail.com');
  const whatsapp = getContactInfo('whatsapp', '053-735-8888');
  const linkedin = getContactInfo('linkedin', 'https://www.linkedin.com/in/dr-diana-blank-porat-896645111/');
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-[#4e1635]">יצירת קשר</h1>
          <p className="text-xl text-gray-700">נשמח לעמוד לשירותכם ולענות על כל שאלה</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 text-[#4e1635] text-right">פרטי התקשרות</h2>
            
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
                  <p className="text-lg font-semibold text-[#4e1635]">
                    ראשון - חמישי: 9:00 - 18:00
                  </p>
                </div>
              </div>
              </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-[#4e1635] text-right">אודות</h2>
            <div className="space-y-4 text-right">
              <h3 className="text-xl font-semibold text-[#8c2b60]">ד"ר דיאנה בלנק-פורת</h3>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">ביוכימאית בכירה עם ניסיון רב בתחומי הבטיחות והבריאות התעסוקתית.</p>
                <p className="leading-relaxed">מוסמכת בריאות תעסוקתית וסביבתית, ממונה בטיחות וגהות בעבודה.</p>
                <p className="font-semibold text-[#4e1635]">התמחויות:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B1538] mt-1">•</span>
                    <span>בטיחות כימית וביולוגית</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B1538] mt-1">•</span>
                    <span>גהות תעסוקתית</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B1538] mt-1">•</span>
                    <span>הסמכת נאמני בטיחות</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B1538] mt-1">•</span>
                    <span>ניהול בטיחות ואיכות</span>
                  </li>
                </ul>
                </div>
                </div>
                </div>
                </div>
      </div>
    </div>
  );
}