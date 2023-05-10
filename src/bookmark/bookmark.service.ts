import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {

    constructor(private prisma:PrismaService){}


    
    async CreateBookmark(userId:number,dto:CreateBookmarkDto){
        const bookmark =await this.prisma.bookmark.create({
            data:{
                UserId:userId,
                ...dto
            }
        })
        return bookmark;

        
    }


     getBookmarks(userId:number){
      return  this.prisma.bookmark.findMany({
            where:{
                UserId:userId
            }
        })

    }


    getBookmarkById(userId:number,bookmarkId:number){
        return  this.prisma.bookmark.findFirst({
            where:{
                UserId:userId,
                id:bookmarkId
            }
        })
        

    }
   
    async editBookmarkById(@GetUser("id")userId:number,bookmarkId,dto:EditBookmarkDto ){

       const bookmark= await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })
        if(!bookmark||bookmark.UserId==userId){
            console.log(dto);
          return this.prisma.bookmark.update({
            where:{
                id:bookmarkId,
            },
            data:{
                ...dto
            }
          })

        }else{
            throw new ForbiddenException("you have no rights to delete this bookmark",)

        }
        
    }
    
   async  deleteBookmarkById(userId:number,bookmarkId:number){
        const bookmark= await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })
        if(!bookmark||bookmark.UserId==userId){
            
          return this.prisma.bookmark.delete({
            where:{
                id:bookmarkId,
            }})

        }else{
            throw new ForbiddenException("you have no rights to edit this bookmark",)

        }


    }
}
