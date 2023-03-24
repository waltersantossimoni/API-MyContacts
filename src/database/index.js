const { Client } = require('pg');

const client = new Client({
  host: '172.30.136.180',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'mycontacts',
});

client.connect();

exports.query = async (query, values) => {
  const { rows } = await client.query(query, values);
  return rows;
};
