import { OTPRepositoryImpl, type OTPRepository } from "../repositories";

class OTPService {
    readonly OTPRepository: OTPRepository;
    constructor() {
        this.OTPRepository = new OTPRepositoryImpl();
    }

    async create(phoneNumber: string) {
        try {
            const existedOtp = await this.OTPRepository.findOne({filter: {phoneNumber} });
            if (existedOtp) {
                await this.OTPRepository.delete(existedOtp._id);
            }
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const otp = await this.OTPRepository.create({ code, phoneNumber });
            return otp;
        }catch(e) {
            throw e;
        }
       
    }

    async verify(phoneNumber: string, code: string): Promise<boolean> {
        try {
            const otp = await this.OTPRepository.findOne({ filter: { phoneNumber, code } });
           console.log(otp)
            if (!otp) {
                return false;
            }
            await this.OTPRepository.delete(otp._id);
            return true;
        }catch(e) {
            throw e;
        }
    }

    
}

const otpService = new OTPService();

export default otpService;