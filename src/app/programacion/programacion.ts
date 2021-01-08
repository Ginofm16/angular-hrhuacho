import { Personal } from '../personal/personal';
import { Consultorio } from '../consultorio/consultorio';


export class Programacion{
    pro_codigo:number;
    pro_fecha: string;
    pro_hora_inicio:string;
    pro_sigla:string;
    pro_num_turno:number;
    personal:Personal;
    consultorio:Consultorio;
    pro_estado:Boolean;
}