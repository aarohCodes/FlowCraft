# FlowCraft - AI Productivity Suite

A comprehensive productivity application with AI-powered features for task management, education, email management, and video meeting tools.

## Features

- **Dashboard**: Overview of tasks, activities, and metrics
- **Task Management**: Create, organize, and track tasks
- **Education Tools**: Flashcards and learning management
- **Email Integration**: AI-powered email management
- **Video Meeting Tools**: Zoom integration and transcript analysis
- **Analytics**: Performance tracking and insights
- **Premium Features**: Advanced AI tools and integrations

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings and copy your project URL and anon key
3. Update the `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Setup

The application uses the following Supabase tables:

- `user_profiles`: User profile information
- `tasks`: Task management data
- `flashcards`: Educational content

These tables are automatically created when users sign up, or you can run the migration in the `supabase/migrations/` folder.

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Authentication

The application uses Supabase Authentication for:

- User registration and login
- Session management
- User profile storage
- Secure API access

## Development

- **Frontend**: React with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context API
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── lib/           # Utility libraries (Supabase, auth)
├── pages/         # Main application pages
├── services/      # API service functions
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License 