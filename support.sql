CREATE DATABASE customer_support

USE customer_support

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'agent') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SHOW TABLES

SELECT * FROM users;

USE customer_support;

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

UPDATE users
SET role = 'admin'
WHERE email = 'admin@example.com';

SELECT id, name, email, role
FROM users
WHERE email = 'admin@example.com';

CREATE TABLE ticket_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE tickets
ADD COLUMN priority ENUM('low', 'medium', 'high') DEFAULT 'medium';

DESCRIBE tickets;

ALTER TABLE tickets
ADD COLUMN assigned_to INT NULL;

ALTER TABLE tickets
ADD CONSTRAINT fk_ticket_assigned_to
FOREIGN KEY (assigned_to)
REFERENCES users(id)
ON DELETE SET NULL;