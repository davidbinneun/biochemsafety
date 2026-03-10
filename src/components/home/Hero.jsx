import React from 'react';

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { getContentBlocks } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export default function Hero() {
  const { data: heroContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'home', 'hero'],
    queryFn: () => getContentBlocks({ page: 'home', section: 'hero' }),
  });

  const getContent = (title) => {
    const item = heroContent.find(c => c.title === title);
    return item?.content || '';
  };

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
            <div className="font-semibold text-gray-800" dangerouslySetInnerHTML={{ __html: getContent('תפקיד 1') }} />
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: getContent('תפקיד 2') }} />
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: getContent('תפקיד 3') }} />
            <div className="font-bold text-[#8B1538]" dangerouslySetInnerHTML={{ __html: getContent('תפקיד 4') }} />
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

        </div>

        {/* Image */}
        <div className="order-2 md:order-2 flex justify-center">
          <img 
            src="https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/biochemsafety/Laboratory-1.gif"
            alt="Laboratory"
            className="w-full max-w-2xl h-auto rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}