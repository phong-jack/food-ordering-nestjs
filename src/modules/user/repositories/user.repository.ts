import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dtos/user.create.dto';

export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  public async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const newUser = this.userRepository.create(userCreateDto);
    return this.userRepository.save(newUser);
  }

  public async updateUser(
    id: number,
    userCreateDto: UserCreateDto,
  ): Promise<User | undefined> {
    await this.userRepository.update(id, userCreateDto);
    return this.findById(id);
  }

  public async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
