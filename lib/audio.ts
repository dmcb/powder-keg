import { sounds, type SoundName } from "config/sounds";

type Listener = () => void;

/**
 * Centralized Web Audio manager: owns a single AudioContext, preloads every
 * sound in `config/sounds`, and plays them on demand. Browsers keep the
 * context suspended until a user activation, so sounds requested while locked
 * are dropped rather than queued (queuing would burst them all on unlock).
 */
class AudioManager {
  private ctx: AudioContext | null = null;
  private buffers = new Map<SoundName, AudioBuffer>();
  private listeners = new Set<Listener>();

  init() {
    if (this.ctx || typeof window === "undefined") return;
    this.ctx = new AudioContext();
    this.ctx.onstatechange = this.emit;
    (Object.keys(sounds) as SoundName[]).forEach((name) => this.load(name));
    this.emit();
  }

  get unlocked() {
    return this.ctx?.state === "running";
  }

  unlock = () => {
    // Also covers Safari's non-standard "interrupted" state.
    if (
      this.ctx &&
      this.ctx.state !== "running" &&
      this.ctx.state !== "closed"
    ) {
      this.ctx.resume().catch(() => {});
    }
  };

  play(name: SoundName) {
    const buffer = this.buffers.get(name);
    if (!this.ctx || !buffer) return;
    if (!this.unlocked) {
      this.unlock();
      return;
    }

    const { volume, playbackRate } = sounds[name];
    const [minRate, maxRate] = playbackRate;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = minRate + Math.random() * (maxRate - minRate);
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain).connect(this.ctx.destination);
    source.start();
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emit = () => this.listeners.forEach((listener) => listener());

  private async load(name: SoundName) {
    try {
      const response = await fetch(sounds[name].src);
      const data = await response.arrayBuffer();
      this.buffers.set(name, await this.ctx!.decodeAudioData(data));
    } catch (error) {
      console.warn(`Failed to load sound "${name}"`, error);
    }
  }
}

export const audio = new AudioManager();
