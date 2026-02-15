import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Link2 } from 'lucide-react';
import { createPageUrl } from '../../utils';
import { getServices } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';

const STATIC_PAGES = [
  { name: 'Home', label: 'דף הבית' },
  { name: 'About', label: 'אודות' },
  { name: 'Services', label: 'תחומי התמחות' },
  { name: 'Contact', label: 'יצירת קשר' },
];

export default function PageLinkButton({ onInsertLink }) {
  const [open, setOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');
  const [linkText, setLinkText] = useState('');

  const { data: services = [] } = useQuery({
    queryKey: ['services-for-links'],
    queryFn: () => getServices('order'),
  });

  const handleInsert = () => {
    if (!selectedPage || !linkText) return;
    
    let pageUrl;
    if (selectedPage.startsWith('service:')) {
      const slug = selectedPage.replace('service:', '');
      pageUrl = createPageUrl('ServiceDetail') + '?id=' + slug;
    } else {
      pageUrl = createPageUrl(selectedPage);
    }
    onInsertLink(linkText, pageUrl);
    
    setSelectedPage('');
    setLinkText('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="ql-page-link flex items-center justify-center w-7 h-6 hover:bg-gray-100 rounded"
          title="קישור לעמוד באתר"
        >
          <Link2 className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">הוספת קישור לעמוד באתר</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-right">בחר עמוד</label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="בחר עמוד..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__divider_pages__" disabled className="text-xs text-gray-400 font-semibold">
                  עמודים
                </SelectItem>
                {STATIC_PAGES.map((page) => (
                  <SelectItem key={page.name} value={page.name}>
                    {page.label}
                  </SelectItem>
                ))}
                {services.length > 0 && (
                  <>
                    <SelectItem value="__divider_services__" disabled className="text-xs text-gray-400 font-semibold mt-2">
                      תחומי התמחות
                    </SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={`service:${service.slug}`}>
                        {service.title}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-right">טקסט הקישור</label>
            <Input
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="למשל: לחץ כאן"
              className="text-right"
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline">ביטול</Button>
          </DialogClose>
          <Button 
            onClick={handleInsert}
            disabled={!selectedPage || !linkText}
            className="bg-[#8c2b60] hover:bg-[#6B1028]"
          >
            הוסף קישור
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}