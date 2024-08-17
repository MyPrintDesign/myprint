import {
    moveableMoveOffset, moveableResizeOffset,
    removeSelectElement,
    selectAllElement,
    selectTabNext
} from '../plugins/moveable/moveable';
import { redoPanel, undoPanel } from '../utils/historyUtil';
import { mitt } from '../utils/utils';
import { memoryClipboardUtil } from '../utils/memoryClipboardUtil';


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
        // macos
        .subscribe([isCtrlShift, 'z'], () => {
            // console.log('isCtrl+Shift+z 重做')
            redoPanel();
        })
        // win
        .subscribe([isCtrlShift, 'y'], () => {
            // console.log('isCtrl+y 重做')
            redoPanel();
        })
        .subscribe([isCtrl, 'z'], () => {
            // console.log('isCtrl+z 撤销')
            undoPanel();
        })
        .subscribe([isCtrl, 'a'], () => {
            // console.log('isCtrl+a 全选');
            selectAllElement();
        })
        .subscribe([isCtrl, 'c'], () => {
            // console.log('isCtrl+c 复制')
            memoryClipboardUtil.copy()
        })
        .subscribe([isCtrl, 'x'], () => {
            // console.log('isCtrl+c 剪切')
            memoryClipboardUtil.cut()
        })
        .subscribe([isCtrl, 'v'], () => {
            // console.log('isCtrl+v 粘贴')
            memoryClipboardUtil.paste()
        })
        .subscribe([isCtrl, 'd'], () => {
            // console.log('isCtrl+d 副本')
        })
        .subscribe([isCtrl, 's'], () => {
            // console.log('isCtrl+s 保存')
            mitt.emit('saveTemplate', {} as any)
        })

        .subscribe(['Tab'], () => {
            // console.log('Tab切换')
            selectTabNext()
        })

        .subscribe([isCtrlShift, 'ArrowUp'], () => {
            // console.log('ArrowUp')
            moveableResizeOffset(0, -10)
        })
        .subscribe([isCtrlShift, 'ArrowDown'], () => {
            // console.log('ArrowDown')
            moveableResizeOffset(0, 10)
        })
        .subscribe([isCtrlShift, 'ArrowLeft'], () => {
            // console.log('ArrowLeft')
            moveableResizeOffset(-10, 0)
        })
        .subscribe([isCtrlShift, 'ArrowRight'], () => {
            // console.log('ArrowRight')
            moveableResizeOffset(10, 0)
        })

        .subscribe([isShift, 'ArrowUp'], () => {
            // console.log('ArrowUp')
            moveableMoveOffset(0, -10)
        })
        .subscribe([isShift, 'ArrowDown'], () => {
            moveableMoveOffset(0, 10)
        })
        .subscribe([isShift, 'ArrowLeft'], () => {
            moveableMoveOffset(-10, 0)
        })
        .subscribe([isShift, 'ArrowRight'], () => {
            moveableMoveOffset(10, 0)
        })

        .subscribe([isCtrl, 'ArrowUp'], () => {
            moveableResizeOffset(0, -1)
        })
        .subscribe([isCtrl, 'ArrowDown'], () => {
            moveableResizeOffset(0, 1)
        })
        .subscribe([isCtrl, 'ArrowLeft'], () => {
            moveableResizeOffset(-1, 0)
        })
        .subscribe([isCtrl, 'ArrowRight'], () => {
            moveableResizeOffset(1, 0)
        })

        .subscribe(['ArrowUp'], () => {
            moveableMoveOffset(0, -1)
        })
        .subscribe(['ArrowDown'], () => {
            moveableMoveOffset(0, 1)
        })
        .subscribe(['ArrowLeft'], () => {
            moveableMoveOffset(-1, 0)
        })
        .subscribe(['ArrowRight'], () => {
            moveableMoveOffset(1, 0)
        })

        .subscribe([isDelete], () => {
            // console.log('ArrowRight')
            removeSelectElement()
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

    // const length = Object.getOwnPropertyNames(downKeyList).length
    for (let eventListener of eventListeners) {
        const { keys, callback } = eventListener;
        let isTrigger = true;

        // if (length !== keys.length) {
        //     continue
        // }

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

// 兼容macos & win
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
