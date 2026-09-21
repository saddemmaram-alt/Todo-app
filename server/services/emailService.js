require("dotenv").config();

const { google } = require("googleapis");

console.log(
  "GMAIL CLIENT ID EXISTS:",
  !!process.env.GMAIL_CLIENT_ID
);

console.log(
  "GMAIL CLIENT SECRET EXISTS:",
  !!process.env.GMAIL_CLIENT_SECRET
);

console.log(
  "GMAIL REFRESH TOKEN EXISTS:",
  !!process.env.GMAIL_REFRESH_TOKEN
);

async function sendEmail({ to, subject, text }) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "http://localhost:3000/oauth2callback"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const message = [
    `From: TaskFlow <${process.env.EMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    text,
  ].join("\r\n");

  const encodedMessage = Buffer.from(message).toString("base64url");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log(`Email sent successfully to ${to}`);
}

module.exports = {
  sendEmail,
};