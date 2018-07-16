import { debounceTime } from "rxjs/operators";
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";

export class QuotesInfiniteLoad {
    private html: HTMLElement = document.documentElement;
    private canBeLoaded = true;
    private percentBeforeLoad = 100;
    private pageNumber = 1000;
    private callback: (str: string) => any = () => {};
    private subj: Subject<boolean> = new Subject<boolean>();

    private get ratio(): number {
        return this.html.scrollTop - this.html.scrollTop * this.percentBeforeLoad / 100;
    }

    constructor(source: { percentBeforeLoad: number, pageNumber: number, callback: (str: string) => any }) {
        this.percentBeforeLoad = source.percentBeforeLoad;
        this.callback = source.callback;
    }

    private handler(): void {
        if (!this.canBeLoaded) {
            return;
        }

        this.subj.next(true);

        if (this.html.scrollTop + this.ratio >= this.html.scrollHeight - this.html.clientHeight) {
            this.canBeLoaded = false;
            this.subj.next(false);

            setTimeout(() => {
                this.getQuotes()
                    .then(this.callback)
                    .then(() => this.canBeLoaded = true);
            }, 3000)


        }

    }

    private getQuotes(): Promise<string> {
        const url = `https://bash.im/index/${--this.pageNumber}`;
        const headers: Headers = new Headers();

        headers.append('Content-Type', 'text/html');
        headers.append('Accept-Charset', 'windows-1251');
        headers.append('Accept-Language', 'ru-RU');

        const request: Request = new Request({ method: 'GET', headers } as any);

        const dec: TextDecoder = new TextDecoder('windows-1251');

        return this.fetch(url, request)
            .then(res => {
                return res.arrayBuffer();
            })
            .then(arrayBuffer => {
                const bufView: Uint8Array = new Uint8Array(arrayBuffer);

                return dec.decode(new Uint8Array(bufView));
            })
    }

    private handleError(err: any) {
        console.error(err);
    }

    private fetch(url: string, request: Request): Promise<any> {
        return fetch(url, request)
            .then((response: Response) => {
                const resp: any = response;
                if (response.status >= 200 && response.status < 300) {
                    return Promise.resolve(response)
                } else {
                    const error = new Error(resp.statusText || resp.status);
                    error['response'] = response;
                    return Promise.reject(error)
                }
            })
            .catch(this.handleError);
    }


    public initScrollEvent(): Observable<boolean> {
        fromEvent(window, 'scroll')
            .pipe(debounceTime(200))
            .subscribe(this.handler.bind(this));

        return this.subj.asObservable();
    }
}

