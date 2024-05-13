import { Injectable } from '@nestjs/common';
import { SettingRepository } from '../repositories/setting.repository';
import { Setting } from '../entities/setting.entity';
import { SETTING_KEY } from '../constants/setting.constant';
import { SettingUpdateDto } from '../dtos/setting.update.dto';

@Injectable()
export class SettingService {
  constructor(private settingRepository: SettingRepository) {}

  async findAll(): Promise<Setting[]> {
    return await this.settingRepository.findAll();
  }

  async findById(id: number): Promise<Setting> {
    return await this.settingRepository.findById(id);
  }

  async findByUser(userId: number): Promise<Setting[]> {
    return await this.settingRepository.findByUser(userId);
  }

  async findByUserKey(userId: number, key: SETTING_KEY): Promise<Setting> {
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
