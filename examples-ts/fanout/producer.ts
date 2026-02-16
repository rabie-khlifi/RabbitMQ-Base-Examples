import { closeConnection, connectRabbit, toBuffer } from "../rabbit-utils";

async function main() {
    // Connect to RabbitMQ and open a channel.
    const { connection, channel } = await connectRabbit();
    // Fanout exchanges broadcast to every bound queue.
    const exchangeName = "fanout_logs";

    await channel.assertExchange(exchangeName, "fanout", { durable: true });
    const message = `Broadcast from ${new Date().toISOString()}`;
    channel.publish(exchangeName, "", toBuffer(message));
    console.log(`Published broadcast: ${message}`);

    await closeConnection(connection, channel);
}

main().catch((error) => {
    console.error("Fanout exchange example failed:", error);
    process.exit(1);
});