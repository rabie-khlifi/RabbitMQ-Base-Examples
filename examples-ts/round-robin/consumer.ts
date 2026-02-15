import { connectRabbit } from "../rabbit-utils";

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { channel } = await connectRabbit();
    // Declare the shared queue as durable.
    const queueName = "round-robin";

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Consumer started. Waiting on queue "${queueName}"...`);

    // Consume messages and acknowledge them once processed.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        console.log(`Received: ${msg.content.toString()}`);
        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("Round-robin consumer failed:", error);
    process.exit(1);
});