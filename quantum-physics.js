/**
 * QUANTUM PHYSICS ENGINE
 * =====================
 * Advanced quantum mechanics simulation for the most overcomplicated pong game
 * Implements: Superposition, Entanglement, Tunneling, Wave-Particle Duality, Uncertainty Principle
 */

class QuantumPhysicsEngine {
    constructor() {
        this.PLANCK_CONSTANT = 6.62607015e-34;
        this.REDUCED_PLANCK = this.PLANCK_CONSTANT / (2 * Math.PI);
        this.SPEED_OF_LIGHT = 299792458;
        this.BOLTZMANN_CONSTANT = 1.380649e-23;
        
        this.waveFunction = new Map();
        this.entangledPairs = new Set();
        this.quantumStates = [];
        this.superpositions = new Map();
        this.dimensionalRifts = [];
        this.quantumFluctuations = 0;
        this.observerEffect = 1.0;
        this.decoherenceRate = 0.01;
        this.tunnelProbability = 0.05;
    }
    
    /**
     * Initialize quantum state for an entity
     */
    initializeQuantumState(entityId, position, momentum) {
        const state = {
            id: entityId,
            position: { ...position },
            momentum: { ...momentum },
            waveFunction: this.createWaveFunction(position),
            phase: Math.random() * 2 * Math.PI,
            spinState: Math.random() > 0.5 ? 'up' : 'down',
            coherence: 1.0,
            superpositionStates: [],
            entangledWith: null,
            observationHistory: [],
            uncertaintyPosition: 0,
            uncertaintyMomentum: 0,
            quantumEnergy: 0,
            dimensionalShift: 0
        };
        
        this.waveFunction.set(entityId, state);
        return state;
    }
    
    /**
     * Create wave function for position
     */
    createWaveFunction(position) {
        return {
            amplitude: 1.0,
            frequency: Math.random() * 0.1 + 0.05,
            wavelength: 50 + Math.random() * 50,
            phase: 0,
            collapsed: false,
            distributionWidth: 10
        };
    }
    
    /**
     * Apply quantum superposition - entity exists in multiple states
     */
    applySuperposition(entityId, numStates = 3) {
        const state = this.waveFunction.get(entityId);
        if (!state) return null;
        
        const states = [];
        for (let i = 0; i < numStates; i++) {
            const deviation = 50 * (Math.random() - 0.5);
            states.push({
                position: {
                    x: state.position.x + deviation,
                    y: state.position.y + deviation
                },
                probability: 1 / numStates,
                phase: Math.random() * 2 * Math.PI,
                energy: Math.random() * 100
            });
        }
        
        state.superpositionStates = states;
        this.superpositions.set(entityId, states);
        return states;
    }
    
    /**
     * Collapse wave function upon observation (measurement)
     */
    collapseWaveFunction(entityId) {
        const state = this.waveFunction.get(entityId);
        if (!state || !state.superpositionStates.length) return state.position;
        
        // Probabilistic collapse based on quantum mechanics
        let random = Math.random();
        let cumulativeProbability = 0;
        let selectedState = state.superpositionStates[0];
        
        for (const superState of state.superpositionStates) {
            cumulativeProbability += superState.probability;
            if (random <= cumulativeProbability) {
                selectedState = superState;
                break;
            }
        }
        
        // Apply observer effect
        state.position = { ...selectedState.position };
        state.waveFunction.collapsed = true;
        state.coherence *= this.observerEffect;
        state.observationHistory.push({
            time: Date.now(),
            position: { ...state.position },
            state: 'collapsed'
        });
        
        // Decohere superposition
        setTimeout(() => {
            state.superpositionStates = [];
            state.waveFunction.collapsed = false;
        }, 100);
        
        return state.position;
    }
    
    /**
     * Create quantum entanglement between two entities
     */
    createEntanglement(entityId1, entityId2) {
        const state1 = this.waveFunction.get(entityId1);
        const state2 = this.waveFunction.get(entityId2);
        
        if (!state1 || !state2) return false;
        
        // Entangle spin states
        state1.entangledWith = entityId2;
        state2.entangledWith = entityId1;
        
        // Synchronize phases
        const avgPhase = (state1.phase + state2.phase) / 2;
        state1.phase = avgPhase;
        state2.phase = avgPhase;
        
        // Create correlation
        if (state1.spinState === 'up') {
            state2.spinState = 'down';
        } else {
            state2.spinState = 'up';
        }
        
        this.entangledPairs.add([entityId1, entityId2].sort().join('-'));
        return true;
    }
    
    /**
     * Apply entanglement effects
     */
    applyEntanglementEffects(entityId) {
        const state = this.waveFunction.get(entityId);
        if (!state || !state.entangledWith) return;
        
        const entangledState = this.waveFunction.get(state.entangledWith);
        if (!entangledState) return;
        
        // Quantum correlation - if one is observed, affect the other
        if (state.waveFunction.collapsed && !entangledState.waveFunction.collapsed) {
            entangledState.spinState = state.spinState === 'up' ? 'down' : 'up';
            entangledState.phase = state.phase + Math.PI;
        }
        
        // Spooky action at a distance - momentum correlation
        const momentumTransfer = 0.1;
        entangledState.momentum.x += state.momentum.x * momentumTransfer;
        entangledState.momentum.y += state.momentum.y * momentumTransfer;
    }
    
    /**
     * Quantum tunneling - probability of passing through barriers
     */
    calculateTunnelingProbability(entity, barrier, velocity) {
        const barrierWidth = barrier.width || 10;
        const barrierHeight = barrier.height || barrier.energy || 100;
        const kineticEnergy = 0.5 * (velocity.x * velocity.x + velocity.y * velocity.y);
        
        // Wave number inside barrier
        const k = Math.sqrt(2 * (barrierHeight - kineticEnergy)) / this.REDUCED_PLANCK;
        
        // Tunneling probability using WKB approximation
        const transmissionCoefficient = Math.exp(-2 * k * barrierWidth);
        
        // Adjust for game playability
        const gameFactor = 0.1;
        return transmissionCoefficient * gameFactor + this.tunnelProbability;
    }
    
    /**
     * Apply tunneling effect
     */
    applyTunneling(entityId, barrier) {
        const state = this.waveFunction.get(entityId);
        if (!state) return false;
        
        const probability = this.calculateTunnelingProbability(
            state,
            barrier,
            state.momentum
        );
        
        if (Math.random() < probability) {
            // Entity tunnels through!
            state.position.x += barrier.width || 0;
            state.position.y += barrier.height || 0;
            state.coherence *= 0.8; // Tunneling reduces coherence
            
            // Create particle effect at exit point
            return {
                success: true,
                exitPosition: { ...state.position },
                probability: probability
            };
        }
        
        return { success: false, probability: probability };
    }
    
    /**
     * Heisenberg Uncertainty Principle
     * ΔxΔp ≥ ℏ/2
     */
    applyUncertaintyPrinciple(entityId) {
        const state = this.waveFunction.get(entityId);
        if (!state) return;
        
        // Calculate minimum uncertainty product
        const minUncertainty = this.REDUCED_PLANCK / 2;
        
        // If we measure position precisely, momentum becomes uncertain
        const positionPrecision = 1.0 / (state.waveFunction.distributionWidth + 1);
        state.uncertaintyPosition = positionPrecision;
        
        // Compensate momentum uncertainty
        state.uncertaintyMomentum = minUncertainty / positionPrecision;
        
        // Add random fluctuation to momentum based on uncertainty
        const fluctuation = state.uncertaintyMomentum * (Math.random() - 0.5) * 1000;
        state.momentum.x += fluctuation;
        state.momentum.y += fluctuation;
        
        return {
            positionUncertainty: state.uncertaintyPosition,
            momentumUncertainty: state.uncertaintyMomentum
        };
    }
    
    /**
     * Wave-particle duality - exhibit wave or particle behavior
     */
    exhibitDuality(entityId, context = 'particle') {
        const state = this.waveFunction.get(entityId);
        if (!state) return context;
        
        // Double-slit experiment inspired behavior
        if (context === 'wave') {
            // Show interference patterns
            const interferencePhase = Math.sin(state.phase) * state.waveFunction.amplitude;
            state.position.y += interferencePhase * 5;
            state.waveFunction.phase += 0.1;
            return 'wave';
        } else {
            // Localized particle behavior
            state.waveFunction.collapsed = true;
            return 'particle';
        }
    }
    
    /**
     * Create dimensional rift (wormhole)
     */
    createDimensionalRift(position1, position2) {
        const rift = {
            id: 'rift-' + Date.now(),
            entrance: { ...position1 },
            exit: { ...position2 },
            stability: 1.0,
            lifetime: 5000, // milliseconds
            radius: 30,
            created: Date.now(),
            quantumFlux: Math.random() * 100
        };
        
        this.dimensionalRifts.push(rift);
        
        // Auto-remove after lifetime
        setTimeout(() => {
            const index = this.dimensionalRifts.indexOf(rift);
            if (index > -1) {
                this.dimensionalRifts.splice(index, 1);
            }
        }, rift.lifetime);
        
        return rift;
    }
    
    /**
     * Check if entity is in dimensional rift
     */
    checkDimensionalRift(position) {
        for (const rift of this.dimensionalRifts) {
            const distToEntrance = Math.sqrt(
                Math.pow(position.x - rift.entrance.x, 2) +
                Math.pow(position.y - rift.entrance.y, 2)
            );
            
            if (distToEntrance < rift.radius) {
                return { teleport: true, destination: rift.exit, rift };
            }
        }
        return { teleport: false };
    }
    
    /**
     * Apply quantum decoherence over time
     */
    applyDecoherence(deltaTime) {
        for (const [entityId, state] of this.waveFunction.entries()) {
            state.coherence -= this.decoherenceRate * deltaTime;
            state.coherence = Math.max(0, Math.min(1, state.coherence));
            
            // Decoherence affects superposition stability
            if (state.coherence < 0.5 && state.superpositionStates.length > 0) {
                this.collapseWaveFunction(entityId);
            }
        }
    }
    
    /**
     * Calculate quantum fluctuations (vacuum energy)
     */
    calculateQuantumFluctuations() {
        // Zero-point energy fluctuations
        this.quantumFluctuations = (Math.random() - 0.5) * 10;
        return this.quantumFluctuations;
    }
    
    /**
     * Apply Pauli Exclusion Principle - no two entities in same quantum state
     */
    checkPauliExclusion(entityId1, entityId2) {
        const state1 = this.waveFunction.get(entityId1);
        const state2 = this.waveFunction.get(entityId2);
        
        if (!state1 || !state2) return false;
        
        // Check if in same quantum state
        const samePosition = Math.abs(state1.position.x - state2.position.x) < 5 &&
                            Math.abs(state1.position.y - state2.position.y) < 5;
        const sameSpin = state1.spinState === state2.spinState;
        
        if (samePosition && sameSpin) {
            // Force different spin states (fermions)
            state2.spinState = state1.spinState === 'up' ? 'down' : 'up';
            
            // Repel entities
            const dx = state2.position.x - state1.position.x || 1;
            const dy = state2.position.y - state1.position.y || 1;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            state2.momentum.x += (dx / dist) * 50;
            state2.momentum.y += (dy / dist) * 50;
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Schrödinger equation time evolution
     */
    evolveWaveFunction(entityId, deltaTime) {
        const state = this.waveFunction.get(entityId);
        if (!state) return;
        
        // Time-dependent Schrödinger equation (simplified)
        // iℏ ∂ψ/∂t = Ĥψ
        
        const hamiltonian = state.quantumEnergy || 0;
        state.waveFunction.phase += (hamiltonian / this.REDUCED_PLANCK) * deltaTime;
        state.waveFunction.phase %= (2 * Math.PI);
        
        // Wave function amplitude decay
        state.waveFunction.amplitude *= Math.exp(-0.01 * deltaTime);
        state.waveFunction.amplitude = Math.max(0.1, state.waveFunction.amplitude);
    }
    
    /**
     * Quantum measurement with back-action
     */
    performMeasurement(entityId, observableType = 'position') {
        const state = this.waveFunction.get(entityId);
        if (!state) return null;
        
        let result;
        
        switch (observableType) {
            case 'position':
                result = this.collapseWaveFunction(entityId);
                break;
            case 'momentum':
                result = { ...state.momentum };
                // Measurement disturbs position (uncertainty principle)
                state.position.x += (Math.random() - 0.5) * 20;
                state.position.y += (Math.random() - 0.5) * 20;
                break;
            case 'spin':
                result = state.spinState;
                break;
            case 'energy':
                result = state.quantumEnergy;
                break;
        }
        
        // Measurement back-action
        state.coherence *= 0.9;
        
        return result;
    }
    
    /**
     * Generate quantum entanglement visualization data
     */
    getEntanglementVisualization() {
        const visualData = [];
        
        for (const pairKey of this.entangledPairs) {
            const [id1, id2] = pairKey.split('-');
            const state1 = this.waveFunction.get(id1);
            const state2 = this.waveFunction.get(id2);
            
            if (state1 && state2) {
                visualData.push({
                    pos1: state1.position,
                    pos2: state2.position,
                    correlation: Math.cos(state1.phase - state2.phase),
                    strength: state1.coherence * state2.coherence
                });
            }
        }
        
        return visualData;
    }
    
    /**
     * Get quantum state information for display
     */
    getQuantumStateInfo() {
        const info = {
            totalStates: this.waveFunction.size,
            entanglements: this.entangledPairs.size,
            rifts: this.dimensionalRifts.length,
            fluctuations: this.quantumFluctuations.toFixed(2),
            avgCoherence: 0,
            superpositions: this.superpositions.size
        };
        
        let totalCoherence = 0;
        for (const [, state] of this.waveFunction.entries()) {
            totalCoherence += state.coherence;
        }
        info.avgCoherence = (totalCoherence / (this.waveFunction.size || 1)).toFixed(3);
        
        return info;
    }
    
    /**
     * Update quantum physics each frame
     */
    update(deltaTime) {
        // Apply decoherence
        this.applyDecoherence(deltaTime);
        
        // Calculate quantum fluctuations
        this.calculateQuantumFluctuations();
        
        // Evolve wave functions
        for (const entityId of this.waveFunction.keys()) {
            this.evolveWaveFunction(entityId, deltaTime);
            
            // Apply uncertainty principle periodically
            if (Math.random() < 0.01) {
                this.applyUncertaintyPrinciple(entityId);
            }
        }
        
        // Update dimensional rifts
        const now = Date.now();
        this.dimensionalRifts = this.dimensionalRifts.filter(rift => {
            rift.stability -= 0.01 * deltaTime;
            return (now - rift.created) < rift.lifetime && rift.stability > 0;
        });
    }
    
    /**
     * Reset quantum engine
     */
    reset() {
        this.waveFunction.clear();
        this.entangledPairs.clear();
        this.quantumStates = [];
        this.superpositions.clear();
        this.dimensionalRifts = [];
        this.quantumFluctuations = 0;
    }
}

// Export for use in main game
if (typeof window !== 'undefined') {
    window.QuantumPhysicsEngine = QuantumPhysicsEngine;
}
