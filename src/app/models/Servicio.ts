export class Servicio {
    public id: number;
    public nombreEmpleado: string;
    public nombreEmpresa: string;
    public id_empleado: number;
    public id_empresa: number;
    public latitud: string;
    public longitud: string;
    public fecha: Date;
    public date: any;
    public duracion: number;
    public observacion: string;
    public actividad: string;
    public estado: number;
    public estadoTexto: string;
    public hora: number;
    public minutos: number;

    public IsValid() {

        if (this.actividad === undefined) {
            return { response: false, mensaje: 'Debe definir una actividad' };
        }

        if (this.actividad === '') {
            return { response: false, mensaje: 'Debe definir una actividad' };
        }

        return { response: true, mensaje: '' };
    }
}