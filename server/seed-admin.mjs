#!/usr/bin/env node

import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_ADMIN = {
  name: 'Administrador',
  email: 'admin@montesinai.com',
  password: 'admin',
  role: 'admin',
  loginMethod: 'local',
};

async function seedAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não configurada');
    process.exit(1);
  }

  try {
    console.log('🌱 Iniciando seed do usuário admin...');

    // Parse DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: 'Amazon' in url.hostname ? { rejectUnauthorized: false } : undefined,
    });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    console.log(`✓ Senha hasheada`);

    // Verificar se admin já existe
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [DEFAULT_ADMIN.email]
    );

    if (existingAdmin.length > 0) {
      console.log(`⚠️  Usuário admin já existe: ${DEFAULT_ADMIN.email}`);
      console.log(`   E-mail: ${DEFAULT_ADMIN.email}`);
      console.log(`   Senha: ${DEFAULT_ADMIN.password}`);
      await connection.end();
      process.exit(0);
    }

    // Inserir admin
    await connection.execute(
      `INSERT INTO users (name, email, password, role, loginMethod, createdAt, updatedAt, lastSignedIn) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
      [
        DEFAULT_ADMIN.name,
        DEFAULT_ADMIN.email,
        hashedPassword,
        DEFAULT_ADMIN.role,
        DEFAULT_ADMIN.loginMethod,
      ]
    );

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('');
    console.log('📋 Credenciais de acesso:');
    console.log(`   E-mail: ${DEFAULT_ADMIN.email}`);
    console.log(`   Senha: ${DEFAULT_ADMIN.password}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
