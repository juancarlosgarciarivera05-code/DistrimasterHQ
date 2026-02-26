-- DISTRIMASTER HQ - ENTERPRISE FOUNDER PROGRAM SCHEMA UPDATE
-- Ejecuta este SQL en tu consola de Supabase para habilitar los nuevos campos.

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS enterprise_cycle_number INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS enterprise_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS enterprise_next_billing_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS enterprise_program_stage TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS enterprise_cycle_completed_at TIMESTAMPTZ;

-- Comentario para documentación
COMMENT ON COLUMN companies.enterprise_program_stage IS 'Etapa del programa Enterprise Founder (founder_cycle_1, founder_cycle_2, founder_cycle_3, plan_selection)';
