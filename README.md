# Quantum Pong

An experimental browser-based pong game featuring quantum physics simulations and machine learning AI.

## Overview

This project is an overcomplicated implementation of the classic Pong game, incorporating quantum mechanics concepts and a TensorFlow.js-powered AI opponent that learns from gameplay.

## Features

### Quantum Physics Simulation

- **Quantum Superposition**: The ball exists in multiple probable states simultaneously, visualized as ghost balls
- **Heisenberg Uncertainty Principle**: Ball position and velocity become increasingly uncertain with each collision
- **Quantum Tunneling**: The ball has a small probability (5%) of phasing through paddles
- **Wave Function Collapse**: Uncertainty reduces upon collision, simulating quantum measurement
- **Quantum Flux System**: Tracks accumulated quantum effects throughout gameplay

### Machine Learning AI

The AI opponent uses a custom-built neural network with backpropagation learning:

- **Input Layer**: 4 normalized inputs (ball Y position, ball Y velocity, distance from paddle, paddle Y position)
- **Hidden Layers**: Two dense layers with ReLU activation (16 and 8 units)
- **Output Layer**: 3-class softmax (move up, stay, move down)
- **Training**: Backpropagation with gradient descent and reinforcement learning
- **Learning Rate**: 0.01 with Xavier weight initialization

The AI improves over time by:
- Recording decisions during gameplay
- Training on recent data when scoring events occur
- Using backpropagation to adjust network weights
- Combining neural network predictions with strategic ball trajectory prediction
- Adjusting behavior based on success/failure outcomes

The network implements a complete forward pass, softmax activation, and backpropagation algorithm from scratch without external dependencies.

### Chaos Systems

- **Reality Degradation**: Universe stability metric (0-100%) that affects visual rendering
- **Glitch Mode**: Enables chaotic effects including:
  - Visual distortions and artifacts
  - Paddle position swaps
  - Gravity inversions
  - Particle explosions
- **Random Quantum Events**: Probabilistic triggers for various quantum phenomena

## Technical Architecture

### Modular Design

The game is structured as ES6 modules:

```
js/
├── main.js        # Entry point and initialization
├── game.js        # Main game controller
├── paddle.js      # Paddle class
├── ball.js        # Ball class with quantum properties
├── ai.js          # TensorFlow.js AI controller
├── particles.js   # Particle effects system
└── renderer.js    # Rendering utilities
```

### Dependencies

- **HTML5 Canvas API**: Graphics rendering
- **ES6 Modules**: Code organization

No external libraries required - all neural network and game logic implemented from scratch.

### Key Classes

- `Game`: Main controller coordinating all game systems
- `Paddle`: Player and AI paddle management
- `Ball`: Ball physics with quantum properties
- `AIController`: Neural network training and prediction
- `Particle`: Visual effects
- `Renderer`: Canvas rendering utilities

## How to Play

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Wait for TensorFlow.js to load
3. Click **START** to begin
4. Control your paddle using:
   - W/S keys, or
   - Arrow Up/Down keys
5. Score points against the AI opponent

### Game Controls

- **START**: Begin gameplay
- **PAUSE**: Pause/resume the game
- **RESET REALITY**: Reset scores and restore universe stability
- **TOGGLE QUANTUM MODE**: Enable/disable quantum effects
- **BREAK PHYSICS**: Enable/disable glitch mode

## Game Mechanics

### Scoring

- Ball crossing the left edge scores a point for the AI
- Ball crossing the right edge scores a point for the player
- Each scoring event triggers AI training

### Quantum Effects

The quantum flux meter increases during gameplay and affects:
- Number of superposition ghost balls
- Probability of quantum events
- Visual uncertainty effects

### Reality System

Reality percentage decreases during quantum collapse events and gradually restores over time. Low reality values cause:
- Visual degradation
- Reduced canvas opacity
- Increased instability

## Performance

The game runs at 60 FPS using `requestAnimationFrame`. Neural network training uses backpropagation and occurs during scoring events with minimal performance impact.

## Browser Compatibility

Requires a modern browser with support for:
- ES6 modules
- HTML5 Canvas
- Async/await syntax

Tested on:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Development

The game uses vanilla JavaScript with no build process required. Simply serve the files over HTTP and open in a browser.

For local development:
```bash
python3 -m http.server 8000
# Navigate to http://localhost:8000
```

## Implementation Details

### AI Training Strategy

The AI uses a supervised learning approach with delayed feedback:
1. Records input states and actions during gameplay
2. Maintains a buffer of recent decisions (max 200)
3. Trains on the most recent 50 decisions when scoring occurs
4. Uses small batch size (16) and few epochs (3) to prevent overfitting

### Quantum Simulation

Quantum effects are simulated probabilistically:
- Superposition: Multiple visual representations of possible states
- Uncertainty: Random position/velocity offsets based on uncertainty value
- Tunneling: Collision detection bypass with 5% probability
- Entanglement: Random trajectory inversions

## License

This software is released into the public domain under The Unlicense. See LICENSE file for details.

## Credits

Built with vanilla JavaScript and HTML5 Canvas. Neural network implementation uses custom backpropagation algorithm. 
