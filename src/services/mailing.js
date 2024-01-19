import nodemailer from 'nodemailer'
import 'dotenv/config'
import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
  tls: {
    rejectUnauthorized: false,
  },
})

const mailToken = new Promise((resolve, reject) => {
  oauth2Client.getAccessToken((err, tokens) => {
    if (err) reject(err)
    resolve(tokens.access_token)
  })
})

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    type: 'OAuth2',
    user: process.env.USER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    mailToken,
  },
})

export async function sendEmailVerification(email, tokenAccess) {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification from Task-Messenger-App',
    html: createVerificationEmail(tokenAccess),
  })
}

export const createVerificationEmail = (tokenAccess) => {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <style>
      html{
        background-color: white;
      }
      body{
        max-width: 600px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: auto;
        background-color: rgb(229, 255, 246);
        padding: 40px;
        border-radius: 4px;
        margin-top: 10px;
      }
    </style>
  <body>
    <h1>Verificación de correo electrónico -  Tasktalk-APP</h1>
    <p>Se ha creado una cuenta en Task messenger-App con este correo electrónico.</p>
      <p>Si esta cuenta no fue creada por usted, desestime este correo.</p>
      <p></p>Si usted creó la cuenta, entonces verifique la cuenta <a href="http://localhost:5173/verify/${tokenAccess}" target="_blank" rel="noopener noreferrer">haciendo click aquí</a>.</p>
      <p><strong>Admin</strong></p>
      <p>CEO Tasktalk-APP</p>
  </body>
  </html>`
}

export async function sendNewPassword(email, password) {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification from Task-Messenger-App',
    html: createChangePassword(password),
  })
}

export const createChangePassword = (password) => {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <style>
      html{
        background-color: white;
      }
      body{
        max-width: 600px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: auto;
        background-color: rgb(229, 255, 246);
        padding: 40px;
        border-radius: 4px;
        margin-top: 10px;
      }
    </style>
  <body>
    <h1>Tu nueva Contraseña -  Tasktalk-APP</h1>
    <p>Si ha cambiado la contraseña de su cuenta en Task messenger-App.</p>
      <p>${password}</p>
      <p></p>Vuelve a tu Login <a href="http://localhost:5173/login-page" target="_blank" rel="noopener noreferrer">haciendo click aquí</a>.</p>
      <p><strong>Admin</strong></p>
      <p>CEO Tasktalk-APP</p>
  </body>
  </html>`
}
