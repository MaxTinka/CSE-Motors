-- Task 1 Queries for CSE340 Assignment 2
-- Max Tinka

-- 1. Insert new classification
INSERT INTO public.classification (classification_name)
VALUES ('Luxury');

-- 2. Insert two vehicles with the new classification
INSERT INTO public.inventory (
    inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, 
    inv_color, classification_id
) VALUES 
    ('Mercedes-Benz', 'S-Class', '2024', 'Ultimate luxury sedan with advanced features',
     '/images/vehicles/mercedes-s-class.jpg', '/images/vehicles/mercedes-s-class-tn.jpg',
     95000, 100, 'Black', 6),
     
    ('BMW', '7 Series', '2024', 'Flagship luxury vehicle with premium amenities',
     '/images/vehicles/bmw-7-series.jpg', '/images/vehicles/bmw-7-series-tn.jpg',
     87000, 150, 'White', 6);

-- 3. Update all Ford vehicles to be red
UPDATE public.inventory 
SET inv_color = 'Red'
WHERE inv_make = 'Ford';

-- 4. Update a specific vehicle's description
UPDATE public.inventory 
SET inv_description = 'The ultimate luxury experience with massage seats and premium sound system'
WHERE inv_make = 'Mercedes-Benz' AND inv_model = 'S-Class';

-- 5. Delete a specific vehicle
DELETE FROM public.inventory 
WHERE inv_make = 'BMW' AND inv_model = '7 Series';

-- 6. Delete the Luxury classification and update associated vehicles
-- First update vehicles with Luxury classification to another classification
UPDATE public.inventory 
SET classification_id = 4  -- Change to Sedan classification
WHERE classification_id = 6;

-- Then delete the Luxury classification
DELETE FROM public.classification 
WHERE classification_name = 'Luxury';
