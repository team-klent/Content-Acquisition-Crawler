# Content Acquisition Crawler - Turborepo Monorepo

This is a [Turborepo](https://turbo.build/repo) monorepo containing the Content Acquisition Crawler application and its shared packages.

## Structure

```
├── apps/
│   ├── content-acquisition/    # Main Next.js application for content acquisition
│   └── inventory/              # Inventory management application
├── packages/
│   ├── shared/                 # Shared components and utilities
│   ├── ui/                     # UI component library  
│   └── utils/                  # Utility functions
└── turbo.json                  # Turborepo configuration
```

## Getting Started

This monorepo uses [pnpm](https://pnpm.io) as the package manager and [Turborepo](https://turbo.build/repo) for build orchestration.

### Prerequisites

- Node.js 18+ 
- pnpm 9+

### Installation

```bash
pnpm install
```

### Development

Run all packages in development mode:

```bash
pnpm run dev
```

This will start:
- Next.js development server for the content acquisition app (usually on port 3001)
- Next.js development server for the inventory app (usually on port 3002)
- TypeScript watch mode for all packages

### Building

Build all packages and apps:

```bash
pnpm run build
```

### Other Commands

- `pnpm run lint` - Lint all packages
- `pnpm run type-check` - Type check all packages

## Packages

### Apps

- **content-acquisition**: Main Next.js application for content acquisition and PDF processing
- **inventory**: Inventory management application for workflow file tracking

### Packages

- **@content-acquisition/shared**: Shared components and utilities
- **@content-acquisition/ui**: UI component library
- **@content-acquisition/utils**: Utility functions and helpers

## Turborepo Features

This setup includes:

- **Build caching**: Incremental builds with intelligent caching
- **Parallel execution**: Run tasks across packages in parallel
- **Task dependencies**: Automatic ordering of dependent tasks
- **Development mode**: Watch mode for all packages simultaneously

---

# Original Content Acquisition Crawler Documentation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Deploying your new service for the firs time
### Before deploying your service for the first time make sure you have prepared these items in order for your application to be deployed seamlessly together with the other services.

- [Dockerfile](https://docs.docker.com/reference/dockerfile/) - Making sure docker file follows the sample of the [`Dockerfile.sample`](/Dockerfile.sample) if your service needs a little more complex configuration make sure to let the others know.

- [ecosystem.config.js](https://pm2.keymetrics.io/docs/usage/application-declaration/) - Since we will be using [pm2](https://pm2.keymetrics.io/) to deploy your application inside the server.

- Service entry inside [applications.json](/applications.json), add the service's information inside the array
```bash
{
    "services": [
        {
            "name": "content",
            "directory": "apps/content-acquisition", 
            "port": 3000 
        },
        {
            "name": "inventory",
            "directory": "apps/inventory",
            "port": 3002
        }
        {
            "name": "service-name", //name of your service
            "directory" : "apps/your-service's root folder",
            "port": 5000, //Ask the project owner or some one who works on the server for a free specific port that your applicatin can run and be listened on. 
        }
    ]
}
```

 ### With that the directory should be like this
 ```
├── apps/
│   ├── content-acquisition/         # Service 1
│   ├── inventory/                   # Service 2
|   └── your-service/                # ROOT DIRECTORY OF THE SERVICE
|       ├── Dockerfile               # Name should be Dockerfile (match the case)
|       └── ecosystem.config.js      # pm2 configuration for your file
|     
├── application.json                 # Entry of your service
├── Dockerfile.sample                # Sample Dockerfile that you can use as base referece
├── packages/
│   ├── shared/                 
│   ├── ui/                     
│   └── utils/                  
└── turbo.json                  
```
_Make sure to let the others know about the new service_
