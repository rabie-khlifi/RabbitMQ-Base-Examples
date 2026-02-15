import { connectRabbit } from "../rabbit-utils";

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { channel } = await connectRabbit();
    // Declare the JSON queue as durable.
    const queueName = "json-messages";

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for JSON messages on queue "${queueName}"...`);

    // Read each JSON message and acknowledge it after processing.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        const payload = JSON.parse(msg.content.toString());
        console.log("Received JSON:", payload);
        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("JSON consumer failed:", error);
    process.exit(1);
});