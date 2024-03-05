export interface IRegisterProps {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  location?: string;
  occupation?: string;
}

export interface ILoginProps {
  email: string;
  password: string;
}
