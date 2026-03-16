/*
  # Add Anonymous Name to Comments

  1. Changes
    - Add `anonymous_name` column to `comments` table
      - Type: text
      - Not null
      - Default: 'Anonymous User'
  
  2. Purpose
    - Enable persistent anonymous identities for comment authors
    - Each user will have a generated name like "Blue Silent Panda #9F2A"
    - Names persist across sessions via localStorage
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comments' AND column_name = 'anonymous_name'
  ) THEN
    ALTER TABLE comments ADD COLUMN anonymous_name text NOT NULL DEFAULT 'Anonymous User';
  END IF;
END $$;
