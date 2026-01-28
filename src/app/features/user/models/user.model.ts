export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string; // El password es opcional al recibir datos, pero obligatorio al enviar
}
