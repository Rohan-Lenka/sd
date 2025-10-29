import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { NullResponseInterceptor } from './interceptors/null-response.interceptor';
import { AudienceManagerModule } from './apis/audienceManager/audienceManager.module';
import { GoogleUsersModule } from './apis/googleUsers/googleUsers.module';
import googleConfig from './config/google.config';
import microsoftConfig from './config/microsoft.config';
import { GoogleOAuthModule } from './apis/googleOAuth/googleOAuth.module';
import { MicrosoftOAuthModule } from './apis/microsoftOAuth/microsoftOAuth.module';
import { WorkflowModule } from './apis/workflow/workflow.module';
import { OrganisationModule } from './apis/organisation/organisation.module';
import { ContentModule } from './apis/content/content.module';
import { ContentworkflowModule } from './apis/contentworkflow/contentworkflow.module';
import { FileUploadModule } from './apis/file-upload/file-upload.module';
import { ContentcommentModule } from './apis/contentcomment/contentcomment.module';
import { ContentactionlogModule } from './apis/contentactionlog/contentactionlog.module';
import { WorkflowstateModule } from './apis/workflowstate/workflowstate.module';
import { GooglechatModule } from './apis/googlechat/googlechat.module';
import { FormfieldsModule } from './apis/formfields/formfields.module';

config();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [googleConfig, microsoftConfig],
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    AuthModule,
    AudienceManagerModule,
    GoogleUsersModule,
    GoogleOAuthModule,
    MicrosoftOAuthModule,
    ContentworkflowModule,
    WorkflowModule,
    OrganisationModule,
    ContentModule,
    ContentcommentModule,
    ContentactionlogModule,
    FileUploadModule,
    WorkflowstateModule,
    GooglechatModule,
    FormfieldsModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: NullResponseInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
