
-- Trainings table
CREATE TABLE trainings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('running', 'cycling', 'swimming', 'strength', 'yoga', 'other') NOT NULL,
    date DATE NOT NULL,
    duration INT NOT NULL, -- in minutes
    distance DECIMAL(8,2), -- in km
    pace VARCHAR(20), -- e.g., "5:30"
    calories INT,
    trainer_notes TEXT,
    trainee_notes TEXT,
    heart_rate_avg INT,
    heart_rate_max INT,
    strava_link VARCHAR(500),
    garmin_link VARCHAR(500),
    category ENUM('aerobic', 'intervals', 'tempo', 'hills'),
    rating INT CHECK (rating >= 1 AND rating <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_trainings_user_id ON trainings(user_id);
CREATE INDEX idx_trainings_date ON trainings(date);
CREATE INDEX idx_trainings_type ON trainings(type);
