import * as $ from 'jquery';
import MessageSender = chrome.runtime.MessageSender;
import { EBashMessage, IBashExtMessage } from "./popup";
import { Observable } from "rxjs/internal/Observable";
import {ReplaySubject} from "rxjs/internal/ReplaySubject";
import {TemplateGenerator} from "./template-generator";
import {QuotesInfiniteLoad} from "./quotes-infinite-load";
import {Spinner} from "./spinner";

const subj: ReplaySubject<any> = new ReplaySubject(1);
const obs: Observable<any> = subj.asObservable();

const templateObj: TemplateGenerator = new TemplateGenerator();

$(() => {
    $(document.body).append(templateObj.getContainer());
});

chrome.runtime.onMessage
    .addListener(
        (msg: IBashExtMessage, sender: MessageSender, response) => {
            if (msg.messageType !== EBashMessage.getBashQuotes) {
                return;
            }

            sendHTML(document.body.innerHTML);


            replaceQuotes();

            const infQuotesLoader: QuotesInfiniteLoad = new QuotesInfiniteLoad({
                percentBeforeLoad: 70,
                pageNumber: +$('input.page').first().val(),
                callback: sendHTML
            });

            const scrollObs: Observable<any> = infQuotesLoader.initScrollEvent();

            scrollObs.subscribe((state: boolean) => {
                const spinner: Spinner = new Spinner(templateObj.getContainer());

                if (state) {
                    console.log('removed');
                    spinner.removeLoader();
                } else {
                    console.log('added');
                    spinner.addLoader();
                }
            })
        });

obs
    .subscribe((data) => {
        console.log('sending message to background');

        chrome.runtime.sendMessage({
            messageType: EBashMessage.parseBashQuotes,
            messageContent: data
        },
            (quotes) => {

                for (const quote of quotes) {
                    templateObj.appendMenuItem(quote);
                }
            });
    });

function replaceQuotes(): void {
    $('.quote').remove();
    $('.pager').first().append(templateObj.getContainer());
}

function sendHTML(bodyStr: string): void {
    const bodyHTML: JQuery<HTMLElement> = $('<div/>').html(bodyStr);
    const quotes: JQuery<HTMLElement> = bodyHTML.find('.quote');

    const wrapper: JQuery<HTMLElement> = $('<div/>');

    quotes.appendTo(wrapper);

    subj.next(wrapper.html());
}