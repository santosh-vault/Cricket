# CricNews - Cricket News & Live Score App

A full-stack cricket news and live score application built with React.js and Supabase.

## Features

### Frontend
- **React.js** with TypeScript for type safety
- **React Router DOM** for client-side routing
- **React Helmet Async** for SEO optimization
- **Tailwind CSS** for styling
- **Responsive design** optimized for all devices
- **Progressive Web App** capabilities

### Pages
- **Home** - Featured news, upcoming matches, and stats
- **News** - Cricket news with search and category filters
- **Blogs** - In-depth analysis and opinion pieces
- **Fixtures** - Match schedules with live updates
- **Scorecard** - Live match scorecards and statistics
- **Admin Dashboard** - Content management system

### Admin Features
- **Authentication** using Supabase Auth
- **Content Management** - Create, edit, delete news and blogs
- **Fixture Management** - Add and manage cricket fixtures
- **Media Upload** - Image management for posts
- **Publishing Control** - Draft and publish content
- **User Management** - Admin role assignment

### Backend (Supabase)
- **PostgreSQL Database** with Row Level Security
- **Real-time subscriptions** for live updates
- **Authentication & Authorization**
- **File Storage** for images and media
- **Edge Functions** for serverless operations

### SEO & Performance
- **Server-side rendering** ready
- **Meta tags optimization** with React Helmet
- **Open Graph tags** for social sharing
- **Structured data** for search engines
- **Sitemap and robots.txt** generation
- **Image optimization** and lazy loading

## Database Schema

### Tables
- `users` - User accounts with role-based access
- `posts` - News articles and blog posts
- `fixtures` - Cricket match schedules
- `scorecards` - Match statistics and live data

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cricket-news-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new project in Supabase
   - Run the SQL migrations in order:
     1. `supabase/migrations/20250701082255_fragrant_coast.sql`
     2. `supabase/migrations/add_default_admin_user.sql`
   - **Important**: Create the admin user in Supabase Auth dashboard (see Admin Access section below)

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Admin Access

### Default Admin Credentials
- **Email**: `admin@cricnews.com`
- **Password**: `CricNews2024!`

### Setup Instructions
1. **Run the database migrations** in your Supabase SQL editor
2. **Create the admin user** in Supabase Auth:
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Users
   - Click "Add user"
   - Enter email: `admin@cricnews.com`
   - Enter password: `CricNews2024!`
   - Click "Create user"
3. **Access the admin dashboard** at `/admin/login`
4. **Sign in** with the credentials above

The migrations will automatically create the user record in the database with admin privileges. You just need to create the authentication record through the Supabase dashboard.

### Admin Dashboard Features
- **Content Management**: Create, edit, and delete news articles and blog posts
- **Fixture Management**: Add and manage cricket match fixtures
- **Publishing Control**: Draft and publish content with scheduling
- **Analytics Overview**: View content statistics and engagement metrics
- **User Management**: Manage user roles and permissions

## Usage

### Content Management
- **News Articles**: Create breaking news and match reports
- **Blog Posts**: Write analysis and opinion pieces
- **Fixtures**: Add upcoming matches and tournaments
- **Live Scores**: Update match scorecards in real-time

### SEO Optimization
- Each page includes proper meta tags and structured data
- Images are optimized for web delivery
- Content is indexed by search engines
- Social sharing is optimized with Open Graph tags

## Sample Data

The application comes with sample data including:
- **News Articles**: Recent cricket news and match reports
- **Blog Posts**: Analysis and opinion pieces
- **Fixtures**: Upcoming and completed matches
- **Live Scorecard**: Sample live match data

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository to Vercel or Netlify
2. Set environment variables in the hosting platform
3. Deploy with automatic builds on push

### Backend (Supabase)
- Supabase handles all backend infrastructure
- Database migrations are applied automatically
- Real-time features work out of the box

## API Integration

The app supports integration with cricket APIs for live data:
- Match fixtures and results
- Live scorecard updates
- Player statistics
- Tournament information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.