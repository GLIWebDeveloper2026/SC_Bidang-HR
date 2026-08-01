# MUI Admin Dashboard

A modern, production-ready admin dashboard built with React 19 and Material UI 7.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![MUI](https://img.shields.io/badge/MUI-7-007fff.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)

## Features

- **Dashboard Analytics** - Overview, User Behavior, and Performance tabs with interactive charts
- **Account Management** - Full CRUD with search, filter, sort, and pagination
- **User Management** - User table with avatars, roles, and status badges
- **Billing** - Invoice tracking with plan management
- **Responsive Design** - Sidebar drawer on mobile, permanent on desktop
- **Theme Switching** - Light/dark mode with localStorage persistence
- **Authentication Ready** - JWT token management scaffolding

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Full type safety
- **Vite 6** - Lightning fast dev server and builds
- **MUI 7** - Material UI components
- **React Router 7** - Client-side routing
- **React Query 5** - Server state management
- **Recharts** - Data visualization
- **React Hook Form + Zod** - Form handling and validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mui-admin-dashboard.git
cd mui-admin-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Login

Use any email/password combination to log in (demo mode).

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── api/              # API client and hooks
├── components/
│   ├── common/       # Reusable components (DataTable, StatCard, etc.)
│   ├── forms/        # Form components with RHF integration
│   └── layout/       # App layout (Sidebar, Header, etc.)
├── context/          # React contexts (Auth, Theme)
├── hooks/            # Custom hooks
├── pages/            # Page components
├── routes/           # Routing configuration
├── theme/            # MUI theme configuration
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Screenshots

### Dashboard Overview
Analytics dashboard with stat cards and line charts.

### User Management
Data table with avatars, search, filter, and pagination.

### Billing
Invoice management with plan selection.

## Customization

### Theme
Edit `src/theme/lightPalette.ts` and `src/theme/darkPalette.ts` to customize colors.

### API Integration
Update `src/api/client.ts` to configure your API base URL and authentication.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Material UI](https://mui.com/) for the component library
- [Recharts](https://recharts.org/) for charts
- [React Hook Form](https://react-hook-form.com/) for form handling
