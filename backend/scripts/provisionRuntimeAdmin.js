const pool = require('../config/database');
const { hashPassword } = require('../services/passwords');
const fs = require('fs');
const path = require('path');

async function main() {
  const migrationDirectory = path.join(__dirname, '..', 'migrations');
  const migrations = fs.readdirSync(migrationDirectory).filter((name) => name.endsWith('.sql')).sort();
  for (const migration of migrations) {
    await pool.query(fs.readFileSync(path.join(migrationDirectory, migration), 'utf8'));
  }
  const email = process.env.PROVISION_ADMIN_EMAIL;
  const password = process.env.PROVISION_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Runtime administrator credentials are required');
  await pool.query(
    `INSERT INTO users (email, password, name, role)
     VALUES ($1, $2, 'Runtime Administrator', 'admin')
     ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, name = EXCLUDED.name, role = EXCLUDED.role`,
    [email, hashPassword(password)],
  );
  await pool.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
