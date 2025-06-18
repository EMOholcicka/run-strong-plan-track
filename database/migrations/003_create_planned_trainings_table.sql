
-- Planned trainings table
CREATE TABLE planned_trainings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('running', 'cycling', 'swimming', 'strength', 'yoga', 'other') NOT NULL,
    planned_date DATE NOT NULL,
    planned_duration INT,
    planned_distance DECIMAL(8,2),
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    completed_training_id VARCHAR(36),
    category ENUM('aerobic', 'intervals', 'tempo', 'hills'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (completed_training_id) REFERENCES trainings(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_planned_trainings_user_id ON planned_trainings(user_id);
CREATE INDEX idx_planned_trainings_date ON planned_trainings(planned_date);
CREATE INDEX idx_planned_trainings_completed ON planned_trainings(completed);
