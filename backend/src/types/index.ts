import {z} from 'zod';

export const userPayloadSchema = z.object({
      id:z.string().cuid(),
      email:z.string().email(),
      iat:z.number().optional(),
      exp:z.number().optional(),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;

export interface AuthTokens{
      accessToken: string;
      refreshToken: string;
}

export interface RegisterInput{
      email:string;
      password:string;
      name?:string;
}

export interface LoginInput{
      email: string;
      password:string;
}

export interface ApiError extends Error{
      statusCode: number;
      isOperational? : boolean;
}

export interface FileMetaData {
      id:string;
      originalName: string;
      storedName: string;
      mimeType: string;
      size: number;
      checksum?: string;
      uploadedAt: Date;
}

export const uploadFileSchema = z.object({

});

export interface ShareLinkInput{
      fileId: string;
      expiresAt? : Date;
      maxDownloads?: number;
      password?:string;
}

export interface ShareLinkResponse{
      id: string;
      token: string;
      shareUrl: string;
      maxDownloads: number;
      expiresAt? : Date;
      downloadCount: number;
}

export interface ChangeInputPassword{
      currentPassword: string;
      newPassword: string;
}