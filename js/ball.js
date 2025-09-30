// Ball class with quantum properties
export class Ball {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.radius = 8;
        this.ghostBalls = [];
        this.reset();
    }
    
    reset() {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
        this.uncertainty = 0;
        this.quantumState = 'coherent';
    }
    
    draw(ctx, quantumMode) {
        // Main ball
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Quantum superposition - ghost balls
        if (quantumMode) {
            this.ghostBalls.forEach(ghost => {
                ctx.fillStyle = `rgba(0, 255, 255, ${ghost.opacity})`;
                ctx.beginPath();
                ctx.arc(ghost.x, ghost.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
    
    update(quantumMode, quantumFlux) {
        // Apply uncertainty to position
        let uncertaintyX = 0, uncertaintyY = 0;
        if (quantumMode) {
            uncertaintyX = (Math.random() - 0.5) * this.uncertainty * 2;
            uncertaintyY = (Math.random() - 0.5) * this.uncertainty * 2;
        }
        
        this.x += this.speedX + uncertaintyX;
        this.y += this.speedY + uncertaintyY;
        
        // Update ghost balls (superposition states)
        if (quantumMode) {
            this.updateGhostBalls(quantumFlux);
        }
        
        // Top and bottom collision
        if (this.y - this.radius < 0 || this.y + this.radius > this.canvasHeight) {
            this.speedY = -this.speedY;
            this.quantumCollapse();
        }
    }
    
    updateGhostBalls(quantumFlux) {
        // Create quantum superposition
        this.ghostBalls = [];
        const numGhosts = 3 + Math.floor(quantumFlux / 20);
        
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
        return 5; // Quantum flux increase
    }
    
    checkPaddleCollision(paddle, quantumMode, statusCallback) {
        // Quantum tunneling - sometimes ball passes through
        if (quantumMode && Math.random() < 0.05) {
            if (statusCallback) {
                statusCallback('QUANTUM TUNNELING DETECTED');
            }
            return { hit: false, tunneled: true };
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
            
            const fluxIncrease = this.quantumCollapse();
            return { hit: true, fluxIncrease, tunneled: false };
        }
        return { hit: false, tunneled: false };
    }
    
    checkScore() {
        if (this.x - this.radius < 0) {
            return 'ai'; // AI scored
        }
        if (this.x + this.radius > this.canvasWidth) {
            return 'player'; // Player scored
        }
        return null;
    }
}
