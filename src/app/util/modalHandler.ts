declare var Foundation;
declare var jQuery: any;
declare var $;

export class ModalHandler {
    name: string;
    id: string;

    onOpen?: any;
    onClose?: any;

    constructor(name: string, onOpen?: any, onClose?: any) {
        this.name = name;
        this.id = '#' + this.name;

        const modal = $(this.id);
        const found = new Foundation.Reveal(modal);

        modal.on('open.zf.reveal', () => {
            setTimeout(() => { if (typeof onOpen !== 'undefined') { onOpen(modal); } }, 300);
        });

        modal.on('closed.zf.reveal', () => {
            if (typeof onClose === 'function') { onClose(modal); }
        });
    }

    Show() {
        $(this.id).foundation('open');
    }

    Hide() {
        $(this.id).foundation('close');
    }
}
