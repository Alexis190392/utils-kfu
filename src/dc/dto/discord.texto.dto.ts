import { StringOption } from 'necord';

export class TextDto {
  @StringOption({
    name: 'mensaje',
    description: 'Tu mensaje',
    required: true
  })
  text: string;
}