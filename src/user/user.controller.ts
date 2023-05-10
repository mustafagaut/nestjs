import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import {EditUserDto} from "./dto"
import { UserService } from './user.service';


@UseGuards(AuthGuard("jwt"))
@Controller('users')
export class UserController {

    constructor(private userService:UserService){

    }
    @Get("me")
    getMe(@GetUser() user:User,@GetUser('email') email:string ){

     
        return user 
    }
    @Patch()
    edituser(@GetUser('id') userId:number,@Body() dto:EditUserDto){
        return this.userService.editUser(userId,dto)

    }





}
