/**
 * ADVANCED AUDIO SYSTEM
 * =====================
 * Dynamic procedural music and sound effects generation
 * Responsive to game state and quantum events
 */

class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicNodes = [];
        this.sfxNodes = [];
        this.analyser = null;
        this.frequencyData = null;
        this.currentScale = [];
        this.tempo = 120; // BPM
        this.intensity = 0.5;
        this.enabled = false;
        
        // Musical scales for procedural generation
        this.scales = {
            minor: [0, 2, 3, 5, 7, 8, 10],
            major: [0, 2, 4, 5, 7, 9, 11],
            pentatonic: [0, 2, 4, 7, 9],
            chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            quantum: [0, 3, 6, 9] // Augmented, unstable
        };
        
        this.baseFreq = 220; // A3
    }
    
    /**
     * Initialize audio context (must be called after user interaction)
     */
    initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.audioContext.destination);
            
            // Create analyser for visualizations
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.connect(this.masterGain);
            
            this.enabled = true;
            this.currentScale = this.scales.pentatonic;
            
            return true;
        } catch (e) {
            console.warn('Audio initialization failed:', e);
            return false;
        }
    }
    
    /**
     * Play a synthesized note
     */
    playNote(frequency, duration = 0.2, waveType = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = waveType;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.value = volume;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );
        
        oscillator.connect(gainNode);
        gainNode.connect(this.analyser);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
        
        this.sfxNodes.push({ oscillator, gainNode });
        
        // Cleanup
        setTimeout(() => {
            const index = this.sfxNodes.findIndex(n => n.oscillator === oscillator);
            if (index > -1) this.sfxNodes.splice(index, 1);
        }, duration * 1000);
    }
    
    /**
     * Get note frequency from scale
     */
    getNoteFrequency(scaleIndex, octaveOffset = 0) {
        const semitone = this.currentScale[scaleIndex % this.currentScale.length];
        return this.baseFreq * Math.pow(2, (semitone + octaveOffset * 12) / 12);
    }
    
    /**
     * Play paddle hit sound
     */
    playPaddleHit(velocity) {
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const freq = 200 + speed * 5;
        const volume = Math.min(0.5, speed / 20);
        
        this.playNote(freq, 0.1, 'square', volume);
        
        // Add harmonic
        setTimeout(() => {
            this.playNote(freq * 1.5, 0.05, 'sine', volume * 0.5);
        }, 20);
    }
    
    /**
     * Play wall bounce sound
     */
    playWallBounce() {
        this.playNote(150, 0.08, 'triangle', 0.2);
    }
    
    /**
     * Play score sound
     */
    playScore(isPlayer1) {
        const baseFreq = isPlayer1 ? 400 : 300;
        const notes = [0, 4, 7]; // Major triad
        
        notes.forEach((note, i) => {
            setTimeout(() => {
                this.playNote(baseFreq * Math.pow(2, note / 12), 0.2, 'sine', 0.3);
            }, i * 100);
        });
    }
    
    /**
     * Play quantum event sound
     */
    playQuantumEvent(type) {
        switch (type) {
            case 'superposition':
                // Eerie chord
                [0, 3, 6, 9].forEach((note, i) => {
                    setTimeout(() => {
                        this.playNote(this.getNoteFrequency(note, 1), 0.3, 'sine', 0.15);
                    }, i * 50);
                });
                break;
                
            case 'entanglement':
                // Intertwined frequencies
                const freq1 = 300;
                const freq2 = 450;
                this.playNote(freq1, 0.4, 'sine', 0.2);
                setTimeout(() => {
                    this.playNote(freq2, 0.4, 'sine', 0.2);
                }, 100);
                break;
                
            case 'tunneling':
                // Sweeping frequency
                this.playSweep(200, 600, 0.3, 'sine', 0.25);
                break;
                
            case 'collapse':
                // Descending glissando
                this.playSweep(800, 200, 0.2, 'sawtooth', 0.2);
                break;
                
            case 'rift':
                // Portal sound
                this.playSweep(100, 1000, 0.5, 'sine', 0.3);
                setTimeout(() => {
                    this.playSweep(1000, 100, 0.5, 'sine', 0.3);
                }, 250);
                break;
        }
    }
    
    /**
     * Play frequency sweep
     */
    playSweep(startFreq, endFreq, duration, waveType = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = waveType;
        oscillator.frequency.value = startFreq;
        oscillator.frequency.exponentialRampToValueAtTime(
            endFreq,
            this.audioContext.currentTime + duration
        );
        
        gainNode.gain.value = volume;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );
        
        oscillator.connect(gainNode);
        gainNode.connect(this.analyser);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    /**
     * Play power-up sound
     */
    playPowerUp(type) {
        const patterns = {
            speed: [[0, 4, 7, 12], 'sine'],
            size: [[0, 5, 9, 12], 'triangle'],
            multi: [[0, 2, 4, 6, 8], 'square'],
            quantum: [[0, 3, 6, 9, 12], 'sawtooth']
        };
        
        const [notes, wave] = patterns[type] || patterns.quantum;
        notes.forEach((note, i) => {
            setTimeout(() => {
                const freq = this.getNoteFrequency(note % this.currentScale.length, Math.floor(note / 12));
                this.playNote(freq, 0.15, wave, 0.25);
            }, i * 60);
        });
    }
    
    /**
     * Start background music loop
     */
    startMusic() {
        if (!this.enabled || !this.audioContext) return;
        
        this.currentScale = this.scales.pentatonic;
        this.playMusicLoop();
    }
    
    /**
     * Play procedural music loop
     */
    playMusicLoop() {
        if (!this.enabled) return;
        
        const beatDuration = (60 / this.tempo) * 1000;
        
        // Bass line
        const bassNote = Math.floor(Math.random() * 3);
        const bassFreq = this.getNoteFrequency(bassNote, -1);
        this.playNote(bassFreq, 0.5, 'triangle', 0.15);
        
        // Melody (based on intensity)
        if (Math.random() < this.intensity) {
            setTimeout(() => {
                const melodyNote = Math.floor(Math.random() * this.currentScale.length);
                const melodyFreq = this.getNoteFrequency(melodyNote, 1);
                this.playNote(melodyFreq, 0.3, 'sine', 0.1);
            }, beatDuration / 2);
        }
        
        // Schedule next beat
        setTimeout(() => {
            this.playMusicLoop();
        }, beatDuration);
    }
    
    /**
     * Update music intensity based on game state
     */
    updateIntensity(gameState) {
        if (!gameState) return;
        
        // Increase intensity with ball speed and score
        const speedFactor = Math.min(1, gameState.ballSpeed / 20);
        const scoreFactor = Math.min(1, (gameState.score1 + gameState.score2) / 20);
        
        this.intensity = (speedFactor + scoreFactor) / 2;
        this.tempo = 120 + this.intensity * 60; // 120-180 BPM
        
        // Change scale based on quantum state
        if (gameState.quantumActive) {
            this.currentScale = this.scales.quantum;
        } else if (this.intensity > 0.7) {
            this.currentScale = this.scales.minor;
        } else {
            this.currentScale = this.scales.pentatonic;
        }
    }
    
    /**
     * Get frequency data for visualization
     */
    getFrequencyData() {
        if (!this.analyser) return null;
        this.analyser.getByteFrequencyData(this.frequencyData);
        return this.frequencyData;
    }
    
    /**
     * Play chaos mode sound
     */
    playChaosSound() {
        // Random chaotic notes
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const freq = Math.random() * 800 + 200;
                const wave = ['sine', 'square', 'triangle', 'sawtooth'][Math.floor(Math.random() * 4)];
                this.playNote(freq, 0.1, wave, 0.15);
            }, i * 50);
        }
    }
    
    /**
     * Play explosion sound
     */
    playExplosion() {
        if (!this.enabled || !this.audioContext) return;
        
        // White noise burst
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        gainNode.gain.value = 0.3;
        
        source.connect(gainNode);
        gainNode.connect(this.analyser);
        
        source.start();
    }
    
    /**
     * Stop all sounds
     */
    stopAll() {
        this.sfxNodes.forEach(node => {
            try {
                node.oscillator.stop();
            } catch (e) {
                // Already stopped
            }
        });
        this.sfxNodes = [];
        
        this.musicNodes.forEach(node => {
            try {
                node.oscillator.stop();
            } catch (e) {
                // Already stopped
            }
        });
        this.musicNodes = [];
    }
    
    /**
     * Set master volume
     */
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
    
    /**
     * Toggle audio on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopAll();
        }
        return this.enabled;
    }
}

// Export for use in main game
if (typeof window !== 'undefined') {
    window.AudioSystem = AudioSystem;
}
