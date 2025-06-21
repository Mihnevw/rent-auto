-- Add pricing columns to cars table
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS price_per_day DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS deposit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS summer_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS summer_deposit DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS june_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS winter_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS winter_deposit DECIMAL(10,2);

-- Update existing cars with default pricing
UPDATE cars
SET 
  price_per_day = 50.00,
  deposit = 200.00,
  summer_price = 60.00,
  summer_deposit = 300.00,
  june_price = 55.00,
  winter_price = 45.00,
  winter_deposit = 200.00
WHERE price_per_day = 0.00; 