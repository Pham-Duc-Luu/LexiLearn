import { Module } from '@nestjs/common';
import { UserAuthController, UserController } from './user.controller';
import { UserAuthService, UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schemas/user.schema';
import { AppModule } from 'src/app.module';
import { UtilService } from 'src/util/util.service';
import { Token, TokenSchema } from 'schemas/token.schema';
import { LoggerModule } from 'libs/logger/logger/infrastructure/nestjs/loggerModule';
import { Collection, CollectionSchema } from 'schemas/collection.schema';
import { FlashCard, FlashCardSchema } from 'schemas/flashCard.schema';
import { ConfigModule } from 'libs/logger/config/infrastructure/nestjs/configModule';
import { ContextModule } from 'libs/logger/context/infrastructure/nestjs/contextModule';
import { UserCollectionController } from './collection/user.collection.controller';
import { UserFlashCardController } from './flashcard/user.flashCard.controller';
import configuration from ' config/configuration';
import { UserCollectionResolver } from './collection/user.collection.resolver';
import { SRSService } from './flashcard/Srs.flashCard.service';
import { UserCollectionService } from './collection/user.collection.service';
import { MailerService } from './mailer.service';
import { UserFlashCardService } from './flashcard/user.flashCard.service';
import { CollectionService } from 'src/collection/collection.service';
import { FlashCardService } from 'src/service/FlashCard.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: User.name, schema: UserSchema },
                { name: Collection.name, schema: CollectionSchema },
                { name: FlashCard.name, schema: FlashCardSchema },
                { name: Token.name, schema: TokenSchema },
            ],
            configuration().database.mongodb_main.name,
        ),
        MongooseModule.forFeature(
            [{ name: Collection.name, schema: CollectionSchema }],
            configuration().database.mongodb_bin.name,
        ),
        LoggerModule,
        ConfigModule,
        ContextModule,
    ],
    controllers: [UserController, UserAuthController, UserCollectionController, UserFlashCardController],
    providers: [
        UserService,
        UtilService,
        UserAuthService,
        UserCollectionResolver,
        UserCollectionService,
        CollectionService,
        FlashCardService,
        SRSService,
        MailerService,
        UserFlashCardService,
        UserCollectionService,
    ],
})
export class UserModule {}
