import jwt from 'jsonwebtoken';
class UtilsService {
    // Generate JWT
    static generateToken(id: string): string {
      return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '1d',
      });
    };
}

export default UtilsService;
