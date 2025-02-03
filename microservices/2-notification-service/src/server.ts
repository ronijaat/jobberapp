import { config } from '@notifications/config';
import { checkConnection } from '@notifications/elasticsearch';
import { consumeEmailAuthMessages, consumeOrderEmailMessages } from '@notifications/queues/auth.consumer';
import { createConnection } from '@notifications/queues/connection';
import { healthRoutes } from '@notifications/routes';
import { winstonLogger } from '@ronijaat/jobebr-shared';
import { Channel } from 'amqplib';
import { Application } from 'express';
import 'express-async-errors';
import http from 'http';
import { Logger } from 'winston';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  consumeEmailAuthMessages(emailChannel);
  consumeOrderEmailMessages(emailChannel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server is listening on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotifactionService startServer() method', error);
  }
}
