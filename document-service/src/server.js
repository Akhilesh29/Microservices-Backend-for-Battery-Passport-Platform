require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");
const { ensureBucket } = require("./config/storage");

const port = process.env.PORT || process.env.DOCUMENT_PORT || 3003;

async function startServer() {
  await connectDB();
  await ensureBucket();
  app.listen(port, () => {
    console.log(`Document service listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Document service failed to start", error);
  process.exit(1);
});
