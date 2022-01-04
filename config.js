const CORPORATE_EMAIL = {
  EMAIL: 'todasok.contacto@gmail.com',
  PASSWORD: 'TodasOK100!*',
  SERVICE: 'gmail',
  HOST: 'smtp.gmail.com',
  PORT: 465,
};

const { FRONTEND } = process.env;

module.exports = {
  SALT_ROUNDS: 10,
  CORPORATE_EMAIL,
  FRONTEND,
};
