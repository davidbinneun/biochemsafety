import React from 'react';
import { Beaker } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "@/components/ui/button";
import { getServices, getContentBlocks } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export default function ServicesGrid() {
  const { data: titleContent = [], error: titleError } = useQuery({
    queryKey: ['contentBlocks', 'home', 'services-title'],
    queryFn: () => getContentBlocks({ page: 'home', section: 'services-title' }),
  });

  const { data: services = [], isLoading, error: servicesError } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices('order'),
  });

  console.log('ServicesGrid:', { services, titleContent, isLoading, servicesError, titleError });

  const title = titleContent[0]?.content || 'תחומי התמחות';

  if (servicesError) {
    console.error('Services error:', servicesError);
  }

  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-[#4e1635]">{title}</h2>
          <div className="w-24 h-1 bg-[#8c2b60] mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300 border border-gray-100 flex flex-col"
            >
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-[#8c2b60] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon_url ? (
                    <img src={service.icon_url} alt={service.title} className="w-10 h-10 object-contain" />
                  ) : (
                    <Beaker className="w-8 h-8 text-[#8c2b60]" />
                  )}
                </div>
                <h3 className="text-lg font-bold mb-3 text-[#4e1635] min-h-[3.5rem]">{service.title}</h3>
                <div 
                  className="text-sm text-[#4e1635] leading-relaxed mb-4 prose prose-sm max-w-none [&_p]:my-1"
                  dangerouslySetInnerHTML={{ __html: service.short_description }}
                />
              </div>
              <div className="flex justify-center mt-4">
                <Link to={createPageUrl('ServiceDetail') + '?id=' + service.slug}>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">
                    קרא עוד
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={createPageUrl('Services')}>
            <Button size="lg" variant="outline" className="border-[#8c2b60] text-[#8c2b60] hover:bg-[#8c2b60] hover:text-white">
              לכל התחומים →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}