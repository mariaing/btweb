export class SideMenu {
    public texto: string;
    public link: string;
    public icon: string;

    constructor(tex: string, lnk: string, icon: string) {
        this.texto = tex;
        this.link = lnk;
        this.icon = icon;
    }
}
