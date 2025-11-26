'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventarioManagement } from '@/components/crud/InventarioManagement';
import { Package, TrendingDown } from 'lucide-react';

export default function AlmacenPage() {
  const [activeTab, setActiveTab] = useState('inventario');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Almacén</h1>
        <p className="text-gray-600 mt-2">Controla tu inventario y movimientos de stock</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventario" className="gap-2">
            <Package className="w-4 h-4" />
            Inventario
          </TabsTrigger>
          <TabsTrigger value="movimientos" className="gap-2">
            <TrendingDown className="w-4 h-4" />
            Movimientos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventario" className="space-y-6">
          <InventarioManagement />
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">Módulo de movimientos de inventario en desarrollo</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
