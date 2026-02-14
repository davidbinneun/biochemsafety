import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServiceBySlug } from '@/lib/supabaseClient';
import { Beaker, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';

export default function ServiceDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceSlug = urlParams.get('id') ? decodeURIComponent(urlParams.get('id')) : null;

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceSlug],
    queryFn: () => getServiceBySlug(serviceSlug),
    enabled: !!serviceSlug,
  });

  // Convert absolute URLs to relative paths for internal links and remove target="_blank"
  const convertInternalLinks = (html) => {
    if (!html) return html;
    const currentHost = window.location.origin;
    // Replace absolute URLs pointing to base44 domains with relative paths
    let result = html.replace(
      /href="https?:\/\/[^"]*\.base44\.app([^"]*)"/g,
      (match, path) => `href="${currentHost}${path}"`
    );
    // Remove target="_blank" from internal links
    result = result.replace(/(<a[^>]*href="[^"]*)(")([^>]*)\s*target="_blank"([^>]*>)/g, '$1$2$3$4');
    return result;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  if (!serviceSlug || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#4e1635] mb-4">השירות לא נמצא</h1>
          <Link to={createPageUrl('Services')}>
            <Button className="bg-[#8c2b60] hover:bg-[#6B1028]">
              חזרה לתחומי התמחות
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const benefits = service.benefits?.split('\n').filter(b => b.trim()) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#83285a] to-[#55183a] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to={createPageUrl('Services')}>
            <Button variant="ghost" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה לתחומי התמחות
            </Button>
          </Link>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              {service.icon_url ? (
                <img src={service.icon_url} alt={service.title} className="w-16 h-16 object-contain" />
              ) : (
                <Beaker className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="text-right">
              <h1 className="text-4xl md:text-5xl font-bold">{service.title}</h1>
            </div>
          </div>

          {service.short_description && (
                        <div 
                          className="text-xl text-white/90 leading-relaxed max-w-4xl prose prose-invert prose-lg [&_p]:my-2 [&_*]:!text-white [&_a]:!text-white [&_a]:underline"
                          dangerouslySetInnerHTML={{ __html: convertInternalLinks(service.short_description) }}
                        />
                      )}
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">

        {service.image_url && (
          <div className="mb-8 flex justify-center">
            <img 
              src={service.image_url} 
              alt={service.title} 
              className="max-w-full h-auto rounded-3xl shadow-xl object-contain"
            />
          </div>
        )}

        {service.full_description && (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 mb-8">
            <h2 className="text-3xl font-bold text-[#8c2b60] mb-6 text-right">פירוט השירות</h2>
            <div 
              className="text-[#4e1635] text-lg leading-relaxed text-right prose prose-lg max-w-none prose-headings:text-[#4e1635] prose-ul:list-disc prose-ul:pr-6 prose-ol:list-decimal prose-ol:pr-6 [&_ul]:list-disc [&_ul]:pr-6 [&_ol]:list-decimal [&_ol]:pr-6 [&_a]:text-[#8c2b60] [&_a]:font-bold [&_a]:no-underline [&_a:hover]:underline [&_*]:!text-[#4e1635]"
              dangerouslySetInnerHTML={{ __html: convertInternalLinks(service.full_description) }}
            />
          </div>
        )}

        {benefits.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 mb-8">
            <h2 className="text-3xl font-bold text-[#8c2b60] mb-6 text-right">יתרונות</h2>
            <div className="space-y-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 text-right">
                  <span className="text-[#8c2b60] text-xl flex-shrink-0">•</span>
                  <p className="text-[#4e1635] text-lg leading-relaxed">{benefit.replace(/^[•\-]\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.process && (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 mb-8">
            <h2 className="text-3xl font-bold text-[#8c2b60] mb-6 text-right">תהליך העבודה</h2>
            <div className="text-[#4e1635] text-lg leading-relaxed whitespace-pre-line text-right">
              {service.process}
            </div>
          </div>
        )}


        </div>
      </div>
    </div>
  );
}