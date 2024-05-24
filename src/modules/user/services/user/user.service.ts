import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities/user.entity';
import { UserCreateDto } from '../../dtos/user.create.dto';
import { UserUpdateDto } from '../../dtos/user.update.dto';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new BadRequestException('User not exist!');
    }
    return user;
  }

  async findOneByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOneByUserName(username);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    return user;
  }

  async findOneBy(filter: FindOptionsWhere<User>): Promise<User> {
    return await this.userRepository.findOneBy(filter);
  }

  async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const newUser = await this.userRepository.createUser(userCreateDto);
    return newUser;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.deleteUser(id);
  }

  async updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(id, userUpdateDto);
    return updatedUser;
  }
}
