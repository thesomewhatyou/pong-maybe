// Quantum Pong - An overcomplicated mess of a game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');

// Game state
let gameState = {
    running: false,
    paused: false,
    quantumMode: true,
    glitchMode: false,
    score: { player: 0, ai: 0 },
    reality: 100,
    quantumFlux: 0
};

// Paddle class
class Paddle {
    constructor(x, y, isAI = false) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 80;
        this.speed = 5;
        this.isAI = isAI;
        this.velocity = 0;
    }
    
    draw() {
        ctx.fillStyle = this.isAI ? '#ff00ff' : '#00ff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Quantum glow effect
        if (gameState.quantumMode) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.isAI ? '#ff00ff' : '#00ff00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowBlur = 0;
        }
    }
    
    update() {
        this.y += this.velocity;
        // Keep paddle in bounds
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
    }
}

// Ball class with quantum properties
class Ball {
    constructor() {
        this.reset();
        this.ghostBalls = [];
    }
    
    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 8;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
        this.uncertainty = 0;
        this.quantumState = 'coherent';
    }
    
    draw() {
        // Main ball
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Quantum superposition - ghost balls
        if (gameState.quantumMode) {
            this.ghostBalls.forEach(ghost => {
                ctx.fillStyle = `rgba(0, 255, 255, ${ghost.opacity})`;
                ctx.beginPath();
                ctx.arc(ghost.x, ghost.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
    
    update() {
        // Apply uncertainty to position
        let uncertaintyX = 0, uncertaintyY = 0;
        if (gameState.quantumMode) {
            uncertaintyX = (Math.random() - 0.5) * this.uncertainty * 2;
            uncertaintyY = (Math.random() - 0.5) * this.uncertainty * 2;
        }
        
        this.x += this.speedX + uncertaintyX;
        this.y += this.speedY + uncertaintyY;
        
        // Update ghost balls (superposition states)
        if (gameState.quantumMode) {
            this.updateGhostBalls();
        }
        
        // Top and bottom collision
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.speedY = -this.speedY;
            this.quantumCollapse();
        }
        
        // Scoring
        if (this.x - this.radius < 0) {
            gameState.score.ai++;
            this.reset();
            neuralNetwork.punish();
        }
        if (this.x + this.radius > canvas.width) {
            gameState.score.player++;
            this.reset();
            neuralNetwork.reward();
        }
    }
    
    updateGhostBalls() {
        // Create quantum superposition
        this.ghostBalls = [];
        const numGhosts = 3 + Math.floor(gameState.quantumFlux / 20);
        
        for (let i = 0; i < numGhosts; i++) {
            this.ghostBalls.push({
                x: this.x + (Math.random() - 0.5) * 30,
                y: this.y + (Math.random() - 0.5) * 30,
                opacity: 0.2 + Math.random() * 0.3
            });
        }
    }
    
    quantumCollapse() {
        this.uncertainty = Math.max(0, this.uncertainty - 1);
        gameState.quantumFlux += 5;
    }
    
    checkPaddleCollision(paddle) {
        // Quantum tunneling - sometimes ball passes through!
        if (gameState.quantumMode && Math.random() < 0.05) {
            statusDiv.textContent = '🌌 QUANTUM TUNNELING DETECTED! 🌌';
            return false; // Ball tunnels through
        }
        
        if (this.x - this.radius < paddle.x + paddle.width &&
            this.x + this.radius > paddle.x &&
            this.y > paddle.y &&
            this.y < paddle.y + paddle.height) {
            
            this.speedX = -this.speedX * 1.05; // Speed up slightly
            this.uncertainty += 2;
            
            // Add spin based on where ball hits paddle
            const hitPos = (this.y - paddle.y) / paddle.height;
            this.speedY = (hitPos - 0.5) * 10;
            
            this.quantumCollapse();
            return true;
        }
        return false;
    }
}

// Neural Network AI (simplified)
class NeuralNetwork {
    constructor() {
        this.weights = {
            ballY: Math.random() * 2 - 1,
            ballSpeedY: Math.random() * 2 - 1,
            distance: Math.random() * 2 - 1,
            paddleY: Math.random() * 2 - 1
        };
        this.learningRate = 0.01;
        this.memory = [];
    }
    
    predict(ball, paddle) {
        // Neural network decision making
        const inputs = {
            ballY: ball.y / canvas.height,
            ballSpeedY: ball.speedY / 10,
            distance: (ball.x - paddle.x) / canvas.width,
            paddleY: paddle.y / canvas.height
        };
        
        // Calculate weighted sum
        let decision = 
            inputs.ballY * this.weights.ballY +
            inputs.ballSpeedY * this.weights.ballSpeedY +
            inputs.distance * this.weights.distance +
            inputs.paddleY * this.weights.paddleY;
        
        // Store in memory for learning
        this.memory.push({ inputs, decision });
        if (this.memory.length > 100) this.memory.shift();
        
        return decision;
    }
    
    reward() {
        // AI scored - reinforce current behavior
        this.adjustWeights(1);
    }
    
    punish() {
        // AI lost - adjust weights negatively
        this.adjustWeights(-1);
    }
    
    adjustWeights(factor) {
        if (this.memory.length === 0) return;
        
        const recent = this.memory.slice(-10);
        recent.forEach(mem => {
            this.weights.ballY += mem.inputs.ballY * this.learningRate * factor;
            this.weights.ballSpeedY += mem.inputs.ballSpeedY * this.learningRate * factor;
            this.weights.distance += mem.inputs.distance * this.learningRate * factor;
            this.weights.paddleY += mem.inputs.paddleY * this.learningRate * factor;
        });
        
        // Add some randomness (quantum AI!)
        if (gameState.quantumMode && Math.random() < 0.1) {
            Object.keys(this.weights).forEach(key => {
                this.weights[key] += (Math.random() - 0.5) * 0.2;
            });
        }
    }
}

// Particle effects
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
        this.life = 1;
        this.decay = 0.02;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.fillRect(this.x, this.y, 3, 3);
        ctx.globalAlpha = 1;
    }
}

// Game objects
const playerPaddle = new Paddle(20, canvas.height / 2 - 40);
const aiPaddle = new Paddle(canvas.width - 30, canvas.height / 2 - 40, true);
const ball = new Ball();
const neuralNetwork = new NeuralNetwork();
let particles = [];

// Quantum effects
let quantumEffects = [];
let realityGlitches = [];

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update function
function update() {
    if (!gameState.running || gameState.paused) return;
    
    // Player input
    playerPaddle.velocity = 0;
    if (keys['w'] || keys['W'] || keys['ArrowUp']) {
        playerPaddle.velocity = -playerPaddle.speed;
    }
    if (keys['s'] || keys['S'] || keys['ArrowDown']) {
        playerPaddle.velocity = playerPaddle.speed;
    }
    
    // AI using neural network
    const aiDecision = neuralNetwork.predict(ball, aiPaddle);
    aiPaddle.velocity = 0;
    if (aiDecision > 0.1) {
        aiPaddle.velocity = aiPaddle.speed;
    } else if (aiDecision < -0.1) {
        aiPaddle.velocity = -aiPaddle.speed;
    }
    
    // Update game objects
    playerPaddle.update();
    aiPaddle.update();
    ball.update();
    
    // Check collisions
    ball.checkPaddleCollision(playerPaddle);
    ball.checkPaddleCollision(aiPaddle);
    
    // Quantum effects
    if (gameState.quantumMode) {
        gameState.quantumFlux += 0.1;
        
        // Random quantum events
        if (Math.random() < 0.002) {
            triggerQuantumEvent();
        }
    }
    
    // Glitch mode chaos
    if (gameState.glitchMode) {
        if (Math.random() < 0.05) {
            triggerGlitch();
        }
    }
    
    // Update particles
    particles = particles.filter(p => {
        p.update();
        return p.life > 0;
    });
    
    // Reality degradation
    if (gameState.reality < 50) {
        if (Math.random() < 0.01) {
            gameState.reality = Math.min(100, gameState.reality + 1);
        }
    }
}

// Draw function
function draw() {
    // Clear canvas with reality distortion
    if (gameState.reality < 100) {
        const alpha = gameState.reality / 100;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    } else {
        ctx.fillStyle = '#000';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reality glitches
    if (realityGlitches.length > 0) {
        realityGlitches.forEach(glitch => {
            ctx.fillStyle = glitch.color;
            ctx.fillRect(glitch.x, glitch.y, glitch.width, glitch.height);
        });
        realityGlitches = realityGlitches.filter(g => Math.random() > 0.3);
    }
    
    // Draw center line (quantum style)
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#00ff0033';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw game objects
    playerPaddle.draw();
    aiPaddle.draw();
    ball.draw();
    
    // Draw particles
    particles.forEach(p => p.draw());
    
    // Draw score
    ctx.font = '36px "Courier New"';
    ctx.fillStyle = '#00ff00';
    ctx.fillText(gameState.score.player, canvas.width / 4, 50);
    ctx.fillStyle = '#ff00ff';
    ctx.fillText(gameState.score.ai, (canvas.width / 4) * 3, 50);
    
    // Draw quantum flux meter
    if (gameState.quantumMode) {
        ctx.fillStyle = '#00ffff';
        ctx.font = '14px "Courier New"';
        ctx.fillText(`Quantum Flux: ${Math.floor(gameState.quantumFlux)}`, 10, canvas.height - 10);
        ctx.fillText(`Reality: ${Math.floor(gameState.reality)}%`, canvas.width - 150, canvas.height - 10);
    }
}

// Quantum events
function triggerQuantumEvent() {
    const events = [
        () => {
            statusDiv.textContent = '⚡ HEISENBERG UNCERTAINTY ACTIVATED! ⚡';
            ball.uncertainty = 10;
        },
        () => {
            statusDiv.textContent = '🌀 QUANTUM ENTANGLEMENT! SPEED INVERTED! 🌀';
            ball.speedX = -ball.speedX;
            ball.speedY = -ball.speedY;
        },
        () => {
            statusDiv.textContent = '🎲 SCHRÖDINGER EVENT! BALL IS BOTH EVERYWHERE AND NOWHERE! 🎲';
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(ball.x, ball.y));
            }
        },
        () => {
            statusDiv.textContent = '👻 QUANTUM SUPERPOSITION INTENSIFIED! 👻';
            gameState.quantumFlux += 30;
        },
        () => {
            statusDiv.textContent = '🌌 REALITY COLLAPSE! 🌌';
            gameState.reality = Math.max(0, gameState.reality - 20);
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event();
}

// Glitch effects
function triggerGlitch() {
    const glitches = [
        () => {
            // Visual glitch
            for (let i = 0; i < 5; i++) {
                realityGlitches.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    width: Math.random() * 200,
                    height: Math.random() * 100,
                    color: `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.3)`
                });
            }
        },
        () => {
            // Paddle swap
            [playerPaddle.y, aiPaddle.y] = [aiPaddle.y, playerPaddle.y];
            statusDiv.textContent = '🔀 PADDLE POSITIONS SWAPPED! 🔀';
        },
        () => {
            // Gravity reversal
            ball.speedY = -ball.speedY * 2;
            statusDiv.textContent = '⬆️ ANTI-GRAVITY ACTIVATED! ⬆️';
        },
        () => {
            // Multiple balls illusion
            for (let i = 0; i < 20; i++) {
                particles.push(new Particle(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                ));
            }
            statusDiv.textContent = '✨ REALITY FRAGMENTATION! ✨';
        }
    ];
    
    const glitch = glitches[Math.floor(Math.random() * glitches.length)];
    glitch();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Button controls
document.getElementById('startBtn').addEventListener('click', () => {
    gameState.running = true;
    gameState.paused = false;
    statusDiv.textContent = 'Game started! Prepare for quantum chaos!';
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    gameState.paused = !gameState.paused;
    statusDiv.textContent = gameState.paused ? 'Game paused' : 'Game resumed';
});

document.getElementById('resetBtn').addEventListener('click', () => {
    gameState.score = { player: 0, ai: 0 };
    gameState.reality = 100;
    gameState.quantumFlux = 0;
    ball.reset();
    particles = [];
    realityGlitches = [];
    statusDiv.textContent = 'Reality reset to baseline... for now.';
});

document.getElementById('quantumBtn').addEventListener('click', () => {
    gameState.quantumMode = !gameState.quantumMode;
    statusDiv.textContent = gameState.quantumMode ? 
        '🌀 Quantum mode ENABLED! Embrace the uncertainty!' : 
        '🔒 Quantum mode disabled. Classical physics restored.';
});

document.getElementById('glitchBtn').addEventListener('click', () => {
    gameState.glitchMode = !gameState.glitchMode;
    statusDiv.textContent = gameState.glitchMode ? 
        '💥 PHYSICS BROKEN! CHAOS UNLEASHED! 💥' : 
        '🔧 Physics repaired... mostly.';
});

// Start the game loop
gameLoop();
