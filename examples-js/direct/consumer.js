const { connectRabbit, closeConnection } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // Bind this queue to a specific routing key on the direct exchange.
    const exchangeName = "direct_logs";
    const bindingKey = process.argv[2] || "info";
    const queueName = `direct-${bindingKey}`;

    await channel.assertQueue(queueName, { durable: true });
    await channel.assertExchange(exchangeName, "direct", { durable: true });
    await channel.bindQueue(queueName, exchangeName, bindingKey);

    console.log(`Waiting for messages with routing key "${bindingKey}"...`);
    // Consume messages and acknowledge them after handling.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        console.log(`Received: ${msg.content.toString()}`);
        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("Direct consumer failed:", error);
    process.exit(1);
});