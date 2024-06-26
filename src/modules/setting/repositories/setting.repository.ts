import { BadRequestException, Injectable } from '@nestjs/common';
import { Setting } from '../entities/setting.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingUpdateDto } from '../dtos/setting.update.dto';
import { SETTING_KEY } from '../constants/setting.constant';
import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';

@Injectable()
export class SettingRepository extends BaseRepositoryAbstract<Setting> {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
  ) {
    super(settingRepository);
  }

  async findAll(): Promise<Setting[]> {
    return await this.settingRepository.find();
  }

  async findAllBy(filter: FindOptionsWhere<Setting>): Promise<Setting[]> {
    const settings = await this.settingRepository.find({
      relations: { user: { shop: true } },
      where: filter,
    });

    return settings;
  }

  async findById(id: number): Promise<Setting | undefined> {
    const setting = await this.settingRepository.findOne({
      relations: { user: true },
      where: { id: id },
    });
    return setting;
  }

  async findOneBy(
    filter: FindOptionsWhere<Setting>,
  ): Promise<Setting | undefined> {
    const setting = await this.settingRepository.findOne({
      relations: { user: { shop: true } },
      where: filter,
    });

    return setting;
  }

  async updateSetting(id: number, settingUpdateDto: SettingUpdateDto) {
    const setting = await this.findById(id);
    if (!setting) throw new BadRequestException('Setting not found!');

    return await this.settingRepository.save({
      id: id,
      value: settingUpdateDto.value,
    });
  }

  async deleteSetting(id: number): Promise<void> {
    const setting = await this.findById(id);
    if (!setting) throw new BadRequestException('Setting not found!');
    await this.settingRepository.delete({ id });
  }

  async findByUser(userId: number): Promise<Setting[]> {
    const settings = await this.settingRepository.find({
      relations: { user: true },
      where: {
        user: { id: userId },
      },
    });
    return settings;
  }

  async findByUserKey(
    userId: number,
    key: string,
  ): Promise<Setting | undefined> {
    const setting = await this.settingRepository.findOne({
      relations: { user: true },
      where: { user: { id: userId }, key: key },
    });
    return setting;
  }
}
