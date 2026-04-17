require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");
const { connectProducer } = require("./config/kafka");

const port = process.env.PORT || process.env.PASSPORT_PORT || 3002;

async function startServer() {
  await connectDB();
  await connectProducer();
  app.listen(port, () => {
    console.log(`Data access service listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Data access service failed to start", error);
  process.exit(1);
});
