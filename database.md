# MediScan Database Model

This document describes the database model for the MediScan application.

## Tables

### profiles
Stores user profile information
- `id` (UUID, PK) - References auth.users
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `email` (TEXT, UNIQUE)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `notifications_enabled` (BOOLEAN)

### notifications
Stores user notifications
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References profiles
- `title` (TEXT)
- `message` (TEXT)
- `type` (TEXT)
- `read` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `expires_at` (TIMESTAMPTZ)

### scan_history
Stores medicine scan history
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References profiles
- `image_url` (TEXT)
- `result` (TEXT)
- `medicine_name` (TEXT)
- `details` (JSONB) - Stores detailed scan results
- `created_at` (TIMESTAMPTZ)

### chats
Stores chat conversations
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References profiles
- `title` (TEXT)
- `messages` (JSONB) - Stores chat messages
- `last_message` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### health_records
Stores user health records
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References profiles
- `record_type` (TEXT)
- `record_date` (DATE)
- `details` (JSONB)
- `attachments` (TEXT[]) - Array of attachment URLs
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### admin_users
Stores admin user information
- `id` (UUID, PK) - References profiles
- `role` (TEXT)
- `permissions` (JSONB)
- `created_at` (TIMESTAMPTZ)

### feedback
Stores user feedback
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References profiles
- `type` (TEXT)
- `message` (TEXT)
- `rating` (INTEGER) - 1 to 5 rating
- `created_at` (TIMESTAMPTZ)

## Security

### Row Level Security (RLS)
All tables have Row Level Security enabled with policies that:
- Allow users to read and manage only their own data
- Restrict admin data access to admin users only
- Prevent unauthorized access to other users' data

### Automatic Timestamps
Tables with `updated_at` columns have triggers to automatically update the timestamp when records are modified.

## Relationships

- Each table with `user_id` has a foreign key relationship to the `profiles` table
- `profiles` table is linked to Supabase Auth users through the `id` field
- Admin users are linked to their profiles through the `id` field

## Data Types

- UUID used for all IDs
- TIMESTAMPTZ used for all timestamps to handle timezone information
- JSONB used for flexible schema fields (messages, details, permissions)
- TEXT[] used for arrays of strings (attachments)
- TEXT used for most string fields
- BOOLEAN used for flags and toggles
