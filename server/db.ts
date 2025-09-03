import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

// Conectar com SUPABASE PostgreSQL (prioridade) ou banco local
const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

// Instância do Drizzle ORM
export const db = drizzle(pool, { schema });

// Teste de conexão
export async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexão com SUPABASE PostgreSQL estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com SUPABASE PostgreSQL:', error);
    return false;
  }
}