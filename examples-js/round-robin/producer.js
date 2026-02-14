const { connectRabbit, closeConnection, toBuffer } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and open a channel.
    const { connection, channel } = await connectRabbit();
    // A durable queue is used for the shared round-robin workload.
    const queueName = "round-robin";

    await channel.assertQueue(queueName, { durable: true });

    // Publish several messages so multiple consumers can share the work.
    for (let index = 0; index < 10; index += 1) {
        const payload = { id: index, message: `Hello ${index}` };
        channel.sendToQueue(queueName, toBuffer(payload));
        console.log(`Sent ${JSON.stringify(payload)}`);
    }

    await closeConnection(connection, channel);
}

main().catch((error) => {
    console.error("Round-robin producer failed:", error);
    process.exit(1);
});