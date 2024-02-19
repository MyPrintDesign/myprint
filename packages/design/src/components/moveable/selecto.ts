import Selecto from "selecto";
import {Ref, ref} from "vue";

export const selecto = ref() as Ref<Selecto>;

export function initSelecto() {
    // console.log(selecto.value)
    if (!selecto.value) {
        // console.log('销毁selecto')
        // selecto.value.destroy()
        console.log('初始化selecto')
        selecto.value = new Selecto({
            // The container to add a selection element
            container: document.querySelector('.design-panel-container-width') as HTMLElement,
            // Selecto's root container (No transformed container. (default: null)
            rootContainer: null,
            // The area to drag selection element (default: container)
            // dragContainer: Element,
            // Targets to select. You can register a queryselector or an Element.
            // selectableTargets: [".design-select"],
            // Whether to select by click (default: true)
            selectByClick: true,
            // Whether to select from the target inside (default: true)
            selectFromInside: false,
            // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
            // continueSelect: false,
            // Determines which key to continue selecting the next target via keydown and keyup.
            // toggleContinueSelect: "shift",
            // The container for keydown and keyup events
            // keyContainer: window,
            // The rate at which the target overlaps the drag area to be selected. (default: 100)
            hitRate: 0,
            ratio: 0,
        })
    }

}
