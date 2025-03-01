import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { ApiBody } from '@nestjs/swagger';
import { DEFAULT_PREFERENCES } from './preferences.entity';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get(':userId')
  async getPreferences(@Param('userId') userId: string) {
    const data = await this.preferencesService.getPreferences(userId);
    if (!data) {
      return DEFAULT_PREFERENCES;
    } else {
      return data;
    }
  }

  @ApiBody({
    schema: {
      example: JSON.stringify({ value: 'dark' }),
    },
  })
  @Patch(':userId/:key')
  setPreferences(
    @Param('userId') userId: string,
    @Param('key') key: string,
    @Body() prefBody: { value: any },
  ) {
    const data = this.preferencesService.setPreferences(
      userId,
      key,
      prefBody.value,
    );
    return data;
  }
}
