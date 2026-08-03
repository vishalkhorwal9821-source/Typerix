// Web Audio API Sound Synthesizer & Web Speech API Voice Coach Engine for Typerix

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentSoundType: string = 'cherry_blue';
  private voiceEnabled: boolean = true;
  private soundVolume: number = 0.5;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundType(type: string) {
    this.currentSoundType = type;
  }

  public setVolume(vol: number) {
    this.soundVolume = Math.max(0, Math.min(1, vol));
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  public playKeyPress(isError: boolean = false, isSpace: boolean = false) {
    if (this.currentSoundType === 'silent') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.soundVolume, now);
      masterGain.connect(this.ctx.destination);

      if (isError) {
        // Error buzz / dull click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.08);
        return;
      }

      switch (this.currentSoundType) {
        case 'cherry_blue': {
          // Sharp click + thock noise
          const clickOsc = this.ctx.createOscillator();
          const clickGain = this.ctx.createGain();
          clickOsc.type = 'square';
          clickOsc.frequency.setValueAtTime(isSpace ? 1800 : 2800, now);
          clickGain.gain.setValueAtTime(0.12, now);
          clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

          clickOsc.connect(clickGain);
          clickGain.connect(masterGain);
          clickOsc.start(now);
          clickOsc.stop(now + 0.02);

          // Thock sub-oscillator
          const thockOsc = this.ctx.createOscillator();
          const thockGain = this.ctx.createGain();
          thockOsc.type = 'triangle';
          thockOsc.frequency.setValueAtTime(isSpace ? 140 : 220, now);
          thockGain.gain.setValueAtTime(0.2, now);
          thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          thockOsc.connect(thockGain);
          thockGain.connect(masterGain);
          thockOsc.start(now);
          thockOsc.stop(now + 0.04);
          break;
        }

        case 'cherry_red': {
          // Deep smooth linear thock
          const thockOsc = this.ctx.createOscillator();
          const thockGain = this.ctx.createGain();
          thockOsc.type = 'sine';
          thockOsc.frequency.setValueAtTime(isSpace ? 110 : 180, now);
          thockGain.gain.setValueAtTime(0.25, now);
          thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          thockOsc.connect(thockGain);
          thockGain.connect(masterGain);
          thockOsc.start(now);
          thockOsc.stop(now + 0.05);
          break;
        }

        case 'typewriter': {
          // Metal strike + high ping
          const strikeOsc = this.ctx.createOscillator();
          const strikeGain = this.ctx.createGain();
          strikeOsc.type = 'sawtooth';
          strikeOsc.frequency.setValueAtTime(isSpace ? 400 : 850, now);
          strikeGain.gain.setValueAtTime(0.15, now);
          strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          strikeOsc.connect(strikeGain);
          strikeGain.connect(masterGain);
          strikeOsc.start(now);
          strikeOsc.stop(now + 0.03);
          break;
        }

        case 'sci_fi': {
          // Synth chirp
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isSpace ? 600 : 1200, now);
          osc.frequency.exponentialRampToValueAtTime(isSpace ? 200 : 400, now + 0.04);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'topre': {
          // Ultra deep rubber dome thock
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(isSpace ? 80 : 130, now);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }

        default:
          break;
      }
    } catch {
      // AudioContext fallback
    }
  }

  public speakMessage(text: string) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 0.7;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis error ignore
    }
  }
}

export const soundEngine = new SoundEngine();
