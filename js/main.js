// Main entry point
import { Game } from './game.js';

// Wait for TensorFlow.js to load
async function init() {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Loading TensorFlow.js...';
    
    // Wait for TensorFlow.js to be ready
    await tf.ready();
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
