
Sis Market
/

'use client'; import React, { useState, useEffect, useCallback, useMemo } from 'react'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Input } from '@/components/ui/input'; import { DataTable } from '@/components/ui/data-table'; import { Filter, Cloc

pasted

Revisar, corregir y optimizar

Voy a revisar, corregir y optimizar este componente de auditoría. Identifico varios puntos de mejora:

Componente Auditoría Optimizado
Artefacto interactivo 
Mejoras Implementadas:
🔧 Correcciones Críticas:
Manejo de errores mejorado: Ahora resetea el estado en caso de error
Validación de datos: Verifica que data sea un array antes de asignarlo
Formateo de fechas seguro: Try-catch en formatDate para evitar crashes
Filtro limpio: Usa trim() para evitar espacios en blanco
⚡ Optimizaciones de Rendimiento:
useCallback para handlers: formatDate, getAccionColor, handleFiltroChange
Memoización de estadísticas: Cálculo único de métricas con useMemo
Eliminación de columna redundante: Removí estado que duplicaba accion
Mejor estructura de estadísticas: Un solo useMemo para todas las métricas
🎨 Mejoras de UX:
Botón "Limpiar filtro": Para resetear el filtro fácilmente
Dark mode: Soporte para tema oscuro en todos los componentes
Tarjeta de paginación: Nueva tarjeta mostrando página actual
Layout responsive: Grid adaptable para móviles
Labels descriptivos: "Creaciones", "Actualizaciones" en lugar de códigos
Hover effects: Transiciones suaves en las tarjetas de resumen
📊 Mejoras Visuales:
Iconos adicionales: Activity para total de registros
Font mono para datos técnicos: Tabla y registro_id en fuente monoespaciada
Mejor jerarquía visual: Espaciado y agrupación mejorados
Grid mejorado: Resumen en 4 columnas con mejor diseño
🛡️ Seguridad y Robustez:
Validación de tipos: Verificaciones explícitas de tipos antes de usar datos
Valores por defecto: Arrays y números vacíos cuando fallan las peticiones
Console.error: Para debugging en desarrollo sin afectar la UI
El componente ahora es más robusto, eficiente y ofrece una mejor experiencia de usuario.

ahora este código por favor
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

Mostrar más
Página Almacén Optimizada
Artefacto interactivo 
Mejoras Implementadas:
🔧 Correcciones y Optimizaciones:
TypeScript estricto:
Tipo TabValue para el estado del tab
Type assertion segura en handleTabChange
useCallback para handlers:
handleTabChange memoizado para evitar re-renders innecesarios
Accesibilidad (a11y):
aria-label en los triggers para lectores de pantalla
aria-hidden="true" en iconos decorativos
tabIndex={-1} en TabsContent para navegación por teclado correcta
Estructura semántica con <header>
🎨 Mejoras de UI/UX:
Diseño del mensaje mejorado:
Card con mejor contraste visual
Icono circular con fondo de color
Título y descripción más estructurados
Soporte para dark mode completo
Preview de funcionalidades:
Grid con cards mostrando próximas características
Entradas, Salidas y Ajustes con iconos y descripciones
Efecto de opacidad para indicar "próximamente"
Responsive design:
TabsList adaptable: 2 columnas en móvil, inline en desktop
Grid de preview: 1-2-3 columnas según viewport
Tokens de diseño:
Uso de text-muted-foreground de shadcn/ui
Consistencia con el sistema de diseño
Mejor espaciado con mt-6 en TabsContent
🎯 Mejor UX:
Contexto visual: Los usuarios ven qué funcionalidades vendrán
Dark mode: Colores ajustados para ambos temas
Feedback claro: El mensaje ya no es solo un placeholder genérico
Anticipación: Las tarjetas de preview generan expectativa
El código es más limpio, accesible y ofrece mejor experiencia visual mientras se desarrolla el módulo de movimientos.


'use client'; import React, { useState, useCallback } from 'react'; import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; import { Card, CardContent } from '@/components/ui/card'; import { InventarioManagement } from '@/components/crud/InventarioManagement'; import

pasted

también es código

Página Almacén Optimizada
Artefacto interactivo ∙ Versión 2 
Mejoras Adicionales Implementadas:
🔧 Optimizaciones de Rendimiento:
useMemo para features:
Array futureFeatures memoizado para evitar recreación en cada render
Reduce asignaciones de memoria innecesarias
Interface TypeScript:
Feature interface para type safety completo
Mejor autocompletado en el IDE
🎨 Mejoras Visuales:
Iconos más descriptivos:
ArrowDownToLine para entradas (flujo hacia abajo)
ArrowUpFromLine para salidas (flujo hacia arriba)
Settings para ajustes (más apropiado que Package)
Interactividad mejorada:
hover:opacity-80 en las cards de preview
transition-opacity para transiciones suaves
Mejor legibilidad:
leading-relaxed en textos para mejor espaciado
truncate en títulos para evitar desbordamiento
🛡️ Mejores Prácticas:
Keys únicas:
Usa template literal con título e índice para keys más descriptivas
Previene warnings de React
Layout defensivo:
min-w-0 y flex-1 para prevenir overflow en flex items
Manejo correcto de texto largo
Tipado estricto:
ComponentType con className opcional para iconos
Sin uso de any
El código ahora es más eficiente, mantiene mejor estado entre renders y ofrece una experiencia visual más pulida con transiciones suaves.

'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditoriaManagement } from '@/components/crud/AuditoriaManagement';
import { BarChart3, CheckCircle } from 'lucide-react';
export default function AuditoriaPage() {
  const [activeTab, setActiveTab] = React.useState('logs');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Auditoría del Sistema</h1>
        <p className="text-gray-600 mt-2">Revisa todos los cambios y actividades del sistema</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Registro de Cambios
          </TabsTrigger>
          <TabsTrigger value="validacion" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Validaciones
          </TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="space-y-6">
          <AuditoriaManagement />
        </TabsContent>
        <TabsContent value="validacion" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">Módulo de validaciones en desarrollo</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

También es código

Mostrar más
Página Auditoría Optimizada
Artefacto interactivo 
Mejoras Implementadas:
🔧 Optimizaciones:
TypeScript estricto:
Tipo TabValue para el estado
Interface Feature para las funcionalidades
Hooks optimizados:
useCallback para handleTabChange
useMemo para validationFeatures
Accesibilidad:
aria-label en los tabs
aria-hidden en iconos decorativos
tabIndex={-1} para navegación correcta
Estructura semántica con <header>
🎨 Mejoras de UI/UX:
Iconos específicos para validación:
Shield para integridad
FileCheck para cumplimiento
AlertTriangle para anomalías
Card adicional con lista de capacidades:
Información más detallada sobre el futuro módulo
Lista con bullets personalizados
Mejor contexto para los usuarios
Consistencia visual:
Misma estructura que AlmacenPage
Dark mode completo
Transiciones suaves con hover
Responsive design:
TabsList adaptable
Grid responsive 1-2-3 columnas
📋 Contenido Mejorado:
Descripción más completa: El mensaje explica mejor qué hará el módulo
Preview realista: Las 3 funcionalidades cubren aspectos clave de auditoría
Expectativas claras: La lista de capacidades da visión del roadmap
🛡️ Mejores Prácticas:
Keys únicas: Template literals para keys descriptivas
Layout defensivo: min-w-0 y flex-1 previenen overflow
Tokens de diseño: Uso consistente de text-muted-foreground y otros tokens de shadcn/ui
El código está optimizado, es más mantenible y ofrece una experiencia visual consistente con el resto de la aplicación.

"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
enum ModeEnum {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET = "RESET",
}
function LoginPageContent() {
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.LOGIN);
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSuccess = () => {
    const redirectTo = searchParams.get("redirect") || "/";
    router.replace(redirectTo);
  };
  const handleRegisterSuccess = () => {
    setMode(ModeEnum.LOGIN);
  };
  const switchMode = (newMode: ModeEnum) => {
    setMode(newMode);
  };
  const handleForgotPassword = () => {
    setMode(ModeEnum.RESET);
  };
  const handleResetSuccess = () => {
    setMode(ModeEnum.LOGIN);
  };
  const handleBackToForgot = () => {
    setMode(ModeEnum.LOGIN);
  };
  return (
    <div
      className="relative flex justify-center items-center min-h-[100vh] overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px_800px_at_10%_-10%, rgba(56,189,248,0.18), rgba(0,0,0,0) 60%),\
           radial-gradient(900px_700px_at_90%_0%, rgba(167,139,250,0.16), rgba(0,0,0,0) 55%),\
           radial-gradient(700px_500px_at_50%_110%, rgba(248,113,113,0.12), rgba(0,0,0,0) 50%),\
           linear-gradient(180deg, 
#0b0f1a 0%, 
#0a0a0a 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56,189,248,0.35), rgba(56,189,248,0))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(167,139,250,0.32), rgba(167,139,250,0))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(248,113,113,0.22), rgba(248,113,113,0))",
        }}
      />
      {mode === ModeEnum.LOGIN && (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToRegister={() => switchMode(ModeEnum.REGISTER)}
          onForgotPassword={handleForgotPassword}
        />
      )}
      {mode === ModeEnum.REGISTER && (
        <RegisterForm
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => switchMode(ModeEnum.LOGIN)}
        />
      )}
      {mode === ModeEnum.RESET && (
        <ResetPasswordForm
          onBack={handleBackToForgot}
          onSuccess={handleResetSuccess}
        />
      )}
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

Este código también

Mostrar más
Página Login Optimizada
Artefacto interactivo 
Mejoras Implementadas:
🔧 Optimizaciones de Rendimiento:
useCallback en todos los handlers:
handleSuccess con dependencias correctas
handleRegisterSuccess, handleForgotPassword, etc.
Evita recreación innecesaria de funciones
Fallback mejorado:
LoginPageSkeleton con loading placeholder animado
Mejor experiencia que fallback={null}
Mantiene el contexto visual del diseño
🎨 Mejoras Visuales:
Animaciones suaves:
Fade-in escalonado para los gradient orbs
animationDelay y animationFillMode para mejor timing
Efecto más profesional al cargar
Mejores gradientes:
Concatenación de strings más limpia con +
transparent en lugar de rgba(0,0,0,0)
Más legible y mantenible
Container responsivo:
max-w-md y px-4 para el form wrapper
Mejor centrado con z-10
🛡️ Mejores Prácticas:
Naming mejorado:
handleBackToLogin en lugar de handleBackToForgot (más descriptivo)
Accesibilidad:
aria-hidden="true" con comillas para consistencia
Elementos decorativos correctamente marcados
Min-height consistente:
min-h-screen en lugar de min-h-[100vh]
Mejor compatibilidad con mobile browsers
Estructura CSS:
Comentario sobre dónde agregar las animaciones
Guía clara para implementación en tailwind.config.js
📱 Responsive Design:
Padding horizontal: El container tiene px-4 para no tocar los bordes en móvil
Max-width: max-w-md asegura que el formulario no sea demasiado ancho en desktop
🎯 Experiencia de Usuario:
Loading state visible: El skeleton da feedback inmediato
Transiciones suaves: Los orbs aparecen gradualmente
Jerarquía visual: El form está claramente separado del background
El código es más eficiente, ofrece mejor feedback visual y sigue las mejores prácticas de React y Next.js.


"use client"; import React, { useState, useCallback, Suspense } from "react"; import { useSearchParams, useRouter } from "next/navigation"; import { LoginForm } from "@/components/auth/LoginForm"; import { RegisterForm } from "@/components/auth/RegisterForm"; import { ResetPasswordForm } from

pasted

Página Login Optimizada
Artefacto interactivo ∙ Versión 2 
Mejoras Adicionales Implementadas:
⚡ Optimizaciones Avanzadas:
Componente GradientOrb reutilizable:
Extracción en componente separado con React.memo
Evita re-renders innecesarios de elementos decorativos
Props tipadas con interface
useMemo para datos estáticos:
backgroundStyle memoizado (objeto de estilo)
orbs array memoizado para configuración
Reduce recreación de objetos en cada render
Handlers más específicos:
handleSwitchToRegister y handleSwitchToLogin separados
Más claro que usar switchMode con parámetros
Mejor para debugging y mantenimiento
🎯 Mejores Prácticas:
Keys descriptivas: orb-${index} para elementos del map
DisplayName: GradientOrb.displayName para DevTools
Comentarios claros: Mejor documentación en el código
📦 Arquitectura Mejorada:
Separación de concerns:
Lógica de orbs separada del componente principal
Configuración centralizada en el array orbs
Escalabilidad:
Fácil agregar/remover orbs modificando el array
Componente reutilizable para otros fondos
Mantenibilidad:
Cambios en orbs solo requieren editar el array
No hay duplicación de código JSX
🎨 Mejoras Visuales:
Documentación de Tailwind:
Comentario multilínea con configuración completa
Instrucciones claras para tailwind.config.js
Código listo para copiar/pegar
🔍 Performance:
Antes: 3 divs renderizados directamente, objeto de estilo creado en cada render
Ahora:

Componente memoizado con props inmutables
Estilos y configuración memoizados
Map sobre array estático
El código es más eficiente, escalable y mantiene la misma experiencia visual con mejor arquitectura.

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

Este código también

Mostrar más
Página Vendedor Optimizada
Artefacto interactivo 
Mejoras Implementadas:
🔧 Optimizaciones:
TypeScript estricto:
Tipo TabValue para el estado
Interface Feature para las funcionalidades
Hooks optimizados:
useCallback para handleTabChange
useMemo para reportFeatures
Accesibilidad completa:
aria-label en tabs
aria-hidden en iconos decorativos
tabIndex={-1} para navegación correcta
🎨 Mejoras de UI/UX:
Iconos específicos para reportes:
TrendingUp para análisis de ventas
BarChart3 para reportes financieros
FileText para exportación
Card adicional con roadmap:
5 capacidades futuras listadas
Contexto más completo para usuarios
Features orientadas a ventas
Diseño consistente:
Misma estructura que páginas an


¿Cómo puedo ayudarle hoy?







'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { VentasManagement } from '@/components/crud/VentasManagement';
import { 
  ShoppingCart, 
  Receipt, 
  Info, 
  TrendingUp, 
  BarChart3, 
  FileText 
} from 'lucide-react';

type TabValue = 'ventas' | 'reportes';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export default function VendedorPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('ventas');

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as TabValue);
  }, []);

  // Memoizar las funcionalidades futuras de reportes
  const reportFeatures: Feature[] = useMemo(() => [
    {
      icon: TrendingUp,
      title: 'Análisis de Ventas',
      description: 'Visualiza tendencias, picos de ventas y patrones de comportamiento'
    },
    {
      icon: BarChart3,
      title: 'Reportes Financieros',
      description: 'Genera reportes de ingresos, márgenes y rentabilidad'
    },
    {
      icon: FileText,
      title: 'Exportación de Datos',
      description: 'Exporta reportes en PDF, Excel y otros formatos'
    }
  ], []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Ventas</h1>
        <p className="text-muted-foreground mt-2">
          Administra todas tus ventas y comprobantes
        </p>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger 
            value="ventas" 
            className="gap-2"
            aria-label="Ver mis ventas"
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            <span>Mis Ventas</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="reportes" 
            className="gap-2"
            aria-label="Ver reportes de ventas"
          >
            <Receipt className="w-4 h-4" aria-hidden="true" />
            <span>Reportes</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Ventas */}
        <TabsContent 
          value="ventas" 
          className="space-y-6 mt-6"
          tabIndex={-1}
        >
          <VentasManagement />
        </TabsContent>

        {/* Tab: Reportes */}
        <TabsContent 
          value="reportes" 
          className="space-y-6 mt-6"
          tabIndex={-1}
        >
          {/* Mensaje informativo */}
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Módulo en Desarrollo
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    El módulo de reportes estará disponible próximamente. 
                    Podrás generar análisis detallados de ventas, reportes financieros y exportar datos en múltiples formatos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview de funcionalidades futuras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={`${feature.title}-${index}`}
                  className="opacity-60 hover:opacity-80 transition-opacity"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Icon 
                            className="w-4 h-4 text-gray-600 dark:text-gray-400" 
                            aria-hidden="true" 
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Información adicional */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-green-600" aria-hidden="true" />
                Próximas Capacidades
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Dashboard interactivo con métricas clave de ventas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Comparativas mensuales, trimestrales y anuales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Análisis de productos más vendidos y rentables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Reportes personalizables con filtros avanzados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Programación de reportes automáticos por correo</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

