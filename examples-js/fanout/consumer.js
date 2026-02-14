const { connectRabbit, closeConnection } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // Each consumer gets its own queue bound to the same fanout exchange.
    const exchangeName = "fanout_logs";
    const queueName = `fanout-${Date.now()}`;

    await channel.assertQueue(queueName, { durable: true });
    await channel.assertExchange(exchangeName, "fanout", { durable: true });
    await channel.bindQueue(queueName, exchangeName, "");

    console.log(`Waiting for fanout messages on ${queueName}...`);
    // Consume and acknowledge each broadcast message.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        console.log(`Received: ${msg.content.toString()}`);
        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("Fanout consumer failed:", error);
    process.exit(1);
});