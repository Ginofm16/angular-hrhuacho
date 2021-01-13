import { Usuario } from './../personal/login/usuario';
import { Programacion } from './../programacion/programacion';
import { Historia } from './../historia/historia';

export class CitaMedica {

    cit_codigo: number;
    cit_fec_registro: string;
    cit_exoneracion: number;
    cit_cos_total: number;
    his_codigo: Historia;
    pro_codigo: Programacion;
    usu_codigo: Usuario;

}
