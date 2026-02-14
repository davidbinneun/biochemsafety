import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Phone, Mail, MessageCircle, Linkedin } from 'lucide-react';

const contactFields = [
  { key: 'phone', label: 'טלפון', icon: Phone, placeholder: '053-735-8888' },
  { key: 'email', label: 'אימייל', icon: Mail, placeholder: 'example@gmail.com' },
  { key: 'whatsapp', label: 'וואטסאפ', icon: MessageCircle, placeholder: '053-735-8888' },
  { key: 'linkedin', label: 'לינקדאין', icon: Linkedin, placeholder: 'https://www.linkedin.com/in/...' },
];

export default function ContactInfoManager() {
  const [form, setForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: contactInfo = [], isLoading } = useQuery({
    queryKey: ['contentBlocks', 'global', 'contact-info'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'global', section: 'contact-info' }),
  });

  useEffect(() => {
    if (contactInfo.length > 0) {
      const formData = {};
      contactInfo.forEach(item => {
        formData[item.title] = { id: item.id, content: item.content };
      });
      setForm(formData);
    }
  }, [contactInfo]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ContentBlock.create(data),
    onSuccess: () => queryClient.invalidateQueries(['contentBlocks', 'global', 'contact-info']),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentBlock.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['contentBlocks', 'global', 'contact-info']),
  });

  const handleSave = async () => {
    setIsSaving(true);
    
    for (const field of contactFields) {
      const value = form[field.key]?.content || '';
      const existingId = form[field.key]?.id;

      if (existingId) {
        await updateMutation.mutateAsync({ id: existingId, data: { content: value } });
      } else if (value) {
        await createMutation.mutateAsync({
          page: 'global',
          section: 'contact-info',
          title: field.key,
          content: value,
        });
      }
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return <p className="text-gray-600">טוען...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">פרטי יצירת קשר</CardTitle>
        <p className="text-sm text-gray-500 text-right">שינויים כאן ישתקפו בכל האתר</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contactFields.map((field) => (
            <div key={field.key} className="flex items-center gap-3">
              <field.icon className="w-5 h-5 text-[#8B1538] flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-right">{field.label}</label>
                <Input
                  value={form[field.key]?.content || ''}
                  onChange={(e) => setForm({
                    ...form,
                    [field.key]: { ...form[field.key], content: e.target.value }
                  })}
                  placeholder={field.placeholder}
                  className="text-right"
                  dir="ltr"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#8B1538] hover:bg-[#6B1028]"
            >
              <Save className="w-4 h-4 ml-2" />
              {isSaving ? 'שומר...' : 'שמור'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}