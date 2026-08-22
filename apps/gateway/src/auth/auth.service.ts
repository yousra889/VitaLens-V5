import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * There are no public user accounts in VitaLens - the map is open
 * access. The only account is the single Admin login (manages data
 * sources / manual upload fallback), configured via env vars rather
 * than a users collection, matching the "Reporté à une V2" note that
 * a full admin module (Spring Boot) is deferred.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const adminPasswordHash = this.config.get<string>('ADMIN_PASSWORD_HASH');

    if (!adminEmail || !adminPasswordHash) {
      throw new UnauthorizedException('Admin account is not configured yet');
    }

    const emailMatches = email === adminEmail;
    const passwordMatches = emailMatches
      ? await bcrypt.compare(password, adminPasswordHash)
      : false;

    if (!emailMatches || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: 'admin', email: adminEmail, role: 'admin' };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: { email: adminEmail, role: 'admin' },
    };
  }
}
