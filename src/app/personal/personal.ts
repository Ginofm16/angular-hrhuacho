import { Especialidad } from './especialidad';
import { Categoria } from './categoria';
import { Pais } from '../pais/pais';
import { TipoDocumento } from '../tipo-documento/tipoDocumento';

export class Personal{
    per_codigo: number;
    per_nombre: string;
    per_ape_paterno: string;
    per_ape_materno: string;
    per_documento: string;
    per_direccion: string;
    per_telefono: string;
    per_rne: string;
    per_fec_ingreso: string;
    per_fec_salida: string;
    per_estado:boolean;
    per_correo: string;
    username: string;
    password: string;
    especialidad: Especialidad;
    categoria: Categoria;
    tipo_documento: TipoDocumento;
    pais: Pais;
    roles:string[]=[];

}
