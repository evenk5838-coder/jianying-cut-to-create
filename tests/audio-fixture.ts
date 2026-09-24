// Original 2-second test tone. Used only when the private soundtrack is absent.
export function testAudio() {
  const rate = 8000;
  const samples = rate * 2;
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + samples * 2, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples * 2, 40);
  for (let n = 0; n < samples; n++)
    wav.writeInt16LE(
      Math.round(Math.sin((2 * Math.PI * 220 * n) / rate) * 300),
      44 + n * 2,
    );
  return wav;
}
