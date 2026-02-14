const { connectRabbit, closeConnection, toBuffer } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and open a channel.
    const { connection, channel } = await connectRabbit();
    // Topic exchanges route by pattern using wildcards.
    const exchangeName = "topic_logs";
    const routingKey = process.argv[2] || "kern.info";

    await channel.assertExchange(exchangeName, "topic", { durable: true });
    const message = `Message for ${routingKey}`;
    channel.publish(exchangeName, routingKey, toBuffer(message));
    console.log(`Published: ${message}`);

    await closeConnection(connection, channel);
}

main().catch((error) => {
    console.error("Topic exchange example failed:", error);
    process.exit(1);
});