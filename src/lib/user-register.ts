
import CrudOperations from '@/lib/crud-operations';
import { generateAdminUserToken } from '@/lib/auth';

export async function userRegisterCallback(user: {
  id: string;
  email: string;
  role: string;
}): Promise<void> {
  try {
    const adminToken = await generateAdminUserToken();
    const profilesCrud = new CrudOperations('user_profiles', adminToken);

    // Crear perfil de usuario con rol por defecto (vendedor)
    const userProfile = {
      user_id: parseInt(user.id),
      nombre_completo: user.email.split('@')[0],
      documento_identidad: null,
      telefono: null,
      direccion: null,
      rol_sistema: 'vendedor',
      activo: true,
    };

    await profilesCrud.create(userProfile);
    console.log(`Perfil de usuario creado para ${user.id}`);
  } catch (error) {
    console.error('Error al crear perfil de usuario:', error);
  }
}
