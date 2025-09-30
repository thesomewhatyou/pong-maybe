// Main entry point
import { Game } from './game.js';

// Initialize the game
async function init() {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Initializing neural network...';
    
    // Small delay to show loading message
    await new Promise(resolve => setTimeout(resolve, 100));
    statusDiv.textContent = 'Press START to begin the quantum chaos...';
    
    // Initialize game
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Setup controls
    document.getElementById('startBtn').addEventListener('click', () => {
        game.start();
    });
    
    document.getElementById('pauseBtn').addEventListener('click', () => {
        game.pause();
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        game.reset();
    });
    
    document.getElementById('quantumBtn').addEventListener('click', () => {
        game.toggleQuantumMode();
    });
    
    document.getElementById('glitchBtn').addEventListener('click', () => {
        game.toggleGlitchMode();
    });
    
    // Start game loop
    game.gameLoop();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
