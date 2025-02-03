import { config } from '@notifications/config';
import { start } from '@notifications/server';
import { winstonLogger } from '@ronijaat/jobebr-shared';
import express, { Express } from 'express';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationApp', 'debug');
function initialize(): void {
  const app: Express = express();
  start(app);
  log.info('Notification Service Initialized');
}
initialize();
