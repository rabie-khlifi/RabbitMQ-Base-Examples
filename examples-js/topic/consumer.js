const { connectRabbit, closeConnection } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and open a channel.
    const { connection, channel } = await connectRabbit();
    // Bind the queue using a topic pattern like *.info or #.
    const exchangeName = "topic_logs";
    const pattern = process.argv[2] || "*.info";
    const queueName = `topic-${pattern.replace(/[^a-zA-Z0-9]/g, "-")}`;

    await channel.assertQueue(queueName, { durable: true });
    await channel.assertExchange(exchangeName, "topic", { durable: true });
    await channel.bindQueue(queueName, exchangeName, pattern);

    console.log(`Waiting for topic messages matching "${pattern}"...`);
    // Consume and acknowledge matched topic messages.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        console.log(`Received: ${msg.content.toString()}`);
        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("Topic consumer failed:", error);
    process.exit(1);
});