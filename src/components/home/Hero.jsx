import React from 'react';
import { Phone, Mail, Linkedin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Hero() {
  const { data: heroContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'home', 'hero'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'home', section: 'hero' }),
  });

  const { data: contactInfo = [] } = useQuery({
    queryKey: ['contentBlocks', 'global', 'contact-info'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'global', section: 'contact-info' }),
  });

  const getContent = (title) => {
    const item = heroContent.find(c => c.title === title);
    return item?.content || '';
  };

  const getContactInfo = (key, fallback) => {
    const item = contactInfo.find(c => c.title === key);
    return item?.content || fallback;
  };

  const phone = getContactInfo('phone', '053-735-8888');
  const email = getContactInfo('email', 'blankporat@gmail.com');
  const linkedin = getContactInfo('linkedin', 'https://www.linkedin.com/in/dr-diana-blank-porat-896645111/');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-center md:text-right order-1 md:order-1">
          <h1 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900">
            {getContent('שם מלא')}
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 text-[#8B1538]">
            {getContent('שם חברה')}
          </h2>
          
          <div className="space-y-2 text-lg mb-8">
            <p className="font-semibold text-gray-800">{getContent('תפקיד 1')}</p>
            <p className="text-gray-700">{getContent('תפקיד 2')}</p>
            <p className="text-gray-700">{getContent('תפקיד 3')}</p>
            <p className="font-bold text-[#8B1538]">{getContent('תפקיד 4')}</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <Link to={createPageUrl('About')}>
              <Button className="bg-[#8B1538] hover:bg-[#6B1028] text-white">
                אודות
              </Button>
            </Link>
            <Link to={createPageUrl('Services')}>
              <Button variant="outline" className="border-[#8B1538] text-[#8B1538] hover:bg-[#8B1538] hover:text-white">
                תחומי התמחות
              </Button>
            </Link>
          </div>

          <div className="flex gap-4 justify-center md:justify-end mt-6">
            <a href={`tel:${phone}`} className="text-gray-600 hover:text-[#8B1538] transition-colors">
              <Phone className="w-5 h-5" />
            </a>
            <a href={`mailto:${email}`} className="text-gray-600 hover:text-[#8B1538] transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#8B1538] transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="order-2 md:order-2 flex justify-center">
          <img 
            src="https://www.biochemsafety.com/wp-content/uploads/2021/10/Laboratory-1.gif"
            alt="Laboratory"
            className="w-full max-w-2xl h-auto rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}