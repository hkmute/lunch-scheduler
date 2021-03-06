export interface Options {
  id: number;
  name: string;
}

export interface History {
  id: number;
  date: string;
  option_id: number;
  code_id: number;
}

export interface OptionList {
  id: number;
  name: string;
  owner_id: number;
}

export interface Code {
  id: number;
  owner_id: number;
  code: string;
  option_list_id: number;
}

export interface OptionInList {
  id: number;
  option_list_id: number;
  option_id: number;
}

export interface Vote {
  id: number;
  date: string;
  user: string;
  option_id: number;
  code_id: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: number;
    }
  }
}
