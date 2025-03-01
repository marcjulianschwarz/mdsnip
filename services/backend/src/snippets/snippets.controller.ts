import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Snippet } from './snippets.entity';

type ByShareCodeRespone =
  | {
      expired: true;
    }
  | { expired: false; snippet: Snippet };

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @ApiBody({
    schema: {
      example: JSON.stringify({ markdown: '**Test** markdown' }),
    },
  })
  @Post('')
  setMarkdownData(
    @Body()
    body: {
      markdown: string;
      userId?: string;
      expirationHours?: number;
    },
  ) {
    return this.snippetsService.createSnippet(
      body.markdown,
      body.userId,
      body.expirationHours,
    );
  }

  @Get('by-share-code/:shareCode')
  async getMarkdownData(
    @Param('shareCode') shareCode: string,
  ): Promise<ByShareCodeRespone> {
    const snippet = await this.snippetsService.getSnippet(shareCode);
    if (snippet) {
      return { snippet: snippet, expired: false };
    }
    return { expired: true };
  }

  @UseGuards(AuthGuard)
  @Get('by-user-id/:userId')
  getSnippetsByUserId(@Param('userId') userId: string) {
    const data = this.snippetsService.getSnippetByUserId(userId);
    return data;
  }

  @UseGuards(AuthGuard)
  @Delete(':snippetId')
  deleteSnippet(@Param('snippetId') snippetId: string) {
    const data = this.snippetsService.deleteSnippet(snippetId);
    return data;
  }

  @UseGuards(AuthGuard)
  @Patch(':snippetId')
  updateSnippet(
    @Param('snippetId') snippetId: string,
    @Body() body: { markdown?: string; expirationHours?: number | null },
  ) {
    const data = this.snippetsService.updateSnippet(snippetId, body);
    return data;
  }
}
