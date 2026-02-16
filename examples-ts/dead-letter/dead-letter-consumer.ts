import { connectRabbit } from "../rabbit-utils";

async function main() {
    // Connect to RabbitMQ and create a channel.
    const { channel } = await connectRabbit();
    const exchangeName = "dead_letter_exchange";
    const deadLetterQueue = "dead_letter_queue";

    // Create the exchange that receives messages routed from the main queue after rejection.
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    // Create the queue that stores dead-lettered messages.
    await channel.assertQueue(deadLetterQueue, { durable: true });

    // Bind the dead-letter queue to the exchange with the same routing key used by the main queue.
    await channel.bindQueue(deadLetterQueue, exchangeName, "dead");

    console.log(`Listening for dead letters on "${deadLetterQueue}"...`);

    // Consume messages from the dead-letter queue and treat them as failed work.
    channel.consume(deadLetterQueue, (msg) => {
        if (!msg) {
            return;
        }

        // Read the message body so we can inspect or process the dead-lettered payload.
        const payload = msg.content.toString();
        console.log(`Handling dead letter: ${payload}`);

        try {
            // Try to interpret the payload as JSON and log the business meaning of the failed message.
            const parsed = JSON.parse(payload);
            console.log(`Treating message as failed work: ${parsed.message}`);
        } catch (error) {
            // Some dead letters may not be JSON, but they should still be handled gracefully.
            console.log("Message payload was not valid JSON, but it was still received from the dead-letter queue.");
        }

        // Acknowledge the message once we have processed it.
        channel.ack(msg);
    }, { noAck: false });
}

main().catch((error) => {
    console.error("Dead-letter consumer failed:", error);
    process.exit(1);
});