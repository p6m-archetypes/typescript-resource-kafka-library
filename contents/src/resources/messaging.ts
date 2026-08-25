import { Kafka, type Producer } from 'kafkajs';
import { settings } from '../settings';

let _producer: Producer | null = null;

export async function initResource(): Promise<void> {
  const kafka = new Kafka({ brokers: [settings.messagingBrokers] });
  _producer = kafka.producer();
  await _producer.connect();
}

export async function closeResource(): Promise<void> {
  if (_producer) {
    await _producer.disconnect();
    _producer = null;
  }
}

export function getProducer(): Producer {
  if (!_producer) throw new Error('Messaging not initialized');
  return _producer;
}
