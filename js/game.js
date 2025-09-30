// Main game controller
import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { AIController } from './ai.js';
import { Particle } from './particles.js';
import { Renderer } from './renderer.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.statusDiv = document.getElementById('status');
        
        // Game state
        this.state = {
            running: false,
            paused: false,
            quantumMode: true,
            glitchMode: false,
            score: { player: 0, ai: 0 },
            reality: 100,
            quantumFlux: 0
        };
        
        // Game objects
        this.playerPaddle = new Paddle(20, canvas.height / 2 - 40);
        this.aiPaddle = new Paddle(canvas.width - 30, canvas.height / 2 - 40, true);
        this.ball = new Ball(canvas.width, canvas.height);
        this.aiController = new AIController();
        this.renderer = new Renderer(canvas, this.ctx);
        this.particles = [];
        
        // Input
        this.keys = {};
        this.setupInput();
        
        // Quantum effects
        this.quantumEvents = [
            () => this.triggerUncertainty(),
            () => this.triggerEntanglement(),
            () => this.triggerSchrodinger(),
            () => this.triggerSuperposition(),
            () => this.triggerRealityCollapse()
        ];
        
        // Glitch effects
        this.glitchEffects = [
            () => this.visualGlitch(),
            () => this.swapPaddles(),
            () => this.antigravity(),
            () => this.fragmentReality()
        ];
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    updateStatus(message) {
        this.statusDiv.textContent = message;
    }
    
    start() {
        this.state.running = true;
        this.state.paused = false;
        this.updateStatus('Game started! Prepare for quantum chaos!');
    }
    
    pause() {
        this.state.paused = !this.state.paused;
        this.updateStatus(this.state.paused ? 'Game paused' : 'Game resumed');
    }
    
    reset() {
        this.state.score = { player: 0, ai: 0 };
        this.state.reality = 100;
        this.state.quantumFlux = 0;
        this.ball.reset();
        this.particles = [];
        this.renderer.realityGlitches = [];
        this.updateStatus('Reality reset to baseline... for now.');
    }
    
    toggleQuantumMode() {
        this.state.quantumMode = !this.state.quantumMode;
        this.updateStatus(this.state.quantumMode ? 
            'Quantum mode ENABLED! Embrace the uncertainty!' : 
            'Quantum mode disabled. Classical physics restored.');
    }
    
    toggleGlitchMode() {
        this.state.glitchMode = !this.state.glitchMode;
        this.updateStatus(this.state.glitchMode ? 
            'PHYSICS BROKEN! CHAOS UNLEASHED!' : 
            'Physics repaired... mostly.');
    }
    
    async update() {
        if (!this.state.running || this.state.paused) return;
        
        // Player input
        this.playerPaddle.velocity = 0;
        if (this.keys['w'] || this.keys['W'] || this.keys['ArrowUp']) {
            this.playerPaddle.velocity = -this.playerPaddle.speed;
        }
        if (this.keys['s'] || this.keys['S'] || this.keys['ArrowDown']) {
            this.playerPaddle.velocity = this.playerPaddle.speed;
        }
        
        // AI decision using TensorFlow.js
        const aiAction = await this.aiController.predict(
            this.ball, 
            this.aiPaddle, 
            this.canvas.width, 
            this.canvas.height
        );
        
        this.aiPaddle.velocity = aiAction * this.aiPaddle.speed;
        
        // Record AI decision for learning
        this.aiController.recordDecision(
            this.ball,
            this.aiPaddle,
            this.canvas.width,
            this.canvas.height,
            aiAction
        );
        
        // Update game objects
        this.playerPaddle.update(this.canvas.height);
        this.aiPaddle.update(this.canvas.height);
        this.ball.update(this.state.quantumMode, this.state.quantumFlux);
        
        // Check collisions
        const playerHit = this.ball.checkPaddleCollision(
            this.playerPaddle, 
            this.state.quantumMode,
            (msg) => this.updateStatus(msg)
        );
        if (playerHit.hit && playerHit.fluxIncrease) {
            this.state.quantumFlux += playerHit.fluxIncrease;
        }
        
        const aiHit = this.ball.checkPaddleCollision(
            this.aiPaddle, 
            this.state.quantumMode,
            (msg) => this.updateStatus(msg)
        );
        if (aiHit.hit && aiHit.fluxIncrease) {
            this.state.quantumFlux += aiHit.fluxIncrease;
        }
        
        // Check scoring
        const scored = this.ball.checkScore();
        if (scored === 'ai') {
            this.state.score.ai++;
            this.ball.reset();
            await this.aiController.reward();
        } else if (scored === 'player') {
            this.state.score.player++;
            this.ball.reset();
            await this.aiController.punish();
        }
        
        // Quantum effects
        if (this.state.quantumMode) {
            this.state.quantumFlux += 0.1;
            
            // Random quantum events
            if (Math.random() < 0.002) {
                const event = this.quantumEvents[Math.floor(Math.random() * this.quantumEvents.length)];
                event();
            }
        }
        
        // Glitch mode chaos
        if (this.state.glitchMode && Math.random() < 0.05) {
            const glitch = this.glitchEffects[Math.floor(Math.random() * this.glitchEffects.length)];
            glitch();
        }
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.update();
            return p.isAlive();
        });
        
        // Reality restoration
        if (this.state.reality < 50) {
            if (Math.random() < 0.01) {
                this.state.reality = Math.min(100, this.state.reality + 1);
            }
        }
    }
    
    draw() {
        this.renderer.clear(this.state.reality);
        this.renderer.drawGlitches();
        this.renderer.drawCenterLine();
        
        // Draw game objects
        this.playerPaddle.draw(this.ctx, this.state.quantumMode);
        this.aiPaddle.draw(this.ctx, this.state.quantumMode);
        this.ball.draw(this.ctx, this.state.quantumMode);
        
        // Draw particles
        this.particles.forEach(p => p.draw(this.ctx));
        
        // Draw UI
        this.renderer.drawScore(this.state.score.player, this.state.score.ai);
        this.renderer.drawMeters(this.state.quantumMode, this.state.quantumFlux, this.state.reality);
    }
    
    async gameLoop() {
        await this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // Quantum events
    triggerUncertainty() {
        this.updateStatus('HEISENBERG UNCERTAINTY ACTIVATED');
        this.ball.uncertainty = 10;
    }
    
    triggerEntanglement() {
        this.updateStatus('QUANTUM ENTANGLEMENT! SPEED INVERTED');
        this.ball.speedX = -this.ball.speedX;
        this.ball.speedY = -this.ball.speedY;
    }
    
    triggerSchrodinger() {
        this.updateStatus('SCHRODINGER EVENT! BALL IS EVERYWHERE AND NOWHERE');
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.ball.x, this.ball.y));
        }
    }
    
    triggerSuperposition() {
        this.updateStatus('QUANTUM SUPERPOSITION INTENSIFIED');
        this.state.quantumFlux += 30;
    }
    
    triggerRealityCollapse() {
        this.updateStatus('REALITY COLLAPSE');
        this.state.reality = Math.max(0, this.state.reality - 20);
    }
    
    // Glitch effects
    visualGlitch() {
        this.renderer.createGlitches(5);
    }
    
    swapPaddles() {
        [this.playerPaddle.y, this.aiPaddle.y] = [this.aiPaddle.y, this.playerPaddle.y];
        this.updateStatus('PADDLE POSITIONS SWAPPED');
    }
    
    antigravity() {
        this.ball.speedY = -this.ball.speedY * 2;
        this.updateStatus('ANTI-GRAVITY ACTIVATED');
    }
    
    fragmentReality() {
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }
        this.updateStatus('REALITY FRAGMENTATION');
    }
}
