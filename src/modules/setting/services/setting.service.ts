import { Injectable } from '@nestjs/common';
import { SettingRepository } from '../repositories/setting.repository';
import { Setting } from '../entities/setting.entity';
import { SETTING_KEY } from '../constants/setting.constant';
import { SettingUpdateDto } from '../dtos/setting.update.dto';
import { SettingCreateDto } from '../dtos/setting.create.dto';

@Injectable()
export class SettingService {
  constructor(private settingRepository: SettingRepository) {}

  async findAll(): Promise<Setting[]> {
    return await this.settingRepository.findAll();
  }

  async findById(id: number): Promise<Setting> {
    return await this.settingRepository.findById(id);
  }

  async findAllByShop(shopId: number): Promise<Setting[]> {
    return await this.settingRepository.findAllBy({
      user: { shop: { id: shopId } },
    });
  }

  async findByShopKey(shopId: number, key: string) {
    return await this.settingRepository.findOneBy({
      user: { shop: { id: shopId } },
      key: key,
    });
  }

  async findAppSettingByKey(key: string): Promise<Setting | undefined> {
    return await this.settingRepository.findOneBy({
      user: null,
      key: key,
    });
  }

  async createSetting(settingCreateDto: SettingCreateDto) {
    const newSetting = await this.settingRepository.create({
      ...settingCreateDto,
      user: { id: settingCreateDto.userId },
    });

    console.log('check new setting:: ', newSetting);
    return await this.settingRepository.create(newSetting);
  }

  async findByUser(userId: number): Promise<Setting[]> {
    return await this.settingRepository.findByUser(userId);
  }

  async findByUserKey(userId: number, key: string): Promise<Setting> {
    return await this.settingRepository.findByUserKey(userId, key);
  }

  async updateSetting(
    userId: number,
    settingUpdateDto: SettingUpdateDto,
  ): Promise<Setting> {
    return await this.settingRepository.updateSetting(userId, settingUpdateDto);
  }

  async deleteSetting(id: number): Promise<void> {
    await this.settingRepository.deleteSetting(id);
  }
}
