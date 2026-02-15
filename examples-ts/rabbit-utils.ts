import { connect as connectAmqp, type Channel, type ChannelModel } from "amqplib";

export async function connectRabbit(url: string = process.env.RABBIT_URL || "amqp://localhost") {
    const connection: ChannelModel = await connectAmqp(url);
    const channel: Channel = await connection.createChannel();
    return { connection, channel };
}

export async function closeConnection(connection?: ChannelModel, channel?: Channel) {
    if (channel) {
        await channel.close().catch(() => undefined);
    }

    if (connection) {
        await connection.close().catch(() => undefined);
    }
}

export function toBuffer(payload: string | Record<string, unknown>) {
    return Buffer.from(typeof payload === "string" ? payload : JSON.stringify(payload));
}