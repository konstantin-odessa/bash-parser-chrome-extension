export class Spinner {
    private container: JQuery<HTMLElement>;
    private spinner: JQuery<HTMLElement> = $('<div/>').addClass('loader');

    constructor(container: JQuery<HTMLElement>) {
        this.container = container;
    }

    public addLoader(): void {
        this.container.append(this.spinner)
    }
    public removeLoader(): void {
        this.container.find('.loader').remove();
    }
}
