# Reconstruction Platform

A comprehensive digital platform connecting investors, landowners, engineers, service providers, and resource suppliers for post-war reconstruction projects. The platform streamlines the entire reconstruction lifecycle — from land discovery and investment to project execution and resource management.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Internationalization](#internationalization)
- [Design System](#design-system)
- [License](#license)

## Overview

Reconstruction is a multi-role marketplace designed to accelerate post-war rebuilding by uniting all stakeholders on a single platform. Investors discover vetted reconstruction projects, landowners list properties, engineers find work, and service/resource providers offer their capabilities — all with transparent project tracking and financial management.

## Features

### For Investors
- Browse and search available lands and buildings for investment
- Track project progress, budgets, and timelines in real time
- Request and manage resource orders from verified providers
- View detailed financial reports and invoices

### For Landowners
- List properties for sale with location mapping and ownership verification
- Connect with serious investors through a trusted marketplace

### For Engineers
- Access a dedicated workspace for assigned construction projects
- Manage site-specific tasks, permissions, and progress reports

### For Service & Resource Providers
- Manage work sites, inventory, and resource catalogs
- Handle investor requests with approval workflows
- Track orders, invoices, and delivery status
- View operational statistics and performance insights

### Shared
- Role-based authentication and onboarding (investor, engineer, service provider, resource provider)
- Full Arabic and English internationalization (RTL support)
- Interactive landing page with testimonials and feature showcase
- Responsive design across all device sizes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix Primitives) |
| State Management | Zustand |
| Server State | TanStack React Query |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| i18n | i18next + react-i18next |
| Icons | Lucide React |
| Animations | Framer Motion |
| Charts | Recharts |
| 3D | Three.js (React Three Fiber) |
| PDF Generation | React PDF Renderer |

## Project Structure

```
src/
├── app/                    # App entry, providers, and route definitions
├── assets/                 # Static assets (fonts, images)
├── components/
│   ├── 3d/                 # Three.js 3D components
│   ├── animations/         # Framer Motion animation wrappers
│   ├── common/             # Shared components (Navbar, Progress, Toggle)
│   ├── inputs/             # Form input components (ImageUploader, etc.)
│   ├── layouts/            # Page layout wrappers
│   ├── model/              # 3D model components
│   ├── shared/             # Cross-feature shared UI
│   └── ui/                 # shadcn/ui primitives (Button, Card, Table, etc.)
├── config/                 # App configuration
├── constant/               # Constants and enums
├── data/                   # Mock data and fixtures
├── features/
│   ├── Auth/               # Authentication (login, register, role selection)
│   ├── category-bank/      # Resource category management
│   ├── home/               # Dashboard home page
│   ├── investor/           # Investor-facing views
│   ├── landing-page/       # Public marketing landing page
│   ├── orders/             # Order management and workflows
│   ├── resource-providor/  # Resource provider (work sites, inventory, stats, requests)
│   └── service-providor/   # Service provider (company services, orders)
├── hooks/                  # Custom React hooks
├── lang/                   # Shared translation files (navbar, profile, common)
├── lib/                    # Utilities, i18n config, API instance
├── pages/                  # Route-level page components
├── services/               # API service layer
├── stores/                 # Zustand state stores
├── styles/                 # Global CSS and Tailwind theme
└── types/                  # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd reconstruction

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run create-feature` | Scaffold a new feature module |
| `npm run init-api` | Generate API service boilerplate |
| `npm run api-method` | Generate a new API method |

## Internationalization

The project supports Arabic (default) and English with full RTL/LTR layout switching. Translations are split by feature:

```
src/
├── lang/                           # Shared keys (navbar, profile, common)
├── features/Auth/i18n/             # Auth translations
├── features/resource-providor/i18n/# Resource provider translations
├── features/service-providor/i18n/ # Service provider translations
├── features/landing-page/i18n/     # Landing page translations
├── features/orders/i18n/           # Orders translations
└── features/home/i18n/             # Home dashboard translations
```

All feature translation files are merged into a single `translation` namespace at startup via `src/lib/i18n.ts`, so existing `t('key.path')` calls remain unchanged.

## Design System

The design system is documented in [`DESIGN.md`](./DESIGN.md) and covers:

- **Color tokens** — Canvas, ink, brand, and semantic color scales
- **Typography** — Locked typographic scale with defined sizes and weights
- **Spacing** — 4px grid rhythm for all margins, padding, and gaps
- **Component specs** — State matrices for buttons, inputs, badges, and cards
- **Responsive layout** — Breakpoint definitions and dense-data layout rules
- **Accessibility** — WCAG AA/AAA contrast requirements, focus visibility, touch targets

## License

Private — All rights reserved.
