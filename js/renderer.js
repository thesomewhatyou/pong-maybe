// Rendering utilities
export class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.realityGlitches = [];
    }
    
    clear(reality) {
        // Clear canvas with reality distortion
        if (reality < 100) {
            const alpha = reality / 100;
            this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        } else {
            this.ctx.fillStyle = '#000';
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawCenterLine() {
        this.ctx.setLineDash([10, 10]);
        this.ctx.strokeStyle = '#00ff0033';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawScore(playerScore, aiScore) {
        this.ctx.font = '36px "Courier New"';
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillText(playerScore, this.canvas.width / 4, 50);
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillText(aiScore, (this.canvas.width / 4) * 3, 50);
    }
    
    drawMeters(quantumMode, quantumFlux, reality) {
        if (quantumMode) {
            this.ctx.fillStyle = '#00ffff';
            this.ctx.font = '14px "Courier New"';
            this.ctx.fillText(`Quantum Flux: ${Math.floor(quantumFlux)}`, 10, this.canvas.height - 10);
            this.ctx.fillText(`Reality: ${Math.floor(reality)}%`, this.canvas.width - 150, this.canvas.height - 10);
        }
    }
    
    drawGlitches() {
        if (this.realityGlitches.length > 0) {
            this.realityGlitches.forEach(glitch => {
                this.ctx.fillStyle = glitch.color;
                this.ctx.fillRect(glitch.x, glitch.y, glitch.width, glitch.height);
            });
            this.realityGlitches = this.realityGlitches.filter(g => Math.random() > 0.3);
        }
    }
    
    addGlitch(x, y, width, height, color) {
        this.realityGlitches.push({ x, y, width, height, color });
    }
    
    createGlitches(count) {
        for (let i = 0; i < count; i++) {
            this.addGlitch(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 200,
                Math.random() * 100,
                `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.3)`
            );
        }
    }
}
