# Prashant.dev - Modern Portfolio Website

A modern, responsive portfolio website built with Next.js, featuring a fully customizable Content Management System (CMS) for dynamic content management. This portfolio showcases professional work, skills, experience, and projects with a beautiful, animated UI.

## ✨ Features

### 🎨 User-Facing Features
- **Modern, Animated UI**: Smooth animations and transitions powered by Framer Motion
- **Dark/Light Theme**: Theme switcher with system preference detection
- **Responsive Design**: Fully responsive layout for all devices
- **Smooth Scrolling**: Custom scroll animations and progress indicator
- **Interactive Components**: 
  - 3D animated hero section
  - Magnetic buttons
  - Spotlight cards with hover effects
  - Tilt cards for projects
  - Custom cursor effects
- **Sections**:
  - Hero section with typewriter effect
  - About section with availability status
  - Experience timeline
  - Skills showcase with infinite scroll
  - Featured projects with tags
  - Contact form with flip animation
- **SEO Optimized**: Dynamic meta tags, robots.txt, and sitemap.xml

### 🔐 Admin Panel Features
- **OTP-Based Authentication**: Secure login using email OTP
- **Content Management System (CMS)**: Manage all portfolio content dynamically
- **Modal-Based Editors**: 
  - Site Metadata (SEO settings, Open Graph, Twitter Cards)
  - Hero Section
  - About Section
  - Projects
  - Experience
  - Skills
  - Contact Information
- **Real-time Updates**: Changes reflect immediately on the frontend
- **Professional UI**: Modern admin dashboard with statistics and easy navigation

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **next-themes** - Theme management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Database for content storage
- **Nodemailer** - Email service for OTP
- **bcryptjs** - Password hashing (for future features)

### Additional Libraries
- **Typewriter Effect** - Animated typing effect
- **Sonner** - Toast notifications
- **Three.js** - 3D graphics (for future 3D elements)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or cloud)
- Email account for OTP (Gmail recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prashant-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string

   # Admin Authentication
   ADMIN_SECRET=your_super_secret_admin_key
   ADMIN_EMAIL=your-admin@email.com

   # Email Configuration (for OTP)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your_app_password

   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

   **Note**: For Gmail, you'll need to create an [App Password](https://support.google.com/accounts/answer/185833):
   - Go to Google Account settings
   - Enable 2-Step Verification
   - Generate an App Password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
prashant-portfolio/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── login/         # OTP login page
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── contact/      # Contact form endpoint
│   │   └── content/      # CMS API endpoints
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Homepage
│   ├── robots.ts         # Dynamic robots.txt
│   └── sitemap.ts        # Dynamic sitemap.xml
├── components/
│   ├── admin/            # Admin panel components
│   │   └── editors/     # Content editor modals
│   ├── About/           # About section
│   ├── Contact/         # Contact section
│   ├── Experience/      # Experience section
│   ├── Header/          # Navigation header
│   ├── Hero/            # Hero section
│   ├── Projects/        # Projects section
│   ├── Skills/          # Skills section
│   └── ui/              # Reusable UI components
├── lib/
│   ├── db.ts            # MongoDB connection utility
│   ├── models.ts        # TypeScript interfaces
│   └── otp.ts           # OTP generation/validation
└── public/              # Static assets
```

## 🔧 Configuration

### MongoDB Setup

1. Create a MongoDB database (local or MongoDB Atlas)
2. Get your connection string
3. Add it to `.env.local` as `MONGODB_URI`

The database will automatically create collections:
- `metadata` - SEO and site metadata
- `hero` - Hero section content
- `about` - About section content
- `projects` - Projects list
- `experience` - Work experience
- `skills` - Skills list
- `contact` - Contact information

### Admin Panel Access

1. Navigate to `/admin/login`
2. Enter your admin email (from `ADMIN_EMAIL`)
3. Request OTP - check your email
4. Enter the 6-digit OTP to login
5. Access the dashboard at `/admin`

## 📝 Usage

### Managing Content

1. **Login to Admin Panel**: Go to `/admin/login` and authenticate
2. **Edit Content**: Click on any section card to open the editor modal
3. **Update Information**: Modify content in the modal forms
4. **Save Changes**: Click "Save" to update the database
5. **View Changes**: Refresh the homepage to see updates

### Available Sections

- **Site Metadata**: SEO settings, meta tags, Open Graph, Twitter Cards
- **Hero Section**: Name, roles, description, avatar, resume link
- **About Section**: Bio, avatar image, availability status
- **Projects**: Add/edit projects with tags, images, and links
- **Experience**: Manage work history and roles
- **Skills**: Add/remove skills with icons
- **Contact**: Email, phone, location

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to customize theme colors:
- Light theme: `:root` variables
- Dark theme: `.dark` class variables

### Components

All components are in the `components/` directory and can be customized to match your style.

### Default Content

If MongoDB is not configured, the site uses default content from the API route files in `app/api/content/`.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted servers

**Important**: Make sure to set all environment variables in your deployment platform.

## 🔒 Security

- Admin routes are protected with Bearer token authentication
- OTP expires after 10 minutes
- Email credentials stored securely in environment variables
- Database connection uses secure connection strings

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Prashant Basnet**
- Portfolio: [prashant.dev](https://prashant.dev)
- Email: prashantbasnet664@gmail.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components inspired by modern design trends
- Icons from [Lucide](https://lucide.dev/)

---

**Note**: This is a personal portfolio project. For questions or issues, please contact the author.
