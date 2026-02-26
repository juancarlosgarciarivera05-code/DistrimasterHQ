-- DISTRIMASTER HQ - SCHEMA UPDATE FOR NURTURING MOTOR
-- Ejecuta este SQL en tu consola de Supabase para habilitar los nuevos campos.

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS sandbox_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sandbox_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS nurturing_stage TEXT,
ADD COLUMN IF NOT EXISTS last_nurturing_sent_at TIMESTAMPTZ;

-- Comentario para documentación
COMMENT ON COLUMN companies.nurturing_stage IS 'Estado actual del flujo de seguimiento comercial (ej: STARTED, TIPS_1, CONVERSION_OFFER)';
