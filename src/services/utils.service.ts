import jwt from 'jsonwebtoken';
class UtilsService {
  // Generate JWT
  static generateToken(id: string): string {
    let expired = process.env.JWT_EXPIRED || '10m';
    const secret = process.env.JWT_SECRET || 'default_secret';
    return jwt.sign({ id }, secret, {
      expiresIn: expired,
    });
  }
}

export default UtilsService;
