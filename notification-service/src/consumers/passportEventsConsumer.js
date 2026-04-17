const { consumer } = require("../config/kafka");
const { sendNotification } = require("../services/notificationService");

async function startPassportEventsConsumer() {
  const topic = process.env.KAFKA_TOPIC_PASSPORT_EVENTS || "passport-events";
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }

      const event = JSON.parse(message.value.toString());
      if (event.eventType?.startsWith("passport.")) {
        await sendNotification(event);
      }
    },
  });

  console.log("Notification service subscribed to Kafka topic", topic);
}

module.exports = {
  startPassportEventsConsumer,
};
