import { config } from '../config';

class TwilioService {
  // private twilio: Twilio;
  // constructor() {
  //   this.twilio = new Twilio(config.twilio.accountSid, config.twilio.authToken);
  // }
  // async sendSMS(to: string, message: string) {
  //   try {
  //     const response = await this.twilio.messages.create({
  //       body: message,
  //       from: '+14142408885',
  //       to: to,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }
}

export default new TwilioService();
