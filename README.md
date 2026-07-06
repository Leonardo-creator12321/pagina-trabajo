# Game Dev Work Review

Plataforma de revision de trabajo para equipos de desarrollo de videojuegos. Permite al CEO revisar y aprobar las entregas de los desarrolladores, mientras cada desarrollador gestiona sus propias evidencias de trabajo.

## Stack Tecnologico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Backend/Auth/Storage**: Supabase
- **Despliegue**: Vercel

## Funcionalidades

- **Dashboard CEO**: Visualiza tarjetas de cada desarrollador, accede a sus entregas, y gestiona estados (Aprobado/Pendiente/Rechazado)
- **Panel de Desarrollador**: Subida de archivos (PDF, imagenes, videos), notas de texto, historial de entregas con estado
- **Autenticacion**: Login con email y contrasena via Supabase Auth
- **Subida de archivos**: Supabase Storage con bucket dedicado
- **Seguridad**: Row Level Security para que cada desarrollador solo acceda a sus propios datos
- **Tema oscuro**: Diseno limpio, responsive y orientado a game dev

## Prerrequisitos

- Node.js 18+
- npm
- Cuenta de Supabase
- Cuenta de Vercel (para despliegue)

## Configuracion Local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd pagina-trabajo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`.

## Configuracion de Supabase

### 1. Crear proyecto

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Espera a que el proyecto se inicialice completamente

### 2. Ejecutar la migracion SQL

1. En el panel de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase/migrations/001_initial_schema.sql`
3. Ejecuta la query

Esto creara:
- Tabla `profiles` (id, email, name, role, avatar_url)
- Tabla `submissions` (id, developer_id, title, description, file_url, file_type, status, created_at)
- Politicas de Row Level Security
- Bucket de Storage `work-evidence`

### 3. Configurar Storage

1. Ve a **Storage** en el panel de Supabase
2. El bucket `work-evidence` ya fue creado por la migracion
3. Si necesitas acceso publico a los archivos, configura el bucket como publico desde la configuracion del bucket

### 4. Obtener credenciales

1. Ve a **Settings > API** en tu proyecto de Supabase
2. Copia la **Project URL** (es tu `NEXT_PUBLIC_SUPABASE_URL`)
3. Copia la **anon public key** (es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 5. Crear usuarios

Crea los usuarios en **Authentication > Users** de Supabase, luego inserta los perfiles correspondientes en la tabla `profiles` usando el SQL Editor. Puedes usar el archivo `supabase/seed.sql` como referencia.

## Despliegue en Vercel

### 1. Conectar repositorio

1. Ve a [vercel.com](https://vercel.com) e inicia sesion
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub

### 2. Configurar variables de entorno

En la configuracion del proyecto en Vercel, agrega las siguientes variables de entorno:

- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave publica anonima de Supabase

### 3. Desplegar

Haz clic en "Deploy". Vercel detectara automaticamente que es un proyecto Next.js y lo configurara correctamente.

## Guia de Uso

### Flujo del CEO

1. Inicia sesion con la cuenta de CEO
2. Ve el dashboard con las tarjetas de los 4 desarrolladores
3. Haz clic en una tarjeta para ver todas las entregas de ese desarrollador
4. Revisa cada entrega (documentos, videos, capturas, notas)
5. Marca las entregas como "Aprobado" o "Pendiente" segun corresponda

### Flujo del Desarrollador

1. Inicia sesion con tu cuenta de desarrollador
2. Accede a tu panel personal
3. Usa el formulario para subir evidencias de trabajo:
   - Archivos PDF
   - Imagenes (PNG, JPG, GIF, WebP)
   - Videos (MP4, WebM)
   - Notas de texto
4. Agrega un titulo y descripcion a cada entrega
5. Revisa tu historial de entregas y su estado actual

## Estructura del Proyecto

```
pagina-trabajo/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (submissions, status)
│   │   ├── auth/             # Auth callback handler
│   │   ├── dashboard/
│   │   │   ├── ceo/          # Dashboard del CEO
│   │   │   ├── developer/    # Vista detalle de desarrollador (CEO)
│   │   │   ├── my-panel/     # Panel personal del desarrollador
│   │   │   └── page.tsx      # Redireccion segun rol
│   │   ├── login/            # Pagina de login
│   │   ├── logout/           # Ruta de logout
│   │   ├── layout.tsx        # Layout raiz
│   │   ├── loading.tsx       # Estado de carga global
│   │   ├── not-found.tsx     # Pagina 404 personalizada
│   │   └── page.tsx          # Landing page
│   ├── components/           # Componentes reutilizables
│   ├── lib/
│   │   └── supabase/         # Clientes de Supabase (server/client)
│   ├── middleware.ts         # Middleware de autenticacion
│   └── types/                # Tipos TypeScript
├── supabase/
│   ├── migrations/           # Migraciones SQL
│   └── seed.sql              # Datos de ejemplo
├── .env.local.example        # Plantilla de variables de entorno
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Licencia

Este proyecto es privado y de uso interno del equipo.
