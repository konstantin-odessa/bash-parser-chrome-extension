import * as $ from "jquery";
import {IBashQuote} from "./background";

export class TemplateGenerator {
    private container: JQuery<HTMLElement> = $('<div/>').addClass('movies-list__container');
    private menuList: JQuery<HTMLElement> = $('<ul/>').addClass('movies-list__wrapper');
    private picPos = 200;

    constructor() {
        this.generateTemplate();
    }

    private generateTemplate(): void {
        const listTitle: JQuery<HTMLElement> = $('<h1/>')
            .addClass('movies-list__title')
            .text('Bash quotes');

        this.container.append(listTitle);
        this.container.append(this.menuList);
    }

    public getContainer(): JQuery<HTMLElement> {
        return this.container;
    }

    public getMenu(): JQuery<HTMLElement> {
        return this.menuList;
    }

    public appendMenuItem(data: IBashQuote): void {
        const menuItem: JQuery<HTMLElement> = $('<li/>').addClass('movies-list__item');

        const itemTitle = $('<span/>')
            .addClass('movie-item__title')
            .text(data.rating);

        menuItem.append(itemTitle);


        const pic: JQuery<HTMLElement> = $('<img/>')
            .addClass('quote-pic');
        const index: number = this.picPos + this.menuList.children().length;
        pic.attr('src', `https://picsum.photos/400/${index}`);

        menuItem.append(pic);

        const quoteContent = $('<div/>')
            .addClass('bash-quote__content')
            .html(data.text);

        menuItem.append(quoteContent);

        this.menuList.append(menuItem);
    }
}
