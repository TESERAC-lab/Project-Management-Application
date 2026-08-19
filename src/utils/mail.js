import Mailgen from 'mailgen';

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

export { emailVerficationMailgenContent, forgotPasswordMailgenContent };
