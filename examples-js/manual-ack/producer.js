const { connectRabbit, closeConnection, toBuffer } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // Durable queue + persistent message delivery make this example more reliable.
    const queueName = "manual-ack";

    await channel.assertQueue(queueName, { durable: true });
    const payload = { message: "crash-me" };

    channel.sendToQueue(queueName, toBuffer(payload), { persistent: true });
    console.log(`Published ${JSON.stringify(payload)} with persistent delivery`);

    await closeConnection(connection, channel);
}

main().catch((error) => {
    console.error("Manual ack producer failed:", error);
    process.exit(1);
});