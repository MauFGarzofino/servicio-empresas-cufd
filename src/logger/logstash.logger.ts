import * as net from 'net';

let logstashStream: net.Socket | null = null;

function connectLogstash() {
    const host = process.env.LOGSTASH_HOST || 'host.docker.internal';
    const port = Number(process.env.LOGSTASH_PORT || 5044);

    logstashStream = net.createConnection({ host, port }, () => {
        console.log(`[LOGSTASH] Conectado a ${host}:${port}`);
    });

    logstashStream.on('error', () => {
        console.error('[LOGSTASH] Error. Reintentando...');
        setTimeout(connectLogstash, 3000);
    });

    logstashStream.on('close', () => {
        console.warn('[LOGSTASH] Conexión cerrada. Reintentando...');
        setTimeout(connectLogstash, 3000);
    });
}

connectLogstash();

export function sendLog(data: Record<string, any>) {
    if (logstashStream && !logstashStream.destroyed) {
        try {
            logstashStream.write(JSON.stringify(data) + '\n');
        } catch {
            console.error('[LOGSTASH] Error enviando log');
        }
    }
}
