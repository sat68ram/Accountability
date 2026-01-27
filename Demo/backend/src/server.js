import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import visionRouter from './routes/vision.js';
import revenueRouter from './routes/revenue.js';


const app = express();
const port = process.env.PORT || 4000;

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/whoami", (_req, res) => {
  res.json({
    file: __filename,
    time: new Date().toISOString()
  });
});


// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // adjust origin to your frontend
app.use(express.json());


// Routes
app.use('/api/auth', authRouter);
app.use("/api/vision", visionRouter);
app.use("/api/revenue", revenueRouter);


app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Auth API running' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
