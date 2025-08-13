

const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"Interio"<${process.env.my_email}>`,
      to,
      subject,
      text
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
  }
};

module.exports = sendEmail;
