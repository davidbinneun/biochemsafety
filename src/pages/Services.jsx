import React from 'react';
import { Beaker } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";

export default function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('order'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-[#4e1635]">תחומי התמחות</h1>
          <p className="text-xl text-gray-700">שירותים מקצועיים לבטיחות ובריאות תעסוקתית</p>
        </div>

        <div className="space-y-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:border-[#8B1538]/30 transition-all">
              <div className="flex flex-col md:flex-row gap-6 text-right">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#8c2b60] bg-opacity-10 rounded-2xl flex items-center justify-center">
                        {service.icon_url ? (
                          <img src={service.icon_url} alt={service.title} className="w-12 h-12 object-contain" />
                        ) : (
                          <Beaker className="w-10 h-10 text-[#8c2b60]" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4 text-[#4e1635]">{service.title}</h2>
                    <div 
                          className="text-[#4e1635] leading-relaxed mb-6 prose prose-sm max-w-none [&_*]:!text-[#4e1635]"
                          dangerouslySetInnerHTML={{ __html: service.short_description }}
                        />

                    <div className="flex justify-start">
                      <Link to={createPageUrl('ServiceDetail') + '?id=' + encodeURIComponent(service.slug)}>
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                          קרא עוד
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}