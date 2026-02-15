import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { getUserProfile } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from 'lucide-react';
import AboutManager from '../components/admin/AboutManager';

export default function EditAbout() {
  const { user, isLoadingAuth } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => getUserProfile(user.id),
    enabled: !!user?.id,
  });

  if (isLoadingAuth || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#4e1635] mb-4">אין הרשאת גישה</h1>
          <p className="text-gray-600 mb-6">עמוד זה זמין למנהלים בלבד</p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-[#8c2b60] hover:bg-[#6B1028]">
              חזרה לדף הבית
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to={createPageUrl('About')}>
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              צפה בעמוד
            </Button>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-[#4e1635]">עריכת עמוד אודות</h1>
            <p className="text-gray-600 mt-2">ערוך את תוכן עמוד האודות</p>
          </div>
        </div>

        <AboutManager />

        <div className="mt-8">
          <Link to={createPageUrl('Admin')}>
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="w-4 h-4" />
              חזרה לניהול
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}