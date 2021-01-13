import { Personal } from '../personal';
import { Role } from './role';

export class Usuario{

    usu_codigo: number;
    usu_fec_registro: string;
    personal: Personal;
    role: Role;
}