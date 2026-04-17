require("dotenv").config();
const app = require("./app");
const { startPassportEventsConsumer } = require("./consumers/passportEventsConsumer");

const port = process.env.PORT || process.env.NOTIFICATION_PORT || 3004;

async function startServer() {
  await startPassportEventsConsumer();
  app.listen(port, () => {
    console.log(`Notification service listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Notification service failed to start", error);
  process.exit(1);
});
