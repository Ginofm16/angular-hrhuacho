import { Especialidad } from './especialidad';
import { Categoria } from './categoria';

export class Personal{
    per_codigo: number;
    per_nombre: string;
    per_ape_paterno: string;
    per_ape_materno: string;
    per_dni: string;
    per_direccion: string;
    per_telefono: string;
    per_rne: string;
    per_fec_ingreso: string;
    per_fec_salida: string;
    username: string;
    password: string;
    especialidad: Especialidad;
    categoria: Categoria;
    roles:string[]=[];

}