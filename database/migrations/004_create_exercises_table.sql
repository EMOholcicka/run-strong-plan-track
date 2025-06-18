
-- Exercises table for strength training
CREATE TABLE exercises (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    training_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight DECIMAL(6,2), -- in kg
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE
);

-- Index for training lookups
CREATE INDEX idx_exercises_training_id ON exercises(training_id);
