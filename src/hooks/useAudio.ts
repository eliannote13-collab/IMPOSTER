import { useCallback } from "react";

// Web Audio Synth Engine for Cyber Suspense Game
class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private droneOscs: { osc1: OscillatorNode; osc2: OscillatorNode; gainNode: GainNode } | null = null;
  private droneInterval: number | null = null;
  private activeNotes: AudioNode[] = [];

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private isMuted(): boolean {
    return localStorage.getItem("imposter_audio_muted") === "true";
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playClick() {
    if (this.isMuted()) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Quick pitch sweep
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  public playHeartbeat(_bpm: number = 60, volumeScale: number = 1.0) {
    if (this.isMuted()) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Double-thump beat: lub-dub
      const playThump = (time: number, freq: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.15);

        gain.gain.setValueAtTime(vol * volumeScale, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.2);
      };

      // Lub
      playThump(now, 58, 0.35);
      // Dub
      playThump(now + 0.18, 52, 0.25);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  public playRevealWhoosh() {
    if (this.isMuted()) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const duration = 0.5;

      // Generate procedural white noise for whoosh
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 3.0;
      // Frequency sweep up
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(2500, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseNode.start(now);
      noiseNode.stop(now + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  public startSuspenseDrone(bpm: number = 60) {
    if (this.isMuted()) return;
    try {
      const ctx = this.initCtx();
      if (this.droneOscs) {
        // Update existing drone frequency/intensity if needed
        return;
      }

      const now = ctx.currentTime;

      // Detuned oscillator pair for a thick, suspenseful cyber drone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(55, now); // A1 note
      osc1.detune.setValueAtTime(-8, now);

      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(55.2, now);
      osc2.detune.setValueAtTime(8, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, now);
      filter.Q.value = 1.0;

      // Pulse filter cutoff frequency slowly
      const filterLfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      filterLfo.type = "sine";
      filterLfo.frequency.setValueAtTime(0.2, now); // 0.2Hz filter sweep
      lfoGain.gain.setValueAtTime(30, now);

      filterLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      filterLfo.start(now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 2.0); // Smooth fade-in

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      this.droneOscs = { osc1, osc2, gainNode: gain };

      // Set up automatic heartbeat thumping that matches game tension
      const intervalMs = (60 / bpm) * 1000;
      this.droneInterval = window.setInterval(() => {
        // Map volume scaling based on BPM (higher tension = louder thump)
        const scale = bpm > 100 ? 1.4 : bpm > 75 ? 1.1 : 0.8;
        this.playHeartbeat(bpm, scale);
      }, intervalMs);

      // Save references so they can be disposed
      this.activeNotes.push(filterLfo);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  public updateDroneSpeed(bpm: number) {
    if (!this.droneOscs) return;
    try {
      // Clear and rebuild heartbeat cycle with new speed
      if (this.droneInterval) {
        clearInterval(this.droneInterval);
      }
      const intervalMs = (60 / bpm) * 1000;
      this.droneInterval = window.setInterval(() => {
        const scale = bpm > 100 ? 1.4 : bpm > 75 ? 1.1 : 0.8;
        this.playHeartbeat(bpm, scale);
      }, intervalMs);
    } catch (e) {
      console.warn("Audio error updating drone:", e);
    }
  }

  public stopSuspenseDrone() {
    try {
      if (this.droneInterval) {
        clearInterval(this.droneInterval);
        this.droneInterval = null;
      }
      if (this.droneOscs) {
        const ctx = this.initCtx();
        const now = ctx.currentTime;
        const currentGain = this.droneOscs.gainNode;
        const currentOsc1 = this.droneOscs.osc1;
        const currentOsc2 = this.droneOscs.osc2;

        // Smooth fade-out
        currentGain.gain.setValueAtTime(currentGain.gain.value, now);
        currentGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        setTimeout(() => {
          try {
            currentOsc1.stop();
            currentOsc2.stop();
          } catch (e) {}
        }, 900);

        this.droneOscs = null;
      }

      // Stop any other active helper notes (like LFOs)
      this.activeNotes.forEach(node => {
        try {
          (node as any).stop();
        } catch (e) {}
      });
      this.activeNotes = [];
    } catch (e) {
      console.warn("Audio error stopping drone:", e);
    }
  }

  public playResult(isVictory: boolean) {
    if (this.isMuted()) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Stop background noise
      this.stopSuspenseDrone();

      const playTone = (freq: number, start: number, duration: number, volume: number, type: OscillatorType = "sine") => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(volume, start + 0.05);
        gain.gain.setValueAtTime(volume, start + duration - 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      if (isVictory) {
        // Triumphant cyberpunk major chord sequence (C Major 7 / F Major)
        // 0.0s: C4, E4, G4
        // 0.2s: E4, G4, C5
        // 0.4s: G4, B4, D5, G5 (high resolve)
        playTone(261.63, now, 0.4, 0.1); // C4
        playTone(329.63, now, 0.4, 0.1); // E4
        playTone(392.00, now, 0.6, 0.1); // G4

        playTone(329.63, now + 0.2, 0.4, 0.1); // E4
        playTone(392.00, now + 0.2, 0.4, 0.1); // G4
        playTone(523.25, now + 0.2, 0.8, 0.1); // C5

        playTone(392.00, now + 0.4, 1.2, 0.12); // G4
        playTone(493.88, now + 0.4, 1.2, 0.12); // B4
        playTone(587.33, now + 0.4, 1.2, 0.12); // D5
        playTone(783.99, now + 0.4, 1.5, 0.15, "triangle"); // G5 (Triumphant lead)
      } else {
        // Menacing detuned minor-diminished sweep (Imposter win / Defeat)
        // Dissonant, creepy, suspenseful digital slide downwards
        playTone(110.00, now, 1.5, 0.2, "sawtooth"); // A2 (Low hum)
        playTone(164.81, now, 1.5, 0.15, "sawtooth"); // E3
        playTone(196.00, now + 0.1, 1.4, 0.12, "sawtooth"); // G3 (Minor 7)
        playTone(233.08, now + 0.25, 1.25, 0.12, "sawtooth"); // Bb3 (Tritone dissonance!)

        // Slide a separate synth pitch downwards
        const slideOsc = ctx.createOscillator();
        const slideGain = ctx.createGain();
        slideOsc.type = "sawtooth";
        slideOsc.frequency.setValueAtTime(220.00, now + 0.3); // A3
        slideOsc.frequency.exponentialRampToValueAtTime(70.00, now + 1.5); // Slide down to C#2/D2 area

        const slideFilter = ctx.createBiquadFilter();
        slideFilter.type = "lowpass";
        slideFilter.frequency.setValueAtTime(300, now + 0.3);

        slideGain.gain.setValueAtTime(0.001, now + 0.3);
        slideGain.gain.linearRampToValueAtTime(0.18, now + 0.5);
        slideGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        slideOsc.connect(slideFilter);
        slideFilter.connect(slideGain);
        slideGain.connect(ctx.destination);

        slideOsc.start(now + 0.3);
        slideOsc.stop(now + 1.5);
      }
    } catch (e) {
      console.warn("Audio error playing result:", e);
    }
  }
}

// Single instance shared across hook calls
const synthInstance = new AudioSynthEngine();

export function useAudio() {
  const playClick = useCallback(() => {
    synthInstance.playClick();
  }, []);

  const playHeartbeat = useCallback((bpm?: number, volumeScale?: number) => {
    synthInstance.playHeartbeat(bpm, volumeScale);
  }, []);

  const playRevealWhoosh = useCallback(() => {
    synthInstance.playRevealWhoosh();
  }, []);

  const startSuspenseDrone = useCallback((bpm?: number) => {
    synthInstance.startSuspenseDrone(bpm);
  }, []);

  const updateDroneSpeed = useCallback((bpm: number) => {
    synthInstance.updateDroneSpeed(bpm);
  }, []);

  const stopSuspenseDrone = useCallback(() => {
    synthInstance.stopSuspenseDrone();
  }, []);

  const playResult = useCallback((isVictory: boolean) => {
    synthInstance.playResult(isVictory);
  }, []);

  return {
    playClick,
    playHeartbeat,
    playRevealWhoosh,
    startSuspenseDrone,
    updateDroneSpeed,
    stopSuspenseDrone,
    playResult,
  };
}
