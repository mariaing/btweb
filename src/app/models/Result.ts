export class Result<T>{
    public IsOk: boolean;
    public Mensaje: string;
    public Data: T;

    constructor() { }
}