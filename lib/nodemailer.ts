import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    text,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("[Nodemailer] Email sent successfully", response);
  } catch (error) {
    console.error("[Nodemailer] Error sending email", error);
    throw new Error("Failed to send email");
  }
};

export { sendEmail };
