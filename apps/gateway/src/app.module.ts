import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ZonesModule } from './zones/zones.module';
import { SqlModule } from './sql/sql.module';
import { MedicalDataModule } from './medical-data/medical-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ZonesModule,
    SqlModule,
    MedicalDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
