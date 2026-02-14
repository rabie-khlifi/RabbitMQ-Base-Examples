const { connectRabbit, closeConnection, toBuffer } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // Configure a main queue with a dead-letter exchange routing key.
    const exchangeName = "dead_letter_exchange";
    const queueName = "main_queue";
    const deadLetterQueue = "dead_letter_queue";

    // Create the exchange that will receive rejected messages.
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    // Create the queue that will store dead-lettered messages.
    await channel.assertQueue(deadLetterQueue, { durable: true });

    // Create the main queue and tell RabbitMQ where to send messages that are rejected.
    // x-dead-letter-exchange: the exchange to route rejected messages to.
    // x-dead-letter-routing-key: the routing key used when sending them there.
    await channel.assertQueue(queueName, {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": exchangeName,
            "x-dead-letter-routing-key": "dead",
        },
    });

    // Bind the dead-letter queue to the exchange using the same routing key.
    await channel.bindQueue(deadLetterQueue, exchangeName, "dead");

    const message = { message: `Will be dead-lettered-${Date.now()}` };
    channel.publish("", queueName, toBuffer(message), { persistent: true });
    console.log(`Published ${JSON.stringify(message)} to ${queueName}`);

    await closeConnection(connection, channel);
}

main().catch((error) => {
    console.error("Dead-letter example failed:", error);
    process.exit(1);
});