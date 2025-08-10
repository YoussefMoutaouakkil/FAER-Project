-- FAER Formation Database Setup Script
-- Run this script in your MySQL client to set up the database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS faer_formation;
USE faer_formation;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create formations table
CREATE TABLE IF NOT EXISTS formations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    price DECIMAL(10,2),
    category VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_formations table
CREATE TABLE IF NOT EXISTS user_formations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    formationId INT NOT NULL,
    enrolledAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('enrolled', 'completed', 'cancelled') DEFAULT 'enrolled',
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (formationId) REFERENCES formations(id) ON DELETE CASCADE
);

-- Insert sample formations
INSERT INTO formations (title, description, duration, price, category) VALUES
('Formation QHSE Niveau 1', 'Formation de base en Qualité, Hygiène, Sécurité et Environnement', '3 jours', 1200.00, 'QHSE'),
('Formation RSE', 'Responsabilité Sociétale des Entreprises et développement durable', '2 jours', 800.00, 'RSE'),
('Audit QHSE', 'Techniques d''audit et évaluation des systèmes QHSE', '4 jours', 1500.00, 'Audit'),
('Management de la Sécurité', 'Gestion et prévention des risques professionnels', '3 jours', 1100.00, 'Sécurité'),
('Normes ISO 14001', 'Système de management environnemental', '2 jours', 900.00, 'Environnement');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_userId ON user_sessions(userId);
CREATE INDEX idx_formations_category ON formations(category);
CREATE INDEX idx_user_formations_userId ON user_formations(userId);
CREATE INDEX idx_user_formations_formationId ON user_formations(formationId);

-- Show created tables
SHOW TABLES;

-- Show sample formations
SELECT * FROM formations; 