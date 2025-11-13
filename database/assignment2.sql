-- Assignment 2 - Task 1: CRUD Operations
-- CSE Motors Database Queries

-- 1. Tony Stark Insert
INSERT INTO public.account (
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password
) VALUES (
    'Tony', 
    'Stark', 
    'tony@starkent.com', 
    'Iam1ronM@n'
);

-- 2. Tony Stark Update
UPDATE public.account 
SET account_type = 'Admin' 
WHERE account_email = 'tony@starkent.com';

-- 3. Tony Stark Delete
DELETE FROM public.account 
WHERE account_email = 'tony@starkent.com';

-- 4. Description Update
UPDATE public.inventory 
SET inv_description = REPLACE(
    inv_description, 
    'the small interiors', 
    'a huge interior'
) 
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Select with Join
SELECT 
    inv_make,
    inv_model,
    classification_name
FROM public.inventory
INNER JOIN public.classification 
    ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- 6. Image Update
UPDATE public.inventory 
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');