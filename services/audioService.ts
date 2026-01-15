
class AudioService {
  private ctx: AudioContext | null = null;
  private bgOsc: OscillatorNode | null = null;
  private bgGain: GainNode | null = null;
  private isPlaying: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playCoinSound() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  public playHurtSound() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public startBGM() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    
    this.bgGain = this.ctx.createGain();
    this.bgGain.gain.value = 0.03;
    this.bgGain.connect(this.ctx.destination);

    // Simple procedural ambient loop
    const playNote = (freq: number, time: number, duration: number) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.03, time + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(g);
      g.connect(this.bgGain!);
      osc.start(time);
      osc.stop(time + duration);
    };

    const loop = () => {
      if (!this.isPlaying) return;
      const now = this.ctx!.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((n, i) => playNote(n, now + i * 0.5, 2));
      setTimeout(loop, 2000);
    };

    this.isPlaying = true;
    loop();
  }

  public stopBGM() {
    this.isPlaying = false;
  }
}

export const audioService = new AudioService();
