import { Programacion } from './../programacion/programacion';
import { Historia } from './../historia/historia';
import { Usuario } from '../personal/login/usuario';
export class CitaPaciente{
    cit_codigo:number;
    cit_fec_registro: string;
    historia:Historia;
    programacion: Programacion;
    usuario: Usuario;
    cit_exoneracion: number;
    cit_costo_total: number;
    cit_estado: boolean;
}