import fs from 'node:fs';

/** Reads PCM WAV header chunks (skips unknown chunks such as LIST). */
export const readWavInfo = (file) => {
  const buf = fs.readFileSync(file);
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') throw new Error(`${file}: not a RIFF/WAVE file`);
  let fmt = null;
  for (let off = 12; off + 8 <= buf.length; ) {
    const id = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') {
      fmt = {channels: buf.readUInt16LE(off + 10), sampleRate: buf.readUInt32LE(off + 12), blockAlign: buf.readUInt16LE(off + 20), bits: buf.readUInt16LE(off + 22)};
    } else if (id === 'data') {
      if (!fmt) throw new Error(`${file}: data chunk before fmt chunk`);
      const samples = Math.floor(Math.min(size, buf.length - off - 8) / fmt.blockAlign);
      return {...fmt, samples, seconds: samples / fmt.sampleRate};
    }
    off += 8 + size + (size % 2); // chunks are word-aligned
  }
  throw new Error(`${file}: no data chunk`);
};
