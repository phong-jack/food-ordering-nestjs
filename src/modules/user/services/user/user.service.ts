import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities/user.entity';
import { UserCreateDto } from '../../dtos/user.create.dto';
import { UserUpdateDto } from '../../dtos/user.update.dto';
import { FindOptionsWhere } from 'typeorm';
import { UserChangePasswordDto } from '@modules/user/dtos/user.change-password.dto';
import argon2, { hash } from 'argon2';
import passport from 'passport';
import { AppAbility } from '@modules/casl/casl-ability.factory';
import { Action } from '@modules/casl/constants/casl.constant';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findAllBy(filter: FindOptionsWhere<User>): Promise<User[]> {
    const users = await this.userRepository.findAllBy(filter);
    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new BadRequestException('User not exist!');
    }
    return user;
  }

  async findOneBy(filter: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOneBy(filter);
    return user;
  }

  async findOneByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username: username });
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: email });
    return user;
  }

  async findOneByPhone(phone: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ phone });
    return user;
  }

  async create(userCreateDto: UserCreateDto): Promise<User> {
    const userByEmail = await this.findOneByEmail(userCreateDto.email);
    if (userByEmail) throw new BadRequestException('This email already exist');
    const userByUserName = await this.findOneByUserName(userCreateDto.username);
    if (userByUserName)
      throw new BadRequestException('This username already exist');

    const newUser = await this.userRepository.create(userCreateDto);
    return newUser;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.deleteUser(id);
  }

  async update(id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    const updatedUser = await this.userRepository.update(id, userUpdateDto);
    return updatedUser;
  }

  async changePassword(
    id: number,
    userChangePasswordDto: UserChangePasswordDto,
    abilities: AppAbility,
  ) {
    const { oldPassword, newPassword, confirmNewPassword } =
      userChangePasswordDto;

    const user = await this.findById(id);
    if (!abilities?.can(Action.Update, user)) {
      throw new ForbiddenException('Not have permission change this resource');
    }

    const isTrueOldPassword = await argon2.verify(user.password, oldPassword);
    if (!isTrueOldPassword) {
      throw new BadRequestException(
        'Not true old password, please re type password',
      );
    }

    const isPasswordMatch = newPassword === confirmNewPassword;
    if (!isPasswordMatch) {
      throw new BadRequestException('Password does not match!');
    }

    const isNewPasswordSameAsOld = await argon2.verify(
      user.password,
      newPassword,
    );
    if (isNewPasswordSameAsOld) {
      throw new BadRequestException(
        'Password used, plase re type new password',
      );
    }

    const hashPassword = await hash(newPassword);
    return await this.update(id, {
      password: hashPassword,
    });
  }
}
