# AI Lead Finder 🚀

A powerful SaaS application that automates job scraping and outreach to help you find your next opportunity.

## ✨ Features

### 🔍 **Job Scraping**
- **LinkedIn Integration**: Professional job listings with Selenium automation
- **Smart Filtering**: Filter by keyword, location, and job type
- **Batch Processing**: Scrape multiple jobs at once with configurable limits
- **Real-time Results**: See scraping progress and results instantly
- **Production Ready**: Stable, scalable scraping solution

### 📧 **Automated Email Outreach**
- **AI-Powered Messages**: Generate personalized outreach messages using GPT
- **Email Extraction**: Automatically extract contact emails from job descriptions
- **Bulk Campaigns**: Send outreach emails to multiple companies at once
- **Campaign Tracking**: Track email status and responses

### 🎯 **Lead Management**
- **Centralized Dashboard**: View all your leads in one place
- **Status Tracking**: Track lead status (new, contacted, active, pending)
- **Smart Filtering**: Filter leads by status, company, or location
- **Export Options**: Export leads for external tracking

### 🔐 **User Authentication**
- **Secure Login**: JWT-based authentication system
- **Password Reset**: Email-based password recovery
- **User Profiles**: Manage your account settings
- **Session Management**: Secure session handling

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **MySQL**: Database
- **JWT**: Authentication
- **Flask-Mail**: Email functionality

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Context API**: State management

### AI & Scraping
- **OpenAI GPT**: AI message generation
- **Selenium**: Web scraping
- **Undetected ChromeDriver**: Anti-detection scraping
- **PRAW**: Reddit API integration

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- MySQL database
- Chrome browser (for scraping)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-lead-finder
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   cd ai-lead-finder-ui
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Create email_config.env
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   
   # Create .env for AI services
   OPENROUTER_API_KEY=your-openrouter-api-key
   ```

5. **Set up MySQL database**
   ```sql
   CREATE DATABASE ai_leads;
   ```

6. **Start the backend server**
   ```bash
   python api_server.py
   ```

7. **Start the frontend**
   ```bash
   cd ai-lead-finder-ui
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 📖 Usage Guide

### 1. **Getting Started**
- Sign up for an account
- Complete your profile
- Set up your email preferences

### 2. **Job Scraping**
1. Navigate to "Scrape & Outreach"
2. Configure your search parameters:
   - **Keyword**: Job title or skills (e.g., "developer", "marketing")
   - **Location**: Remote, city, or country
   - **Limit**: Number of jobs to scrape
   - **Source**: Choose scraping sources
3. Click "Scrape Jobs"
4. Review the found jobs

### 3. **Email Outreach**
1. Select jobs you want to contact
2. Choose to:
   - **Generate AI Message**: Let AI create a personalized message
   - **Write Custom Message**: Write your own outreach message
3. Click "Send Outreach"
4. Monitor campaign results

### 4. **Lead Management**
- View all leads in the "Leads" section
- Update lead status as you progress
- Filter and search through your leads
- Track your outreach success rate

## 🔧 Configuration

### Email Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Add credentials to `email_config.env`

### AI Configuration
1. Get an API key from [OpenRouter](https://openrouter.ai/)
2. Add to your environment variables
3. Configure message templates in the AI settings

### Scraping Configuration
- LinkedIn scraping requires login credentials
- Adjust scraping limits to avoid rate limiting
- Configure proxy settings if needed

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/forgot-password` - Password reset request
- `POST /api/reset-password` - Password reset

### Job Scraping
- `POST /api/scrape` - Scrape jobs from multiple sources
- `GET /api/leads` - Get user's leads
- `PATCH /api/leads/:id` - Update lead status

### Email Outreach
- `POST /api/generate-message` - Generate AI outreach message
- `POST /api/send-outreach` - Send single outreach email
- `POST /api/bulk-outreach` - Send bulk outreach campaign
- `POST /api/extract-email` - Extract email from job description

## 🎯 Best Practices

### Job Scraping
- Use specific keywords for better results
- Limit scraping to avoid overwhelming companies
- Respect robots.txt and rate limits
- Regularly update your search criteria

### Email Outreach
- Personalize messages for each company
- Keep messages concise and professional
- Follow up appropriately
- Track your response rates

### Lead Management
- Update lead status regularly
- Set reminders for follow-ups
- Organize leads by priority
- Export data for external tracking

## 🔒 Security Features

- JWT-based authentication
- Password strength validation
- Rate limiting on API endpoints
- Secure email handling
- Input validation and sanitization
- CORS protection

## 🚀 Deployment

### Backend Deployment
1. Set up a production server
2. Configure environment variables
3. Set up MySQL database
4. Install dependencies
5. Run with production WSGI server

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests on GitHub
- **Email**: Contact support for urgent issues

## 🎉 What's Next?

- [ ] Advanced analytics dashboard
- [ ] Integration with more job boards
- [ ] CRM integration
- [ ] Advanced email templates
- [ ] Mobile application
- [ ] Team collaboration features

---

**Built with ❤️ for job seekers everywhere** 