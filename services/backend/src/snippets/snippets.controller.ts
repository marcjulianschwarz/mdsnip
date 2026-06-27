import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Snippet } from './snippets.entity';

type PublicSnippet = Omit<Snippet, 'passwordHash'>;

type ByShareCodeRespone =
  | { expired: true }
  | { protected: true }
  | { expired: false; snippet: PublicSnippet };

function stripPassword(snippet: Snippet): PublicSnippet {
  const { passwordHash: _ph, ...rest } = snippet;
  return rest;
}

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @ApiBody({
    schema: {
      example: JSON.stringify({ markdown: '**Test** markdown' }),
    },
  })
  @Post('')
  async setMarkdownData(
    @Body()
    body: {
      markdown: string;
      userId?: string;
      expirationHours?: number;
      password?: string;
    },
  ): Promise<PublicSnippet> {
    const snippet = await this.snippetsService.createSnippet(
      body.markdown,
      body.userId,
      body.expirationHours,
      body.password,
    );
    return stripPassword(snippet);
  }

  @Get('by-share-code/:shareCode')
  async getMarkdownData(
    @Param('shareCode') shareCode: string,
  ): Promise<ByShareCodeRespone> {
    const snippet = await this.snippetsService.getSnippet(shareCode);
    if (snippet) {
      if (snippet.passwordHash) {
        return { protected: true };
      }
      return { snippet: stripPassword(snippet), expired: false };
    }
    const exists = await this.snippetsService.snippetExists(shareCode);
    if (!exists) {
      throw new NotFoundException('Snippet not found');
    }
    return { expired: true };
  }

  @Post('by-share-code/:shareCode/unlock')
  async unlockSnippet(
    @Param('shareCode') shareCode: string,
    @Body() body: { password: string },
  ): Promise<{ snippet: PublicSnippet }> {
    const result = await this.snippetsService.unlockSnippet(
      shareCode,
      body.password ?? '',
    );
    if (result === 'invalid') {
      throw new UnauthorizedException('Invalid password');
    }
    return { snippet: stripPassword(result) };
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
    @Body()
    body: {
      markdown?: string;
      expirationHours?: number | null;
      password?: string | null;
    },
  ) {
    const data = this.snippetsService.updateSnippet(snippetId, body);
    return data;
  }
}
