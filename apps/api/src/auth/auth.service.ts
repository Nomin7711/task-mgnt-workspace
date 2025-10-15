import { Injectable, UnauthorizedException, Logger } from '@nestjs/common'; 
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@task-mgnt-workspace/data'; 

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); 

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const isValid = await this.usersService.validatePassword(user, password);
    if (!isValid) return null;
    
    const { password: _p, ...result } = user as any;
    return result;
  }

  async login(user: { id: number; username: string; roles?: string[] }) {
    const payload = { sub: user.id, username: user.username, roles: user.roles || [] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithCredentials(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    this.logger.log('AuthService.loginWithCredentials', { username, user: user ? user.username : null });

    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await this.usersService.validatePassword(user as User, password);

    if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _p, ...userWithoutPassword } = user as any;
    
    return this.login({ 
        id: userWithoutPassword.id, 
        username: userWithoutPassword.username, 
        roles: userWithoutPassword.roles 
    });
  }
}