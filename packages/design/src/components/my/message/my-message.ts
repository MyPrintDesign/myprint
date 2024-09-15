import { App, h, render, VNode } from 'vue-demi';
import MessageView from '@myprint/design/components/my/message/my-message.vue';

let messageNode: VNode = null!;
let handleSuccess: (content: string) => void = null!;
let handleError: (content: string) => void = null!;

export function installMessage(app: App<any>) {
    if (!messageNode) {
        messageNode = h(MessageView, {});
        const container = document.createElement('div');
        messageNode.appContext = app._context;

        render(messageNode, container);

        handleSuccess = messageNode.component!.exposed!.success;
        handleError = messageNode.component!.exposed!.error;

        document.body.appendChild(container.firstElementChild!);
    }
}

export const MyMessage = {
    success(msg: string) {
        handleSuccess(msg);
    },
    error(msg: string) {
        handleError(msg);
    }
};
