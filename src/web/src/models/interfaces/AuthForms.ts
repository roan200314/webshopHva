export interface RegisterForm {
    [key: string]: string;
    name: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface LoginForm {
    [key: string]: string;
    email: string;
    password: string;
}
