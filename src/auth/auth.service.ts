import { ForbiddenException, Injectable } from "@nestjs/common";
import { User,Bookmark, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import {JwtService} from '@nestjs/jwt'
import { ConfigService } from "@nestjs/config";
@Injectable({

})
export class AuthService {
    constructor(
        private prisma:PrismaService,
        private jwt:JwtService,
        private config:ConfigService){}


    async signin(dto: AuthDto){
        try {
            const user= await this.prisma.user.findUnique({
                where:{
                    email:dto.email
                }
            })
            if(!user){
                throw new ForbiddenException("Credential incorrect",)
            }
            const pwmatches=await argon.verify(user.hash, dto.password);
            if(!pwmatches){
                throw new ForbiddenException("Credential incorrect",)
            }
    

            return this.signToken(user.id,user.email);

        } catch (error) {
            console.log(error);
            throw error;
        }
        
    }


    async signup(dto :AuthDto){

       try {
        const hash=await argon.hash(dto.password)

        const  user=await this.prisma.user.create({
            data:{
                email:dto.email,
                hash,
            }
            ,select:{
                id:true,
                email:true,
                createdAt:true
            }
        })

        return this.signToken(user.id,user.email);

       } catch (error) {
        console.log( error instanceof Prisma.PrismaClientKnownRequestError );

        if(error instanceof Prisma.PrismaClientKnownRequestError){
            
            if(error.code=='P2002'){
                throw new ForbiddenException('Credential taken',)
            }
        }
        throw error;
       }
        
    }


 async signToken(userId:number ,email:string):Promise<{access_token:string}> {
        const data={
            sub:userId,
            email
        };
        const secret=this.config.get("JWT_SECRET");
        const token= await this.jwt.signAsync(data,{
            expiresIn:"15m",
            secret:secret
        })

        return {
            access_token:token
        }
        
    }
}