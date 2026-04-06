export interface User{
      email:string;
      id:string;
      name?:string;
}

export interface FileItem{
      id:string;
      originalName:string;
      mimeType:string;
      size:number;
      uploadedAt:string;
}

export interface ShareLink{
      id:string;
      token:string;
      fileName:string;
      fileSize:number;
      shareUrl:string;
      expiresAt?:string;
      maxDownloads: number;
      downloadCount: number;
      createdAt:string;
      isExpired:boolean;
}

export interface LoginCreadentials{
      email:string;
      password:string;
}

export interface RegisterData{
      email:string;
      password:string;
      name?:string;
}

export interface ApiResponse<T= any> {
      success: boolean,
      message?:string;
      accessToken?:string;
      [key:string]: any;
}