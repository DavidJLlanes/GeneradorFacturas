// Escritor de ZIP sin dependencias. Cada archivo se comprime con deflate si el navegador sabe
// (CompressionStream) y, si no, se guarda tal cual.

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = TABLE[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

async function deflate(data: Uint8Array): Promise<Uint8Array | null> {
  if (typeof CompressionStream === 'undefined') return null;
  const stream = new Blob([data as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Fecha y hora en el formato MS-DOS que usa el ZIP.
function dosTime(date: Date): { time: number; day: number } {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1),
    day:
      ((Math.max(date.getFullYear(), 1980) - 1980) << 9) |
      ((date.getMonth() + 1) << 5) |
      date.getDate(),
  };
}

export class ZipWriter {
  private readonly parts: Uint8Array[] = [];
  private readonly central: Uint8Array[] = [];
  private offset = 0;

  async add(entry: ZipEntry, date = new Date()): Promise<void> {
    const name = new TextEncoder().encode(entry.name);
    const packed = await deflate(entry.data);
    const body = packed && packed.length < entry.data.length ? packed : entry.data;
    const method = body === entry.data ? 0 : 8;
    const crc = crc32(entry.data);
    const { time, day } = dosTime(date);

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // nombres en UTF-8
    local.setUint16(8, method, true);
    local.setUint16(10, time, true);
    local.setUint16(12, day, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, body.length, true);
    local.setUint32(22, entry.data.length, true);
    local.setUint16(26, name.length, true);

    const head = new DataView(new ArrayBuffer(46));
    head.setUint32(0, 0x02014b50, true);
    head.setUint16(4, 20, true);
    head.setUint16(6, 20, true);
    head.setUint16(8, 0x0800, true);
    head.setUint16(10, method, true);
    head.setUint16(12, time, true);
    head.setUint16(14, day, true);
    head.setUint32(16, crc, true);
    head.setUint32(20, body.length, true);
    head.setUint32(24, entry.data.length, true);
    head.setUint16(28, name.length, true);
    head.setUint32(42, this.offset, true);

    const localBytes = new Uint8Array(local.buffer);
    this.parts.push(localBytes, name, body);
    this.central.push(new Uint8Array(head.buffer), name);
    this.offset += localBytes.length + name.length + body.length;
  }

  finish(): Blob {
    const size = this.central.reduce((n, p) => n + p.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, this.central.length / 2, true);
    end.setUint16(10, this.central.length / 2, true);
    end.setUint32(12, size, true);
    end.setUint32(16, this.offset, true);
    return new Blob([...this.parts, ...this.central, new Uint8Array(end.buffer)] as BlobPart[], {
      type: 'application/zip',
    });
  }
}
