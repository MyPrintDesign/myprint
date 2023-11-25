export function clearEventBubble(evt:any) {
    // if (evt.stopPropagation)
    //     evt.stopPropagation();
    // else
    //     evt.cancelBubble = true;
    // if (evt.preventDefault)
    //     evt.preventDefault();
    // else
    //     evt.returnValue = false;
    evt.stopPropagation();

}
