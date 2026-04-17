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

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID || "notification-service-group",
});

module.exports = {
  consumer,
};
