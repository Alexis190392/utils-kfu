import { Injectable } from "@nestjs/common";
import { Context } from "necord";

import { CreateRoleDto } from "../dtos/create-role.dto";

@Injectable()
export class RoleService{

  async getRoles(@Context() [interaction]){
    const rolesDC = await interaction.guild.roles.fetch();

    const roles=[];

    rolesDC.forEach(role => {
      const roleAdd = new CreateRoleDto();
      roleAdd.id = role.id;
      roleAdd.name = role.name;
      roles.push(roleAdd)
    })

    return roles;
  }
}