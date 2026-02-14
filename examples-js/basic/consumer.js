const amqp = require("amqplib");

async function main() {
    // Connect to RabbitMQ and create a channel.
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    // Allow the queue name to be overridden from the command line.
    const queueName = process.argv[2] || "hello";

    // Declare the queue as durable so it survives broker restarts.
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages on queue "${queueName}"...`);

    // Consume messages and acknowledge them manually.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        console.log(`Received: ${msg.content.toString()}`);
        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("Consumer failed:", error);
    process.exit(1);
});