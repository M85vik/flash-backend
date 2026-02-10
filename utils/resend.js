import { Resend } from 'resend';




const resendAPIKey= process.env.ResendAPIKey
if(!resendAPIKey) throw new Error("Resend Environment Variable Not Loaded.");

export const resendClient = new Resend(resendAPIKey);


export const sender = {
    email: process.env.EMAIL_FROM,
    name:process.env.EMAIL_FROM_NAME
}



// resendClient.emails.send({
//   from: 'onboarding@resend.dev',
//   to: '858sharma@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });