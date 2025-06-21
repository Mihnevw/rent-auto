-- Fix any remaining null brands (safety check)
UPDATE cars
SET brand = 
    CASE 
        WHEN name LIKE 'VW%' THEN 'Volkswagen'
        WHEN name LIKE 'Mercedes%' THEN 'Mercedes-Benz'
        ELSE split_part(name, ' ', 1)
    END,
    model = 
    CASE 
        WHEN name LIKE 'VW Up-Move' THEN 'Up-Move'
        WHEN name LIKE 'VW PASSAT%' THEN 'Passat'
        WHEN name LIKE 'Mercedes-Benz GLC%' THEN 'GLC'
        ELSE split_part(name, ' ', 2)
    END
WHERE brand IS NULL OR model IS NULL;

-- Insert additional sample cars
INSERT INTO cars (
  name,
  brand,
  model,
  image_url,
  price_per_day,
  deposit,
  summer_price,
  summer_deposit,
  june_price,
  winter_price,
  winter_deposit,
  fuel,
  gearbox,
  body_type,
  seats,
  doors,
  year,
  consumption,
  features
) VALUES 
(
  'BMW 3 Series',
  'BMW',
  '3 Series',
  '/images/bmw-3.png',
  120.00,
  800.00,
  140.00,
  1200.00,
  130.00,
  110.00,
  800.00,
  'gasoline',
  'automatic',
  'sedan',
  '5',
  '4',
  '2023',
  '7.0L/100km',
  '["AC", "Navigation", "Leather Seats", "Sport Package"]'::jsonb
),
(
  'Mercedes E-Class',
  'Mercedes-Benz',
  'E-Class',
  '/images/mercedes-e.png',
  150.00,
  1000.00,
  180.00,
  1500.00,
  160.00,
  140.00,
  1000.00,
  'diesel',
  'automatic',
  'sedan',
  '5',
  '4',
  '2023',
  '6.8L/100km',
  '["AC", "Navigation", "Leather Seats", "360 Camera", "Driver Assistance"]'::jsonb
)
ON CONFLICT (name) DO NOTHING; 