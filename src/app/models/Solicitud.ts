import { Empleado } from './Empleado';

export class Solicitud {

    public id: number;
    public id_servicio: number;
    public peticion: string;
    public estado: number;
    public estado_texto: string;
    public fecha: Date;
    public id_empleado: number;
    public empleado: Empleado;
    public nombre_cliente: string;
    public nombre_empleado: string;
    public identificacion_empleado: string;
    constructor() { }
}
