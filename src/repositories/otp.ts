import { otpModel } from "../models";
import type { OTP } from "../types";
import { BaseRepositoryImpl, type BaseRepository } from "./base";


interface OTPRepository extends BaseRepository<OTP>{}

class OTPRepositoryImpl extends BaseRepositoryImpl<OTP> implements OTPRepository {
    constructor() {
        super(otpModel);
    }
}

export { type OTPRepository, OTPRepositoryImpl };