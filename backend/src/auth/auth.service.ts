import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly logger: Logger = new Logger(AuthService.name),
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.userService.createUser({
        username: registerDto.username,
        passwordHash: hashedPassword,
      });

      return user;
    } catch (error: unknown) {
      // PostgreSQL unique violation error code
      const err = error as { code?: string; detail?: string };
      if (err.code === '23505') {
        if (err.detail?.includes('username')) {
          throw new ConflictException('Username already exists');
        }
      }
      this.logger.error(
        'Registration error: ',
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException(
        'Registration Failed due to unexpected error',
      );
    }
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  login(user: User): { access_token: string } {
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
