// AI controller using TensorFlow.js
export class AIController {
    constructor() {
        this.model = null;
        this.training = false;
        this.trainingData = [];
        this.maxTrainingData = 200;
        this.setupModel();
    }
    
    setupModel() {
        // Create a simple sequential model
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [4], units: 16, activation: 'relu' }),
                tf.layers.dense({ units: 8, activation: 'relu' }),
                tf.layers.dense({ units: 3, activation: 'softmax' }) // Output: up, stay, down
            ]
        });
        
        this.model.compile({
            optimizer: tf.train.adam(0.01),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });
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
        
        return tf.tidy(() => {
            const inputTensor = tf.tensor2d([inputs]);
            const prediction = this.model.predict(inputTensor);
            const values = prediction.arraySync()[0];
            
            // Return action: -1 (up), 0 (stay), 1 (down)
            const maxIndex = values.indexOf(Math.max(...values));
            return maxIndex - 1; // Convert 0,1,2 to -1,0,1
        });
    }
    
    recordDecision(ball, paddle, canvasWidth, canvasHeight, action) {
        const inputs = this.normalizeInputs(ball, paddle, canvasWidth, canvasHeight);
        
        // Convert action to one-hot encoding
        const actionOneHot = [0, 0, 0];
        actionOneHot[action + 1] = 1; // Convert -1,0,1 to 0,1,2
        
        this.trainingData.push({ inputs, action: actionOneHot });
        
        // Keep only recent data
        if (this.trainingData.length > this.maxTrainingData) {
            this.trainingData.shift();
        }
    }
    
    async reward() {
        // Positive reinforcement - train on successful actions
        if (this.trainingData.length < 20) return;
        
        await this.trainOnRecentData(1.0);
    }
    
    async punish() {
        // Negative reinforcement - train with inverted rewards
        if (this.trainingData.length < 20) return;
        
        await this.trainOnRecentData(0.5);
    }
    
    async trainOnRecentData(weight = 1.0) {
        if (this.training || this.trainingData.length < 10) return;
        
        this.training = true;
        
        try {
            const recentData = this.trainingData.slice(-50);
            const inputs = recentData.map(d => d.inputs);
            const actions = recentData.map(d => d.action);
            
            const xs = tf.tensor2d(inputs);
            const ys = tf.tensor2d(actions);
            
            await this.model.fit(xs, ys, {
                epochs: 3,
                batchSize: 16,
                verbose: 0,
                shuffle: true
            });
            
            xs.dispose();
            ys.dispose();
        } catch (error) {
            console.error('Training error:', error);
        }
        
        this.training = false;
    }
    
    dispose() {
        if (this.model) {
            this.model.dispose();
        }
    }
}
