# CLAUDE.md - Next.js 15 Best Practices Guide

## Project Overview
This document outlines best practices for building Next.js 15 applications with optimal performance, maintainability, and scalability.

## Tech Stack
- **Framework**: Next.js 15 (with App Router)
- **React**: React 19
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4
- **Package Manager**: npm/pnpm/yarn

---

## 1. Project Structure

Follow this well-organized folder structure for scalability:

```
my-nextjs-project/
├── app/                          # App Router (Next.js 15)
│   ├── (auth)/                   # Route groups for auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Route groups for dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                      # API routes
│   │   └── users/
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── loading.tsx               # Loading UI
│   ├── error.tsx                 # Error boundary
│   └── not-found.tsx             # 404 page
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (buttons, inputs)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   └── dashboard/
│   │       ├── stats-card.tsx
│   │       └── chart.tsx
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   └── providers/                # Context providers
│       └── theme-provider.tsx
│
├── lib/                          # Utility functions and configurations
│   ├── utils.ts                  # General utilities
│   ├── api-client.ts            # API client setup
│   ├── constants.ts             # App constants
│   └── validations.ts           # Validation schemas (Zod)
│
├── actions/                      # Server Actions (by feature)
│   ├── auth-actions.ts
│   ├── user-actions.ts
│   └── post-actions.ts
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-debounce.ts
│   └── use-media-query.ts
│
├── types/                        # TypeScript type definitions
│   ├── index.ts
│   ├── user.ts
│   └── api.ts
│
├── config/                       # Configuration files
│   ├── site.ts                  # Site metadata
│   └── env.ts                   # Environment variable validation
│
├── styles/                       # Global styles
│   └── globals.css
│
├── public/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── .env.local                    # Environment variables
├── .eslintrc.json               # ESLint configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

### Key Principles:
- **Group by feature, not by file type** for components above 20+ files
- **Avoid nesting deeper than 3-4 levels**
- **Use route groups** `(name)` to organize routes without affecting URL structure
- **Keep components focused** - each file should have a single responsibility
- **Break large utility files** into smaller, logical modules

---

## 2. Server vs Client Components

### Default to Server Components
Server Components are the default in Next.js 15 and should be used whenever possible as they reduce client-side JavaScript, enable direct database access, and improve initial page load performance.

### Server Components (Default)
**Use for:**
- Data fetching from databases or APIs
- Accessing backend resources
- Keeping sensitive information secure (API keys, tokens)
- Static content rendering
- SEO-critical content

**Example:**
```tsx
// app/posts/page.tsx (Server Component - no 'use client')
import { db } from '@/lib/db'

export default async function PostsPage() {
  const posts = await db.post.findMany()
  
  return (
    <div>
      <h1>Posts</h1>
      <PostsList posts={posts} />
    </div>
  )
}
```

### Client Components
**Use for:**
- Interactivity (onClick, onChange)
- Browser APIs (window, localStorage)
- React hooks (useState, useEffect, useContext)
- Event listeners
- Real-time updates

**Example:**
```tsx
// components/ui/counter.tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Best Practices:
1. **Push Client Components to leaf nodes** - keep them at the edges of your component tree
2. **Pass Server Components as children** to Client Components when needed:
```tsx
// ✅ Good: Server Component as children
<ClientComponent>
  <ServerComponent />
</ClientComponent>

// ❌ Bad: Importing Server Component in Client Component
```

3. **Use the `cache()` function** for repeated fetch requests:
```tsx
import { cache } from 'react'

const getUser = cache(async (id: string) => {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
})
```

---

## 3. Server Actions

Server Actions promote separation of concerns by isolating server-side logic into dedicated functions, making components focus solely on UI rendering.

### Organization
Create Server Actions organized by feature in the `actions/` directory:

```tsx
// actions/user-actions.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  
  try {
    const user = await db.user.create({
      data: { name, email }
    })
    
    revalidatePath('/users')
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Failed to create user' }
  }
}
```

### Best Practices:
1. **Use 'use server' directive** at the top of action files
2. **Keep actions focused** - one action per responsibility
3. **Handle errors gracefully** - always return structured responses
4. **Validate input** using Zod or similar libraries
5. **Use revalidatePath/revalidateTag** for cache invalidation
6. **Avoid UI logic** in actions - they should only handle data operations

---

## 4. Data Fetching Patterns

### Parallel Data Fetching
Initiate multiple fetch requests in parallel and wait for them together to prevent waterfalls.

```tsx
// ✅ Good: Parallel fetching
async function Page() {
  const userPromise = getUser()
  const postsPromise = getPosts()
  
  const [user, posts] = await Promise.all([userPromise, postsPromise])
  
  return <div>{/* render */}</div>
}
```

### Streaming with Suspense
Use Suspense boundaries to stream content and show loading states:

```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
```

### Caching Strategy
Next.js 15 changed caching defaults - GET Route Handlers and Client Router Cache are now uncached by default.

```tsx
// Opt into caching
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const data = await fetch('https://api.example.com/data')
  return Response.json(data)
}
```

---

## 5. API Routes Best Practices

### Security First
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
})

export async function POST(request: NextRequest) {
  try {
    // 1. Validate input
    const body = await request.json()
    const validatedData = userSchema.parse(body)
    
    // 2. Authenticate (if needed)
    // const session = await getSession(request)
    
    // 3. Process request
    const user = await db.user.create({
      data: validatedData
    })
    
    // 4. Return sanitized response (no sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
        // Don't include: password, tokens, etc.
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### API Route Principles:
1. **Always validate input** with Zod or similar
2. **Use parameterized queries** to prevent SQL injection
3. **Never expose sensitive data** in responses
4. **Implement rate limiting** for protection
5. **Use proper HTTP status codes**
6. **Keep routes lean** - move business logic to separate services

---

## 6. TypeScript Best Practices

### Strict Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "strictNullChecks": true
  }
}
```

### Type Definitions
```tsx
// types/user.ts
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt'>
export type UpdateUserInput = Partial<CreateUserInput>

// types/api.ts
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Environment Variables
```tsx
// config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  API_SECRET_KEY: z.string().min(1)
})

export const env = envSchema.parse(process.env)
```

---

## 7. Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image'

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### Dynamic Imports
```tsx
import dynamic from 'next/dynamic'

// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false // Disable SSR for client-only components
})
```

### Font Optimization
```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## 8. State Management

You may not need a state management library - use React's built-in hooks (useState, useReducer, useContext) for local and global state before considering third-party libraries.

### When to Use State Libraries:
- **No external library needed**: Simple local state, forms
- **Context API**: Moderate global state (theme, auth)
- **Zustand/Jotai**: Complex state with many updates
- **Redux**: Large applications with complex state logic
- **TanStack Query**: Server state caching and synchronization

### Example with Context:
```tsx
// components/providers/auth-provider.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

---

## 9. Styling Best Practices

### Tailwind Organization
```tsx
// ✅ Good: Use component classes and @apply sparingly
// components/ui/button.tsx
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'hover:bg-gray-100': variant === 'ghost'
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg'
        },
        className
      )}
      {...props}
    />
  )
}
```

### CSS Modules (Alternative)
```tsx
// components/card.module.css
.card {
  @apply rounded-lg border border-gray-200 p-6;
}

.cardTitle {
  @apply text-xl font-semibold mb-2;
}
```

---

## 10. Testing Strategy

### Component Testing
```tsx
// __tests__/components/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## 11. SEO Optimization

### Metadata API
```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage]
    }
  }
}
```

---

## 12. Error Handling

### Error Boundaries
```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button onClick={reset} className="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
        Try again
      </button>
    </div>
  )
}
```

---

## 13. Environment Variables

```bash
# .env.local
# Public variables (accessible in browser)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Private variables (server-only)
DATABASE_URL=postgresql://user:password@localhost:5432/db
API_SECRET_KEY=your-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
```

**Rules:**
- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Never commit `.env.local` to version control
- Validate environment variables at runtime with Zod

---

## 14. Code Quality Tools

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  }
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 15. Deployment Checklist

- [ ] Remove console.logs and debug code
- [ ] Set proper environment variables
- [ ] Enable TypeScript strict mode
- [ ] Configure proper caching strategies
- [ ] Optimize images and fonts
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure CSP headers in `next.config.js`
- [ ] Set up monitoring and analytics
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals

---

## Key Takeaways

1. **Default to Server Components** - use Client Components only when necessary
2. **Organize by feature** - group related files together
3. **Keep files focused** - single responsibility principle
4. **Use TypeScript strictly** - catch errors early
5. **Optimize performance** - images, fonts, code splitting
6. **Handle errors gracefully** - error boundaries and try-catch
7. **Security first** - validate input, sanitize output
8. **Test critical paths** - unit and integration tests
9. **Monitor production** - analytics and error tracking
10. **Stay updated** - follow Next.js release notes

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

*This guide is based on Next.js 15 best practices as of 2025. Always refer to the official documentation for the latest updates.*