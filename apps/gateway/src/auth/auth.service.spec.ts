import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const adminEmail = 'admin@vitalens.local';
  const adminPassword = 'correct-horse-battery-staple';
  let adminPasswordHash: string;

  beforeAll(async () => {
    adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              ({
                ADMIN_EMAIL: adminEmail,
                ADMIN_PASSWORD_HASH: adminPasswordHash,
              })[key],
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync: () => Promise.resolve('signed.jwt.token') },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('issues a token for the correct admin credentials', async () => {
    const result = await service.login(adminEmail, adminPassword);
    expect(result.accessToken).toBe('signed.jwt.token');
    expect(result.user).toEqual({ email: adminEmail, role: 'admin' });
  });

  it('rejects a wrong password', async () => {
    await expect(service.login(adminEmail, 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects an unknown email', async () => {
    await expect(
      service.login('nope@vitalens.local', adminPassword),
    ).rejects.toThrow(UnauthorizedException);
  });
});
