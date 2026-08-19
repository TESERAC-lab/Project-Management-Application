import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const mailGenerator = new mailgen({
    theme: 'default',
    porduct: {
      name: 'Task Manager',
      link: 'https://taskmangaelink.com',
    },
  });
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: 'mail.taskmangaer@example.com',
    to: options.email,
    subject: options.subject,
    html: emailHTML,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email service failed silently . Make sure you provided your MAILTRAP credentials in the .env file.",
      console.error("error :", error)
    )
  }
};

const emailVerficationMailgenContent = (username, verficationURL) => {
  return {
    body: {
      name: username,
      intro: 'Welcome to our ap , we are excited to have you on board',
      action: {
        instructions: 'To verify your email , please click on the following button',
        button: {
          color: '#22BC66',
          text: 'Confirm your account',
          link: verficationURL,
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetURL) => {
  return {
    body: {
      name: username,
      intro: 'We got a request to reset the password of your account',
      action: {
        instructions: 'To reset your password, please click on the following button',
        button: {
          color: '#930c0c',
          text: 'Reset your password',
          link: passwordResetURL,
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { emailVerficationMailgenContent, forgotPasswordMailgenContent ,sendEmail };
