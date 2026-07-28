import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { User, UserSchema } from '@user/schemas/user.schema';

@Module({
   imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})

export class UserModule {}