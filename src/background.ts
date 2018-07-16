import {EBashMessage, IBashExtMessage} from "./popup";
import MessageSender = chrome.runtime.MessageSender;
import * as $ from "jquery";

export interface IBashQuote {
    text: string;
    rating: string;
    date: string;
}

console.log('background is working');

let quotes: IBashQuote[] = [];

chrome.runtime.onMessage
    .addListener(
        (msg: IBashExtMessage, sender: MessageSender, response) => {
            console.log('background has gotten message');

            if (msg.messageType !== EBashMessage.parseBashQuotes) {
                return;
            }

            parseQuotes(msg.messageContent);

            response(quotes);
        });

function parseQuotes(serializedDOMContent: string) {

    quotes = [];

    const $div: JQuery<HTMLElement> = $('<div/>').html(serializedDOMContent);
    const $quotes: HTMLElement[] = $div.find('.quote').toArray();


    $quotes.forEach((quote: HTMLElement) => {
        const text: string = $(quote).find('.text').text();
        const date: string = $(quote).find('.date').html();
        const rating: string = $(quote).find('.rating').text();

        quotes.push({ text, date, rating });
    });

}

