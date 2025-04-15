import { OTPRepositoryImpl, type OTPRepository } from '../repositories';

class OTPService {
  readonly otpRepository: OTPRepository;
  constructor() {
    this.otpRepository = new OTPRepositoryImpl();
  }

  async create(phoneNumber: string) {
    try {
      const existedOtp = await this.otpRepository.findOne({ filter: { phoneNumber } });
      if (existedOtp) {
        await this.otpRepository.delete(existedOtp._id);
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const otp = await this.otpRepository.create({ code, phoneNumber });
      return otp;
    } catch (e) {
      throw e;
    }
  }

  async verify(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const otp = await this.otpRepository.findOne({ filter: { phoneNumber, code } });
      console.log(otp);
      if (!otp) {
        return false;
      }
      await this.otpRepository.delete(otp._id);
      return true;
    } catch (e) {
      throw e;
    }
  }
}

const otpService = new OTPService();

export default otpService;
