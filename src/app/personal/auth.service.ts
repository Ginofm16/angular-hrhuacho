import { Injectable } from '@angular/core';
import { Personal } from './personal';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Usuario } from './login/usuario';
import { Role } from './login/role';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _personal: Personal;
  private _token: string;
  private _usuario: Usuario;
  private _role: Role;

  datosToken:string;

  constructor(private http: HttpClient) {
    

   }
  
  public get personal(): Personal{
    if(this._personal != null){
      return this._personal;
    }else if(this._personal == null && sessionStorage.getItem('personal') != null){

      this._personal = JSON.parse(sessionStorage.getItem('personal')) as Personal;
      return this._personal;
    }
    /*si no existe en ningun lado, regresamos un usuario con atributos vacios */
    return new Personal();
  }

  public get usuario(): Usuario{
    if(this._usuario != null){
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario') != null){

      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    /*si no existe en ningun lado, regresamos un usuario con atributos vacios */
    return new Usuario();
  }

  public get token(): string{
    if(this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token') != null){

      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  /*va retornar la respuesta que contiene el token de acceso y todos los datos del
  JSON que nos genera el endpoint cuando nos autenticamos en spring con OAuth2 */
  login(personal:Personal):Observable<any>{

    const urlEndpoint = 'http://localhost:8080/oauth/token';

    /*credenciales de la aplicacion, de la aplicacion angular que seria el clienteId hospital-app
    concatenado con : y la clave del cliente(de la aplicacion), btoa, permite encriptar, convertir en base64*/
    const credenciales=btoa('angularapp'+":"+'12345'); 

    /*por su constructor se va pasar las cabecerasm, que es un objeto con atributos por eso va en {}.
    content-type, es importante ya que tiene que ser del tipo form-urlencoded*/
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization':'Basic '+ credenciales});

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',personal.username);
    params.set('password',personal.password);

    console.log(params.toString());

    /*se va retornar la respuesta que se obtiene del backend atraves de una 
    peticion httpRequest del tipo post, para ello se necesita el objeto httpClient.
    DEntro de post(), se requiere una url, el endpoint, al cual se va enviar los 
    datos para autenticarlos; los parametros a enviar; finalmente la cabecera http*/
    return this.http.post(urlEndpoint, params.toString(), {headers:httpHeaders});
  }

  guardarToken(access_token: string):void {
    this._token = access_token;
    sessionStorage.setItem('token',this._token);
  }
  
  guardarPersonal(access_token: string):void {
    let payload = this.obtenerDatosToken(access_token);
    this._personal = new Personal();
    this._personal.per_nombre = payload.nombre;
    this._personal.per_ape_paterno = payload.apellido_paterno;
    this._personal.per_ape_materno = payload.apellido_materno;
    this._personal.per_dni = payload.dni;
    this._personal.username = payload.user_name;
    this._personal.roles = payload.authorities;

    sessionStorage.setItem('personal',JSON.stringify(this._personal) );
  }

  
  guardarUsuario(access_token: string):void {
    let payload = this.obtenerDatosToken(access_token);
    this._usuario = new Usuario();
    this._usuario.usu_codigo = payload.cod_user;
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario) );
  }

  obtenerDatosToken(accessToken: string):any{
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  /*verificar si el usuario ya esta autenticado */
  isAuthenticated(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    /**payload.user_name, si existe */
    if(payload != null && payload.user_name && payload.user_name.length>0){

      return true;
     
    }
    return false;
    
  }

  hasRole(role: string):boolean{
    /*usuario, seria el get. roles, es un arreglo en javascript que tiene el metodo include
    que permite validar si existe algun elemento dentro de ese arreglo*/
    if(this.personal.roles.includes(role)){
      return true;
    }
    return false;
  }

  logout():void{
    this._token = null;
    this._personal = null;
    /*una forma de borrar todo*/
    sessionStorage.clear();
    /*otra forma, de borrar por separado*/
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');

  }


}
