import { defineStore } from 'pinia';
import { printCssStyle } from '@myprint/design/utils/utils';
import { useConfigStore } from './config';
import { ClientCmd, ClientResult, Printer } from '@myprint/design/types/entity';

let lockReconnect: any;
export const useSocket = defineStore('myPrintSocket', {
    state: () => {
        return {
            socket: undefined as any,
            timer: undefined as any,
            connect: false,
            printerList: [] as Printer[],
            resolveMap: {}
        };
    },
    actions: {
        INIT_SOCKET() {
            // console.log(onSocketMessage)
            // console.log('初始化INIT_SOCKET')
            let stateThis = this;
            const reconnect = () => {
                if (lockReconnect) return;
                lockReconnect = true;
                // clearTimeout(timer);
                stateThis.timer = setTimeout(() => {
                    createSocket();
                    lockReconnect = false;
                }, 4000);
            };
            const onMessage = (msgData: ClientResult) => {
                // 遍历onMessage集合并触发
                if (this.resolveMap[msgData.taskId]) {
                    this.resolveMap[msgData.taskId](msgData);
                    delete this.resolveMap[msgData.taskId];
                }
            };

            const init = () => {
                this.socket!.onopen = function(_event: any) {
                    // console.log('WebSocket:已连接');
                    //心跳检测重置
                    stateThis.connect = true;
                    // app.SET_CLIENT_CONNECT(true)
                    heartCheck.reset().start();
                    // 发送css样式过去
                    stateThis.socket!.send(JSON.stringify({
                        options: { css: printCssStyle() },
                        cmd: 'text/css'
                    } as ClientCmd));
                };

                //接收到消息的回调方法
                this.socket!.onmessage = function(event: any) {
                    const clientResult = JSON.parse(event.data) as ClientResult;
                    switch (clientResult.cmd) {
                        case 'printerList':
                            stateThis.printerList = (clientResult.data as any[]).map(res => (res));
                            onMessage(clientResult);
                            break;
                        case 'printResult':
                            onMessage(clientResult);
                            break;
                        case 'generatePdfResult':
                            onMessage(clientResult);
                            break;
                        case 'pong':
                            break;
                    }
                    heartCheck.reset().start();
                };

                //连接发生错误的回调方法
                this.socket!.onerror = function(_event: any) {
                    // console.log("WebSocket:发生错误");
                    stateThis.connect = false;
                    // app.SET_CLIENT_CONNECT(false)
                    reconnect();
                };

                //连接关闭的回调方法
                this.socket!.onclose = function(_event: any) {
                    // console.log("WebSocket:已关闭");
                    heartCheck.reset();//心跳检测
                    stateThis.connect = false;
                    // app.SET_CLIENT_CONNECT(false)
                    reconnect();
                };

                //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                window.onbeforeunload = function() {
                    // app.SET_CLIENT_CONNECT(false)
                    stateThis.connect = false;
                    stateThis.socket!.close();
                };
            };

            const createSocket = () => {
                try {
                    // console.log(this)
                    // console.log(stateThis)
                    stateThis.socket = new WebSocket(useConfigStore().clientUrl.replace('https', 'ws').replace('http', 'ws'));
                    init();
                } catch (e) {
                    reconnect();
                }
            };

            const heartCheck = {
                timeout: 5000,
                timeoutObj: setTimeout(() => {
                }),
                serverTimeoutObj: setInterval(() => {
                }),
                reset: function() {
                    clearTimeout(this.timeoutObj);
                    clearTimeout(this.serverTimeoutObj);
                    return this;
                },
                start: function() {
                    const self = this;
                    clearTimeout(this.timeoutObj);
                    clearTimeout(this.serverTimeoutObj);
                    this.timeoutObj = setTimeout(function() {
                        //这里发送一个心跳，后端收到后，返回一个心跳消息，
                        //onmessage拿到返回的心跳就说明连接正常
                        stateThis.socket!.send(JSON.stringify({
                            'cmd': 'ping'
                        }));
                        // console.log('ping');
                        self.serverTimeoutObj = setTimeout(function() { // 如果超过一定时间还没重置，说明后端主动断开了
                            // console.log('关闭服务');
                            stateThis.socket!.close();//如果onclose会执行reconnect，我们执行 websocket.close()就行了.如果直接执行 reconnect 会触发onclose导致重连两次
                        }, self.timeout);
                    }, this.timeout);
                }
            };

            createSocket();
        },
        SET_PRINTER_LIST(list: Printer[]) {
            this.printerList = list;
        },
        SEND(taskId: string, msg: any) {
            return new Promise<ClientResult>((resolve, _reject) => {
                this.resolveMap[taskId] = resolve;
                this.socket!.send(msg);
            });
        }
    }
});
