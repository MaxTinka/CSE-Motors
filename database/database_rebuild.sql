-- CSE Motors Database Rebuild File

-- Drop tables if they exist (for clean rebuild)
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.account CASCADE;
DROP TABLE IF EXISTS public.classification CASCADE;
DROP TYPE IF EXISTS public.account_type CASCADE;

-- Create custom type for account roles
CREATE TYPE public.account_type AS ENUM ('Client', 'Employee', 'Admin');

-- Create Classification Table
CREATE TABLE public.classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create Inventory Table with enhanced fields
CREATE TABLE public.inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year CHAR(4),
    inv_price NUMERIC(10,2),
    inv_miles INTEGER,
    inv_color VARCHAR(30),
    inv_description TEXT,
    inv_image TEXT,
    inv_thumbnail TEXT,
    classification_id INT NOT NULL REFERENCES public.classification(classification_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Account Table
CREATE TABLE public.account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) NOT NULL UNIQUE,
    account_password VARCHAR(100) NOT NULL,
    account_type public.account_type DEFAULT 'Client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Data into Classification Table
INSERT INTO public.classification (classification_name) VALUES
('Sport'),
('SUV'),
('Truck'),
('Sedan'),
('Custom');

-- Insert Data into Inventory Table with proper image paths
INSERT INTO public.inventory (
    inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, 
    inv_description, inv_image, inv_thumbnail, classification_id
) VALUES
('DMC', 'Delorean', '1981', 45000, 15000, 'Silver',
 'The iconic time-traveling vehicle with flux capacitor', 
 '/images/vehicles/delorean.jpg', '/images/vehicles/delorean-tn.jpg', 5),
 
('GM', 'Hummer', '2023', 85000, 5000, 'Black',
 'a huge interior with advanced off-road capabilities', 
 '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg', 2),
 
('Ford', 'Mustang', '2024', 35000, 2000, 'Red',
 'Classic American muscle car with modern performance', 
 '/images/vehicles/mustang.jpg', '/images/vehicles/mustang-tn.jpg', 1);

-- Create indexes for better performance
CREATE INDEX idx_inventory_classification ON public.inventory(classification_id);
CREATE INDEX idx_inventory_make_model ON public.inventory(inv_make, inv_model);
CREATE INDEX idx_account_email ON public.account(account_email);
