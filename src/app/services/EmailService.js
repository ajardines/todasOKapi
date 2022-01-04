const nodemailer = require('nodemailer');
const { CORPORATE_EMAIL, FRONTEND } = require('../../../config');
const emailTemplate = require('../../email_template/email_template');

const EmailService = module.exports;

const transporter = nodemailer.createTransport({
  service: CORPORATE_EMAIL.SERVICE,
  auth: {
    user: CORPORATE_EMAIL.EMAIL,
    pass: CORPORATE_EMAIL.PASSWORD,
  },
});

EmailService.sendValidationMail = (user, token) => {
  let html = emailTemplate.replace('{url_validation}', `${FRONTEND}/validate-email/${token}`);
  html = html.replace('{name}', `${user.name} ${user.lastName}`);
  const mailOptions = {
    from: CORPORATE_EMAIL.EMAIL,
    to: user.email,
    subject: 'Bienvenido a TodasOK',
    text: `Para validar tu correo haz click aqui ${FRONTEND}/validate-email/${token}`,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

EmailService.sendForgotPassword = (user, token) => {
  let html = emailTemplate.replace('{url_validation}', `${FRONTEND}/reset-password/${token}`);
  html = html.replace('{name}', `${user.name} ${user.lastName}`);
  const mailOptions = {
    from: CORPORATE_EMAIL.EMAIL,
    to: user.email,
    subject: 'Reestablecer contraseña de TodasOK',
    text: `Para reiniciar la contraseña ${FRONTEND}/reset-password/${token}`,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
