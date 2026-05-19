# 🚀 Next.js Auth RBAC

Sistema de autenticación seguro con Control de Acceso Basado en Roles (RBAC) implementado en Next.js 16 con App Router, JWT httpOnly cookies y sesiones persistidas en PostgreSQL.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat&logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat&logo=prisma)](https://prisma.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)
[![Status](https://img.shields.io/badge/Status-En%20Desarrollo-orange?style=flat)](#)

---

## ✨ Características

- **Autenticación JWT + Sesiones en BD**: Token JWT firmado almacenado en cookie httpOnly, con sesión activa en PostgreSQL para revocación instantánea
- **Triple Validación**: Cada request verifica JWT válido + sesión activa en BD + usuario activo
- **Protección de Rutas**: Layouts con redirect automático según estado de sesión y rol
- **RBAC (Control de Acceso Basado en Roles)**: Dos roles nativos (ADMIN, USER) con rutas diferenciadas
- **Validación con Zod**: Esquemas de validación en el servidor y cliente con mensajes de error específicos
- **Seguridad contra Timing Attacks**: Mensajes de error genéricos en login para evitar enumeración de usuarios
- **Soft Delete**: Campo `isActive` en usuarios para suspensión sin eliminación física
- **UI Components**: Componentes shadcn/ui con variantes responsivas (ghost, outline, default, etc.)
- **Toast Notifications**: Sistema de notificaciones con Sonner posicionables
- **Logger Consola**: Utilidad centralizada de logging para debugging en desarrollo

---

## 🏗️ Arquitectura

```
src/
├── app/                              # Next.js App Router (Route Groups)
│   ├── (routes)/                     # Grupo de rutas con naming convention
│   │   ├── (public)/                 # Rutas públicas (sin protección)
│   │   │   ├── (auth)/               # Auth: login, register
│   │   │   │   ├── layout.tsx        # Redirect si ya autenticado
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   └── page.tsx              # Landing page pública
│   │   │
│   │   └── (private)/                # Rutas protegidas (requieren sesión)
│   │       ├── layout.tsx            # Verifica sesión, redirect si no
│   │       ├── dashboard/page.tsx    # Dashboard ADMIN
│   │       └── user/profile/page.tsx # Perfil USER
│   │
│   ├── layout.tsx                    # Root layout con Toaster + fonts
│   ├── globals.css                  # Tailwind + variables CSS
│   ├── error.tsx                    # Error boundary global
│   ├── loading.tsx                  # Loading state global
│   └── not-found.tsx                # Página 404
│
├── features/                        # Arquitectura basada en features
│   ├── auth/                        # Feature: autenticación
│   │   ├── actions/                 # Server Actions (login, register)
│   │   │   ├── login.action.ts
│   │   │   ├── register.action.ts
│   │   │   └── index.ts
│   │   ├── components/              # Componentes específicos de auth
│   │   │   ├── login-form.tsx       # Formulario con react-hook-form + zod
│   │   │   └── index.ts
│   │   └── validations/             # Schemas Zod para validación
│   │       ├── login.schema.ts
│   │       ├── register.schema.ts
│   │       └── index.ts
│   │
│   └── shared/                      # Feature: componentes compartidos
│       ├── actions/                 # Server Actions compartidas
│       │   ├── get-current-session.action.ts  # Triple validación
│       │   ├── logout.action.ts                # Revocación + cookie delete
│       │   └── index.ts
│       ├── components/ui/           # shadcn/ui components
│       │   ├── button.tsx           # CVA (class variance authority)
│       │   ├── input.tsx
│       │   ├── label.tsx
│       │   ├── card.tsx
│       │   ├── logout-button.tsx    # Botón responsivo con icono
│       │   └── ...más componentes
│       └── types/                   # Tipos TypeScript compartidos
│           ├── auth.type.ts        # JwtPayload, CurrentSession, CurrentSessionResult
│           ├── general-response.ts # IGeneralResponse<T>
│           └── index.ts
│
├── lib/                             # Utilidades y configuración
│   ├── db/
│   │   ├── prismaDB.ts              # Singleton PrismaClient
│   │   └── seeders/                 # Seeders para datos iniciales
│   │       ├── index.ts
│   │       └── 01-users.seeder.ts   # Crea admin@email.com y user@email.com
│   ├── utils/
│   │   ├── jwt.util.ts              # generateToken, verifyToken, decodeToken
│   │   ├── cookie.util.ts           # setSessionCookie, getSessionCookie, deleteSessionCookie
│   │   ├── slugify.ts
│   │   ├── sleep.ts
│   │   └── enums-labels.ts
│   ├── logger/
│   │   └── console-logger.ts        # console.log con formato estructurado
│   ├── seo/
│   │   └── metadataGenerator.tsx    # Generador de metadatos dinámicos
│   └── utils.ts                     # cn() - merge de clases Tailwind
│
└── generated/prisma/                # Prisma Client generado
    ├── client/                     # @prisma/client
    └── enums/                      # Enums generados (Role)
```

### Route Groups en `src/app/`

| Grupo | Propósito | Protección |
|-------|-----------|------------|
| `(public)` | Rutas accesibles sin sesión | No |
| `(private)` | Rutas que requieren sesión activa | Sí, via layout con `getCurrentSessionAction` |
| `(auth)` | Subgrupo para login/register | Redirige si ya hay sesión activa |

---

## 🛠️ Tech Stack

| Paquete | Versión | Propósito en este proyecto |
|---------|---------|---------------------------|
| **next** | 16.2.6 | Framework con App Router, Server Actions, Server Components |
| **react** | 19.2.4 | UI library, Server Components por defecto |
| **typescript** | 5.9.3 | Tipado estático completo en todo el codebase |
| **@prisma/client** | 7.8.0 | ORM para PostgreSQL con generación de tipos automáticos |
| **prisma** | 7.8.0 | CLI para migrations, generate, studio |
| **zod** | 4.4.3 | Validación de datos en servidor y cliente |
| **jsonwebtoken** | 9.0.3 | Firmado y verificación de JWT |
| **bcryptjs** | 3.0.3 | Hashing de contraseñas con salt rounds configurables |
| **react-hook-form** | 7.76.0 | Manejo de formularios con performance optimizado |
| **@hookform/resolvers** | 5.2.2 | Integración Zod con react-hook-form |
| **zustand** | 5.0.13 | Estado global para cliente (UI state, no server state) |
| **sonner** | 2.0.7 | Toast notifications con posicionamiento granular |
| **radix-ui** | 1.4.3 | Primitivos de accesibilidad (Slot, etc.) |
| **class-variance-authority** | 0.7.1 | Variantes de componentes (buttonVariants) |
| **tailwind-merge** | 3.6.0 | Merge de clases Tailwind sin conflictos |
| **lucide-react** | 1.16.0 | Iconos SVG optimizados |
| **shadcn** | 4.7.0 | Componentes UI baseados en Radix + Tailwind |
| **dotenv** | 17.4.2 | Carga de variables de entorno |

---

## 🔐 Flujo de Autenticación y Seguridad

### Diagrama ASCII del flujo completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LOGIN FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

  Cliente                           Servidor                           BD
    │                                  │                               │
    │  1. POST /login (Server Action)  │                               │
    │ ─────────────────────────────────>│                               │
    │                                  │                               │
    │                          2. Validar Zod                           │
    │                                  │                               │
    │                          3. Buscar User por email                 │
    │                                  │───────────> SELECT * FROM      │
    │                                  │              users WHERE       │
    │                                  │              email = ?         │
    │                                  │<────────────── User | null    │
    │                                  │                               │
    │                          4. Verificar isActive                   │
    │                                  │                               │
    │                          5. bcrypt.compare(password, hash)       │
    │                                  │                               │
    │                          6. Generar JWT (jsonwebtoken)            │
    │                                  │                               │
    │                          7. Persistir Session en BD               │
    │                                  │───────────> INSERT INTO        │
    │                                  │              sessions (...)    │
    │                                  │<────────────── Session created │
    │                                  │                               │
    │                          8. Set-Cookie: httpOnly, secure         │
    │                                  │──────> Set-Cookie: auth_token │
    │                                  │         httpOnly=true         │
    │                                  │         secure=true (prod)    │
    │                                  │         SameSite=lax          │
    │                                  │         Path=/                │
    │                                  │         Expires=7d            │
    │                                  │                               │
    │  9. Return CurrentSession       │                               │
    │ <────────────────────────────────│                               │
    │                                  │                               │
    ▼                                  ▼                               ▼


┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROTECCIÓN DE RUTAS (Private Layout)                     │
└─────────────────────────────────────────────────────────────────────────────┘

  Request a /dashboard
         │
         ▼
  ┌──────────────────────────────────────────┐
  │  Private Layout (layout.tsx)             │
  │  ┌────────────────────────────────────┐  │
  │  │ getCurrentSessionAction()          │  │
  │  │                                     │  │
  │  │ 1. getSessionCookie()              │  │
  │  │    → Leer httpOnly cookie          │  │
  │  │                                     │  │
  │  │ 2. verifyToken(token)             │  │
  │  │    → JWT válido + firma correcta  │  │
  │  │                                     │  │
  │  │ 3. prisma.session.findUnique()    │  │
  │  │    → Sesión activa en BD          │  │
  │  │    → Verificar expiresAt          │  │
  │  │                                     │  │
  │  │ 4. prisma.user.findUnique()        │  │
  │  │    → Usuario isActive = true       │  │
  │  └────────────────────────────────────┘  │
  │                                     │
  │         ┌──────────────────────┐  │
  │         │ Triple validación OK  │  │
  │         │ → isAuthenticated=true│  │
  │         └──────────────────────┘  │
  │                    │              │
  │              Render               │
  │                    │              │
  └────────────────────┼──────────────┘
                       ▼
         ┌─────────────────────────┐
         │ Renderizar página       │
         │ protegida               │
         └─────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                              LOGOUT FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

  Cliente                           Servidor                           BD
    │                                  │                               │
    │  POST /logout (Server Action)    │                               │
    │ ─────────────────────────────────>│                               │
    │                                  │                               │
    │                          1. getSessionCookie()                  │
    │                                  │                               │
    │                          2. prisma.session.updateMany()          │
    │                                  │───────────> UPDATE sessions    │
    │                                  │              SET isActive =   │
    │                                  │              false WHERE       │
    │                                  │              token = ?        │
    │                                  │<────────────── ✓ Revoked     │
    │                                  │                               │
    │                          3. deleteSessionCookie()                │
    │                                  │──────> Set-Cookie: expires    │
    │                                  │         in the past          │
    │                                  │                               │
    │                          4. redirect("/login")                   │
    │ <────────────────────────────────│                               │
    │                                  │                               │
    ▼                                  ▼                               ▼
```

### Triple Validación en `getCurrentSessionAction`

```typescript
// 1. Verificar JWT - firma válida, no expirado en el token mismo
const payload = verifyToken(token);

// 2. Verificar sesión activa en BD - no revocada manualmente
const session = await prisma.session.findUnique({ where: { token } });
if (!session?.isActive) return unauthenticated;

// 3. Verificar usuario activo - no suspendido/bloqueado
const user = await prisma.user.findUnique({ where: { id: payload.sub } });
if (!user?.isActive) return unauthenticated;
```

### ¿Por qué httpOnly Cookie + Sesión en BD en lugar de solo JWT?

| Aspecto | Solo JWT (localStorage) | JWT + httpOnly + Sesión BD |
|---------|------------------------|----------------------------|
| **XSS** | ❌ Vulnerable - JS puede leer el token | ✅ httpOnly bloquea acceso desde JavaScript |
| **CSRF** | ✅ No vulnerable a CSRF tradicional | ✅ sameSite=lax/block bloques csrf básico |
| **Revocación** | ❌ Hasta que expire (puede ser horas/días) | ✅ Instantánea - marcar isActive=false |
| **Logout forzado** | ❌ No es posible si token está en localStorage | ✅ Invalidar desde cualquier dispositivo |
| **Sesiones múltiples** | ❌ Difícil de implementar | ✅ Una tabla, múltiples sesiones por usuario |
| **Detección de robo** | ❌ Imposible detectar | ✅ IP y userAgent en cada sesión |

---

## 🗄️ Esquema de Base de Datos

### Modelos Prisma

```prisma
// prisma/schema.prisma

/// Roles disponibles en el sistema
enum Role {
  ADMIN  // Acceso total al sistema
  USER   // Acceso estándar
}

/// Tabla de usuarios del sistema
model User {
  // --- Identificador ---
  id String @id @default(uuid()) @map("id")

  // --- Datos personales ---
  name  String @map("name")
  email String @unique @map("email")

  // --- Seguridad ---
  password String @map("password")  // Siempre hasheado con bcrypt
  role     Role   @default(USER) @map("role")

  // --- Estado ---
  isActive Boolean @default(true) @map("is_active")

  // --- Relaciones ---
  sessions Session[]  // Un usuario puede tener múltiples sesiones activas

  // --- Timestamps ---
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

/// Tabla de sesiones JWT activas por usuario
/// Útil para invalidar tokens (logout, cambio de contraseña, etc.)
model Session {
  // --- Identificador ---
  id String @id @default(uuid()) @map("id")

  // --- Token ---
  token     String   @unique @map("token")
  expiresAt DateTime @map("expires_at")
  userAgent String?  @map("user_agent")
  ipAddress String?  @map("ip_address")

  // --- Relación con usuario ---
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // --- Estado ---
  isActive  Boolean  @default(true) @map("is_active")

  // --- Timestamps ---
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("sessions")
}
```

### Convenciones de Naming

- **@map("nombre_columna")**: Mapea el campo de TypeScript a la columna en snake_case en PostgreSQL
- **@@map("nombre_tabla")**: Define el nombre exacto de la tabla en la BD

Esta convención permite:
- Usar camelCase en código TypeScript (convención TS)
- Usar snake_case en PostgreSQL (convención SQL)
- Evitar conflictos de nombres reservados

---

## 🚀 Getting Started

### Prerrequisitos

- **Node.js**: v18+ (recomendado v20 LTS)
- **pnpm** o **npm** (el proyecto usa pnpm internamente, pero npm funciona)
- **PostgreSQL**: v14+ (ejecutándose localmente en puerto 5432)
- **Git**: Para clonar el repositorio

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/nextjs-auth-rbac.git
cd nextjs-auth-rbac

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env .env.local

# 4. Generar Prisma Client y ejecutar migraciones
npx prisma generate
npx prisma migrate dev --name init

# 5. (Opcional) Ejecutar seeders para datos de prueba
npx tsx src/lib/db/seeders/index.ts

# 6. Iniciar servidor de desarrollo
npm run dev
```

### Credenciales de Prueba (después del seed)

| Rol | Email | Password |
|-----|-------|----------|
| ADMIN | admin@email.com | 123456789 |
| USER | user@email.com | 123456789 |

### Script de Reset Completo

El proyecto incluye un script que resetea la base de datos completa:

```bash
npm run seed
```

Este comando:
1. Limpia migraciones
2. Regenera Prisma Client
3. Resetea la BD
4. Ejecuta migraciones
5. Ejecuta seeders

---

## 🌍 Variables de Entorno

```env
# ============================================
# Base de datos - PostgreSQL
# ============================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nextjs-auth-rbac?schema=public"

# ============================================
# JWT - Firmado de tokens
# ============================================
# IMPORTANTE: Genera una clave segura de al menos 64 caracteres
# Para generar una nueva:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="137e9fd30992967049ed30611a2632ea2fbf91e699faa1f3d29a3a1d565765e3fe51c97233ded272a583db289b1e0dd3767c3eeadb97f43e76d61ae55a821c85"

# Tiempo de expiración del JWT (formato: número + unidad)
# s=segundos, m=minutos, h=horas, d=días
JWT_EXPIRES_IN="7d"

# ============================================
# App - Configuración general
# ============================================
# URL pública para enlaces, meta tags, etc.
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Entorno: development | production
NODE_ENV="development"

# Nombre del entorno (para UI condicional)
NEXT_PUBLIC_ENVIRONMENT="development"

# ============================================
# Cookie - Configuración de sesión
# ============================================
# Nombre de la cookie donde se almacena el JWT
SESSION_COOKIE_NAME="nextjs-auth-rbac-session"
```

### Cómo generar JWT_SECRET

```bash
# Opción 1: Node.js (recomendado)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opción 2: OpenSSL
openssl rand -hex 64
```

El secret debe tener al menos 64 caracteres para máxima seguridad con HS256.

---

## 📡 Server Actions

### `LoginAction` - `src/features/auth/actions/login.action.ts`

```typescript
// Parámetros: { email: string, password: string }
// Retorna: IGeneralResponse<CurrentSession>

// Flujo:
// 1. Validar datos con loginSchema (Zod)
// 2. Buscar usuario por email
// 3. Verificar cuenta activa (isActive)
// 4. Comparar contraseña (bcrypt)
// 5. Generar JWT con jwt.util
// 6. Persistir sesión en BD (prisma.session.create)
// 7. Guardar token en httpOnly cookie
// 8. Retornar CurrentSession con datos del usuario
```

### `RegisterAction` - `src/features/auth/actions/register.action.ts`

```typescript
// Parámetros: { name: string, email: string, password: string, passwordConfirmation: string }
// Retorna: IGeneralResponse<User>

// Flujo:
// 1. Validar datos con registerSchema (Zod)
// 2. Verificar email no existe
// 3. Hashear contraseña con bcrypt (salt rounds = 10)
// 4. Crear usuario en BD
// 5. Retornar usuario creado
```

### `LogoutAction` - `src/features/shared/actions/logout.action.ts`

```typescript
// Parámetros: None (form action)
// Retorna: void (redirect a /login)

// Flujo:
// 1. Leer token de cookie
// 2. Marcar sesión como inactiva (isActive = false)
// 3. Eliminar cookie de sesión
// 4. Redirigir a /login
```

### `getCurrentSessionAction` - `src/features/shared/actions/get-current-session.action.ts`

```typescript
// Parámetros: None
// Retorna: CurrentSessionResult

// Flujo (triple validación):
// 1. Leer cookie httpOnly
// 2. Verificar JWT (firma, expiración)
// 3. Buscar sesión activa en BD (isActive, expiresAt)
// 4. Verificar usuario activo en BD (isActive)
// 5. Retornar { isAuthenticated, isAdmin, isRegularUser, role, currentUser }
```

---

## 🎭 Roles y Permisos

### Roles Definidos

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **ADMIN** | Administrador del sistema | `/dashboard` (y todas las rutas privadas) |
| **USER** | Usuario regular | `/user/profile` |

### Rutas por Rol

| Ruta | Método | Require Auth | Roles Permitidos |
|------|--------|--------------|------------------|
| `/` | GET | ❌ | Todos |
| `/login` | GET | ❌ | No autenticados (redirect si autenticado) |
| `/register` | GET | ❌ | No autenticados (redirect si autenticado) |
| `/dashboard` | GET | ✅ | ADMIN |
| `/user/profile` | GET | ✅ | USER, ADMIN |

### Redirect Automático por Rol

En el layout `(public)/(auth)/layout.tsx`:

```typescript
if (isAdmin) return redirect("/dashboard");
if (isRegularUser) return redirect("/user/profile");
```

Esto redirige automáticamente a usuarios ya autenticados que intenten acceder a `/login` o `/register`.

---

## 🧠 Decisiones de Diseño Clave

### 1. JWT + httpOnly Cookie en lugar de NextAuth

**Decisión**: Implementar autenticación JWT manual con cookie httpOnly en lugar de usar NextAuth.

**Razones**:
- **Control total**:每 línea de código de autenticación es visible y modificable
- **Revocación instantánea**: Sesiones en BD permiten invalidar tokens inmediatamente
- **Aprendizaje**: Proyecto para demostrar comprensión profunda de auth flow
- **Flexibilidad**: Adaptar el flujo exacto a requisitos específicos del negocio
- **Sin dependencias externas**: Menos superficie de ataque, menos puntos de falla

### 2. Sesiones en Base de Datos

**Decisión**: Almacenar sesiones en PostgreSQL (modelo `Session`) además del JWT.

**Razones**:
- **Revocación forzada**: Si un usuario reporta dispositivo robado, admin puede invalidar todas sus sesiones
- **Detección de anomalías**: IP y userAgent permiten detectar login desde ubicación desconocida
- **Logout desde cualquier dispositivo**: Sistema de "cerrar todas las sesiones" feasible
- **Auditoría**: Historial de sesiones para compliance y seguridad

### 3. Arquitectura Feature-Based

**Decisión**: Estructurar código por features (`src/features/auth/`, `src/features/shared/`) en lugar de por tipo de archivo.

**Razones**:
- **Cohesión**: Todo lo relacionado a auth está junto (actions, components, validations, types)
- **Escalabilidad**: Agregar nueva feature es crear una carpeta, no modificar archivos en múltiples directorios
- **Testing**: Tests por feature, no por tipo
- **Onboarding**: Nuevos devs entienden el dominio buscando carpetas, no archivos dispersos

### 4. Zustand para Estado de UI

**Decisión**: Usar Zustand para estado efímero del cliente (no datos del servidor).

**Razones**:
- **Simplicidad**: API mínima comparado con Redux
- **TypeScript**: Inferencia automática de tipos sin boilerplate
- **DevTools**: Middleware de persistencia integrado
- **No para server state**: Datos del servidor van a Server Components o React Query (no implementado aún, pero la separación está clara)

### 5. Validación en Frontera (Zod)

**Decisión**: Validar TODA entrada externa con Zod en la frontera servidor-cliente.

**Razón**: Previene datos maliciosos antes de llegar a la lógica de negocio, mensajes de error específicos en lugar de errores 500 genéricos.

---

## 📝 Detalles de Implementación Interesantes

### Mensajes de Error Genéricos en Login

El `LoginAction` retorna el mismo mensaje "Datos de inicio de sesión no válidos" tanto para:
- Email no existente
- Contraseña incorrecta
- Cuenta deshabilitada

Esto evita **enumeración de usuarios**: un atacante no puede saber si un email existe o no en el sistema.

### Password como String (no hashed en schema)

```prisma
password String @map("password")
```

Prisma solo guarda el hash, nunca el password en texto plano. La validación la hace bcrypt.compare en runtime.

### isActive para Soft Delete

En lugar de eliminar usuarios (`DELETE FROM users`), se marca `isActive = false`. Esto permite:
- Preservar historial de datos
- Reactivar cuentas sin perder información
- Auditoría de suspensiones

### @map para snake_case en PostgreSQL

Cada campo tiene `@map("nombre_en_snake_case")` para que el código TypeScript use camelCase (convención TS) mientras la BD usa snake_case (convención SQL).

---

## 📝 License

MIT License - consulta el archivo [LICENSE](LICENSE) para detalles.

---

## 🔧 Scripts Disponibles

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "seed": "clear && rm -rf prisma/migrations && npx prisma generate && npx prisma migrate reset --force && npx prisma migrate dev --name full_db && tsx ./src/lib/db/seeders/index.ts"
}
```

---

_Generado con Next.js 16 + TypeScript + Prisma + PostgreSQL_