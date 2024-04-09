import { Role } from "../entities";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateMemberDto {

  @IsString()
  id : string;

  @IsString()
  username : string;

  @IsString()
  discriminator : string;

  @IsString()
  globalName : string;

  @IsString()
  avatarHash : string;

  @IsString()
  avatarDecorationHash : string;

  @IsString()
  avatarUrl : string;

  @IsString()
  bannerHash : string;

  @IsString()
  bannerUrl : string;

  @IsString()
  accentColor : string;

  @IsString()
  bot : string;

  @IsString()
  system : string;

  @IsString()
  flags : string;

  @IsString()
  joinedAt : string;

  @IsNumber()
  timeInServer : number;

  @IsString({each: true})
  @IsArray()
  roles : string[];
}
