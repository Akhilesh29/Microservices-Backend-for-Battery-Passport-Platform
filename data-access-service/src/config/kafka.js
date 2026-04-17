const { Kafka } = require("kafkajs");

function resolveKafkaBroker() {
  if (process.env.KAFKA_BROKER) {
    return process.env.KAFKA_BROKER;
  }

  const host = process.env.KAFKA_HOST;
  const port = process.env.KAFKA_PORT || "9092";
  return host ? `${host}:${port}` : "kafka:9092";
}

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "battery-passport-platform",
  brokers: [resolveKafkaBroker()],
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("Data access service connected to Kafka");
}

async function publishPassportEvent(eventType, passport, actor) {
  const topic = process.env.KAFKA_TOPIC_PASSPORT_EVENTS || "passport-events";
  await producer.send({
    topic,
    messages: [
      {
        key: passport._id.toString(),
        value: JSON.stringify({
          eventType,
          passportId: passport._id,
          batteryIdentifier:
            passport.data?.generalInformation?.batteryIdentifier || null,
          actor,
          occurredAt: new Date().toISOString(),
        }),
      },
    ],
  });
}

module.exports = {
  connectProducer,
  publishPassportEvent,
};
