'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditoriaManagement } from '@/components/crud/AuditoriaManagement';
import { BarChart3, CheckCircle } from 'lucide-react';

export default function AuditoriaPage() {
  const [activeTab, setActiveTab] = React.useState('logs');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Auditoría del Sistema</h1>
        <p className="text-gray-600 mt-2">Revisa todos los cambios y actividades del sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Registro de Cambios
          </TabsTrigger>
          <TabsTrigger value="validacion" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Validaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <AuditoriaManagement />
        </TabsContent>

        <TabsContent value="validacion" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">Módulo de validaciones en desarrollo</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
