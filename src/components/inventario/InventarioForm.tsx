'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Inventario } from '@/lib/schemas';
import React, { useState } from 'react';

interface InventarioFormProps {
  inventario?: Inventario;
  onSubmit: (data: Partial<Inventario>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function InventarioForm({ inventario, onSubmit, onCancel, loading }: InventarioFormProps) {
  const [formData, setFormData] = useState<Partial<Inventario>>({
    producto_id: inventario?.producto_id || 0,
    tipo_movimiento: inventario?.tipo_movimiento || 'entrada',
    cantidad: inventario?.cantidad || 0,
    fecha: inventario?.fecha || new Date().toISOString().split('T')[0],
    notas: inventario?.notas || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Inventario, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Producto ID *</label>
          <Input
            type="number"
            value={formData.producto_id}
            onChange={(e) => handleChange('producto_id', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Movimiento</label>
          <select
            value={formData.tipo_movimiento}
            onChange={(e) => handleChange('tipo_movimiento', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad *</label>
          <Input
            type="number"
            value={formData.cantidad}
            onChange={(e) => handleChange('cantidad', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha *</label>
          <Input
            type="date"
            value={formData.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
          value={formData.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : inventario ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
