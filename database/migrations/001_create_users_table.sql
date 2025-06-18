
-- Users table for authentication
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    height INT,
    weight DECIMAL(5,2),
    activity_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    goals TEXT,
    strava_connected BOOLEAN DEFAULT FALSE,
    strava_user_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);
