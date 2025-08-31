# 🚀 DevSpace - Dynamic Portfolio Platform for Developers

<div align="center">

![DevSpace Logo](public/favicon.ico)

**Create stunning developer portfolios with dynamic APIs. Manage projects, blogs, achievements, and showcase your skills.**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.17-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://devspacee.me) • [Documentation](https://devspacee.me/api) • [Report Bug](https://github.com/mrravipandee/devspace/issues) • [Request Feature](https://github.com/yourusername/devspace/issues)

</div>

## ✨ Features

### 🎨 **Modern Portfolio Design**
- **Responsive Design** - Mobile-first approach with beautiful UI
- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Glassmorphism UI** - Modern design with backdrop blur effects
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions

### 📊 **Dynamic Portfolio Management**
- **Project Showcase** - Display projects with live links, source code, and tech stacks
- **Blog Management** - Create and manage technical blog posts with rich content
- **Achievements** - Showcase certifications, hackathon wins, and professional milestones
- **Tech Stack** - Display your technology skills with proficiency levels
- **Resume Management** - Upload and manage your professional resume

### 🔌 **Powerful API System**
- **RESTful APIs** - Complete API coverage for all portfolio data
- **Public Endpoints** - No authentication required for portfolio data
- **Rate Limiting** - Generous limits (1000 req/hour, 100 req/minute)
- **CORS Enabled** - Ready for external integrations
- **Real-time Analytics** - Track API usage and portfolio views

### 🛠️ **Developer Experience**
- **TypeScript** - Full type safety and better development experience
- **SEO Optimized** - Comprehensive meta tags, sitemap, and structured data
- **PWA Ready** - Progressive Web App capabilities
- **Performance** - Optimized with Next.js 15 and Turbopack

## 🏗️ Tech Stack

### **Frontend**
- **Next.js 15.4.2** - React framework with App Router
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 12.23** - Animation library
- **Lucide React** - Beautiful icons
- **React Icons** - Additional icon sets

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB 8.17** - NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure user authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image and file storage

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Turbopack** - Fast development builds

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **MongoDB** database (local or cloud)
- **Cloudinary** account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrravipandee/devspace.git
   cd devspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/devspace
   # or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/devspace

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Optional: API URL for production
   NEXT_PUBLIC_API_URL=https://devspacee.me
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
devspace/
├── public/                 # Static assets
│   ├── fonts/             # Custom fonts
│   └── *.png, *.jpg      # Images and icons
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (dashboard)/  # Dashboard pages
│   │   ├── [username]/   # Dynamic user portfolio pages
│   │   ├── api/          # API routes
│   │   └── globals.css   # Global styles
│   ├── components/       # Reusable components
│   │   ├── LandingPage/  # Landing page components
│   │   └── dashboard/    # Dashboard components
│   ├── context/          # React contexts
│   ├── lib/              # Utility functions
│   ├── models/           # MongoDB schemas
│   └── types/            # TypeScript type definitions
├── tailwind.config.js    # Tailwind configuration
├── next.config.ts        # Next.js configuration
└── package.json          # Dependencies and scripts
```

## 🔌 API Documentation

### Base URL
```
https://devspacee.me/api
```

### Public Endpoints (No Authentication Required)

#### **User Profile**
```bash
GET /api/{username}/profile
```
Returns complete user profile information including social links, bio, and location.

#### **Projects**
```bash
GET /api/{username}/projects
```
Returns all user projects with live links, source code, and tech stack information.

#### **Blog Posts**
```bash
GET /api/{username}/blog
```
Returns published blog posts with content, excerpts, and feature images.

#### **Achievements**
```bash
GET /api/{username}/achievements
```
Returns user achievements, certifications, and professional milestones.

#### **Tech Stack**
```bash
GET /api/{username}/techstack
```
Returns user's technology skills with proficiency levels.

#### **Contributions**
```bash
GET /api/{username}/contributions
```
Returns open source contributions and GitHub activity.

#### **Resume**
```bash
GET /api/{username}/resume
```
Returns resume information and download link.

### System Endpoints

#### **Health Check**
```bash
GET /api/health
```
Check API health status and server information.

#### **Analytics** (Authentication Required)
```bash
GET /api/analytics?days=30
```
Get API usage analytics and statistics.

#### **Contact Form**
```bash
POST /api/contact
```
Submit contact form messages.

### Example Usage

```javascript
// Fetch user profile
const response = await fetch('https://devspacee.me/api/mrravipandee/profile');
const profile = await response.json();

// Fetch user projects
const projects = await fetch('https://devspacee.me/api/mrravipandee/projects');
const projectData = await projects.json();

// Fetch user achievements
const achievements = await fetch('https://devspacee.me/api/mrravipandee/achievements');
const achievementData = await achievements.json();
```

## 🎨 Portfolio Themes

### **Modern Portfolio** (`/{username}`)
- Full-featured portfolio with all sections
- Responsive grid layouts
- Interactive animations
- Social media integration

### **Link-in-Bio Style** (`/{username}/simple`)
- Minimalist design
- Clean link organization
- Mobile-optimized
- Fast loading

### **Dashboard View** (`/{username}/user`)
- Analytics and statistics
- Project management
- Activity tracking
- Professional insights

## 🛠️ Development

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Code Structure

- **Components** - Reusable UI components in `src/components/`
- **Pages** - Next.js pages in `src/app/`
- **API Routes** - Serverless functions in `src/app/api/`
- **Models** - MongoDB schemas in `src/models/`
- **Utilities** - Helper functions in `src/lib/`

### Database Models

- **User** - User profiles and authentication
- **Project** - Project information and metadata
- **Blog** - Blog posts and content
- **Achievement** - Certifications and milestones
- **TechStack** - Technology skills
- **Contribution** - Open source contributions
- **Resume** - Resume files and metadata
- **Contact** - Contact form submissions
- **ApiAnalytics** - API usage tracking

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

### Environment Variables for Production

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devspace
JWT_SECRET=your-production-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_API_URL=https://devspacee.me
```

## 📊 SEO Features

- **Meta Tags** - Comprehensive meta tags for all pages
- **OpenGraph** - Social media sharing optimization
- **Twitter Cards** - Twitter sharing optimization
- **Structured Data** - JSON-LD for rich snippets
- **Sitemap** - Dynamic sitemap generation
- **Robots.txt** - Search engine crawling rules
- **PWA Manifest** - Progressive Web App support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **MongoDB** - For the flexible database solution
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Cloudinary** - For image and file storage

## 📞 Support

- **Documentation** - [https://devspacee.me/api](https://devspacee.me/api)
- **Issues** - [GitHub Issues](https://github.com/yourusername/devspace/issues)
- **Discussions** - [GitHub Discussions](https://github.com/yourusername/devspace/discussions)
- **Email** - support@devspacee.me

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/devspace&type=Date)](https://star-history.com/#yourusername/devspace&Date)

---

<div align="center">

**Made with ❤️ by [Ravi Pandey](https://devspacee.me/mrravipandee)**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mrravipandee)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ravi-pandey)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/mrravipandee)

</div>