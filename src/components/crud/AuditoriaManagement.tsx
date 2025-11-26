'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { Filter, Clock } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { AuditLog } from '@/lib/schemas';

export function AuditoriaManagement() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, filtro]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '20',
        offset: String((page - 1) * 20),
        ...(filtro && { tabla: filtro }),
      });
      const data = await api.get(`/auditoria?${params.toString()}`);
      setLogs(data?.data || []);
    } catch (error) {
      toast.error('Error al cargar auditoría');
    } finally {
      setLoading(false);
    }
  };

  const getAccionColor = (accion: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      VIEW: 'bg-gray-100 text-gray-800',
    };
    return colors[accion] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'created_at' as const,
      label: 'Fecha',
      render: (value: string) => new Date(value).toLocaleString('es-PE'),
    },
    { key: 'accion' as const, label: 'Acción' },
    { key: 'tabla' as const, label: 'Tabla' },
    { key: 'registro_id' as const, label: 'ID Registro' },
    {
      key: 'usuario_id' as const,
      label: 'Usuario',
      render: (value: number) => `Usuario #${value}`,
    },
    {
      key: 'accion' as const,
      label: 'Estado',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getAccionColor(value)}`}>
          {value}
        </span>
      ),
    },
  ];

  const totalRegistros = logs.length;
  const accionesHoy = logs.filter(log => {
    const logDate = new Date(log.created_at || '').toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Acciones Hoy
            </p>
            <p className="text-2xl font-bold">{accionesHoy}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Registros</p>
            <p className="text-2xl font-bold">{totalRegistros}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Registro de Auditoría
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Filtrar por tabla (ej: ventas, productos, usuarios)..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPage(1);
            }}
          />

          <DataTable
            data={logs}
            columns={columns}
            isLoading={loading}
            actions={false}
            pagination={{
              page,
              pageSize: 20,
              total: logs.length,
              onPageChange: setPage,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['CREATE', 'UPDATE', 'DELETE'].map((accion) => {
              const count = logs.filter(log => log.accion === accion).length;
              return (
                <div key={accion} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="capitalize">{accion.toLowerCase()}</span>
                  <span className="font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
