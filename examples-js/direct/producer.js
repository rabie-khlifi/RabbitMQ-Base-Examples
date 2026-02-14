const { connectRabbit, closeConnection, toBuffer } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // A direct exchange routes messages based on an exact routing key.
    const exchangeName = "direct_logs";
    const routingKey = process.argv[2] || "info";

    await channel.assertExchange(exchangeName, "direct", { durable: true });
    const message = `Message routed with ${routingKey}`;
    channel.publish(exchangeName, routingKey, toBuffer(message));
    console.log(`Published: ${message} to ${routingKey}`);

    await closeConnection(connection, channel);
}

main().catch((error) => {
    console.error("Direct exchange example failed:", error);
    process.exit(1);
});