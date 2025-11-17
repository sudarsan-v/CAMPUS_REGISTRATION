# Campus Registration System

A comprehensive full-stack web application for campus registration and student management, built with React.js frontend and Express.js backend.

## 🌟 Features

### ✨ Modern UI/UX
- **Collapsible Sidebar** with icons and hover tooltips
- **Responsive Design** that works on mobile and desktop
- **Interactive Dashboard** with professional animations
- **Beautiful Reports** with advanced data visualization

### 📊 Comprehensive Reporting Suite
1. **Cumulative Performance** - Overall academic progress tracking
2. **Error List** - Advanced error analysis with search/sort/export
3. **Question Review** - Dynamic question navigation and review
4. **Practice Wrong/Unattempted** - Interactive practice sessions
5. **Time Taken Analysis** - Performance timing with modal viewer
6. **Question Paper Weightage** - Complex multi-level table analysis

### 🔔 Communication System
- **Notifications Center** with detail views
- **Progress Tracking** for student advancement
- **Real-time Updates** and alerts

### 🔒 Security & Authentication
- **JWT-based Authentication** with secure session management
- **Role-based Access Control**
- **Profile Management** with photo uploads

### ☁️ AWS Integration
- **S3 Photo Storage** - Complete photo management system
- **Lambda Deployment** - Serverless backend deployment
- **CDK Infrastructure** - Infrastructure as code

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- AWS Account with S3 and Lambda access
- Git for version control

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sudarsan-v/CAMPUS_REGISTRATION.git
   cd CAMPUS_REGISTRATION
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd src/backend
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment template
   cp src/backend/.env.example src/backend/.env
   
   # Edit .env with your credentials
   nano src/backend/.env
   ```

5. **Configure Environment Variables**
   ```env
   # AWS Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-s3-bucket
   
   # Database Configuration
   DB_HOST=your_database_host
   DB_PORT=5432
   
   # API Configuration
   API_BASE_URL=http://localhost:3001
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1: Frontend (React)
   npm start
   
   # Terminal 2: Backend (Express)
   cd src/backend
   npm start
   ```

## 📦 Deployment

### AWS Lambda Deployment
```bash
# Build and deploy to AWS Lambda
npm run build
./deploy-lambda.sh

# Or use the Windows batch file
deploy-lambda.bat
```

### CDK Infrastructure
```bash
# Deploy infrastructure with CDK
cdk deploy

# Follow the CDK deployment guide
cat CDK-DEPLOYMENT-GUIDE.md
```

## 🗃️ Project Structure

```
campus-registration/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Main application pages
│   │   ├── StudentDashboard.jsx
│   │   ├── CumulativePerformancePage.jsx
│   │   ├── ErrorListPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── ProgressReportPage.jsx
│   │   └── ...
│   ├── backend/           # Express.js backend
│   │   ├── server.js      # Main server file
│   │   ├── lambda-handler.js
│   │   └── utils/         # Backend utilities
│   ├── config/            # API configuration
│   └── utils/             # Frontend utilities
├── build/                 # Production build files
├── deploy/                # Deployment scripts
└── docs/                  # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **FontAwesome** for icons
- **Bootstrap** for responsive design
- **Axios** for API calls

### Backend
- **Express.js** with middleware
- **AWS SDK v3** for cloud integration
- **JWT** for authentication
- **CORS** for cross-origin requests

### Cloud & DevOps
- **AWS S3** for file storage
- **AWS Lambda** for serverless functions
- **CDK** for infrastructure
- **Git** for version control

## 🎨 Key Features Deep Dive

### Sidebar Navigation
- **Auto-collapse/expand** on hover
- **Icon tooltips** when collapsed
- **Smooth animations** and transitions
- **Mobile-responsive** design

### Reporting System
- **6 different report types** with unique layouts
- **Advanced data tables** with search/sort/filter
- **Export functionality** for data analysis
- **Interactive modals** for detailed views

### Photo Management
- **Drag & drop uploads** to S3
- **Automatic resizing** and optimization
- **Secure signed URLs** for access
- **Delete and replace** functionality

## 🚨 Troubleshooting

### Common Issues
1. **Environment Variables**: Ensure all required variables are set
2. **AWS Permissions**: Verify S3 and Lambda access rights
3. **CORS Issues**: Check API configuration for frontend domain
4. **Build Errors**: Clear node_modules and reinstall

### Debug Resources
- `LAMBDA-502-TROUBLESHOOTING.md` - Lambda debugging guide
- `PROFILE_API_DEBUGGING.md` - Profile API issues
- `DEPLOYMENT-LOG.md` - Deployment history and fixes

## 📞 Support & Documentation

- **Deployment Guide**: `CDK-DEPLOYMENT-GUIDE.md`
- **Deployment Checklist**: `DEPLOYMENT-CHECKLIST.md`
- **API Documentation**: `PROFILE_API_FIXED.md`
- **Troubleshooting**: `LAMBDA-502-TROUBLESHOOTING.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔄 Version History

- **v1.0** - Initial release with basic functionality
- **v2.0** - Added comprehensive reporting suite
- **v3.0** - Implemented modern UI with collapsible sidebar
- **v4.0** - Complete AWS integration and deployment

## 🎯 Roadmap

- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics dashboard
- [ ] Mobile application development
- [ ] Multi-language support
- [ ] Advanced role management

---

**Built with ❤️ by the Campus Registration Team**

For technical support: [sudarsan.v@codonsystems.com](mailto:sudarsan.v@codonsystems.com)
