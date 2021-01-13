import { Estudio } from './../estudio/estudio';
import {Pais} from './pais';

export class Historia {

    his_codigo: number;
    his_nombre: string;
    his_ape_paterno: string;
    his_ape_materno: string;
    his_dni: string;
    his_direccion: string;
    his_fec_nacimiento: string;
    his_seguro: string;
    his_genero: string;
    estudio: Estudio;
    his_estado: boolean;
    pais:Pais;
}