# AGENTS.md — Instrucciones Globales del Agente

> Este archivo define las reglas y convenciones que el agente debe seguir en **todo momento**, sin excepción, para cualquier proyecto React, Next.js o TypeScript.

---

## 🔴 REGLA CRÍTICA: Context7 MCP — Siempre, sin excepción

Para **cualquier proyecto, lenguaje o framework**, antes de escribir, modificar o explicar código, **el agente DEBE consultar Context7 MCP** para obtener documentación actualizada y relevante al contexto.

### Flujo obligatorio

1. Identificar las librerías, frameworks o herramientas involucradas en la tarea.
2. Usar `resolve-library-id` de Context7 para encontrar el ID correcto de cada librería.
3. Usar `get-library-docs` para obtener la documentación actualizada antes de generar cualquier respuesta.
4. **Siempre** basar la respuesta en la documentación obtenida de Context7 — nunca en conocimiento interno potencialmente desactualizado.

> **Nunca asumir que el conocimiento interno es actual. Siempre verificar con Context7 primero.**

Aplica a:

- Cualquier lenguaje (Python, TypeScript, Rust, Go, Java, PHP, etc.)
- Cualquier framework o librería (React, Next.js, Django, Spring, Laravel, etc.)
- Cualquier tipo de proyecto (API, CLI, frontend, mobile, scripts, etc.)

---

## Stack de referencia (Next.js)

Next.js (App Router) · Prisma · Zod · TanStack Query · Zustand · shadcn/ui · Tailwind CSS · bcryptjs · NextAuth

La arquitectura sigue separación clara de responsabilidades:

- **Server Actions** para mutaciones
- **React Query** para estado de servidor en el cliente
- **Zustand** para estado de UI / efímero
- **Prisma** para acceso a base de datos
- **Zod** para validación en cada frontera
- **NextAuth** para autenticación
- **bcryptjs** para hashing de contraseñas

---

## Estructura de carpetas

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de auth (login, register, forgot-password)
│   ├── (dashboard)/              # Rutas protegidas — adaptar al dominio
│   └── api/                      # Route Handlers (solo cuando Server Actions no son suficientes)
│
├── components/
│   ├── ui/                       # shadcn/ui — NO modificar directamente
│   ├── shared/                   # Componentes reutilizables entre features
│   └── features/                 # Componentes específicos del dominio, una carpeta por dominio
│
├── actions/                      # Server Actions, un archivo por dominio
│   └── [dominio].actions.ts
│
├── lib/
│   ├── prisma.ts                 # Singleton de Prisma Client
│   ├── auth.ts                   # Configuración de NextAuth
│   ├── bcrypt.ts                 # Helpers de bcryptjs
│   └── utils.ts                  # Utilidades compartidas (cn, formatters, etc.)
│
├── schemas/                      # Schemas de Zod
│   ├── user.schema.ts
│   ├── product.schema.ts
│   └── index.ts                  # Re-exporta todo
│
├── stores/                       # Stores de Zustand
│   └── index.ts
│
├── hooks/                        # Custom hooks (React Query + lógica derivada)
│
├── types/                        # Definiciones TypeScript
│   ├── user.interface.ts
│   ├── user.types.ts
│   ├── product.interface.ts
│   ├── product.types.ts
│   └── index.ts                  # Re-exporta todo
│
├── constants/                    # Constantes globales
│   └── index.ts
│
└── services/                     # Lógica de negocio pura — clases agnósticas al framework
    ├── user.service.ts
    └── email.service.ts
```

---

## Convenciones de nombrado — Seguir siempre

```ts
// Interfaces → PascalCase, sin prefijo — guardadas en *.interface.ts
interface User { ... }
interface Product { ... }
interface OrderWithItems { ... }

// Types → PascalCase — guardados en *.types.ts
type Response<T> = { data: T | null; error: string | null }
type Status = 'pending' | 'active' | 'cancelled'
type PageProps<P = {}, S = {}> = { params: P; searchParams: S }

// Enums → PascalCase — guardados en *.types.ts o *.enums.ts
enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

// Constantes → UPPER_SNAKE_CASE
const MAX_FILE_SIZE_MB = 10
const DEFAULT_PAGE_SIZE = 20
const SALT_ROUNDS = 12

// Clases / Servicios → PascalCase + sufijo Service
class UserService { ... }
class PaymentService { ... }

// Funciones → camelCase, verbos descriptivos
function hashPassword(plain: string): Promise<string> { ... }
function formatCurrency(amount: number, currency: string): string { ... }

// Componentes → PascalCase (función y exportación)
function UserCard() { ... }
function ProductForm() { ... }

// Hooks → camelCase con prefijo `use`
function useUsers() { ... }
function useDebounce<T>(value: T, delay: number) { ... }

// Zustand stores → camelCase + sufijo Store
const useUIStore = create(...)
const useCartStore = create(...)
```

### Nombrado de archivos

| Artefacto        | Nombre de archivo       | Nombre de función/clase/export |
| ---------------- | ----------------------- | ------------------------------ |
| Componente React | `componente-header.tsx` | `ComponenteHeader`             |
| Interface        | `user.interface.ts`     | `User` (sin prefijo I)         |
| Types / Enums    | `user.types.ts`         | `UserRole`, `UserStatus`       |
| Schema Zod       | `user.schema.ts`        | `CreateUserSchema`             |
| Server Action    | `user.actions.ts`       | `createUser`, `deleteUser`     |
| Hook             | `use-entities.ts`       | `useEntities`                  |
| Store Zustand    | `ui.store.ts`           | `useUIStore`                   |
| Servicio         | `user.service.ts`       | `UserService`                  |

> ❌ `IUser`, `TUser`, `EUserRole` — nunca usar prefijos en interfaces, types o enums  
> ✅ `User`, `UserRole`, `UserStatus`

---

## Schemas Zod — src/schemas/

```ts
// src/schemas/user.schema.ts
import { z } from "zod";
import { UserRole } from "@/types";

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.nativeEnum(UserRole).default(UserRole.MEMBER),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  id: z.string().cuid(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "La contraseña es requerida"),
});

// Siempre inferir tipos desde los schemas
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
```

```ts
// src/schemas/index.ts — re-exportar todo
export * from "./auth.schema";
export * from "./user.schema";
```

### Reglas de Zod

- Toda entrada externa (formularios, API, Server Actions) debe ser validada con Zod antes de usarse
- Usar siempre `safeParse` — nunca `parse` (lanza excepción)
- Siempre inferir tipos TypeScript desde los schemas — nunca duplicar definiciones de tipos
- Nombres de schemas en PascalCase con sufijo `Schema`

---

## Autenticación — NextAuth + bcryptjs

```ts
// src/lib/bcrypt.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
```

```ts
// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/bcrypt";
import { LoginSchema } from "@/schemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.password) return null;

        const valid = await verifyPassword(parsed.data.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
```

### Reglas de autenticación

- **Nunca** guardar contraseñas en texto plano — siempre usar `hashPassword`
- **Nunca** comparar contraseñas manualmente — siempre usar `verifyPassword`
- Proteger Server Actions y Route Handlers llamando `auth()` y verificando la sesión
- Extender el tipo de sesión de NextAuth para incluir campos personalizados (`role`, `id`)
- Siempre definir páginas personalizadas (`signIn`, `error`) — nunca confiar en los defaults de NextAuth

---

## Server Actions — src/actions/

```ts
// src/actions/[dominio].actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateEntitySchema } from "@/schemas";
import type { Response } from "@/types";
import type { Entity } from "@prisma/client";

export async function createEntity(
  rawData: unknown,
): Promise<Response<Entity>> {
  // 1. Verificar autenticación
  const session = await auth();
  if (!session?.user) return { data: null, error: "No autorizado" };

  // 2. Validar con Zod
  const parsed = CreateEntitySchema.safeParse(rawData);
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message };
  }

  try {
    // 3. Lógica de negocio — delegar a Service si es compleja
    const entity = await prisma.entity.create({ data: parsed.data });

    // 4. Revalidar rutas afectadas
    revalidatePath("/entities");

    return { data: entity, error: null };
  } catch (error) {
    console.error("[createEntity]", error);
    return { data: null, error: "Error al crear. Por favor intenta de nuevo." };
  }
}
```

### Reglas de Server Actions

- Siempre retornar `Response<T>` — nunca lanzar errores crudos al cliente
- Siempre verificar auth antes de cualquier otra cosa
- Siempre validar con `safeParse` de Zod antes de tocar Prisma
- Siempre loguear errores con contexto: `console.error('[nombreAction]', error)`
- Siempre llamar `revalidatePath` o `revalidateTag` después de mutaciones
- Nunca poner lógica de negocio compleja dentro de actions — delegar a una clase Service

---

## Prisma — src/lib/prisma.ts

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Patrones de queries

```ts
// Tipos de retorno explícitos siempre
async function getEntityById(id: string): Promise<Entity | null> {
  return prisma.entity.findUnique({
    where: { id },
    include: { relatedModel: true },
  });
}

// Paginación estándar
async function getEntities(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const [items, total] = await prisma.$transaction([
    prisma.entity.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.entity.count(),
  ]);
  return { items, total, page, pageSize };
}

// Mutaciones siempre en try/catch
async function updateEntity(id: string, data: UpdateInput) {
  try {
    return await prisma.entity.update({ where: { id }, data });
  } catch (error) {
    throw new Error(`Error al actualizar entidad ${id}: ${error}`);
  }
}
```

### Reglas de Prisma

- Nunca instanciar `PrismaClient` directamente — siempre usar `@/lib/prisma`
- Preferir `select` sobre `include` cuando solo se necesitan algunos campos
- Agrupar queries dependientes en `$transaction`
- Nunca exponer modelos crudos de Prisma al cliente — siempre mapear a interfaces
- Preferir soft deletes sobre hard deletes cuando importa el historial (patrón `deletedAt`)

---

## Componentes React — Server vs Client

```tsx
// Server Component — por defecto, sin directiva
// src/components/features/[dominio]/entity-list.tsx
import { prisma } from "@/lib/prisma";
import { EntityCard } from "./entity-card";

export async function EntityList() {
  const items = await prisma.entity.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground">No se encontraron elementos.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <EntityCard key={item.id} entity={item} />
      ))}
    </ul>
  );
}
```

```tsx
// Client Component — solo cuando es necesario
"use client";

import { useTransition } from "react";
import { deleteEntity } from "@/actions/entity.actions";
import { toast } from "sonner";

interface DeleteButtonProps {
  entityId: string;
}

export function DeleteButton({ entityId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEntity(entityId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Eliminado correctamente");
      }
    });
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
```

### Reglas de componentes

- Por defecto, Server Component — agregar `'use client'` solo para: `useState`, `useEffect`, event handlers, APIs del navegador
- Las props siempre deben tipificarse con `interface ...Props`
- Nunca hacer fetch de datos dentro de Client Components via `useEffect` — usar React Query o Server Components
- Los formularios usan `react-hook-form` + Zod resolver + Server Actions
- Siempre envolver llamadas a Server Actions en `useTransition` dentro de Client Components
- Usar `disabled={isPending}` en elementos interactivos durante transiciones

---

## Formularios — react-hook-form + Zod + Server Actions

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { CreateEntitySchema, type CreateEntityInput } from "@/schemas";
import { createEntity } from "@/actions/entity.actions";

export function EntityForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateEntityInput>({
    resolver: zodResolver(CreateEntitySchema),
    defaultValues: { name: "", description: "" },
  });

  function onSubmit(values: CreateEntityInput) {
    startTransition(async () => {
      const result = await createEntity(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Creado correctamente");
        form.reset();
      }
    });
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* campos */}</form>;
}
```

---

## React Query (TanStack Query) — Hooks

```ts
// src/hooks/use-entities.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Entity, CreateEntityInput } from "@/types";

// Query keys — constantes tipadas a nivel de módulo, nunca inline
export const ENTITY_QUERY_KEYS = {
  all: ["entities"] as const,
  list: (filters?: object) => ["entities", "list", filters] as const,
  detail: (id: string) => ["entities", "detail", id] as const,
};

// Funciones de fetch — declaradas fuera del hook
async function fetchEntities(): Promise<Entity[]> {
  const res = await fetch("/api/entities");
  if (!res.ok) throw new Error("Error al cargar entidades");
  return res.json();
}

export function useEntities() {
  return useQuery({
    queryKey: ENTITY_QUERY_KEYS.list(),
    queryFn: fetchEntities,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useCreateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEntityInput) => {
      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al crear");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTITY_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("[useCreateEntity]", error);
    },
  });
}
```

### Reglas de React Query

- Las query keys deben ser constantes tipadas a nivel de módulo — nunca strings inline
- Las funciones de fetch deben declararse fuera del hook — nunca inline en `queryFn`
- **Estado de servidor → React Query. Estado de UI/efímero → Zustand. Nunca mezclarlos.**
- Siempre establecer un `staleTime` con sentido — el default de `0` casi nunca es correcto
- Usar `invalidateQueries` después de mutaciones — nunca actualizar la cache manualmente salvo que el rendimiento lo requiera

---

## Zustand Stores — src/stores/

```ts
// src/stores/ui.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIStore {
  // Estado
  isSidebarOpen: boolean;
  activeModal: string | null;

  // Acciones
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

const initialState = {
  isSidebarOpen: true,
  activeModal: null,
};

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      ...initialState,
      toggleSidebar: () =>
        set(
          (s) => ({ isSidebarOpen: !s.isSidebarOpen }),
          false,
          "toggleSidebar",
        ),
      openModal: (id) => set({ activeModal: id }, false, "openModal"),
      closeModal: () => set({ activeModal: null }, false, "closeModal"),
    }),
    { name: "UIStore" },
  ),
);
```

### Reglas de Zustand

- Usar siempre el middleware `devtools` — pasar nombres de acciones como tercer argumento de `set`
- Zustand = estado de UI y estado efímero **únicamente**
- Separar claramente campos de estado y funciones de acción en la interface del store
- Siempre exportar la interface del store
- Siempre definir `initialState` separadamente — facilita acciones de `reset`

---

## Servicios — src/services/

```ts
// src/services/email.service.ts
// Lógica de negocio pura — sin imports de framework, sin Prisma, sin Next.js

export class EmailService {
  static buildWelcomeTemplate(name: string): { subject: string; html: string } {
    return {
      subject: `Bienvenido, ${name}!`,
      html: `<p>Hola ${name}, gracias por registrarte.</p>`,
    };
  }

  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### Reglas de Servicios

- Los servicios deben ser **puros** — sin `prisma`, sin `fetch`, sin APIs de Next.js
- Son el lugar correcto para: cálculos, transformaciones, validaciones más allá de Zod, construcción de templates
- Usar siempre métodos `static` salvo que se necesite estado de instancia
- La lógica de negocio en componentes o actions debe delegarse a un Service

---

## Variables de entorno — src/lib/env.ts

```ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = envSchema.parse(process.env);
```

### Reglas de env

- Siempre validar las variables de entorno al iniciar — nunca acceder a `process.env` directamente en el código de la app
- Usar `@/lib/env` en todos lados — detectar variables faltantes al arrancar, no en runtime
- Nunca hacer commit de archivos `.env` — siempre proveer `.env.example`

---

## Toast Notifications

```tsx
// Informativo / no implementado aún
toast.info("<mensaje específico al contexto>", {
  description: "<descripción específica>", // opcional
  action: {
    label: "Entendido",
    onClick: () => toast.dismiss(),
  },
});

// Éxito / Error
toast.success("Cambios guardados");
toast.error(result.error ?? "Algo salió mal. Por favor intenta de nuevo.");
```

### Reglas de Toast

- `toast.info` para avisos y feedback no crítico
- `toast.success` para mutaciones completadas
- `toast.error` para operaciones fallidas — siempre incluir mensaje amigable para el usuario
- Nunca usar mensajes genéricos como "Error" o "Listo" — siempre ser específico al contexto
- Nunca mostrar mensajes de error crudos o stack traces al usuario

---

## Route Handlers — app/api/

Usar Route Handlers solo cuando los Server Actions son insuficientes (webhooks, file uploads, OAuth callbacks de terceros).

```ts
// app/api/[dominio]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const items = await prisma.entity.findMany();
    return NextResponse.json(items);
  } catch (error) {
    console.error("[GET /api/entities]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
```

---

## Anti-patrones — Nunca hacer esto

```ts
// ❌ Nunca usar `any`
const data: any = await fetch(...)
// ✅ Siempre tipar explícitamente
const data: Entity = await fetch(...)

// ❌ Nunca hacer fetch en useEffect
useEffect(() => { fetch('/api/items').then(setItems) }, [])
// ✅ Usar React Query o Server Components

// ❌ Nunca instanciar PrismaClient directamente
const prisma = new PrismaClient()
// ✅ Siempre usar el singleton
import { prisma } from '@/lib/prisma'

// ❌ Nunca lanzar excepciones desde Server Actions
throw new Error('DB falló')
// ✅ Retornar Response
return { data: null, error: 'Algo salió mal. Por favor intenta de nuevo.' }

// ❌ Nunca omitir validación Zod
async function action(data: FormData) {
  await prisma.entity.create({ data: data as any })
}
// ✅ Siempre safeParse primero

// ❌ Nunca guardar contraseñas en texto plano
await prisma.user.create({ data: { password: rawPassword } })
// ✅ Siempre hashear
await prisma.user.create({ data: { password: await hashPassword(rawPassword) } })

// ❌ Nunca poner lógica de negocio en componentes o actions
const price = qty * 25000 * (type === 'premium' ? 1.5 : 1)
// ✅ Delegar a un Service
const price = PricingService.calculate({ qty, type })

// ❌ Nunca guardar datos de servidor en Zustand
useMyStore.setState({ items: fetchedData })
// ✅ Datos del servidor → React Query. Estado de UI → Zustand

// ❌ Nunca acceder a process.env directamente en el código de la app
const url = process.env.API_URL
// ✅ Usar env validado
import { env } from '@/lib/env'
const url = env.API_URL

// ❌ Nunca usar prefijo I en interfaces
interface IUser { ... }
// ✅ Sin prefijo
interface User { ... }
```

---

## Documentación de código

Documentar **todo** el código en español siguiendo estos estándares.

### Docstrings de funciones/métodos (JSDoc para TS/JS)

```ts
/**
 * Descripción breve de lo que hace la función.
 *
 * Descripción detallada del propósito y comportamiento.
 * Explica casos de uso, algoritmos importantes o lógica compleja.
 *
 * @param param1 - Descripción del parámetro, propósito y valores esperados.
 * @param param2 - Descripción del segundo parámetro.
 * @returns Descripción detallada de qué retorna la función.
 * @throws {Error} Cuándo y por qué se lanza esta excepción.
 *
 * @example
 * const resultado = await miFuncion('valor1', 123);
 * console.log(resultado);
 */
```

### Docstrings de clases

```ts
/**
 * Descripción breve de la responsabilidad de la clase.
 *
 * Descripción detallada del propósito, su rol en el sistema
 * y patrones de diseño implementados si aplica.
 *
 * @example
 * const instancia = new MiClase(param1, param2);
 * instancia.metodo();
 */
```

### Docstrings de módulos (inicio de cada archivo)

```ts
/**
 * Módulo para gestión de autenticación y autorización.
 *
 * Implementa el sistema de autenticación JWT siguiendo el estándar RFC 7519.
 * Provee funciones para generar, validar y refrescar tokens de acceso.
 *
 * @module auth
 */
```

### Comentarios inline

**Reglas:**

1. Comentar el **POR QUÉ**, no el QUÉ (el código ya dice qué hace)
2. Usar `//` con un espacio después
3. Máximo 79 caracteres por línea

**Cuándo comentar:**

- ✅ Lógica de negocio no obvia
- ✅ Algoritmos complejos
- ✅ Workarounds o hacks necesarios
- ✅ Números mágicos o constantes
- ✅ Regex complejas
- ✅ Optimizaciones no evidentes
- ❌ Código autoexplicativo

```ts
// Iteramos en reversa para evitar problemas con índices al eliminar elementos
for (let i = lista.length - 1; i >= 0; i--) {
  // Validamos integridad antes de procesar para prevenir datos corruptos
  if (!validarIntegridad(lista[i])) {
    logger.error(`Dato corrupto en índice ${i}`);
    lista.splice(i, 1); // Eliminación segura iterando en reversa
    continue;
  }
}

// HACK: Timeout extendido a 60s porque la API externa es lenta
// TODO: Migrar a cola asíncrona en próxima versión (ticket #789)
// FIXME: Este manejo de errores es temporal hasta implementar retry logic
// NOTE: Este valor viene del RFC-1234 sección 3.2
```

### Etiquetas especiales

```ts
// TODO: Tarea pendiente (asignar a: @usuario, prioridad: alta)
// FIXME: Bug que necesita corrección urgente
// HACK: Solución temporal — explicar por qué
// NOTE: Información importante para entender el contexto
// WARNING: Advertencia sobre uso peligroso o efectos secundarios
// OPTIMIZE: Oportunidad de optimización identificada
// DEPRECATED: Será removido en v2.0, usar nuevaFuncion() en su lugar
```

---

## Mensajes de commit

Formato obligatorio en **español**:

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo       | Uso                                     |
| ---------- | --------------------------------------- |
| `feat`     | Nueva funcionalidad                     |
| `fix`      | Corrección de bug                       |
| `docs`     | Solo cambios en documentación           |
| `style`    | Cambios de formato sin afectar código   |
| `refactor` | Refactorización (ni fix ni feat)        |
| `perf`     | Mejoras de rendimiento                  |
| `test`     | Agregar o corregir tests                |
| `build`    | Cambios en build o dependencias         |
| `ci`       | Cambios en configuración de CI          |
| `chore`    | Mantenimiento sin cambios en src o test |
| `revert`   | Revertir un commit anterior             |

### Reglas de la descripción

1. Máximo 50 caracteres
2. Imperativo presente: "agrega" NO "agregado" ni "agregando"
3. Sin punto final
4. Minúsculas después de los dos puntos
5. Ser específico y conciso

### Ejemplos

```
feat(auth): agrega autenticación con Google OAuth

Implementa el flujo completo de OAuth 2.0 para permitir login
con cuentas de Google. Incluye manejo de tokens y refresh.

Closes #234
```

```
fix(api): corrige timeout en endpoint de usuarios

El timeout ocurría cuando había más de 1000 usuarios.
Se optimiza la query agregando índice en created_at.
```

```
refactor(utils): simplifica función de validación de emails
```

```
docs(readme): actualiza instrucciones de instalación
```

**Errores comunes a evitar:**

- ❌ `"actualizaciones varias"`
- ❌ `"fix"`
- ❌ `"WIP"`
- ✅ `"feat(cart): agrega botón de compra rápida"`
- ✅ `"fix(login): corrige redirección después del logout"`

---

## Checklist pre-commit

- [ ] Context7 MCP fue consultado antes de escribir o modificar código
- [ ] Todas las interfaces sin prefijo (`User`, no `IUser`)
- [ ] Todos los types en PascalCase (`UserRole`, no `TUserRole`)
- [ ] Todos los enums en PascalCase (`UserRole`, no `EUserRole`)
- [ ] Todas las constantes en `UPPER_SNAKE_CASE`
- [ ] Archivos nombrados en kebab-case (`componente-header.tsx`)
- [ ] Funciones/clases/exports nombrados en PascalCase/camelCase según corresponde
- [ ] Schemas Zod en `src/schemas/` con sufijo `Schema` (PascalCase)
- [ ] Tipos inferidos desde schemas — sin definiciones de tipos duplicadas
- [ ] Server Actions retornan `Response<T>` y verifican auth primero
- [ ] Contraseñas hasheadas con `hashPassword` — nunca guardadas en plano
- [ ] Mutaciones de Prisma envueltas en try/catch
- [ ] `'use client'` solo donde es estrictamente necesario
- [ ] Lógica de negocio delegada a `src/services/`
- [ ] Prisma accedido solo vía singleton `@/lib/prisma`
- [ ] Variables de entorno accedidas solo vía `@/lib/env`
- [ ] Sin tipos `any` en ningún lugar
- [ ] Mensajes de toast específicos al contexto — sin texto genérico
- [ ] Código documentado en español con JSDoc donde corresponde
- [ ] Mensaje de commit sigue el formato convencional en español

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
