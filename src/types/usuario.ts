export interface Usuario {
  id?: number;
  email: string;
  nombre: string;
  apellido?: string;
  rol: 'administrador' | 'vendedor' | 'almacenero' | 'auditor';
  estado: 'activo' | 'inactivo';
  telefono?: string;
  created_at?: string;
  updated_at?: string;
}
