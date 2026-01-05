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
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
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