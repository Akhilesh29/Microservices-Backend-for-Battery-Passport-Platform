const { Kafka } = require("kafkajs");

function isKafkaDisabled() {
  return process.env.KAFKA_DISABLED === "true";
}

function resolveKafkaBroker() {
  if (process.env.KAFKA_BROKER) {
    return process.env.KAFKA_BROKER;
  }

  const host = process.env.KAFKA_HOST;
  const port = process.env.KAFKA_PORT || "9092";
  return host ? `${host}:${port}` : "kafka:9092";
}

let producer;

function getProducer() {
  if (!producer) {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || "battery-passport-platform",
      brokers: [resolveKafkaBroker()],
    });
    producer = kafka.producer();
  }

  return producer;
}

async function connectProducer() {
  if (isKafkaDisabled()) {
    console.log("Kafka is disabled; events will be logged locally");
    return;
  }

  await getProducer().connect();
  console.log("Data access service connected to Kafka");
}

async function publishPassportEvent(eventType, passport, actor) {
  const payload = {
    eventType,
    passportId: passport._id,
    batteryIdentifier:
      passport.data?.generalInformation?.batteryIdentifier || null,
    actor,
    occurredAt: new Date().toISOString(),
  };

  if (isKafkaDisabled()) {
    console.log("Mock notification event", JSON.stringify(payload));
    return;
  }

  const topic = process.env.KAFKA_TOPIC_PASSPORT_EVENTS || "passport-events";
  await getProducer().send({
    topic,
    messages: [
      {
        key: passport._id.toString(),
        value: JSON.stringify(payload),
      },
    ],
  });
}

module.exports = {
  connectProducer,
  publishPassportEvent,
};
