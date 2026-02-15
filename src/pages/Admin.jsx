import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllContentBlocks,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
  getUserProfile
} from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, X, Plus, Trash2 } from 'lucide-react';
import ServicesManager from '../components/admin/ServicesManager';
import ContactInfoManager from '../components/admin/ContactInfoManager';
import AboutManager from '../components/admin/AboutManager';
import { signInWithGoogle } from '@/lib/supabaseClient';

export default function Admin() {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({
    page: 'home',
    section: '',
    title: '',
    content: '',
    order: 0
  });

  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => getUserProfile(user.id),
    enabled: !!user?.id,
  });

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['contentBlocks'],
    queryFn: () => getAllContentBlocks(),
    enabled: !!profile && profile.role === 'admin',
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateContentBlock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentBlocks'] });
      setEditingId(null);
      setEditForm({});
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createContentBlock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentBlocks'] });
      setShowAddForm(false);
      setNewContent({
        page: 'home',
        section: '',
        title: '',
        content: '',
        order: 0
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteContentBlock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentBlocks'] });
    },
  });

  if (isLoadingAuth || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">טוען...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-gray-600">יש להתחבר כדי לגשת לפאנל הניהול</p>
            <Button onClick={signInWithGoogle} className="bg-[#8B1538] hover:bg-[#6B1028]">
              התחבר עם Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">אין לך הרשאות גישה לדף זה</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedContents = contents
    .filter(c => c.page !== 'services' && c.page !== 'service-detail')
    .reduce((acc, content) => {
      if (!acc[content.page]) acc[content.page] = {};
      if (!acc[content.page][content.section]) acc[content.page][content.section] = [];
      acc[content.page][content.section].push(content);
      return acc;
    }, {});

  Object.keys(groupedContents).forEach(page => {
    Object.keys(groupedContents[page]).forEach(section => {
      groupedContents[page][section].sort((a, b) => (a.order || 0) - (b.order || 0));
    });
  });

  const handleEdit = (content) => {
    setEditingId(content.id);
    setEditForm(content);
  };

  const handleSave = () => {
    updateMutation.mutate({ id: editingId, data: editForm });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreate = () => {
    createMutation.mutate(newContent);
  };

  const handleDelete = (id) => {
    if (confirm('האם למחוק את התוכן?')) {
      deleteMutation.mutate(id);
    }
  };

  const pageNames = {
    home: 'דף הבית',
    about: 'אודות',
    contact: 'יצירת קשר',
    layout: 'כותרת ותחתית'
  };

  const renderContentCard = (content) => (
    <Card key={content.id}>
      <CardContent className="pt-6">
        {editingId === content.id ? (
          <div className="space-y-4">
            <Input
              value={editForm.title}
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              placeholder="כותרת"
              className="text-right"
            />
            <Textarea
              value={editForm.content}
              onChange={(e) => setEditForm({...editForm, content: e.target.value})}
              rows={4}
              className="text-right"
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={handleSave} size="sm" className="bg-[#8B1538] hover:bg-[#6B1028]">
                <Save className="w-4 h-4 ml-2" />
                שמור
              </Button>
              <Button onClick={handleCancel} size="sm" variant="outline">
                <X className="w-4 h-4 ml-2" />
                ביטול
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(content)} size="sm" variant="outline">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleDelete(content.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 text-right">
                <h4 className="font-semibold text-lg text-gray-900">{content.title}</h4>
                <p className="text-gray-600 mt-2 whitespace-pre-line">{content.content}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">פאנל ניהול</h1>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="services">תחומי התמחות</TabsTrigger>
            <TabsTrigger value="contact-info">פרטי קשר</TabsTrigger>
            <TabsTrigger value="home">דף הבית</TabsTrigger>
            <TabsTrigger value="about">אודות</TabsTrigger>
            <TabsTrigger value="contact">יצירת קשר</TabsTrigger>
            <TabsTrigger value="layout">כותרת ותחתית</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="contact-info">
            <ContactInfoManager />
          </TabsContent>

          <TabsContent value="about">
            <AboutManager />
          </TabsContent>

          {Object.keys(pageNames).filter(k => k !== 'about').map(pageKey => (
            <TabsContent key={pageKey} value={pageKey}>
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => {
                    setNewContent({ ...newContent, page: pageKey });
                    setShowAddForm(!showAddForm);
                  }}
                  className="bg-[#8B1538] hover:bg-[#6B1028]"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  הוסף תוכן
                </Button>
              </div>

              {showAddForm && newContent.page === pageKey && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-right">תוכן חדש</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-right">
                      <div>
                        <label className="block text-sm font-medium mb-2">סקשן</label>
                        <Input
                          value={newContent.section}
                          onChange={(e) => setNewContent({...newContent, section: e.target.value})}
                          placeholder="למשל: hero, footer"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">כותרת</label>
                        <Input
                          value={newContent.title}
                          onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">תוכן</label>
                        <Textarea
                          value={newContent.content}
                          onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                          rows={4}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">סדר</label>
                        <Input
                          type="number"
                          value={newContent.order}
                          onChange={(e) => setNewContent({...newContent, order: parseInt(e.target.value)})}
                          className="text-right"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button onClick={handleCreate} className="bg-[#8B1538] hover:bg-[#6B1028]">
                          <Save className="w-4 h-4 ml-2" />
                          שמור
                        </Button>
                        <Button onClick={() => setShowAddForm(false)} variant="outline">
                          <X className="w-4 h-4 ml-2" />
                          ביטול
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {groupedContents[pageKey] && Object.entries(groupedContents[pageKey]).map(([section, items]) => (
                <div key={section} className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700 text-right">{section}</h3>
                  <div className="space-y-3">
                    {items.map(renderContentCard)}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
