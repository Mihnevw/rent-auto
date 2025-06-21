-- First, clear existing sample data
TRUNCATE TABLE cars CASCADE;

-- Reset the sequence if it exists
-- ALTER SEQUENCE cars_id_seq RESTART WITH 1;

-- Insert cars matching the frontend data
INSERT INTO cars (
  id,
  name,
  brand,
  model,
  image_url,
  price_per_day,
  deposit,
  fuel,
  gearbox,
  body_type,
  seats,
  doors,
  year,
  features,
  is_active
) VALUES 
(1, 'SHKODA RAPID 2016', 'Škoda', 'Rapid', '/images/rapid.png', 40.00, 200.00, 'petrol', 'manual', 'sedan', '5', '4/5', '2016', '["AC", "Radio", "Central Locking"]'::jsonb, true),
(2, 'MERCEDES-BENZ GLC 2021', 'Mercedes-Benz', 'GLC', '/images/glc.png', 90.00, 500.00, 'petrol', 'automatic', 'suv', '5', '4/5', '2021', '["AC", "Navigation", "Leather Seats", "360 Camera"]'::jsonb, true),
(3, 'BMW 3-SERIES 2021', 'BMW', '3-Series', '/images/bmw-3.png', 65.00, 400.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2021', '["AC", "Navigation", "Leather Seats"]'::jsonb, true),
(4, 'BMW 5-SERIES 2020', 'BMW', '5-Series', '/images/bmw-5.png', 75.00, 450.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2020', '["AC", "Navigation", "Leather Seats", "Premium Sound"]'::jsonb, true),
(5, 'MASERATI GHIBLI 2017', 'Maserati', 'Ghibli', '/images/maserati.png', 90.00, 800.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2017', '["AC", "Navigation", "Leather Seats", "Sport Mode"]'::jsonb, true),
(6, 'JAGUAR F-TYPE 2019', 'Jaguar', 'F-Type', '/images/jaguar-f.png', 150.00, 1000.00, 'petrol', 'automatic', 'sedan', '2', '2', '2019', '["AC", "Navigation", "Leather Seats", "Sport Package"]'::jsonb, true),
(7, 'SHKODA OCTAVIA 2020', 'Škoda', 'Octavia', '/images/shkoda.png', 60.00, 300.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2020', '["AC", "Navigation", "Smart Link"]'::jsonb, true),
(8, 'RANGE ROVER 2014', 'Land Rover', 'Range Rover', '/images/range.png', 75.00, 500.00, 'petrol', 'automatic', 'suv', '5', '4/5', '2014', '["AC", "Navigation", "Leather Seats", "Terrain Response"]'::jsonb, true),
(9, 'OPEL INSIGNIA 2019', 'Opel', 'Insignia', '/images/opel.png', 60.00, 300.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2019', '["AC", "Navigation", "Cruise Control"]'::jsonb, true),
(10, 'MERCEDES C220 2021', 'Mercedes-Benz', 'C220', '/images/mercedes.png', 75.00, 450.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2021', '["AC", "Navigation", "Leather Seats", "LED Lights"]'::jsonb, true),
(11, 'FORD FOCUS 2021', 'Ford', 'Focus', '/images/ford-focus.png', 55.00, 250.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2021', '["AC", "Navigation", "SYNC 3"]'::jsonb, true),
(12, 'FORD MONDEO 2021', 'Ford', 'Mondeo', '/images/ford-mondeo.png', 60.00, 300.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2021', '["AC", "Navigation", "Leather Seats"]'::jsonb, true),
(13, 'VOLKSWAGEN PASSAT 2021', 'Volkswagen', 'Passat', '/images/passat.png', 60.00, 300.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2021', '["AC", "Navigation", "Digital Cockpit"]'::jsonb, true),
(14, 'CITROEN GRAND C4 PICASSO 2016', 'Citroen', 'Grand C4 Picasso', '/images/citroen.png', 60.00, 300.00, 'petrol', 'manual', 'suv', '7', '4/5', '2016', '["AC", "Navigation", "Panoramic Roof"]'::jsonb, true),
(15, 'SHKODA OCTAVIA 2012', 'Škoda', 'Octavia', '/images/shkoda-octavia.png', 35.00, 200.00, 'petrol', 'manual', 'sedan', '5', '4/5', '2012', '["AC", "Radio", "Central Locking"]'::jsonb, true),
(16, 'MERCEDES-BENZ E-CLASS 2020', 'Mercedes-Benz', 'E-Class', '/images/mercedes-e.png', 70.00, 400.00, 'petrol', 'manual', 'sedan', '5', '4/5', '2020', '["AC", "Navigation", "Leather Seats", "Driver Assistance"]'::jsonb, true),
(17, 'SHKODA SUPERB 2021', 'Škoda', 'Superb', '/images/superb.png', 65.00, 350.00, 'petrol', 'automatic', 'sedan', '5', '4/5', '2021', '["AC", "Navigation", "Leather Seats", "Virtual Cockpit"]'::jsonb, true);

-- Add seasonal pricing for all cars
UPDATE cars
SET 
  summer_price = ROUND(price_per_day * 1.2, 2),
  summer_deposit = ROUND(deposit * 1.5, 2),
  june_price = ROUND(price_per_day * 1.1, 2),
  winter_price = ROUND(price_per_day * 0.9, 2),
  winter_deposit = deposit;

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_cars_id ON cars(id); 