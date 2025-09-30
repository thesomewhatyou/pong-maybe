// Paddle class for player and AI paddles
export class Paddle {
    constructor(x, y, isAI = false) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 80;
        this.speed = 5;
        this.isAI = isAI;
        this.velocity = 0;
    }
    
    draw(ctx, quantumMode) {
        ctx.fillStyle = this.isAI ? '#ff00ff' : '#00ff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Quantum glow effect
        if (quantumMode) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.isAI ? '#ff00ff' : '#00ff00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowBlur = 0;
        }
    }
    
    update(canvasHeight) {
        this.y += this.velocity;
        // Keep paddle in bounds
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }
}
