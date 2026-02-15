import { closeConnection, connectRabbit, toBuffer } from "../rabbit-utils";

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // Use a durable queue for regular JSON work messages.
    const queueName = "json-messages";

    await channel.assertQueue(queueName, { durable: true });
    // Create a JSON payload and serialize it before sending.
    const payload = {
        message: "Hello RabbitMQ",
        source: "producer-json",
        sentAt: new Date().toISOString(),
    };

    channel.sendToQueue(queueName, toBuffer(payload));
    console.log(`Sent JSON: ${JSON.stringify(payload)}`);

    await closeConnection(connection, channel);
}

main().catch((error) => {
    console.error("JSON producer failed:", error);
    process.exit(1);
});