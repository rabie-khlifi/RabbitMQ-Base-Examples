import { connect as connectAmqp, type Channel, type ChannelModel } from "amqplib";

async function main() {
    // Connect to the local RabbitMQ broker.
    const connection: ChannelModel = await connectAmqp("amqp://localhost");
    // Open a channel for publishing and consuming messages.
    const channel: Channel = await connection.createChannel();
    // Use a durable queue for a normal shared work queue.
    const queueName = "hello";

    await channel.assertQueue(queueName, { durable: true });
    // Build the payload and send it as bytes.
    const message = "Hello RabbitMQ";
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Sent: ${message}`);

    // Close the channel and connection cleanly.
    await channel.close();
    await connection.close();
}

main().catch((error) => {
    console.error("Producer failed:", error);
    process.exit(1);
});