import { Controller, Post, Body, Headers } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { RedisService } from './redis.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('registro')
export class RegistroController {
  constructor(private readonly redisService: RedisService) {}

  @Post()
  async registrar(@Body() data, @Headers('X-Comercio-ID') comercioId: string) {
    if (!this.validarTarjeta(data.card_number)) {
      throw new Error('Tarjeta de crédito no válida');
    }

    const comercio = await this.consultarComercio(comercioId);

    if (!comercio) {
      throw new Error('Comercio no encontrado');
    }

    const token = this.generarTokenUnico();

    await this.guardarDatosEnRedis(token, data);

    return { mensaje: 'Registro exitoso', token };
  }

  private validarTarjeta(cardNumber: string): boolean {
    const reversedCardNumber = cardNumber.split('').reverse();
    let sum = 0;
    let isEven = false;

    for (const digitStr of reversedCardNumber) {
      const digit = parseInt(digitStr, 10);
      if (isEven) {
        const doubledDigit = digit * 2;
        sum += doubledDigit > 9 ? doubledDigit - 9 : doubledDigit;
      } else {
        sum += digit;
      }
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private async consultarComercio(comercioId: string): Promise<any> {
    return null;
  }

  private generarTokenUnico(): string {
    return uuidv4().substr(0, 16);
  }

  private async guardarDatosEnRedis(token: string, data: any): Promise<void> {
    await this.redisService.set(token, JSON.stringify(data));
  }
}
