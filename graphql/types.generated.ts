import { Time, Upload } from "./scalars";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type BusinessInfo = {
  __typename?: 'BusinessInfo';
  bizAddress1: Scalars['String']['output'];
  bizAddress2?: Maybe<Scalars['String']['output']>;
  bizCEO: Scalars['String']['output'];
  bizItem: Scalars['String']['output'];
  bizLicenseURL?: Maybe<Scalars['String']['output']>;
  bizRegNumber: Scalars['String']['output'];
  bizType: Scalars['String']['output'];
  bizZipCode: Scalars['String']['output'];
};

export type BusinessInput = {
  bizAddress1: Scalars['String']['input'];
  bizAddress2?: InputMaybe<Scalars['String']['input']>;
  bizCEO: Scalars['String']['input'];
  bizItem: Scalars['String']['input'];
  bizLicenseURL?: InputMaybe<Scalars['String']['input']>;
  bizRegNumber: Scalars['String']['input'];
  bizType: Scalars['String']['input'];
  bizZipCode: Scalars['String']['input'];
};

export type FileInfo = {
  __typename?: 'FileInfo';
  fileName: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  confirmVerification: Scalars['Boolean']['output'];
  login: Token;
  refreshToken: Token;
  register: User;
  requestVerification: Scalars['Boolean']['output'];
  uploadFile: FileInfo;
  withdraw: Scalars['Boolean']['output'];
};


export type MutationConfirmVerificationArgs = {
  code: Scalars['String']['input'];
  target: Scalars['String']['input'];
  type: VerificationType;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRequestVerificationArgs = {
  target: Scalars['String']['input'];
  type: VerificationType;
};


export type MutationUploadFileArgs = {
  directory?: InputMaybe<Scalars['String']['input']>;
  file: Scalars['Upload']['input'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  me?: Maybe<User>;
};

export type RegisterInput = {
  agreeEmail: Scalars['Boolean']['input'];
  agreeSMS: Scalars['Boolean']['input'];
  bizInfo?: InputMaybe<BusinessInput>;
  email: Scalars['String']['input'];
  landlineNumber?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Token = {
  __typename?: 'Token';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  agreeEmail: Scalars['Boolean']['output'];
  agreeSMS: Scalars['Boolean']['output'];
  bizInfo?: Maybe<BusinessInfo>;
  createdAt: Scalars['Time']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  landlineNumber?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  role: UserRole;
  status: UserStatus;
  type: UserType;
  updatedAt: Scalars['Time']['output'];
  username: Scalars['String']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum UserStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Withdrawn = 'WITHDRAWN'
}

export enum UserType {
  Business = 'BUSINESS',
  Personal = 'PERSONAL'
}

export enum VerificationType {
  Email = 'EMAIL',
  Sms = 'SMS'
}
