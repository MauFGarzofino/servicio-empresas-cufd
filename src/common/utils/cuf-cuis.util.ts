export function generarCodigoCUIS(): {
    codigo: string;
    fechaVigencia: string;
    timeVigencia: number;
} {
    const random = [...crypto.getRandomValues(new Uint8Array(4))]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

    const now = new Date();
    const vence = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
        codigo: random, 
        fechaVigencia: vence.toISOString(),
        timeVigencia: Math.floor(vence.getTime() / 1000),
    };
}
