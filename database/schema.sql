-- Esquema de base de datos para el Módulo de Efecto de la Inflación sobre el Ahorro
-- PostgreSQL Database Schema

-- Tabla para almacenar las consultas de efecto de inflación
CREATE TABLE IF NOT EXISTS inflation_queries (
    id SERIAL PRIMARY KEY,
    amount_nominal NUMERIC(15, 2) NOT NULL,
    inflation_rate NUMERIC(5, 2) NOT NULL,
    years NUMERIC(5, 2) NOT NULL,
    granularity VARCHAR(20) NOT NULL,
    real_value NUMERIC(15, 2) NOT NULL,
    absolute_loss NUMERIC(15, 2) NOT NULL,
    loss_percent NUMERIC(5, 2) NOT NULL,
    series JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_ip VARCHAR(45),
    user_agent TEXT
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_inflation_queries_created_at 
    ON inflation_queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inflation_queries_amount_nominal 
    ON inflation_queries(amount_nominal);
CREATE INDEX IF NOT EXISTS idx_inflation_queries_inflation_rate 
    ON inflation_queries(inflation_rate);

-- Tabla para estadísticas agregadas (opcional)
CREATE TABLE IF NOT EXISTS query_statistics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_queries INTEGER DEFAULT 0,
    avg_amount_nominal NUMERIC(15, 2),
    avg_inflation_rate NUMERIC(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- Índice para la tabla de estadísticas
CREATE INDEX IF NOT EXISTS idx_statistics_date 
    ON query_statistics(date DESC);