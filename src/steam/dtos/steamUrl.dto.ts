import { StringOption } from "necord";

export class SteamUrlDto{
  @StringOption({
    name: 'id',
    description: 'Id Steam',
    required: true
  })
  id: string;
}