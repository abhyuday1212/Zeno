// import logger from "../utils/logger.js";
import transporter from "@/lib/config/nodemailer";
import logger from "./logger";

export const sendContactSubmissionEmail = async (
  contactData: any
): Promise<void> => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.SENDER_EMAIL,
    subject: "New Contact Form Submission",
    html: `
      <h1>New Contact Form Submission</h1>
      <p>You have received a new contact form submission with the following details:</p>
      <div>
        <strong>Name:</strong> ${contactData.name} <br>
        <strong>Number:</strong> ${contactData.phoneNumber} <br>
        <strong>Email:</strong> ${contactData.email} <br>
        <strong>Subject:</strong> ${contactData.subject} <br>
        <strong>Message:</strong> ${contactData.message} <br>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(
      `Contact submission email sent: ${info.response}. \n Sent to: ${process.env.SENDER_EMAIL}`
    );
  } catch (error) {
    logger.error("Error sending contact submission email:", error);
  }
};
