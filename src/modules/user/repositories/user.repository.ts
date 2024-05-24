import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';

export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByUserName(username: string) {
    const user = await this.userRepository.findOne({
      relations: { shop: true },
      where: { username: username },
    });
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: { shop: true },
      where: { email: email },
    });
    return user;
  }

  async findOneBy(filter: FindOptionsWhere<User>): Promise<User> {
    return await this.userRepository.findOne({
      relations: { shop: true },
      where: filter,
    });
  }

  async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const newUser = await this.userRepository.create(userCreateDto);
    return await this.userRepository.save(newUser);
  }

  async updateUser(
    id: number,
    userCreateDto: UserUpdateDto,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findBy({ id });
    if (!user) throw new Error('User not found!');
    await this.userRepository.save({ id, ...userCreateDto });
    return await this.findById(id);
  }

  async deleteUser(id: number): Promise<void> {
    const result: DeleteResult = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('User not found');
    }
  }
}
