import nodemailer from "nodemailer";

export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"FShop Foo 👻" <foo@example.com>',
    to,
    subject,
    html,
  });

  return info;
}
