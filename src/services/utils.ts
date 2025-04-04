import jwt from 'jsonwebtoken';
class UtilsService {
    // Generate JWT
    static generateToken(id: string): string {
      console.log(process.env.JWT_SECRET || 'default_secret') 
      return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '1m',
      });
    };
}

export default UtilsService;
