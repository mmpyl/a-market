'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VentasManagement } from '@/components/crud/VentasManagement';
import { ShoppingCart, Receipt } from 'lucide-react';

export default function VendedorPage() {
  const [activeTab, setActiveTab] = useState('ventas');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Ventas</h1>
        <p className="text-gray-600 mt-2">Administra todas tus ventas y comprobantes</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ventas" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            Mis Ventas
          </TabsTrigger>
          <TabsTrigger value="reportes" className="gap-2">
            <Receipt className="w-4 h-4" />
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-6">
          <VentasManagement />
        </TabsContent>

        <TabsContent value="reportes" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">Módulo de reportes en desarrollo</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
