import * as $ from 'jquery';

export enum EBashMessage {
    getBashQuotes = 'getBashQuotes',
    parseBashQuotes = 'parseBashQuotes'
}

export interface IBashExtMessage {
    messageType: EBashMessage;
    messageContent?: any
}

$(function() {
    $('#popup-btn').on('click', () => {
        sendMes();
    });
});
function sendMes(): void {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){

        const activeTab = tabs[0];

        const msg: IBashExtMessage = {
            messageType: EBashMessage.getBashQuotes,
        };

        chrome.tabs.sendMessage(activeTab.id, msg, (response) => {
            console.log(response);
        });

        console.log('message was sent');
    });
}