import React from 'react';
import { Phone, Mail, MessageCircle, Linkedin } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function ContactSection() {
  const { data: titleContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'home', 'contact-title'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'home', section: 'contact-title' }),
  });

  const { data: subtitleContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'home', 'contact-subtitle'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'home', section: 'contact-subtitle' }),
  });

  const { data: contactInfo = [] } = useQuery({
    queryKey: ['contentBlocks', 'global', 'contact-info'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'global', section: 'contact-info' }),
  });

  const getContactInfo = (key, fallback) => {
    const item = contactInfo.find(c => c.title === key);
    return item?.content || fallback;
  };

  const phone = getContactInfo('phone', '053-735-8888');
  const email = getContactInfo('email', 'blankporat@gmail.com');
  const whatsapp = getContactInfo('whatsapp', '053-735-8888');
  const linkedin = getContactInfo('linkedin', 'https://www.linkedin.com/in/dr-diana-blank-porat-896645111/');

  const title = titleContent[0]?.content || 'יצירת קשר';
  const subtitle = subtitleContent[0]?.content || 'נשמח לעמוד לשירותכם ולענות על כל שאלה';

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-[#8B1538] to-[#6B1028] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg opacity-90">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B1538] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">טלפון</p>
                  <a href={`tel:${phone}`} className="text-xl font-semibold hover:underline">{phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B1538] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">אימייל</p>
                  <a href={`mailto:${email}`} className="text-lg font-semibold hover:underline break-all">{email}</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B1538] bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">WhatsApp</p>
                  <a href={`https://wa.me/${whatsapp.replace(/-/g, '').replace(/^0/, '972')}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">שלח הודעה</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B1538] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">LinkedIn</p>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">פרופיל מקצועי</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="h-full flex flex-col justify-center text-right">
              <h3 className="text-2xl font-bold mb-4">ד"ר דיאנה בלנק-פורת</h3>
              <p className="text-xl font-semibold mb-4 opacity-95">BioChem Safety & Health</p>
              <div className="space-y-3 text-lg">
                <p className="opacity-90">ביוכימאית בכירה</p>
                <p className="opacity-90">מוסמכת בריאות תעסוקתית וסביבתית</p>
                <p className="opacity-90">ממונה בטיחות וגהות בעבודה</p>
                <p className="font-bold">הסמכת נאמני בטיחות</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}