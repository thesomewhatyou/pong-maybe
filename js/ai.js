// Advanced Neural Network AI (without external dependencies)
export class AIController {
    constructor() {
        this.network = this.createNetwork();
        this.learningRate = 0.01;
        this.trainingData = [];
        this.maxTrainingData = 200;
        this.adaptiveStrategy = 'balanced'; // balanced, aggressive, defensive
    }
    
    createNetwork() {
        // Multi-layer neural network with configurable architecture
        return {
            layers: [
                { weights: this.randomMatrix(4, 16), biases: this.randomArray(16), activation: 'relu' },
                { weights: this.randomMatrix(16, 8), biases: this.randomArray(8), activation: 'relu' },
                { weights: this.randomMatrix(8, 3), biases: this.randomArray(3), activation: 'softmax' }
            ]
        };
    }
    
    randomMatrix(rows, cols) {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                // Xavier initialization
                matrix[i][j] = (Math.random() * 2 - 1) * Math.sqrt(2.0 / rows);
            }
        }
        return matrix;
    }
    
    randomArray(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr[i] = (Math.random() * 2 - 1) * 0.1;
        }
        return arr;
    }
    
    relu(x) {
        return Math.max(0, x);
    }
    
    softmax(values) {
        const max = Math.max(...values);
        const exps = values.map(v => Math.exp(v - max));
        const sum = exps.reduce((a, b) => a + b, 0);
        return exps.map(e => e / sum);
    }
    
    matrixMultiply(input, weights, biases) {
        const output = [];
        for (let j = 0; j < weights[0].length; j++) {
            let sum = biases[j];
            for (let i = 0; i < input.length; i++) {
                sum += input[i] * weights[i][j];
            }
            output[j] = sum;
        }
        return output;
    }
    
    forwardPass(inputs) {
        let activation = inputs;
        const activations = [inputs];
        
        for (let i = 0; i < this.network.layers.length; i++) {
            const layer = this.network.layers[i];
            const z = this.matrixMultiply(activation, layer.weights, layer.biases);
            
            if (layer.activation === 'relu') {
                activation = z.map(v => this.relu(v));
            } else if (layer.activation === 'softmax') {
                activation = this.softmax(z);
            }
            
            activations.push(activation);
        }
        
        return { output: activation, activations };
    }
    
    normalizeInputs(ball, paddle, canvasWidth, canvasHeight) {
        return [
            ball.y / canvasHeight,
            ball.speedY / 10,
            (ball.x - paddle.x) / canvasWidth,
            paddle.y / canvasHeight
        ];
    }
    
    async predict(ball, paddle, canvasWidth, canvasHeight) {
        const inputs = this.normalizeInputs(ball, paddle, canvasWidth, canvasHeight);
        const { output } = this.forwardPass(inputs);
        
        // Add strategic behavior based on game state
        const ballComingTowards = ball.speedX > 0;
        const predictedY = this.predictBallY(ball, paddle.x, canvasWidth, canvasHeight);
        
        if (ballComingTowards) {
            // Calculate optimal paddle position
            const targetY = predictedY - paddle.height / 2;
            const currentY = paddle.y;
            const diff = targetY - currentY;
            
            // Use neural network with adaptive strategy
            if (Math.abs(diff) < 5) {
                return 0; // Stay
            } else if (diff > 0) {
                return output[2] > output[0] ? 1 : 0; // Down or stay
            } else {
                return output[0] > output[2] ? -1 : 0; // Up or stay
            }
        } else {
            // Move to center when ball is far
            const centerY = canvasHeight / 2;
            const diff = centerY - paddle.y - paddle.height / 2;
            
            if (Math.abs(diff) < 10) return 0;
            return diff > 0 ? 1 : -1;
        }
    }
    
    predictBallY(ball, targetX, canvasWidth, canvasHeight) {
        // Predict where ball will be when it reaches paddle
        const timeToReach = Math.abs(targetX - ball.x) / Math.abs(ball.speedX);
        let predictedY = ball.y + ball.speedY * timeToReach;
        
        // Account for bounces
        while (predictedY < 0 || predictedY > canvasHeight) {
            if (predictedY < 0) {
                predictedY = -predictedY;
            } else if (predictedY > canvasHeight) {
                predictedY = 2 * canvasHeight - predictedY;
            }
        }
        
        return predictedY;
    }
    
    recordDecision(ball, paddle, canvasWidth, canvasHeight, action) {
        const inputs = this.normalizeInputs(ball, paddle, canvasWidth, canvasHeight);
        const actionOneHot = [0, 0, 0];
        actionOneHot[action + 1] = 1;
        
        this.trainingData.push({ inputs, action: actionOneHot });
        
        if (this.trainingData.length > this.maxTrainingData) {
            this.trainingData.shift();
        }
    }
    
    async reward() {
        // Positive reinforcement
        if (this.trainingData.length < 20) return;
        this.trainOnRecentData(1.0);
    }
    
    async punish() {
        // Negative reinforcement
        if (this.trainingData.length < 20) return;
        this.trainOnRecentData(-0.5);
    }
    
    trainOnRecentData(rewardFactor) {
        if (this.trainingData.length < 10) return;
        
        const recentData = this.trainingData.slice(-30);
        
        // Backpropagation with gradient descent
        for (const data of recentData) {
            const { output, activations } = this.forwardPass(data.inputs);
            
            // Calculate error (target - output)
            const error = [];
            for (let i = 0; i < 3; i++) {
                error[i] = (data.action[i] - output[i]) * rewardFactor;
            }
            
            // Update weights using gradient descent
            this.updateWeights(activations, error);
        }
    }
    
    updateWeights(activations, finalError) {
        let error = finalError;
        
        // Backpropagate through layers
        for (let l = this.network.layers.length - 1; l >= 0; l--) {
            const layer = this.network.layers[l];
            const prevActivation = activations[l];
            const nextError = new Array(prevActivation.length).fill(0);
            
            // Update weights and biases
            for (let j = 0; j < error.length; j++) {
                layer.biases[j] += this.learningRate * error[j];
                
                for (let i = 0; i < prevActivation.length; i++) {
                    const gradient = this.learningRate * error[j] * prevActivation[i];
                    layer.weights[i][j] += gradient;
                    
                    // Calculate error for previous layer
                    if (l > 0) {
                        nextError[i] += error[j] * layer.weights[i][j];
                    }
                }
            }
            
            // Apply activation derivative for ReLU layers
            if (l > 0 && layer.activation === 'relu') {
                for (let i = 0; i < nextError.length; i++) {
                    nextError[i] = activations[l][i] > 0 ? nextError[i] : 0;
                }
            }
            
            error = nextError;
        }
    }
    
    dispose() {
        // Cleanup if needed
        this.trainingData = [];
    }
}

