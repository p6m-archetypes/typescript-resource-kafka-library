import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { Kafka, Producer } from 'kafkajs';
import { settings } from '../settings';

declare module 'fastify' {
  interface FastifyInstance {
    producer: Producer;
  }
}

const messagingPlugin: FastifyPluginAsync = async (fastify) => {
  const kafka = new Kafka({ brokers: [settings.messagingBrokers] });
  const producer = kafka.producer();
  await producer.connect();
  fastify.decorate('producer', producer);
  fastify.addHook('onClose', async () => {
    await producer.disconnect();
  });
};

export default fp(messagingPlugin, { name: 'messaging' });
