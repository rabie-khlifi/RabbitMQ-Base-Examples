import { connectRabbit } from "../rabbit-utils";

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { channel } = await connectRabbit();
    // Declare the main queue and configure where rejected messages should go.
    const queueName = "main_queue";

    // x-dead-letter-exchange: the exchange that receives rejected messages.
    // x-dead-letter-routing-key: the routing key used when moving them there.
    await channel.assertQueue(queueName, {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": "dead_letter_exchange",
            "x-dead-letter-routing-key": "dead",
        },
    });
    console.log(`Waiting for messages on "${queueName}" to force dead-lettering...`);

    // Consume from the main queue and reject each message without requeueing it.
    // RabbitMQ will then move it to the dead-letter exchange/queue configured above.
    channel.consume(queueName, (msg) => {
        if (!msg) {
            return;
        }

        // Log the payload before rejecting it so the dead-letter flow is visible.
        console.log(`Rejecting message so it is routed to the dead-letter queue: ${msg.content.toString()}`);

        // Reject without requeueing to trigger the dead-letter flow.
        channel.reject(msg, false);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("Dead-letter consumer failed:", error);
    process.exit(1);
});