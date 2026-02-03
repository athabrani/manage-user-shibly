import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.ts';
import memberRoutes from './modules/members/member.routes.ts';
import dashboardRoutes from './modules/dashboard/dashboard.routes.ts';
import userRoutes from './modules/users/user.routes.ts';
import regionRoutes from './modules/regions/region.route.ts';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/regions', regionRoutes);

export default app;