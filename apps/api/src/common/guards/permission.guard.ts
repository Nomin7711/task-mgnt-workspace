import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Retrieve the required permissions from the metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no @RequirePermission decorator is present, access is allowed.
    if (!requiredPermissions) {
      return true;
    }

    // 2. Get the authenticated user object from the request
    const { user } = context.switchToHttp().getRequest();

    // Safety check: JwtAuthGuard should have populated the user, but if not, reject.
    if (!user) {
        throw new ForbiddenException('User object missing in request. Authentication failed.');
    }
    
    // contains an array named 'permissions' with all granted permission strings.
    const userPermissions: string[] = user.permissions || []; 

    // 3. Check if the user has ALL required permissions
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (hasRequiredPermissions) {
      return true;
    } else {
      const missing = requiredPermissions.filter(p => !userPermissions.includes(p)).join(', ');
      throw new ForbiddenException(`Missing required permission(s): ${missing}`);
    }
  }
}