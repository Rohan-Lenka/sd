import * as nodemailer from 'nodemailer';

export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(email: string, name: string = '') {
    const mailOptions = {
      from: 'smtp@mail.creuto.in', // sender address
      to: email, // list of receivers
      subject: `hello ${name} from skribe`, // Subject line
      text: 'welcome to skribe', // plain text body
      html: `<h1> Welcome to Skribe by Creuto</h1>
                <p>
                    Account successfully created
                </p>
                <a href="https://dev.skribe.app/" target="_blank" 
                style="display: inline-block; margin-top: 20px; padding: 12px 24px; 
                    background-color: #4f46e5; color: #fff; text-decoration: none; 
                    border-radius: 6px; font-weight: bold;">
                Open Skribe
                </a>
                `, // html body
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent : ', info.messageId);
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
}
