-- Migration: add mode column and adjust unique constraint for per-mode attempts

-- Add mode column with default 'random5'
ALTER TABLE IF EXISTS quiz_attempts
ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'random5';

-- Backfill unlimited mode based on total_questions <> 5 (heuristic for existing data)
UPDATE quiz_attempts SET mode = 'unlimited' WHERE total_questions <> 5;

-- Drop old unique constraint on phone_number if present (name differs by schema)
ALTER TABLE IF EXISTS quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_phone_number_key;
ALTER TABLE IF EXISTS quiz_attempts DROP CONSTRAINT IF EXISTS unique_phone_number;

-- Create new unique constraint per phone_number + mode
ALTER TABLE IF EXISTS quiz_attempts
ADD CONSTRAINT unique_phone_number_mode UNIQUE (phone_number, mode);

-- Ensure questions_answered has a default array value to avoid null inserts
ALTER TABLE IF EXISTS quiz_attempts
ALTER COLUMN questions_answered SET DEFAULT '[]'::jsonb;

