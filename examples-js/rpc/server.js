const { connectRabbit, closeConnection, toBuffer } = require("../rabbit-utils");

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { connection, channel } = await connectRabbit();
    // The request queue is durable so RPC work survives broker restarts.
    const queueName = "rpc_queue";

    await channel.assertQueue(queueName, { durable: true });
    console.log(`RPC server listening on queue "${queueName}"...`);

    // Consume requests and send a reply using the replyTo queue.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        const request = JSON.parse(msg.content.toString());
        const response = { answer: `Hello ${request.name}` };
        const replyTo = msg.properties.replyTo;

        channel.sendToQueue(replyTo, toBuffer(response), {
            correlationId: msg.properties.correlationId,
        });

        console.log(`Responded to ${replyTo}: ${JSON.stringify(response)}`);
        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("RPC server failed:", error);
    process.exit(1);
});