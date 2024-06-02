-- This file is used to initialize the database schema when the container is started
-- It is executed by the Dockerfile when the container is built
-- It creates the tables for the users, categories, items, reviews and comments

-- User table
-- The user table stores information about the users of the application
-- It includes fields for the user's name, email, password, active status, last login time and creation date
-- The email field is unique to ensure that each user has a unique email address
-- The active field is a boolean that indicates whether the user is active or not
-- The last login field stores the timestamp of the user's last login
-- The date created field stores the timestamp of when the user account was created
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password) VALUES ('admin', 'admin@admin.com', 'admin');

-- Category table
-- The category table stores information about the categories of items in the application
-- It includes fields for the category name and a description template
-- The description template field is a JSON object that will store form fields for the item description
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description_template jsonb -- Description de l'item (peut être un objet JSON)
);

INSERT INTO categories (name, description_template) VALUES ('Electronics', '{"brand": "text", "model": "text", "price": "number", "color": "text"}');

-- Item table
-- The item table stores information about the items in the application
-- It includes fields for the item name, category ID, description and creation date
-- The category ID field is a reference to the category of the item
-- The description field is a JSON object that will store the item description
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category_id INT, -- Référence vers la catégorie de l'item
    description jsonb, -- Description de l'item (peut être un objet JSON)
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name, category_id, description) VALUES ('iPhone 12', 1, '{"brand": "Apple", "model": "iPhone 12", "price": 799, "color": "Black"}');

-- Review table
-- The review table stores information about the reviews of items in the application
-- It includes fields for the user ID, item ID, rating, content, likes and creation date
-- The user ID field is a reference to the user who created the review
-- The item ID field is a reference to the item being reviewed
-- The rating field stores the rating of the review (e.g. a score out of 5 or 10)
-- The content field stores the text content of the review
-- The likes field stores the number of likes the review has received
-- The date created field stores the timestamp of when the review was created
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT, -- User who wrote the review
    item_id INT, -- Item being reviewed
    rating INT, -- Rating of the review
    content TEXT, -- Content of the review
    likes INT DEFAULT 0, -- Number of likes, default to 0
    dislikes INT DEFAULT 0, -- Number of dislikes, default to 0
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date the review was created
);

INSERT INTO reviews (user_id, item_id, rating, content) VALUES (1, 1, 5, 'Great phone, love the camera quality!');

-- Comment table
-- The comment table stores information about the comments on reviews in the application
-- It includes fields for the user ID, review ID, content, likes and creation date
-- The user ID field is a reference to the user who created the comment
-- The review ID field is a reference to the review being commented
-- The content field stores the text content of the comment
-- The likes field stores the number of likes the comment has received
-- The date created field stores the timestamp of when the comment was created
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT, -- User who wrote the comment
    review_id INT, -- Review being commented
    content TEXT, -- Content of the comment
    likes INT DEFAULT 0, -- Number of likes, default to 0
    dislikes INT DEFAULT 0, -- Number of dislikes, default to 0
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (user_id, review_id, content) VALUES (1, 1, 'I agree, the camera is amazing!');