import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear fechas
export function formatDate(date: string | Date, formatStr = 'dd/MM/yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: es });
  } catch {
    return 'Fecha inválida';
  }
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

// Formatear números
export function formatCurrency(amount: number, currency = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(value: number): string {
  return `${formatNumber(value)}%`;
}

// Formatear texto
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text: string): string {
  return text.split(' ').map(capitalize).join(' ');
}

// Formatear estados
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    pendiente: 'Pendiente',
    completada: 'Completada',
    cancelada: 'Cancelada',
    disponible: 'Disponible',
    reservado: 'Reservado',
    dañado: 'Dañado',
  };

  return statusMap[status] || capitalize(status);
}

// Formatear roles
export function formatRole(role: string): string {
  const roleMap: Record<string, string> = {
    administrador: 'Administrador',
    vendedor: 'Vendedor',
    almacenero: 'Almacenero',
    auditor: 'Auditor',
  };

  return roleMap[role] || capitalize(role);
}

// Formatear tipos de movimiento
export function formatMovementType(type: string): string {
  const typeMap: Record<string, string> = {
    entrada: 'Entrada',
    salida: 'Salida',
    ajuste: 'Ajuste',
    devolucion: 'Devolución',
  };

  return typeMap[type] || capitalize(type);
}

// Formatear tipos de comprobante
export function formatReceiptType(type: string): string {
  const typeMap: Record<string, string> = {
    factura: 'Factura',
    boleta: 'Boleta',
    nota_credito: 'Nota de Crédito',
    nota_debito: 'Nota de Débito',
  };

  return typeMap[type] || capitalize(type);
}
