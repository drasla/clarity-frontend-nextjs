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
  Int64: { input: any; output: any; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AnswerInquiryInput = {
  answer: Scalars['String']['input'];
  status: InquiryStatus;
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

export type CreateEmailTemplateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  htmlBody: Scalars['String']['input'];
  subject: Scalars['String']['input'];
  templateCode: Scalars['String']['input'];
  variables?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInquiryInput = {
  attachments?: InputMaybe<Array<FileInput>>;
  category: InquiryCategory;
  content: Scalars['String']['input'];
  domain?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  nonMemberPw?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type EmailTemplate = {
  __typename?: 'EmailTemplate';
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  htmlBody: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  subject: Scalars['String']['output'];
  templateCode: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
  variables?: Maybe<Scalars['String']['output']>;
};

export type EmailTemplateList = {
  __typename?: 'EmailTemplateList';
  list: Array<EmailTemplate>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type EmailTemplateSearchInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
};

export type File = {
  __typename?: 'File';
  createdAt: Scalars['Time']['output'];
  extension: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  originalName: Scalars['String']['output'];
  size: Scalars['Int64']['output'];
  storedName: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FileInfo = {
  __typename?: 'FileInfo';
  extension: Scalars['String']['output'];
  originalName: Scalars['String']['output'];
  size: Scalars['Int64']['output'];
  storedName: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FileInput = {
  extension: Scalars['String']['input'];
  originalName: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  storedName: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type Inquiry = {
  __typename?: 'Inquiry';
  answer?: Maybe<Scalars['String']['output']>;
  answeredAt?: Maybe<Scalars['Time']['output']>;
  attachments: Array<File>;
  category: InquiryCategory;
  content: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  domain?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  phoneNumber: Scalars['String']['output'];
  status: InquiryStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
};

export enum InquiryCategory {
  Domain = 'DOMAIN',
  Email = 'EMAIL',
  Etc = 'ETC',
  GoldenShop = 'GOLDEN_SHOP',
  Hosting = 'HOSTING',
  Ssl = 'SSL',
  UserInfo = 'USER_INFO'
}

export type InquiryList = {
  __typename?: 'InquiryList';
  list: Array<Inquiry>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type InquirySearchInput = {
  category?: InputMaybe<InquiryCategory>;
  domain?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<InquiryStatus>;
};

export enum InquiryStatus {
  Completed = 'COMPLETED',
  Pending = 'PENDING'
}

export type ModifyEmailTemplateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  htmlBody?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  templateCode?: InputMaybe<Scalars['String']['input']>;
  variables?: InputMaybe<Scalars['String']['input']>;
};

export type ModifyInquiryInput = {
  attachments?: InputMaybe<Array<FileInput>>;
  category?: InputMaybe<InquiryCategory>;
  content?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  answerInquiry: Inquiry;
  confirmVerification: Scalars['Boolean']['output'];
  createEmailTemplate: EmailTemplate;
  createInquiry: Inquiry;
  deleteEmailTemplate: Scalars['Boolean']['output'];
  deleteInquiry: Scalars['Boolean']['output'];
  login: Token;
  modifyEmailTemplate: EmailTemplate;
  modifyInquiry: Inquiry;
  refreshToken: Token;
  register: User;
  requestVerification: Scalars['Boolean']['output'];
  uploadFile: FileInfo;
  withdraw: Scalars['Boolean']['output'];
};


export type MutationAnswerInquiryArgs = {
  id: Scalars['Int']['input'];
  input: AnswerInquiryInput;
};


export type MutationConfirmVerificationArgs = {
  code: Scalars['String']['input'];
  target: Scalars['String']['input'];
  type: VerificationType;
};


export type MutationCreateEmailTemplateArgs = {
  input: CreateEmailTemplateInput;
};


export type MutationCreateInquiryArgs = {
  input: CreateInquiryInput;
};


export type MutationDeleteEmailTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteInquiryArgs = {
  id: Scalars['Int']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationModifyEmailTemplateArgs = {
  id: Scalars['Int']['input'];
  input: ModifyEmailTemplateInput;
};


export type MutationModifyInquiryArgs = {
  id: Scalars['Int']['input'];
  input: ModifyInquiryInput;
  password?: InputMaybe<Scalars['String']['input']>;
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

export type PageInput = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  findManyEmailTemplates: EmailTemplateList;
  findManyInquiriesForAdmin: InquiryList;
  findManyMyInquiries: InquiryList;
  findManyPublicInquiries: InquiryList;
  findOneEmailTemplateById: EmailTemplate;
  findOneInquiryById: Inquiry;
  me?: Maybe<User>;
};


export type QueryFindManyEmailTemplatesArgs = {
  page: PageInput;
  search?: InputMaybe<EmailTemplateSearchInput>;
};


export type QueryFindManyInquiriesForAdminArgs = {
  page: PageInput;
  search?: InputMaybe<InquirySearchInput>;
};


export type QueryFindManyMyInquiriesArgs = {
  page: PageInput;
};


export type QueryFindManyPublicInquiriesArgs = {
  page: PageInput;
  search?: InputMaybe<InquirySearchInput>;
};


export type QueryFindOneEmailTemplateByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindOneInquiryByIdArgs = {
  id: Scalars['Int']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
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
