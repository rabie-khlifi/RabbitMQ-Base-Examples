import { closeConnection, connectRabbit } from "../rabbit-utils";

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // Use a durable queue for the manual-ack workflow.
    const queueName = "manual-ack";

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages on queue "${queueName}"...`);

    // Consume messages and only acknowledge them after successful processing.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        const payload = msg.content.toString();
        console.log(`Received: ${payload}`);

        if (payload.includes("crash")) {
            console.log("Simulating crash before ack...");
            closeConnection(connection, channel);
            process.exit(1);
        }

        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("Manual ack consumer failed:", error);
    process.exit(1);
});