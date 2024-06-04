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

-- Category table
-- The category table stores information about the categories of items in the application
-- It includes fields for the category name and a description template
-- The description template field is a JSON object that will store form fields for the item description
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description_template jsonb -- Description de l'item (peut être un objet JSON)
);

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

-- Truncate tables and reset identities
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE items RESTART IDENTITY CASCADE;
TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE comments RESTART IDENTITY CASCADE;

-- Inserting 5 users
INSERT INTO users (name, email, password) VALUES 
('Amelia Earhart', 'amelia@example.com', 'admin'),
('Christopher Columbus', 'columbus@example.com', 'password1'),
('Marco Polo', 'polo@example.com', 'password2'),
('Vasco da Gama', 'gama@example.com', 'password3'),
('Ferdinand Magellan', 'magellan@example.com', 'password4');

-- Inserting 3 categories
INSERT INTO categories (name, description_template) VALUES 
('Electronics', '{"brand": "text", "model": "text", "price": "number", "color": "text"}'),
('Movies', '{"title": "text", "director": "text", "year": "number", "genre": "text"}'),
('Restaurants', '{"name": "text", "cuisine": "text", "location": "text", "rating": "number"}');

-- Inserting 4 items into Electronics category
INSERT INTO items (name, category_id, description) VALUES 
('iPhone 12', 1, '{"brand": "Apple", "model": "iPhone 12", "price": 799, "color": "Black"}'),
('Galaxy S21', 1, '{"brand": "Samsung", "model": "Galaxy S21", "price": 799, "color": "Phantom Gray"}'),
('Pixel 5', 1, '{"brand": "Google", "model": "Pixel 5", "price": 699, "color": "Just Black"}'),
('OnePlus 8T', 1, '{"brand": "OnePlus", "model": "8T", "price": 749, "color": "Aquamarine Green"}');

-- Inserting 4 items into Movies category
INSERT INTO items (name, category_id, description) VALUES 
('Inception', 2, '{"title": "Inception", "director": "Christopher Nolan", "year": 2010, "genre": "Sci-Fi"}'),
('The Matrix', 2, '{"title": "The Matrix", "director": "Lana Wachowski, Lilly Wachowski", "year": 1999, "genre": "Action"}'),
('Interstellar', 2, '{"title": "Interstellar", "director": "Christopher Nolan", "year": 2014, "genre": "Sci-Fi"}'),
('Parasite', 2, '{"title": "Parasite", "director": "Bong Joon Ho", "year": 2019, "genre": "Thriller"}');

-- Inserting 4 items into Restaurants category
INSERT INTO items (name, category_id, description) VALUES 
('Joe''s Pizza', 3, '{"name": "Joe''s Pizza", "cuisine": "Italian", "location": "New York, NY", "rating": 4.5}'),
('Sushi Nakazawa', 3, '{"name": "Sushi Nakazawa", "cuisine": "Japanese", "location": "New York, NY", "rating": 4.8}'),
('The French Laundry', 3, '{"name": "The French Laundry", "cuisine": "French", "location": "Yountville, CA", "rating": 4.9}'),
('Noma', 3, '{"name": "Noma", "cuisine": "Nordic", "location": "Copenhagen, Denmark", "rating": 4.7}');

-- Inserting 10 reviews with a variety of ratings
INSERT INTO reviews (user_id, item_id, rating, content, likes, dislikes) VALUES 
(1, 1, 5, 'Great phone, love the camera quality!', 25, 5),  -- Review ID 1
(2, 1, 3, 'Solid performance, but a bit pricey.', 15, 8),   -- Review ID 2
(3, 2, 5, 'Best Android phone out there!', 30, 2),         -- Review ID 3
(4, 3, 2, 'Good phone, but battery life could be better.', 10, 20), -- Review ID 4
(5, 4, 4, 'Fast and responsive, great value for money.', 18, 3), -- Review ID 5
(1, 5, 0, 'Did not enjoy this movie at all.', 8, 25),  -- Review ID 6
(2, 5, 4, 'Complex plot, but worth the watch.', 12, 9),   -- Review ID 7
(3, 6, 5, 'Revolutionary movie, a must-watch!', 35, 1),  -- Review ID 8
(4, 7, 5, 'Amazing storyline and visuals.', 40, 0),     -- Review ID 9
(5, 8, 2, 'Did not live up to the hype.', 5, 22); -- Review ID 10

-- Inserting comments with at least 3 comments per review
INSERT INTO comments (user_id, review_id, content, likes, dislikes) 
SELECT u.id, r.id, 
    CASE 
        WHEN r.rating <= 2 THEN 'I completely disagree.' 
        WHEN r.rating >= 4 THEN 'I agree, great review!' 
        ELSE 'I have mixed feelings about this.' 
    END AS content, 
    FLOOR(RANDOM() * 50), 
    FLOOR(RANDOM() * 50)
FROM reviews r
JOIN users u ON r.user_id != u.id
WHERE (SELECT COUNT(*) FROM comments WHERE review_id = r.id) < 3
LIMIT 10;
