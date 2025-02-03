import { config } from '@notifications/config';
import { winstonLogger } from '@ronijaat/jobebr-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('NotificationService connected to RabbitMQ');
    closeConnection(channel, connection);
    return channel;
  } catch (err) {
    log.log('error', 'NotificationService createConnection() method:', err);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { closeConnection, createConnection };
