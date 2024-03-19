const nodemailer = require('nodemailer');

function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function sendVerificationEmail(email, verificationToken) {
  // Create a Nodemailer transporter
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 587,
    // auth: {
    //   user: testAccount.user,
    //   pass: testAccount.pass,
    // },
    auth:{
        user: 'saketnanda164@gmail.com',
        pass: 'Saketnanda@6',
      },
  });

  const mailOptions = {
    from: 'saketnanda164@gmail.com',
    to: email,
    subject: 'Verify Your Email',
    text: `Click the following link to verify your email: http://your-app.com/verify/${verificationToken}`,
    // You can also use HTML for more styling options
    // html: `<p>Click the following link to verify your email: <a href="http://your-app.com/verify/${verificationToken}">Verify Email</a></p>`,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);

    // Log the preview URL to view the sent email on Ethereal
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

const userEmail = 'saketnanda35@gmail.com';
const verificationToken = generateVerificationToken();
sendVerificationEmail(userEmail, verificationToken);
