/*
  # Team Feedback Loop Database Setup

  1. New Tables
    - feedback
      - id (uuid, primary key)
      - created_at (timestamptz)
      - content (text)
      - category (text)
      - upvotes (integer)
      - downvotes (integer)

    - comments
      - id (uuid, primary key)
      - feedback_id (uuid, foreign key)
      - created_at (timestamptz)
      - content (text)

  2. Security
    - Enable RLS on both tables
    - Public read access
    - Public insert access
    - Public vote updates

  3. Performance
    - Indexes for lookup and filtering
*/

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  content text NOT NULL,
  category text NOT NULL,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES public.feedback(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  content text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Feedback policies
CREATE POLICY "Anyone can view feedback"
ON public.feedback
FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can create feedback"
ON public.feedback
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update vote counts"
ON public.feedback
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Comment policies
CREATE POLICY "Anyone can view comments"
ON public.comments
FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can create comments"
ON public.comments
FOR INSERT
TO public
WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS comments_feedback_id_idx
ON public.comments(feedback_id);

CREATE INDEX IF NOT EXISTS feedback_category_idx
ON public.feedback(category);

CREATE INDEX IF NOT EXISTS feedback_created_at_idx
ON public.feedback(created_at DESC);