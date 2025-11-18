-- database_rebuild.sql
-- CSE Motors Database Rebuild File

-- 1. Create custom type (if any, example for demonstration)
-- You can adjust or remove if not needed
-- CREATE TYPE public.vehicle_type AS ENUM ('Sedan', 'SUV', 'Truck', 'Custom');

-- 2. Create Classification Table
CREATE TABLE IF NOT EXISTS public.classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL
);

-- 3. Create Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_description TEXT,
    inv_image TEXT,
    inv_thumbnail TEXT,
    classification_id INT REFERENCES public.classification(classification_id)
);

-- 4. Create Account Table
CREATE TABLE IF NOT EXISTS public.account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) NOT NULL UNIQUE,
    account_password VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) DEFAULT 'Customer'
);

-- 5. Insert Data into Classification Table
INSERT INTO public.classification (classification_name) VALUES
('Sport'),
('SUV'),
('Truck'),
('Sedan'),
('Custom');

-- 6. Insert Data into Inventory Table
INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id) VALUES
('GM', 'Hummer', 'the small interiors', '/images/hummer.jpg', '/images/hummer_thumb.jpg', 2),
('Ford', 'Mustang', 'Classic muscle car', '/images/mustang.jpg', '/images/mustang_thumb.jpg', 1),
('Chevrolet', 'Camaro', 'Sporty coupe', '/images/camaro.jpg', '/images/camaro_thumb.jpg', 1),
('Tesla', 'Model S', 'Electric luxury sedan', '/images/models.jpg', '/images/models_thumb.jpg', 4);

-- 7. Task 1 Queries to run at the end of rebuild
-- 7a. Update GM Hummer description
UPDATE public.inventory 
SET inv_description = REPLACE(
    inv_description, 
    'the small interiors', 
    'a huge interior'
) 
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 7b. Update inventory image paths
UPDATE public.inventory 
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
