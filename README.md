# 🎨 Visura - AI Thumbnail Generator

> **Create professional, eye-catching YouTube thumbnails in seconds using the power of AI.**

Visura is a full-stack web application that leverages generative AI to help content creators design stunning thumbnails without any design experience. Simply provide your video title and vision, and let AI do the heavy lifting.

![Visura Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=Visura+AI+Thumbnail+Generator)

---

## ✨ Features

### 🤖 AI-Powered Generation
- **Smart Prompt Enhancement**: Uses Google Gemini AI to transform simple prompts into detailed, cinematic descriptions
- **Image Generation**: Powered by Replicate's state-of-the-art image generation models
- **Intelligent Composition**: Automatically optimizes layout, lighting, and visual focus for maximum engagement

### 🎨 Customization Options
- **Themes & Style Presets**: Choose from pre-designed themes to match your brand
- **Custom Positioning**: Control logo and subject placement (top-left, top-right, bottom-left, bottom-right, center)
- **Multiple Orientations**: Support for both landscape (16:9) and portrait (9:16) formats
- **Asset Upload**: Upload your own logos, subject images, and reference images

### 📦 Asset Management
- **Upload & Organize**: Manage your logos, subjects, and reference images
- **Reusable Assets**: Access previously uploaded assets for quick thumbnail creation
- **ImageKit Integration**: Fast and reliable image storage and delivery

### 📊 Project Management
- **Save Projects**: Keep track of all your thumbnail generation projects
- **Generation History**: View all your previously generated thumbnails
- **Status Tracking**: Real-time updates on thumbnail generation progress

### 👤 User Features
- **Authentication**: Secure login and signup with JWT-based authentication
- **Credits System**: Free tier with 1 free thumbnail, expandable with premium plans
- **User Dashboard**: Track your usage, credits, and generation history

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icon set
- **React Hot Toast** - Elegant notifications
- **Spline** - 3D graphics and animations

#### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web application framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Replicate API** - AI image generation
- **Google Generative AI** - Prompt enhancement
- **ImageKit** - Image storage and CDN
- **Inngest** - Background job processing
- **Multer** - File upload handling

---

## 📁 Project Structure

```
AI thumbnail/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js      # AI generation logic
│   │   ├── assetController.js   # Asset management
│   │   ├── projectController.js # Project CRUD
│   │   ├── stylePresetController.js
│   │   ├── thumbnailOutput.js   # Output retrieval
│   │   └── userController.js    # User auth & management
│   ├── inngest/
│   │   ├── functions.js         # Background job definitions
│   │   └── index.js            # Inngest client setup
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── authMiddleware.js   # Route protection
│   ├── models/
│   │   ├── assetsModel.js      # Asset schema
│   │   ├── generationModel.js  # Generation record schema
│   │   ├── projectModel.js     # Project schema
│   │   ├── stylePresentModel.js
│   │   └── userModel.js        # User schema
│   ├── routes/
│   │   ├── aiRoute.js          # AI endpoints
│   │   ├── assetRoute.js       # Asset endpoints
│   │   ├── getOutputRoute.js   # Output endpoints
│   │   ├── projectRoute.js     # Project endpoints
│   │   ├── stylePresetRoute.js
│   │   └── userRoute.js        # User endpoints
│   ├── services/
│   │   └── storageService.js   # ImageKit integration
│   └── index.js                # Entry point
│
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/            # Images, logos
│   │   ├── config/
│   │   │   └── api.js         # API endpoints configuration
│   │   ├── context/           # React context providers
│   │   ├── pages/
│   │   │   ├── ExportPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ThumbnailGenerator.jsx  # Main generator
│   │   ├── routing/
│   │   │   └── Routing.jsx    # Route definitions
│   │   ├── services/
│   │   │   └── CheckStatus.js # Status polling
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── package.json               # Root package file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**
- API Keys:
  - Google Generative AI API key
  - Replicate API key
  - ImageKit credentials (public key, private key, URL endpoint)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "AI thumbnail"
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
# Server
PORT=3000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Google Generative AI
GOOGLE_API_KEY=your_google_ai_api_key

# Replicate
REPLICATE_API_TOKEN=your_replicate_api_token

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Running the Application

#### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:3000`

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Start Inngest Dev Server** (for background jobs)
   ```bash
   npx inngest-cli dev
   ```

#### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

---

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Check Login Status
```http
GET /api/users/checkLogin
```

#### Logout
```http
POST /api/users/logout
```

### AI Endpoints

#### Enhance Prompt
```http
POST /api/ai/enhance-prompt
Content-Type: application/json

{
  "prompt": "A cat sitting on a laptop"
}
```

#### Generate Thumbnail
```http
POST /api/ai/generate-image
Content-Type: application/json

{
  "id": "project_id_here"
}
```

### Project Endpoints

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "title": "My Video Title",
  "inputPrompt": "Description of the thumbnail",
  "styleId": "style_preset_id",
  "orientation": "landscape",
  "logoPosition": "top-left",
  "subjectPosition": "center"
}
```

#### Get All Projects
```http
GET /api/projects
```

#### Get Project by ID
```http
GET /api/projects/:id
```

#### Get Projects by Status
```http
GET /api/projects/status/:status
```
Status options: `pending`, `processing`, `completed`, `failed`

### Asset Endpoints

#### Upload Asset
```http
POST /api/assets
Content-Type: multipart/form-data

{
  "image": [file],
  "type": "logo" | "subject" | "reference"
}
```

#### Get User Assets
```http
GET /api/assets
```

#### Delete Asset
```http
DELETE /api/assets/:id
```

### Output Endpoints

#### Get Project Output
```http
GET /api/output/:projectId
```

#### Get All User Thumbnails
```http
GET /api/output/user/all
```

---

## 🎯 Usage Guide

### Creating Your First Thumbnail

1. **Sign Up / Login**
   - Create an account or login to existing account
   - You start with 1 free credit

2. **Start a New Project**
   - Navigate to the thumbnail generator
   - Enter your video title

3. **Describe Your Vision**
   - Write a simple prompt describing your thumbnail
   - Click "Enhance This Prompt with AI ⚡" for AI-powered improvement

4. **Customize Settings**
   - Choose a theme/style preset
   - Select orientation (landscape/portrait)
   - Upload logo, subject, or reference images (optional)
   - Set positioning for logo and subject

5. **Generate**
   - Click "Generate My Thumbnail"
   - Wait for AI to create your thumbnail (typically 30-60 seconds)

6. **View & Export**
   - Check your generation history
   - Download your thumbnail
   - Use credits for additional generations

---

## 🔧 Configuration

### Style Presets
Style presets can be configured in the database with the following schema:
```javascript
{
  name: "Cinematic Dark",
  promptTemplate: "Dark cinematic style with dramatic lighting and moody atmosphere",
  thumbnail: "preview_image_url"
}
```

### User Plans
- **Free**: 1 free thumbnail credit
- **Premium**: Additional credits (configurable)

### Credit System
- Each thumbnail generation costs 1 credit
- Credits are deducted upon successful generation
- Failed generations don't consume credits

---

## 🛠️ Development

### Database Models

#### User Model
- name, email, password (hashed)
- plan (free/premium)
- credits (number)
- profileImg, createdAt

#### Project Model
- title, inputPrompt, enhancedPrompt
- styleId (reference to StylePreset)
- logo, subject, reference (references to Assets)
- logoPosition, subjectPosition, orientation
- userId, status, generatedImage
- createdAt

#### Asset Model
- imageUrl, type (logo/subject/reference)
- userId, createdAt

#### Generation Model
- projectId, status, outputUrl
- startedAt, completedAt

---

## 🔐 Security

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: HTTP-only cookies for session management
- **CORS Configuration**: Restricted to allowed origins
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Type and size restrictions on uploads

---

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Theme**: Modern dark UI optimized for extended use
- **Loading States**: Clear feedback during AI generation
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time success/error notifications
- **Progressive Enhancement**: Graceful degradation for older browsers

---

## 🚧 Background Jobs (Inngest)

The application uses Inngest for handling long-running AI generation tasks:

- **Job Queuing**: Thumbnail generation runs as background job
- **Status Updates**: Real-time project status updates
- **Error Recovery**: Automatic retry on transient failures
- **Webhook Integration**: Replicate webhook handling

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure network access if using MongoDB Atlas

**AI Generation Fails**
- Verify API keys are correct
- Check API quotas and rate limits
- Ensure Replicate/Google AI accounts are active

**Images Not Uploading**
- Check ImageKit credentials
- Verify file size limits (default: 5MB)
- Ensure allowed file types (jpg, png, webp)

**Frontend Can't Connect to Backend**
- Verify backend is running on correct port
- Check CORS configuration
- Ensure API_BASE_URL in frontend config is correct

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- **Google Generative AI** for prompt enhancement
- **Replicate** for image generation models
- **ImageKit** for image storage and CDN
- **Inngest** for background job processing
- **Lucide** for beautiful icons
- **TailwindCSS** for styling utilities

---

## 📧 Contact & Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Additional AI models integration
- [ ] Batch thumbnail generation
- [ ] Advanced editing tools
- [ ] Template marketplace
- [ ] Team collaboration features
- [ ] A/B testing for thumbnails
- [ ] Analytics and performance tracking
- [ ] Social media integration

---

**Built with ❤️ by creators, for creators**
