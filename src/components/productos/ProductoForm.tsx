'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Producto } from '@/lib/schemas';
import React, { useState } from 'react';

interface ProductoFormProps {
  producto?: Producto;
  onSubmit: (data: Partial<Producto>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductoForm({ producto, onSubmit, onCancel, loading }: ProductoFormProps) {
  const [formData, setFormData] = useState<Partial<Producto>>({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    codigo_barras: producto?.codigo_barras || '',
    categoria_id: producto?.categoria_id || 0,
    proveedor_id: producto?.proveedor_id || undefined,
    precio_costo: producto?.precio_costo || 0,
    precio_venta: producto?.precio_venta || 0,
    stock: producto?.stock || 0,
    stock_minimo: producto?.stock_minimo || 10,
    estado: producto?.estado || 'activo',
    imagen_url: producto?.imagen_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Producto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <Input
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Código de Barras</label>
          <Input
            value={formData.codigo_barras}
            onChange={(e) => handleChange('codigo_barras', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
          value={formData.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio Costo *</label>
          <Input
            type="number"
            step="0.01"
            value={formData.precio_costo}
            onChange={(e) => handleChange('precio_costo', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Precio Venta *</label>
          <Input
            type="number"
            step="0.01"
            value={formData.precio_venta}
            onChange={(e) => handleChange('precio_venta', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Stock *</label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock Mínimo</label>
          <Input
            type="number"
            value={formData.stock_minimo}
            onChange={(e) => handleChange('stock_minimo', parseInt(e.target.value) || 10)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : producto ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
