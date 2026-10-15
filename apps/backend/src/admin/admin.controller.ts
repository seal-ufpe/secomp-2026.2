import { Body, Controller, Post, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { timingSafeEqual } from 'node:crypto';
import { adminCookieName, createAdminSession } from './session';

@Controller('admin')
export class AdminController {
  @Post('login')
  async login(
    @Body() body: { password?: string },
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? '');
    const received = Buffer.from(body.password ?? '');
    const valid =
      expected.length > 0 &&
      expected.length === received.length &&
      timingSafeEqual(expected, received);
    await new Promise((resolve) => setTimeout(resolve, valid ? 0 : 250));
    if (!valid) return { error: { code: 'unauthorized', message: 'Senha inválida.' } };
    response.header(
      'Set-Cookie',
      `${adminCookieName}=${createAdminSession()}; HttpOnly; SameSite=Strict; Max-Age=${8 * 60 * 60}; Path=/;${process.env.NODE_ENV === 'production' ? ' Secure' : ''}`,
    );
    return { ok: true };
  }
}
