import { selectedElementBatchOperation } from './elementUtil';
import { px2unit } from './devicePixelRatio';

const keyConvert = {
    Ctrl: ['Meta', 'Ctrl']
} as Record<string, Array<string>>;

interface keyListener {
    keys: Array<string | ((event: KeyboardEvent) => boolean)>;
    callback: () => void;
}

const eventListeners: Array<keyListener> = [];
const downKeyList = {} as any;

export function mountedKeyboardEvent() {
    addKeyboardEvent()
        .subscribe([isCtrlShift, 'z'], () => {
            // console.log('isCtrl+Shift+z 重做')
        })
        .subscribe([isCtrl, 'z'], () => {
            // console.log('isCtrl+z 撤销')
        })
        .subscribe([isCtrl, 'a'], () => {
            console.log('isCtrl+a 全选');
            // selectAllElement();
        })
        .subscribe([isCtrl, 'c'], () => {
            // console.log('isCtrl+c 复制')
        })
        .subscribe([isCtrl, 'x'], () => {
            // console.log('isCtrl+c 剪切')
        })
        .subscribe([isCtrl, 'v'], () => {
            // console.log('isCtrl+v 粘贴')
        })
        .subscribe([isCtrl, 'd'], () => {
            // console.log('isCtrl+d 副本')
        })
        .subscribe([isCtrl, 's'], () => {
            // console.log('isCtrl+s 保存')
            // mitt.emit('saveTemplate')
        })

        .subscribe(['Tab'], () => {
            // console.log('Tab切换')
        })
        .subscribe(['ArrowUp'], () => {
            console.log('ArrowUp');
            selectedElementBatchOperation(element => element.height = element.height - px2unit(1));
        })

        .subscribe([isCtrl, 'ArrowUp'], () => {
            console.log('isCtrl+ArrowUp');
            selectedElementBatchOperation(element => element.height = element.height - px2unit(1));
        })
        .subscribe([isCtrl, 'ArrowDown'], () => {
            // console.log('isCtrl+ArrowRight')
            selectedElementBatchOperation(element => element.height = element.height + px2unit(1));
        })
        .subscribe([isCtrl, 'ArrowLeft'], () => {
            // console.log('isCtrl+ArrowRight')
            selectedElementBatchOperation(element => element.width = element.width - px2unit(1));
        })
        .subscribe([isCtrl, 'ArrowRight'], () => {
            // console.log('isCtrl+ArrowRight')
            selectedElementBatchOperation(element => element.width = element.width + px2unit(1));
        })

        .subscribe([isShift, 'ArrowUp'], () => {
            // console.log('ArrowUp')
            selectedElementBatchOperation(element => element.y = element.y! - px2unit(10));
        })
        .subscribe([isShift, 'ArrowDown'], () => {
            // console.log('ArrowDown')
            selectedElementBatchOperation(element => element.y = element.y! + px2unit(10));
        })
        .subscribe([isShift, 'ArrowLeft'], () => {
            // console.log('ArrowLeft')
            selectedElementBatchOperation(element => element.x = element.x! - px2unit(10));
        })
        .subscribe([isShift, 'ArrowRight'], () => {
            // console.log('ArrowRight')
            selectedElementBatchOperation(element => element.x = element.x! + px2unit(10));
        })


        .subscribe(['ArrowUp'], () => {
            // console.log('ArrowUp')
            selectedElementBatchOperation(element => element.y = element.y! - px2unit(1));
        })
        .subscribe(['ArrowDown'], () => {
            // console.log('ArrowDown')
            selectedElementBatchOperation(element => element.y = element.y! + px2unit(1));
        })
        .subscribe(['ArrowLeft'], () => {
            // console.log('ArrowLeft')
            selectedElementBatchOperation(element => element.x = element.x! - px2unit(1));
        })
        .subscribe(['ArrowRight'], () => {
            // console.log('ArrowRight')
            selectedElementBatchOperation(element => element.x = element.x! + px2unit(1));
        })

        .subscribe([isDelete], () => {
            // console.log('ArrowRight')
        });
}

export function unMountedKeyboardEvent() {
    removeKeyboardEvent();
}

export function addKeyboardEvent() {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    const handlers = {
        subscribe(keys: Array<string | ((event: KeyboardEvent) => boolean)>, callback: () => void) {
            eventListeners.push({
                keys,
                callback
            });
            return handlers;
        }
    };
    return handlers;
}

export function removeKeyboardEvent() {
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
}

function keyUp(event: KeyboardEvent) {
    // console.log('up' + convertKey(event.key))
    delete downKeyList[convertKey(event.key)];
    // console.log(downKeyList)
}

function convertKey(key: string) {
    for (let keyConvertKey in keyConvert) {
        let convertList = keyConvert[keyConvertKey];
        if (convertList.includes(key)) {
            return keyConvertKey;
        }
    }
    return key;
}

function keyDown(event: KeyboardEvent) {
    // console.log(convertKey(event.key))
    // downKeyList[convertKey(event.key)] = true
    // console.log(downKeyList)
    // console.log(event.key)
    if ((event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'TEXTAREA') {
        // console.log('This event is triggered by an input or textarea!');
        return;
    }

    for (let eventListener of eventListeners) {
        const { keys, callback } = eventListener;
        let isTrigger = true;
        for (let key of keys) {
            // console.log(key, event.key)
            if (key instanceof Function) {
                if (!key(event)) {
                    isTrigger = false;
                    break;
                }
            } else {
                if (key != event.key) {
                    isTrigger = false;
                    break;
                }
            }

            // if (!downKeyList[key]) {
            //     isTrigger = false
            //     break
            // }
        }
        // console.log(isTrigger)
        if (isTrigger) {
            callback();
            event.preventDefault();
            event.stopPropagation();
            break;
        }
    }


    // if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    //     console.log('Undo shortcut was pressed');
    // }
    // // 重做
    // if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
    //     console.log('Redo shortcut was pressed');
    // }
    // // 方向键
    // if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    //     console.log(`Arrow key was pressed: ${event.key}`);
    // }
}

export function isCtrl(event: KeyboardEvent) {
    return event.ctrlKey || event.metaKey;
}

export function isShift(event: KeyboardEvent) {
    return event.shiftKey;
}

export function isCtrlShift(event: KeyboardEvent) {
    // console.log(event)
    return (event.ctrlKey || event.metaKey) && event.shiftKey;
}

export function isDelete(event: KeyboardEvent) {
    return event.key == 'Backspace';
}
