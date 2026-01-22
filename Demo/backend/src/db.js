// src/db.js
import dotenv from 'dotenv';
import snowflake from 'snowflake-sdk';

// Load .env from backend folder
dotenv.config();

// Support either SNOWFLAKE_USER or SNOWFLAKE_USERNAME
const {
  SNOWFLAKE_ACCOUNT,
  SNOWFLAKE_PASSWORD,
  SNOWFLAKE_WAREHOUSE,
  SNOWFLAKE_DATABASE,
  SNOWFLAKE_SCHEMA,
  SNOWFLAKE_ROLE,
} = process.env;

const SNOWFLAKE_USER =
  process.env.SNOWFLAKE_USER || process.env.SNOWFLAKE_USERNAME;

// DEBUG: log config (no password)
console.log('[Snowflake config]', {
  account: SNOWFLAKE_ACCOUNT,
  user: SNOWFLAKE_USER,
  warehouse: SNOWFLAKE_WAREHOUSE,
  database: SNOWFLAKE_DATABASE,
  schema: SNOWFLAKE_SCHEMA,
  role: SNOWFLAKE_ROLE,
});

// Hard validation – fail early if missing
if (!SNOWFLAKE_USER) {
  throw new Error(
    'Snowflake username missing. Define SNOWFLAKE_USER or SNOWFLAKE_USERNAME in .env'
  );
}

if (!SNOWFLAKE_ACCOUNT) {
  throw new Error('SNOWFLAKE_ACCOUNT is missing in .env');
}

const pool = snowflake.createPool(
  {
    account: SNOWFLAKE_ACCOUNT,
    username: SNOWFLAKE_USER,
    password: SNOWFLAKE_PASSWORD,
    warehouse: SNOWFLAKE_WAREHOUSE,
    database: SNOWFLAKE_DATABASE,
    schema: SNOWFLAKE_SCHEMA,
    role: SNOWFLAKE_ROLE,
  },
  {
    max: 5,
    min: 1,
  }
);

export function query(sqlText, binds = []) {
  // pool.use passes ONLY the connection into your function
  return pool.use((connection) => {
    return new Promise((resolve, reject) => {
      connection.execute({
        sqlText,
        binds,
        complete: (execErr, _stmt, rows) => {
          if (execErr) {
            console.error('Snowflake query error:', execErr);
            return reject(execErr);
          }
          resolve(rows || []);
        },
      });
    });
  });
}

