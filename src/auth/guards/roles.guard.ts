import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleEnum } from '../enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    if (!token) return false;

    try {
      const user = this.jwtService.verify(token);
      return requiredRoles.some((role) => user.roles?.includes(role));
    } catch (error) {
      return false;
    }
  }
}
