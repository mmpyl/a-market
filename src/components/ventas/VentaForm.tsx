'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Venta } from '@/lib/schemas';
import React, { useState } from 'react';

interface VentaFormProps {
  venta?: Venta;
  onSubmit: (data: Partial<Venta>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function VentaForm({ venta, onSubmit, onCancel, loading }: VentaFormProps) {
  const [formData, setFormData] = useState<Partial<Venta>>({
    numero_venta: venta?.numero_venta || '',
    cliente_nombre: venta?.cliente_nombre || '',
    total: venta?.total || 0,
    igv: venta?.igv || 0,
    estado: venta?.estado || 'pendiente',
    fecha: venta?.fecha || new Date().toISOString().split('T')[0],
    notas: venta?.notas || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Venta, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Número de Venta *</label>
          <Input
            value={formData.numero_venta}
            onChange={(e) => handleChange('numero_venta', e.target.value)}
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
        <label className="block text-sm font-medium mb-1">Nombre del Cliente</label>
        <Input
          value={formData.cliente_nombre}
          onChange={(e) => handleChange('cliente_nombre', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Total *</label>
          <Input
            type="number"
            step="0.01"
            value={formData.total}
            onChange={(e) => handleChange('total', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IGV</label>
          <Input
            type="number"
            step="0.01"
            value={formData.igv}
            onChange={(e) => handleChange('igv', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <select
          value={formData.estado}
          onChange={(e) => handleChange('estado', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="pendiente">Pendiente</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
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
          {loading ? 'Guardando...' : venta ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
