import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService, deleteService } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil } from 'lucide-react';
import ServiceEditor from './ServiceEditor';

export default function ServicesManager() {
  const [editingService, setEditingService] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices('order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setShowNew(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setEditingService(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setEditingService(null);
    },
  });

  const handleSave = (data) => {
    if (editingService?.id) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('האם למחוק את תחום ההתמחות?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">טוען...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">תחומי התמחות</h2>
        <Button
          onClick={() => { setShowNew(true); setEditingService(null); }}
          className="bg-[#8B1538] hover:bg-[#6B1028]"
        >
          <Plus className="w-4 h-4 ml-2" />
          תחום חדש
        </Button>
      </div>

      {showNew && (
        <ServiceEditor
          onSave={handleSave}
          onCancel={() => setShowNew(false)}
        />
      )}

      <div className="space-y-3">
        {services.map((service) => (
          <React.Fragment key={service.id}>
            {editingService?.id === service.id ? (
              <ServiceEditor
                service={editingService}
                onSave={handleSave}
                onCancel={() => setEditingService(null)}
                onDelete={handleDelete}
              />
            ) : (
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => { setEditingService(service); setShowNew(false); }}
                        size="sm"
                        variant="outline"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="w-12 h-12 bg-[#8B1538] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {service.icon_url ? (
                        <img src={service.icon_url} alt={service.title} className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-6 h-6 bg-[#8B1538] rounded-full opacity-30" />
                      )}
                    </div>

                    <div className="flex-1 text-right">
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{service.short_description}</p>
                    </div>

                    <div className="text-sm text-gray-400">
                      סדר: {service.order || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </React.Fragment>
        ))}

        {services.length === 0 && !showNew && (
          <div className="text-center py-12 text-gray-500">
            <p>אין תחומי התמחות עדיין</p>
            <Button
              onClick={() => setShowNew(true)}
              variant="link"
              className="text-[#8B1538]"
            >
              הוסף את התחום הראשון
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
