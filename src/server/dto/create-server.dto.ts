import { IsOptional, IsString, MinLength } from "class-validator";
import { Column } from "typeorm";

export class CreateServerDto {

  @IsString()
  @MinLength(1)
  name : string;

  @IsString()
  @IsOptional()
  slug? : string

  @IsString()
  @MinLength(7)
  ip : string;

  @IsString()
  @MinLength(4)
  port : string;

  @IsString()
  @MinLength(1)
  user : string;

  @IsString()
  @MinLength(1)
  pass : string;

  @IsString()
  @MinLength(1)
  channelId : string;


  @IsString()
  @MinLength(1)
  webhook : string;

}
