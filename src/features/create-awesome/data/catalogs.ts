/**
 * Sourced catalogs from Create-*-App templates.json (verified 2026-08-07).
 * Do not invent slugs — refresh from each family `source` URL.
 */
import type { AddonSummary, TemplateSummary, VariantId } from '../types/index.js';

export interface FamilyCatalog {
  id: VariantId;
  source: string;
  templateCount: number;
  addonCount: number;
  templates: TemplateSummary[];
  addons: AddonSummary[];
}

export const familyCatalogs: Record<VariantId, FamilyCatalog> = {
  node: {
    id: 'node',
    source: 'https://raw.githubusercontent.com/Create-Node-App/cna-templates/main/templates.json',
    templateCount: 10,
    addonCount: 53,
    templates: [
      {
        id: 'nestjs-boilerplate',
        name: 'NestJS Boilerplate',
        description: 'Modular NestJS API with TypeScript, ESLint, and Prettier',
        stack: ['NestJS', 'Backend', 'TypeScript'],
      },
      {
        id: 'nextjs-starter',
        name: 'NextJS Starter',
        description: 'Next.js App Router starter with TypeScript and a feature-based layout',
        stack: ['Next.js', 'FullStack', 'TypeScript'],
      },
      {
        id: 'turborepo-boilerplate',
        name: 'Turborepo Boilerplate',
        description: 'Turborepo workspace with TypeScript, Changesets, and shared packages',
        stack: ['Monorepo', 'Turborepo', 'TypeScript'],
      },
      {
        id: 'react-vite-boilerplate',
        name: 'React Vite Boilerplate',
        description: 'React SPA on Vite with React Router and TypeScript',
        stack: ['React', 'Vite', 'Frontend'],
        featured: true,
      },
      {
        id: 'web-extension-react-boilerplate',
        name: 'Web Extension React Boilerplate',
        description: 'React + Vite WebExtension with HMR and polyfills',
        stack: ['WebExtension', 'React', 'Vite'],
      },
      {
        id: 'webdriverio-boilerplate',
        name: 'WebdriverIO Boilerplate',
        description: 'WebdriverIO + TypeScript harness with Selenoid-friendly setup',
        stack: ['WebdriverIO', 'Testing', 'TypeScript'],
      },
      {
        id: 'nextjs-saas-ai-starter',
        name: 'NextJS SaaS AI Starter',
        description:
          'Multi-tenant Next.js SaaS with AI providers, Auth.js v5, Drizzle + PostgreSQL, Tailwind v4, shadcn/ui, RBAC, audit logs, webhooks, and i18n',
        stack: ['Next.js', 'SaaS', 'AI'],
      },
      {
        id: 'remix-starter',
        name: 'Remix / React Router v7 Starter',
        description: 'React Router v7 with file-based routes, loaders/actions, and TypeScript',
        stack: ['Remix', 'React Router', 'FullStack'],
      },
      {
        id: 'astro-starter',
        name: 'Astro Starter',
        description: 'Astro static site with TypeScript and island-friendly structure',
        stack: ['Astro', 'Static Site', 'TypeScript'],
      },
      {
        id: 'hono-starter',
        name: 'Hono Starter',
        description: 'Minimal Hono API in TypeScript',
        stack: ['Hono', 'API', 'Backend'],
      },
    ],
    addons: [
      {
        id: 'github-setup',
        name: 'GitHub Setup',
        description: 'Automate GitHub workflows with Actions, Dependabot, and templates for issues and pull requests',
        category: 'tooling',
      },
      {
        id: 'github-setup-uat',
        name: 'GitHub Setup for User Acceptance Testing',
        description:
          'This extension adds GitHub setup to your project including GitHub Actions, Dependabot, Issue Templates, Pull Request Templates, and more',
        category: 'tooling',
      },
      {
        id: 'husky-lint-staged',
        name: 'Husky + Lint Staged',
        description: 'Improve code quality with pre-commit hooks using Husky and Lint Staged',
        category: 'tooling',
      },
      {
        id: 'monorepo-husky-lint-staged',
        name: 'Husky + Lint Staged (Monorepo)',
        description: 'Improve code quality with pre-commit hooks using Husky and Lint Staged for monorepo projects',
        category: 'tooling',
      },
      {
        id: 'development-container',
        name: 'Development Container',
        description: 'Set up a development container with Docker and VSCode for consistent environments',
        category: 'tooling',
      },
      {
        id: 'jest-react-testing-library',
        name: 'Jest + React Testing Library',
        description: 'Add Jest and React Testing Library for unit and integration testing in React projects',
        category: 'tooling',
      },
      {
        id: 'vitest-react-testing-library',
        name: 'Vitest + React Testing Library',
        description:
          'Add Vitest and React Testing Library for fast Vite-native unit and integration testing in React projects',
        category: 'tooling',
      },
      {
        id: 'react-playwright',
        name: 'Playwright E2E',
        description:
          'Add Playwright end-to-end browser testing with multi-browser config, dev-server bootstrap, and CI workflow',
        category: 'tooling',
      },
      {
        id: 'react-i18n',
        name: 'React i18n',
        description: 'Add internationalization support to your React app with react-i18n and async backend',
        category: 'tooling',
      },
      {
        id: 'tanstack-react-query',
        name: 'TanStack React Query',
        description: 'High-quality open-source software for web developers',
        category: 'tooling',
      },
      {
        id: 'react-hook-form',
        name: 'React Hook Form',
        description:
          'Extension to add React Hook Form, a performant, flexible and extensible forms with easy-to-use validation',
        category: 'tooling',
      },
      {
        id: 'jotai',
        name: 'Jotai',
        description: 'Extension to add Jotai, a small and fast state management library for React',
        category: 'tooling',
      },
      {
        id: 'recoil-js',
        name: 'Recoil.js (Deprecated)',
        description: 'Extension to add Recoil.js, a state management library for React',
        category: 'tooling',
      },
      {
        id: 'hookstate',
        name: 'Hookstate',
        description: 'Add Hookstate, a modern state management solution with hooks-based API and TypeScript support',
        category: 'tooling',
      },
      {
        id: 'mobx',
        name: 'MobX',
        description: 'Extension to add MobX, a tiny state management library for React',
        category: 'tooling',
      },
      {
        id: 'teaful',
        name: 'Teaful (Deprecated)',
        description: 'Add Teaful, a tiny and fast state management solution with a simple API and TypeScript support',
        category: 'tooling',
      },
      {
        id: 'valtio',
        name: 'Valtio',
        description: 'Extension to add Valtio, a tiny state management library for React',
        category: 'tooling',
      },
      {
        id: 'xstate',
        name: 'XState',
        description:
          'Add XState, a state management and orchestration solution for complex state machines and workflows',
        category: 'tooling',
      },
      {
        id: 'zustand',
        name: 'Zustand',
        description:
          'Add Zustand, a small, fast and scalable state management solution with a simple API and TypeScript support',
        category: 'tooling',
      },
      {
        id: 'react-redux-saga',
        name: 'React Redux with Redux Saga',
        description:
          'Extension to add Redux Toolkit (RTK) with React Redux bindings and Redux Saga for side-effect management',
        category: 'tooling',
      },
      {
        id: 'react-redux-thunk',
        name: 'React Redux with Redux Toolkit',
        description:
          'Extension to add Redux Toolkit (RTK) with React Redux bindings, redux-persist, and redux-logger for a fully configured store',
        category: 'tooling',
      },
      {
        id: 'ionic-react-capacitor',
        name: 'Cross Platform Apps with Ionic React + Capacitor',
        description: 'Add Ionic React and Capacitor to your cross platform react app',
        category: 'data',
      },
      {
        id: 'docker-compose-setup',
        name: 'Docker Compose Setup',
        description: 'Add docker environments for development and production to your project setup with docker-compose',
        category: 'tooling',
      },
      {
        id: 'android-tools',
        name: 'Android Tools',
        description:
          'Avoid using heavy IDEs by installing this extension that creates an elegant tool setup for your android app',
        category: 'data',
      },
      {
        id: 'semantic-ui-react',
        name: 'Semantic UI React',
        description: 'Extension to add Semantic UI React to your setup',
        category: 'styling',
      },
      {
        id: 'semantic-ui-react-theme',
        name: 'Semantic UI React with Theme',
        description: 'Extension to add Semantic UI React to your setup with theme customization',
        category: 'styling',
      },
      {
        id: 'material-ui',
        name: 'Material UI',
        description:
          'Add Material UI components and theming capabilities to your React application with TypeScript support and best practices',
        category: 'styling',
      },
      {
        id: 'ant-design-react',
        name: 'Ant Design for React',
        description:
          'Add Ant Design React components with TypeScript support, theming capabilities and enterprise-grade UI patterns',
        category: 'styling',
      },
      {
        id: 'bootstrap-react',
        name: 'Bootstrap React',
        description: 'Add Bootstrap React components with TypeScript support and responsive design patterns',
        category: 'styling',
      },
      {
        id: 'drizzle-orm-sqlite',
        name: 'Drizzle ORM SQLite',
        description:
          'Add Drizzle ORM with SQLite to your NestJS API with TypeScript support and best practices for database operations',
        category: 'data',
      },
      {
        id: 'drizzle-orm-postgresql',
        name: 'Drizzle ORM PostgreSQL',
        description:
          'Add Drizzle ORM with PostgreSQL to your NestJS API with TypeScript support and best practices for database operations',
        category: 'data',
      },
      {
        id: 'mongoose-orm-mongodb',
        name: 'Mongoose ORM MongoDB',
        description:
          'Add Mongoose ORM with MongoDB to your NestJS API with TypeScript support and best practices for NoSQL database operations',
        category: 'data',
      },
      {
        id: 'serverless-framework',
        name: 'Serverless Framework',
        description:
          'Add Serverless Framework packaging to deploy your NestJS API to AWS Lambda with TypeScript support and best practices for serverless archit…',
        category: 'deploy',
      },
      {
        id: 'react-million-dom-optimization',
        name: 'React Million DOM Optimization',
        description: 'Extension to add Million DOM Optimization to your React app',
        category: 'tooling',
      },
      {
        id: 'openapi',
        name: 'OpenAPI',
        description: 'Extension to add OpenAPI documentation to your NestJS API',
        category: 'tooling',
      },
      {
        id: 'react-electron-vite',
        name: 'React Electron Vite',
        description: 'Add Electron to your cross platform React Vite app',
        category: 'data',
      },
      {
        id: 'tailwind-css',
        name: 'Tailwind CSS',
        description: 'Add Tailwind CSS utility-first styling with PostCSS and dark mode class strategy',
        category: 'styling',
      },
      {
        id: 'shadcn-ui',
        name: 'shadcn/ui',
        description:
          'Add shadcn/ui component primitives (Radix UI + Tailwind CSS) with variant-based theming utilities',
        category: 'styling',
      },
      {
        id: 'nextjs-tailwindcss',
        name: 'Tailwind CSS for Next.js',
        description:
          'Add Tailwind CSS v4 to your Next.js project with PostCSS configuration and utility-first CSS setup',
        category: 'styling',
      },
      {
        id: 'nextjs-shadcn',
        name: 'shadcn/ui for Next.js',
        description:
          'Add shadcn/ui component library to your Next.js project with Radix UI primitives, class-variance-authority, and a cn() utility',
        category: 'styling',
      },
      {
        id: 'nextjs-drizzle-postgres',
        name: 'Drizzle ORM + PostgreSQL for Next.js',
        description: 'Add Drizzle ORM with PostgreSQL to your Next.js project',
        category: 'data',
      },
      {
        id: 'nextjs-auth',
        name: 'Auth.js v5 for Next.js',
        description:
          'Add Auth.js v5 (next-auth@beta, latest: 5.0.0-beta.31) to your Next.js project with OAuth providers support, database sessions, and TypeScr…',
        category: 'tooling',
      },
      {
        id: 'nextjs-authkit',
        name: 'WorkOS AuthKit',
        description:
          'Hosted authentication platform with pre-built UI, SSO, MFA, and password reset via WorkOS AuthKit',
        category: 'tooling',
      },
      {
        id: 'nextjs-t3-env',
        name: 't3-env for Next.js',
        description:
          'Add type-safe environment variable validation with @t3-oss/env-nextjs and Zod, including server/client split and SKIP_ENV_VALIDATION for CI',
        category: 'tooling',
      },
      {
        id: 'nextjs-trpc',
        name: 'tRPC for Next.js',
        description:
          'Add tRPC v11 with TanStack Query and App Router fetch adapter for end-to-end type-safe APIs without code generation',
        category: 'tooling',
      },
      {
        id: 'nextjs-i18n',
        name: 'next-intl (i18n) for Next.js',
        description:
          'Add internationalization to your Next.js project using next-intl with English and Spanish translations, middleware routing, and type-safe m…',
        category: 'tooling',
      },
      {
        id: 'sentry',
        name: 'Sentry for Next.js',
        description:
          'Add Sentry error tracking and performance monitoring to your Next.js project with client/server configuration and source map upload support',
        category: 'tooling',
      },
      {
        id: 'apollo-client',
        name: 'Apollo Client for React',
        description: 'Add Apollo Client for GraphQL data fetching, caching, and state management in React applications',
        category: 'data',
      },
      {
        id: 'storybook',
        name: 'Storybook',
        description: 'Add Storybook for isolated component development, visual testing, and interactive documentation',
        category: 'tooling',
      },
      {
        id: 'nextjs-react-query',
        name: 'React Query for Next.js',
        description:
          'Add TanStack React Query with SSR-compatible setup for Next.js App Router, including hydration support and query client factory',
        category: 'data',
      },
      {
        id: 'nextjs-prisma',
        name: 'Prisma for Next.js',
        description:
          'Add Prisma ORM with PostgreSQL for type-safe database access, schema management, and migrations in Next.js',
        category: 'data',
      },
      {
        id: 'nextjs-turso',
        name: 'Turso/libSQL for Next.js',
        description:
          'Add Turso (libSQL) database client with Drizzle ORM for edge-ready SQLite database access in Next.js',
        category: 'data',
      },
      {
        id: 'react-react-router',
        name: 'React Router v7',
        description: 'Adds React Router v7 with BrowserRouter setup and sample pages',
        category: 'tooling',
      },
    ],
  },
  python: {
    id: 'python',
    source: 'https://raw.githubusercontent.com/Create-Python-App/cpa-templates/main/templates.json',
    templateCount: 6,
    addonCount: 18,
    templates: [
      {
        id: 'fastapi-starter',
        name: 'FastAPI Starter',
        description:
          'Production-ready FastAPI API with feature-based layout, uv, Ruff, pytest, mypy, pyright, and pydantic-settings',
        stack: ['FastAPI', 'API', 'Python'],
        featured: true,
      },
      {
        id: 'cli-starter',
        name: 'CLI Starter',
        description: 'Typer CLI with multi-command layout, uv, Ruff, pytest, and a console script entry point',
        stack: ['CLI', 'Typer', 'Python'],
      },
      {
        id: 'celery-worker',
        name: 'Celery Worker',
        description: 'Celery worker with modular tasks, Redis defaults, pydantic-settings, and eager-mode tests',
        stack: ['Celery', 'Worker', 'Redis'],
      },
      {
        id: 'django-api',
        name: 'Django API',
        description: 'Django + DRF API with feature apps, OpenAPI-friendly health probes, uv, Ruff, and pytest-django',
        stack: ['Django', 'DRF', 'API'],
      },
      {
        id: 'uv-workspace-starter',
        name: 'uv Workspace Starter',
        description:
          'Python monorepo using uv workspaces: shared packages/ libraries and apps/ deployables with one lockfile, Ruff, Pyright, and pytest',
        stack: ['Monorepo', 'uv', 'Workspace'],
      },
      {
        id: 'mlops-sklearn-starter',
        name: 'MLOps sklearn Starter',
        description:
          'CPU-first sklearn MLOps pipeline with YAML configs, step architecture, local MLflow, and batch/FastAPI serving',
        stack: ['MLOps', 'sklearn', 'MLflow'],
      },
    ],
    addons: [
      {
        id: 'github-setup',
        name: 'GitHub Setup',
        description:
          'GitHub Actions CI, MegaLinter, Danger PR review, todo-to-issue, Dependabot, and issue/PR templates',
        category: 'tooling',
      },
      {
        id: 'development-container',
        name: 'Development Container',
        description: 'VS Code Dev Container with Python 3.12 and uv for consistent editor environments across stacks',
        category: 'tooling',
      },
      {
        id: 'postgres',
        name: 'Postgres',
        description: 'PostgreSQL 16 Compose service under docker/postgres/ plus env examples',
        category: 'data',
      },
      {
        id: 'fastapi-cors',
        name: 'FastAPI CORS',
        description: 'CORS middleware helper for FastAPI (no-op without CORS_ORIGINS)',
        category: 'tooling',
      },
      {
        id: 'fastapi-docker',
        name: 'FastAPI Docker',
        description: 'Dockerfile and Compose for FastAPI (uvicorn app.main:app)',
        category: 'deploy',
      },
      {
        id: 'django-docker',
        name: 'Django Docker',
        description: 'Dockerfile and Compose for Django (runserver / gunicorn config.wsgi)',
        category: 'deploy',
      },
      {
        id: 'celery-docker',
        name: 'Celery Docker',
        description: 'Dockerfile and Compose for a Celery worker plus Redis broker',
        category: 'deploy',
      },
      {
        id: 'fastapi-sqlalchemy',
        name: 'FastAPI SQLAlchemy',
        description: 'SQLAlchemy 2.x session helpers and Alembic migrations for FastAPI (writes app/db/)',
        category: 'data',
      },
      {
        id: 'fastapi-redis',
        name: 'FastAPI Redis',
        description: 'Redis client helper under app/core plus a local Redis Compose service for FastAPI apps',
        category: 'data',
      },
      {
        id: 'fastapi-sentry',
        name: 'FastAPI Sentry',
        description: 'Sentry SDK helper for FastAPI with env-driven init (no-op without SENTRY_DSN)',
        category: 'tooling',
      },
      {
        id: 'fastapi-auth-jwt',
        name: 'FastAPI Auth JWT',
        description: 'JWT auth feature skeleton under app/features/auth for FastAPI starters',
        category: 'tooling',
      },
      {
        id: 'pre-commit',
        name: 'Pre-commit',
        description: 'Local quality gates with Ruff, YAML validation, and whitespace checks for every CPA template',
        category: 'tooling',
      },
      {
        id: 'fastapi-opentelemetry',
        name: 'FastAPI OpenTelemetry',
        description:
          'OpenTelemetry tracing and logging hooks for FastAPI projects, useful for local debugging and observability setup',
        category: 'tooling',
      },
      {
        id: 'fastapi-rate-limit',
        name: 'FastAPI Rate Limit',
        description: 'Rate limiting helper using slowapi (in-memory by default, Redis-ready)',
        category: 'tooling',
      },
      {
        id: 'fastapi-mlflow-tracing',
        name: 'FastAPI MLflow Tracing',
        description: 'Generic MLflow tracing infrastructure for FastAPI',
        category: 'tooling',
      },
      {
        id: 'fastapi-rag-pgvector',
        name: 'FastAPI RAG pgvector',
        description: 'Foundational RAG data layer using pgvector',
        category: 'tooling',
      },
      {
        id: 'fastapi-ai-chat',
        name: 'FastAPI AI Chat',
        description: "Minimal /chat endpoint backed by LangChain's BaseChatModel",
        category: 'tooling',
      },
      {
        id: 'django-spectacular',
        name: 'Django Spectacular',
        description: 'OpenAPI 3 schema generation and Swagger UI for Django REST Framework',
        category: 'tooling',
      },
    ],
  },
  v: {
    id: 'v',
    source: 'https://raw.githubusercontent.com/Create-Vlang-App/cva-templates/main/templates.json',
    templateCount: 7,
    addonCount: 11,
    templates: [
      {
        id: 'web-server',
        name: 'Web Server',
        description: 'HTTP server starter using veb',
        stack: ['web', 'wave-1', 'veb'],
        featured: true,
      },
      {
        id: 'cli-app',
        name: 'Cli App',
        description: 'CLI application using os and cli modules',
        stack: ['cli', 'wave-1'],
      },
      {
        id: 'library-starter',
        name: 'Library Starter',
        description: 'Publishable V library with examples and tests',
        stack: ['library', 'wave-1'],
      },
      {
        id: 'systems-app',
        name: 'Systems App',
        description: 'Low-level systems-oriented starter with GC guidance',
        stack: ['systems', 'wave-1', 'no-gc'],
      },
      {
        id: 'vsl-starter',
        name: 'Vsl Starter',
        description: 'Scientific Computing Starter (vsl) — numerics topology; add plotting/ML via addons',
        stack: ['scientific', 'growth', 'vsl'],
      },
      {
        id: 'vtl-starter',
        name: 'Vtl Starter',
        description: 'ML / Tensor Starter (vtl) — tensor topology; add NN/bridge via addons',
        stack: ['machine-learning', 'growth', 'vtl'],
      },
      {
        id: 'rxv-starter',
        name: 'Rxv Starter',
        description: 'Reactive App Starter (rxv) — observable topology; add operators via addons',
        stack: ['reactive', 'growth', 'rxv'],
      },
    ],
    addons: [
      {
        id: 'github-setup',
        name: 'Github Setup',
        description: 'GitHub Actions CI using vlang/setup-v',
        category: 'tooling',
      },
      { id: 'v-docker', name: 'V Docker', description: 'Dockerfile and docker-compose for V apps', category: 'deploy' },
      { id: 'v-sqlite', name: 'V Sqlite', description: 'SQLite environment and sample wiring', category: 'data' },
      {
        id: 'v-postgres',
        name: 'V Postgres',
        description: 'Postgres compose overlay and environment sample',
        category: 'data',
      },
      {
        id: 'v-fmt-vet',
        name: 'V Fmt Vet',
        description: 'Format and vet hooks (pre-commit + Makefile targets)',
        category: 'tooling',
      },
      {
        id: 'development-container',
        name: 'Development Container',
        description: 'Devcontainer with V toolchain via setup-v patterns',
        category: 'deploy',
      },
      {
        id: 'vsl-plotting',
        name: 'Vsl Plotting',
        description: 'vsl.plot wiring and scatter helper for scientific starters (no GUI in unit tests)',
        category: 'tooling',
      },
      {
        id: 'vsl-classical-ml',
        name: 'Vsl Classical Ml',
        description: 'Classical ML smoke (linear regression style) on vsl-starter',
        category: 'tooling',
      },
      {
        id: 'vtl-nn-cpu',
        name: 'Vtl Nn Cpu',
        description: 'Tiny CPU neural-net training loop for vtl-starter (CI-safe)',
        category: 'tooling',
      },
      {
        id: 'vtl-vsl-bridge',
        name: 'Vtl Vsl Bridge',
        description: 'Bridge VTL tensors to vsl.plot (compose vsl+vtl without a combined base)',
        category: 'tooling',
      },
      {
        id: 'rxv-operators',
        name: 'Rxv Operators',
        description: 'Reactive operator chain (filter/map/reduce) beyond hello-world rxv',
        category: 'tooling',
      },
    ],
  },
};
