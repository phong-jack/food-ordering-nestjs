import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { UserService } from 'src/modules/user/services/user/user.service';

@Injectable()
export class MigrationUserSeed {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Command({
    command: 'seed:user',
    describe: 'seed users',
  })
  async seed() {
    const hashPassword = await this.authService.hashData('123456');
    const user1 = this.userService.create({
      email: 'ngotienphong053@gmail.com',
      username: 'phongjack1',
      firstName: 'Jack',
      lastName: 'Phong',
      password: hashPassword,
      phone: '123456789',
      role: UserRole.USER,
    });
    const shop1 = this.userService.create({
      email: 'hottodth@gmail.com',
      username: 'hottoDTH',
      firstName: 'hotto',
      lastName: 'dinh tien hoang',
      password: hashPassword,
      phone: '+84507152002',
      role: UserRole.SHOP,
      shopId: 1000012108, //hotto dinh tien hoang
    });
    const shop2 = this.userService.create({
      email: 'saigonmorin@gmail.com',
      username: 'saigonmorin',
      firstName: 'saigon',
      lastName: 'morin',
      password: hashPassword,
      phone: '+84507132002',
      role: UserRole.SHOP,
      shopId: 83082, //sai gon morin
    });
    try {
      await Promise.all([user1, shop1, shop2]);
    } catch (error) {
      console.error('Error occurred during seeding:', error.message);
      throw error;
    }

    console.log('Success !!');
    return;
  }
}
