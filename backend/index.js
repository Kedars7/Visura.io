const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoute.js');
const projectRoutes = require('./routes/projectRoute.js');
const assetRoutes = require('./routes/assetRoute.js');
const stylePresetRoutes = require('./routes/stylePresetRoute.js');
const aiRoutes = require('./routes/aiRoute.js');
const outputRoutes = require('./routes/getOutputRoute.js')
const connectDB = require('./config/database.js');
const cors = require("cors");

const {serve} = require("inngest/express");
const {inngest, functions} = require("./inngest/index.js");

const app = express();
app.use(express.json());

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://visura-io.vercel.app',
  'https://visura-io-kedars-projects-70f5988e.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());

app.use("/api/inngest", serve({ client: inngest, functions }));


app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/styles', stylePresetRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/output', outputRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 3001;



app.listen(PORT, () => {
    connectDB();
});