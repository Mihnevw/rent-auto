-- First, add the new columns as nullable
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS brand VARCHAR(255),
ADD COLUMN IF NOT EXISTS model VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS price_per_day DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS deposit DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS summer_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS summer_deposit DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS june_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS winter_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS winter_deposit DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS fuel VARCHAR(50),
ADD COLUMN IF NOT EXISTS gearbox VARCHAR(50),
ADD COLUMN IF NOT EXISTS body_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS seats VARCHAR(50),
ADD COLUMN IF NOT EXISTS doors VARCHAR(50),
ADD COLUMN IF NOT EXISTS year VARCHAR(50),
ADD COLUMN IF NOT EXISTS consumption VARCHAR(50),
ADD COLUMN IF NOT EXISTS features JSONB;

-- Update existing data with brand and model information
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
    END;

-- Now add the NOT NULL constraint after data is updated
ALTER TABLE cars
ALTER COLUMN brand SET NOT NULL;

-- Add sample data if the table is empty
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
)
SELECT
  'VW Up-Move',
  'Volkswagen',
  'Up-Move',
  '/images/placeholder.svg',
  50.00,
  200.00,
  60.00,
  300.00,
  55.00,
  42.00,
  200.00,
  'gasoline',
  'manual',
  'hatchback',
  '4',
  '4',
  '2020',
  '5.5L/100km',
  '["AC", "Radio", "Central Locking"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM cars LIMIT 1);

-- Add more sample cars if the table is empty
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
)
SELECT
  'VW PASSAT 9',
  'Volkswagen',
  'Passat',
  '/images/passat.png',
  100.00,
  500.00,
  120.00,
  1000.00,
  105.00,
  99.00,
  500.00,
  'diesel',
  'automatic',
  'sedan',
  '5',
  '4',
  '2021',
  '6.5L/100km',
  '["AC", "Navigation", "Leather Seats", "Cruise Control"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM cars LIMIT 1); 