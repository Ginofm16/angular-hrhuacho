import { Usuario } from './../personal/login/usuario';
import { Programacion } from './../programacion/programacion';
import { Historia } from './../historia/historia';

export class CitaMedica {

    cit_codigo: number;
    cit_exoneracion: number;
    cit_costo_total: number;
    historia: Historia;
    programacion: Programacion;
    usuario: Usuario;
    cit_estado: boolean;

}
