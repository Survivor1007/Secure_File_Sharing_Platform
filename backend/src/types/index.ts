export interface UserPayload{
      id: string;
      email: string;
}

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