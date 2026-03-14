import React from 'react';
import { getContentBlocks } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export default function Banner() {
  const { data: bannerContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'home', 'banner'],
    queryFn: () => getContentBlocks({ page: 'home', section: 'banner' }),
  });

  const content = bannerContent[0]?.content || '';
  const strippedContent = content.replace(/<[^>]*>/g, '').trim();

  if (!strippedContent) return null;

  return (
    <div className="w-full bg-[#8B1538] text-white">
      <div
        className="max-w-7xl mx-auto px-4 py-3 text-center prose prose-sm prose-invert max-w-none [&_p]:my-0 [&_img]:inline-block [&_img]:my-1 [&_img]:max-h-16 [&_a]:text-white [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
