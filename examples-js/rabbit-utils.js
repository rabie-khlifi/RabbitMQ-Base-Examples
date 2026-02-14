const amqp = require("amqplib");

async function connectRabbit(url = process.env.RABBIT_URL || "amqp://localhost") {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    return { connection, channel };
}

async function closeConnection(connection, channel) {
    if (channel) {
        await channel.close().catch(() => undefined);
    }

    if (connection) {
        await connection.close().catch(() => undefined);
    }
}

function toBuffer(payload) {
    return Buffer.from(typeof payload === "string" ? payload : JSON.stringify(payload));
}

module.exports = { connectRabbit, closeConnection, toBuffer };