import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Upload, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import RichTextEditor from './RichTextEditor';

export default function ServiceEditor({ service, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState(service || {
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    benefits: '',
    process: '',
    icon_url: '',
    image_url: '',
    order: 0
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm({ ...form, icon_url: file_url });
    } catch (error) {
      alert('שגיאה בהעלאת תמונה');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm({ ...form, image_url: file_url });
    } catch (error) {
      alert('שגיאה בהעלאת תמונה');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.slug || !form.short_description) {
      alert('יש למלא שם, מזהה ותיאור קצר');
      return;
    }
    onSave(form);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-right">{service?.id ? 'עריכת תחום התמחות' : 'תחום התמחות חדש'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-right">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">שם התחום *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                placeholder="למשל: בטיחות כימית"
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">מזהה (באנגלית) *</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({...form, slug: e.target.value})}
                placeholder="למשל: chemical-safety"
                className="text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">תיאור קצר (לדף הבית ורשימת התחומים) *</label>
            <RichTextEditor
              value={form.short_description || ''}
              onChange={(value) => setForm({...form, short_description: value})}
              height="150px"
              toolbarOptions="minimal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">תיאור מלא (לעמוד הפרטני)</label>
            <RichTextEditor
              value={form.full_description || ''}
              onChange={(value) => setForm({...form, full_description: value})}
              height="350px"
              toolbarOptions="full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">יתרונות (כל יתרון בשורה נפרדת)</label>
            <Textarea
              value={form.benefits}
              onChange={(e) => setForm({...form, benefits: e.target.value})}
              rows={4}
              className="text-right"
              placeholder="יתרון ראשון&#10;יתרון שני&#10;יתרון שלישי"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">תהליך העבודה</label>
            <Textarea
              value={form.process}
              onChange={(e) => setForm({...form, process: e.target.value})}
              rows={4}
              className="text-right"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">אייקון</label>
              <div className="flex items-center gap-3 justify-end">
                {form.icon_url && (
                  <img src={form.icon_url} alt="icon" className="w-16 h-16 object-contain border rounded-lg p-2" />
                )}
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'מעלה...' : 'העלה אייקון'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.icon_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm({...form, icon_url: ''})}
                  >
                    הסר
                  </Button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">סדר הצגה</label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({...form, order: parseInt(e.target.value) || 0})}
                className="text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">תמונה לתחום ההתמחות</label>
            <div className="flex items-center gap-3 justify-end flex-wrap">
              {form.image_url && (
                <img src={form.image_url} alt="תמונה" className="w-32 h-24 object-cover border rounded-lg" />
              )}
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImage ? 'מעלה...' : 'העלה תמונה'}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              {form.image_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm({...form, image_url: ''})}
                >
                  הסר
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">התמונה תוצג בעמוד תחומי ההתמחות ובעמוד הפרטני</p>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            {service?.id && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(service.id)}
                className="text-red-600 hover:text-red-700 ml-auto"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                מחק
              </Button>
            )}
            <Button onClick={onCancel} variant="outline">
              <X className="w-4 h-4 ml-2" />
              ביטול
            </Button>
            <Button onClick={handleSubmit} className="bg-[#8c2b60] hover:bg-[#6B1028]">
              <Save className="w-4 h-4 ml-2" />
              שמור
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}