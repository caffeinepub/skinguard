export const sqlExamples = {
  create: `-- Create Users Table
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Skin Type Results Table
CREATE TABLE skin_type_results (
    result_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    detected_skin_type TEXT NOT NULL CHECK (detected_skin_type IN ('oily', 'dry', 'combination', 'sensitive', 'normal')),
    concerns JSON,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create Products Table
CREATE TABLE products (
    product_id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('cleanser', 'moisturizer', 'serum', 'sunscreen', 'treatment')),
    price_range TEXT CHECK (price_range IN ('low', 'medium', 'high'))
);

-- Create Ingredients Table
CREATE TABLE ingredients (
    ingredient_id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    safety_classification TEXT NOT NULL CHECK (safety_classification IN ('safe', 'conditional', 'risky', 'harmful')),
    suitable_skin_types JSON,
    concerns JSON
);

-- Create Product-Ingredients Junction Table (Many-to-Many)
CREATE TABLE product_ingredients (
    product_id TEXT NOT NULL,
    ingredient_id TEXT NOT NULL,
    PRIMARY KEY (product_id, ingredient_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
);

-- Create Favorites Table
CREATE TABLE favorites (
    favorite_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create Routines Table
CREATE TABLE routines (
    routine_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create Routine Steps Table
CREATE TABLE routine_steps (
    step_id TEXT PRIMARY KEY,
    routine_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    order_num INTEGER NOT NULL,
    frequency INTEGER NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(routine_id) ON DELETE CASCADE
);

-- Create Product Notes Table
CREATE TABLE product_notes (
    note_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    experience TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create Analysis History Table
CREATE TABLE analysis_history (
    history_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skin_type TEXT NOT NULL,
    concerns JSON,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);`,

  insert: `-- Insert Sample Users
INSERT INTO users (user_id, name, created_at) VALUES
('user_001', 'Alice Johnson', '2024-01-15 10:30:00'),
('user_002', 'Bob Smith', '2024-01-20 14:45:00');

-- Insert Sample Ingredients
INSERT INTO ingredients (ingredient_id, name, description, safety_classification, suitable_skin_types, concerns) VALUES
('ing_001', 'Hyaluronic Acid', 'Hydrating ingredient suitable for all skin types', 'safe', '["oily", "dry", "combination", "sensitive", "normal"]', '[]'),
('ing_002', 'Niacinamide', 'Vitamin B3 that helps with oil control and brightening', 'safe', '["oily", "combination", "normal"]', '["acne", "pigmentation"]'),
('ing_003', 'Salicylic Acid', 'BHA exfoliant effective for acne-prone skin', 'conditional', '["oily", "combination"]', '["acne"]'),
('ing_004', 'Retinol', 'Vitamin A derivative for anti-aging', 'conditional', '["oily", "dry", "combination"]', '["aging"]'),
('ing_005', 'Vitamin C', 'Antioxidant for brightening and anti-aging', 'safe', '["oily", "dry", "combination", "normal"]', '["pigmentation", "aging"]'),
('ing_006', 'Ceramides', 'Lipids that strengthen skin barrier', 'safe', '["dry", "sensitive", "normal"]', '["dryness"]'),
('ing_007', 'Glycerin', 'Humectant that attracts moisture', 'safe', '["oily", "dry", "combination", "sensitive", "normal"]', '["dryness"]'),
('ing_008', 'Peptides', 'Amino acid chains for anti-aging', 'safe', '["dry", "combination", "normal"]', '["aging"]'),
('ing_009', 'Alcohol Denat.', 'Drying alcohol that can irritate', 'risky', '["oily"]', '[]'),
('ing_010', 'Parabens', 'Preservatives with potential health concerns', 'risky', '["oily", "dry", "combination", "normal"]', '[]');

-- Insert Sample Products
INSERT INTO products (product_id, name, brand, description, category, price_range) VALUES
('prod_001', 'CeraVe Hydrating Cleanser', 'CeraVe', 'Gentle cleanser with ceramides and hyaluronic acid', 'cleanser', 'low'),
('prod_002', 'The Ordinary Niacinamide 10% + Zinc 1%', 'The Ordinary', 'High-strength niacinamide serum for oil control', 'serum', 'low'),
('prod_003', 'La Roche-Posay Toleriane Double Repair', 'La Roche-Posay', 'Moisturizer with ceramides and niacinamide', 'moisturizer', 'medium'),
('prod_004', 'Neutrogena Hydro Boost Water Gel', 'Neutrogena', 'Lightweight gel moisturizer with hyaluronic acid', 'moisturizer', 'low'),
('prod_005', 'Paula''s Choice 2% BHA Liquid Exfoliant', 'Paula''s Choice', 'Salicylic acid treatment for acne', 'treatment', 'medium');

-- Insert Product-Ingredient Relationships
INSERT INTO product_ingredients (product_id, ingredient_id) VALUES
('prod_001', 'ing_001'), -- CeraVe: Hyaluronic Acid
('prod_001', 'ing_006'), -- CeraVe: Ceramides
('prod_002', 'ing_002'), -- The Ordinary: Niacinamide
('prod_003', 'ing_002'), -- La Roche-Posay: Niacinamide
('prod_003', 'ing_006'), -- La Roche-Posay: Ceramides
('prod_004', 'ing_001'), -- Neutrogena: Hyaluronic Acid
('prod_004', 'ing_007'), -- Neutrogena: Glycerin
('prod_005', 'ing_003'); -- Paula's Choice: Salicylic Acid

-- Insert Sample Skin Type Results
INSERT INTO skin_type_results (result_id, user_id, detected_skin_type, concerns, timestamp) VALUES
('result_001', 'user_001', 'combination', '{"acne": "medium", "pigmentation": "low", "aging": "none", "dryness": "low"}', '2024-01-15 11:00:00'),
('result_002', 'user_002', 'oily', '{"acne": "high", "pigmentation": "none", "aging": "none", "dryness": "none"}', '2024-01-20 15:00:00');

-- Insert Sample Favorites
INSERT INTO favorites (favorite_id, user_id, product_name, created_at) VALUES
('fav_001', 'user_001', 'CeraVe Hydrating Cleanser', '2024-01-16 09:00:00'),
('fav_002', 'user_001', 'The Ordinary Niacinamide 10% + Zinc 1%', '2024-01-17 10:30:00');

-- Insert Sample Routines
INSERT INTO routines (routine_id, user_id, name, created_at) VALUES
('routine_001', 'user_001', 'Morning Routine', '2024-01-18 08:00:00');

-- Insert Sample Routine Steps
INSERT INTO routine_steps (step_id, routine_id, product_name, order_num, frequency) VALUES
('step_001', 'routine_001', 'CeraVe Hydrating Cleanser', 1, 7),
('step_002', 'routine_001', 'The Ordinary Niacinamide 10% + Zinc 1%', 2, 7),
('step_003', 'routine_001', 'Neutrogena Hydro Boost Water Gel', 3, 7);`,

  select: `-- Get user profile by ID
SELECT * FROM users WHERE user_id = 'user_001';

-- Get latest skin type result for a user
SELECT * FROM skin_type_results 
WHERE user_id = 'user_001' 
ORDER BY timestamp DESC 
LIMIT 1;

-- Get all product recommendations for oily skin with acne concerns
SELECT p.* FROM products p
WHERE p.category IN ('cleanser', 'moisturizer', 'serum', 'treatment')
ORDER BY p.name;

-- Get all ingredients with their safety classifications
SELECT name, safety_classification, description 
FROM ingredients 
ORDER BY safety_classification, name;

-- Get user's favorite products with full details (JOIN)
SELECT f.favorite_id, f.product_name, f.created_at, p.brand, p.description, p.category
FROM favorites f
LEFT JOIN products p ON f.product_name = p.name
WHERE f.user_id = 'user_001'
ORDER BY f.created_at DESC;

-- Get user's routines with all steps (JOIN)
SELECT r.name AS routine_name, rs.order_num, rs.product_name, rs.frequency
FROM routines r
INNER JOIN routine_steps rs ON r.routine_id = rs.routine_id
WHERE r.user_id = 'user_001'
ORDER BY r.name, rs.order_num;

-- Get product with all its ingredients (INNER JOIN via junction table)
SELECT p.name AS product_name, i.name AS ingredient_name, i.safety_classification
FROM products p
INNER JOIN product_ingredients pi ON p.product_id = pi.product_id
INNER JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
WHERE p.name = 'CeraVe Hydrating Cleanser';

-- Get analysis history for a user ordered by timestamp
SELECT skin_type, concerns, timestamp 
FROM analysis_history 
WHERE user_id = 'user_001' 
ORDER BY timestamp DESC;

-- Count total products by category
SELECT category, COUNT(*) as product_count 
FROM products 
GROUP BY category;

-- Get all safe ingredients suitable for sensitive skin
SELECT name, description 
FROM ingredients 
WHERE safety_classification = 'safe' 
AND suitable_skin_types LIKE '%sensitive%';`,

  update: `-- Update user profile name
UPDATE users 
SET name = 'Alice Marie Johnson' 
WHERE user_id = 'user_001';

-- Update product note rating
UPDATE product_notes 
SET rating = 5, notes = 'Absolutely love this product!' 
WHERE note_id = 'note_001';

-- Confirm/update skin type for a user
UPDATE skin_type_results 
SET detected_skin_type = 'normal', concerns = '{"acne": "low", "pigmentation": "none", "aging": "low", "dryness": "none"}' 
WHERE result_id = 'result_001';

-- Update routine name
UPDATE routines 
SET name = 'Updated Morning Routine' 
WHERE routine_id = 'routine_001' AND user_id = 'user_001';

-- Update ingredient safety classification
UPDATE ingredients 
SET safety_classification = 'conditional', description = 'Updated description with new research findings' 
WHERE ingredient_id = 'ing_003';`,

  delete: `-- Delete a favorite by user and product
DELETE FROM favorites 
WHERE user_id = 'user_001' AND product_name = 'CeraVe Hydrating Cleanser';

-- Delete a routine (CASCADE will delete associated routine_steps)
DELETE FROM routines 
WHERE routine_id = 'routine_001' AND user_id = 'user_001';

-- Delete old analysis history (older than 1 year)
DELETE FROM analysis_history 
WHERE timestamp < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR);

-- Delete a product note
DELETE FROM product_notes 
WHERE note_id = 'note_001' AND user_id = 'user_001';

-- Delete user data (CASCADE will delete all related records)
DELETE FROM users 
WHERE user_id = 'user_002';

-- Delete a specific skin type result by timestamp
DELETE FROM skin_type_results 
WHERE user_id = 'user_001' AND timestamp = '2024-01-15 11:00:00';`,

  complexJoins: `-- Get user favorites with full product details and all ingredients
SELECT 
    f.user_id,
    u.name AS user_name,
    f.product_name,
    p.brand,
    p.category,
    p.price_range,
    i.name AS ingredient_name,
    i.safety_classification
FROM favorites f
INNER JOIN users u ON f.user_id = u.user_id
LEFT JOIN products p ON f.product_name = p.name
LEFT JOIN product_ingredients pi ON p.product_id = pi.product_id
LEFT JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
WHERE f.user_id = 'user_001'
ORDER BY f.product_name, i.name;

-- Get user's complete skincare routine with product details
SELECT 
    u.name AS user_name,
    r.name AS routine_name,
    rs.order_num,
    rs.product_name,
    rs.frequency,
    p.brand,
    p.category,
    p.description
FROM users u
INNER JOIN routines r ON u.user_id = r.user_id
INNER JOIN routine_steps rs ON r.routine_id = rs.routine_id
LEFT JOIN products p ON rs.product_name = p.name
WHERE u.user_id = 'user_001'
ORDER BY r.name, rs.order_num;

-- Get all products suitable for a user's detected skin type with ingredient analysis
SELECT 
    p.name AS product_name,
    p.brand,
    p.category,
    str.detected_skin_type,
    COUNT(i.ingredient_id) AS ingredient_count,
    GROUP_CONCAT(i.name) AS ingredients,
    AVG(CASE 
        WHEN i.safety_classification = 'safe' THEN 4
        WHEN i.safety_classification = 'conditional' THEN 3
        WHEN i.safety_classification = 'risky' THEN 2
        WHEN i.safety_classification = 'harmful' THEN 1
    END) AS avg_safety_score
FROM skin_type_results str
CROSS JOIN products p
LEFT JOIN product_ingredients pi ON p.product_id = pi.product_id
LEFT JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
WHERE str.user_id = 'user_001' 
    AND str.timestamp = (SELECT MAX(timestamp) FROM skin_type_results WHERE user_id = 'user_001')
GROUP BY p.product_id, p.name, p.brand, p.category, str.detected_skin_type
HAVING avg_safety_score >= 3
ORDER BY avg_safety_score DESC, p.name;

-- Get user's skin type progression over time with concern trends
SELECT 
    u.name AS user_name,
    str.detected_skin_type,
    str.concerns,
    str.timestamp,
    LAG(str.detected_skin_type) OVER (PARTITION BY str.user_id ORDER BY str.timestamp) AS previous_skin_type,
    LAG(str.timestamp) OVER (PARTITION BY str.user_id ORDER BY str.timestamp) AS previous_timestamp
FROM users u
INNER JOIN skin_type_results str ON u.user_id = str.user_id
WHERE u.user_id = 'user_001'
ORDER BY str.timestamp DESC;`
};
