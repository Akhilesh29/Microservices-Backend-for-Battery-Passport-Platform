require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");

const port = process.env.PORT || process.env.AUTH_PORT || 3001;

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Auth service listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Auth service failed to start", error);
  process.exit(1);
});
