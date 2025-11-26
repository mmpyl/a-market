'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductosManagement } from '@/components/crud/ProductosManagement';
import { UsuariosManagement } from '@/components/crud/UsuariosManagement';
import { Settings, Users, Package } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('productos');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administración del Sistema</h1>
        <p className="text-gray-600 mt-2">Gestión centralizada de productos, usuarios y configuración</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="productos" className="gap-2">
            <Package className="w-4 h-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="gap-2">
            <Users className="w-4 h-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="configuracion" className="gap-2">
            <Settings className="w-4 h-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="space-y-6">
          <ProductosManagement />
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <UsuariosManagement />
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">Módulo de configuración en desarrollo</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
