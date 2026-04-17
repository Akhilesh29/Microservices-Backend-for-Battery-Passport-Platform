const fs = require("fs/promises");
const path = require("path");

async function sendNotification(event) {
  const outputDir = process.env.NOTIFICATION_OUTPUT_DIR || path.join(process.cwd(), "logs");
  await fs.mkdir(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `${Date.now()}-${event.eventType}.txt`);
  const message = [
    `Event: ${event.eventType}`,
    `Passport ID: ${event.passportId}`,
    `Battery Identifier: ${event.batteryIdentifier || "N/A"}`,
    `Actor: ${event.actor?.email || "system"} (${event.actor?.role || "unknown"})`,
    `Occurred At: ${event.occurredAt}`,
  ].join("\n");

  await fs.writeFile(filePath, message, "utf8");
  console.log("Notification written", filePath);
}

module.exports = {
  sendNotification,
};

