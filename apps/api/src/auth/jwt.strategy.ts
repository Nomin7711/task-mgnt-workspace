import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '@task-mgnt-workspace/data';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mysecret123',
    });
  }

  async validate(payload: any) {
    const userWithRoleAndPermissions = await this.usersService.findById(
      payload.sub, true
    );
    
    if (!userWithRoleAndPermissions) return null;

    const user = userWithRoleAndPermissions as User & { role: { permissions: { action: string }[] } };
    
    const permissions: string[] = 
        user.role?.permissions?.map(p => p.action) || 
        [];
    
    const { password, ...rest } = user as any;

    return {
      ...rest,
      permissions: permissions, 
    };
  }
}
