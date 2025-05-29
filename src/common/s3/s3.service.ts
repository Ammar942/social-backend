import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import * as mime from 'mime-types';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: configService.get<string>('AWS_REGION') as string,
      endpoint: configService.get<string>('AWS_ENDPOINT') as string,
      forcePathStyle: true,
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    });

    this.bucket = configService.get<string>('AWS_S3_BUCKET_NAME') as string;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExt = extname(file.originalname);
    const contentType = mime.lookup(fileExt) || 'application/octet-stream';
    const key = `posts/${randomUUID()}${fileExt}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: contentType,
      }),
    );

    return `https://jkotsonnekxnixgxasae.supabase.co/storage/v1/object/public/social/${key}`;
  }
}
