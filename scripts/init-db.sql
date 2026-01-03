-- Initialize databases for Teach Charlie AI
-- This script runs on first PostgreSQL container startup

-- Create the Langflow database (Langflow stores flows, messages here)
CREATE DATABASE langflow;

-- Create the Teach Charlie database (our custom backend data)
-- Note: 'teachcharlie' is created by POSTGRES_DB env var, but we ensure it exists
SELECT 'CREATE DATABASE teachcharlie'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'teachcharlie')\gexec

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE langflow TO postgres;
GRANT ALL PRIVILEGES ON DATABASE teachcharlie TO postgres;

-- Enable UUID extension in both databases
\c langflow
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c teachcharlie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
