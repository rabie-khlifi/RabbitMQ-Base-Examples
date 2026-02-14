const { connectRabbit, closeConnection, toBuffer } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // Create a temporary exclusive reply queue for this client request.
    const requestQueue = "rpc_queue";
    const replyQueue = await channel.assertQueue("", { exclusive: true });
    const correlationId = `${Date.now()}`;

    await channel.consume(replyQueue.queue, (msg) => {
        if (!msg) {
            return;
        }

        if (msg.properties.correlationId === correlationId) {
            console.log(`Reply received: ${msg.content.toString()}`);
            closeConnection(connection, channel);
        }
    }, { noAck: true });

    const request = { name: "RabbitMQ" };
    channel.sendToQueue(requestQueue, toBuffer(request), {
        replyTo: replyQueue.queue,
        correlationId,
    });

    console.log(`Sent request: ${JSON.stringify(request)}`);
}

main().catch((error) => {
    console.error("RPC client failed:", error);
    process.exit(1);
});