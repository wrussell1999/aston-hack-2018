class Instrument {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.volume = this.ctx.createGain();
    this.volume.gain.setValueAtTime(0, this.ctx.currentTime);
    this.volume.connect(this.ctx.destination);

    this.leftGain = this.ctx.createGain();
    this.leftGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.leftGain.connect(this.volume);
    this.left = this.ctx.createOscillator();
    this.left.type = 'square';
    this.left.connect(this.leftGain);
    this.left.start()

    this.rightGain = this.ctx.createGain();
    this.rightGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.rightGain.connect(this.volume);
    this.right = this.ctx.createOscillator();
    this.right.type = 'sawtooth';
    this.right.connect(this.rightGain);
    this.right.start()
  }

  play(pitch, pan = 0.5) {
    const freq = this.realToFrequency(pitch);

    // this smooths out the sounds
    const delay = 0.05;

    this.left.frequency.linearRampToValueAtTime(freq, this.ctx.currentTime + delay);
    this.right.frequency.linearRampToValueAtTime(freq, this.ctx.currentTime + delay);

    this.leftGain.gain.linearRampToValueAtTime(1.0 - pan, this.ctx.currentTime + delay);
    this.rightGain.gain.linearRampToValueAtTime(pan, this.ctx.currentTime + delay);

    this.volume.gain.setValueAtTime(0.4, this.ctx.currentTime + delay);
  }

  pause() {
    this.volume.gain.setValueAtTime(0, this.ctx.currentTime);
  }

  /*
  realToFrequency(real) {
    const min = 49;
    const max = 49 + 12;
    const between = min + real * (max - min);
    return this.noteToFrequency(between);
  }
  */

  realToFrequency(real) {
    const base = 49;
    const majorScale = [base, base + 2, base + 4, base + 7, base + 9];

    const note = majorScale[Math.floor(real * majorScale.length)];
    return this.noteToFrequency(note);
  }

  noteToFrequency(note) {
    return 440 * Math.pow(2, (note - 49) / 12);
  }

  frequencyToNote(freq) {
    return 12 * Math.log2(freq / 440);
  }
}

module.exports = {
  Instrument: Instrument
}