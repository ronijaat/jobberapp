import { authRoutes } from '@gateway/routes/auth';
import { Application } from 'express';
import { currentUserRoutes } from './routes/current-user';
import { healthRoutes } from './routes/health';
import { authMiddleware } from './services/auth-middleware';

const BASE_PATH = '/api/gateway/v1';

export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
};
