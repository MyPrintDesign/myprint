import {parse, stringify} from "@cp-print/design/utils/utils";
import {unit2px, px2unit} from "@cp-print/design/utils/devicePixelRatio";
import {nextTick, reactive,Ref} from "vue";
import {FormatterVariable, Panel, PreviewWrapper, RuntimeElementOption} from "@cp-print/design/types/entity";
import {copyElementRefValueId, formatter, getCurrentPanel, initElement} from "@cp-print/design/utils/elementUtil";
import numberUtil from "@cp-print/design/utils/numberUtil";

export async function autoPage(pageList: Array<Panel>, previewContent: Ref<HTMLDivElement[]|undefined>, itemRefs: any, previewData: Ref<any>) {
    // console.log(itemRefs)

    const data = {
        panel: getCurrentPanel(),
        currentPage: {} as any,
        top: 0,
        bottom: getCurrentPanel().height // 单位 mm
    }

    const variable = {
        pageIndex: 0,
        pageSize: 0,
        nowDate: new Date()
    } as FormatterVariable

    // 找table
    await newPage()

    // 处理elementWrapper
    const previewElementList = data.panel.elementList!.map(v => {
        return {element: copyElementRefValueId(v)} as PreviewWrapper
    })

    // 排序
    previewElementList.sort((o1, o2) => {
        return o1.element!.y! - o2.element!.y!
    })

    // 初始化element offsetTop
    let offsetLastElementTop = 0

    for (let previewWrapper of previewElementList) {
        previewWrapper.offsetLastElementTop = numberUtil.subScale(previewWrapper.element!.y, offsetLastElementTop)
        offsetLastElementTop = numberUtil.sumScale(previewWrapper.element!.y, previewWrapper.element!.height)
        // console.log(previewWrapper.element.y, offsetLastElementTop, previewWrapper.element.label, previewWrapper)
    }

    let previewContext = {
        elementChangeHeightIs: false,
        lastPreviewWrapper: undefined as PreviewWrapper | undefined
    }

    for (let i = 0; i < previewElementList.length; i++) {
        const previewWrapper = previewElementList[i];
        let element = previewWrapper.element!

        // 计算顶部需不需要偏移
        if (element.label == '文本1112') {
            console.log(element.y)
        }
        // console.log(data.currentPage.offsetTop, previewWrapper.offsetLastElementTop)
        if (data.currentPage!.offsetTop > 0) {
            if (previewContext.elementChangeHeightIs) {
                element.y = numberUtil.sumScale(data.currentPage!.offsetTop, previewWrapper.offsetLastElementTop)
            } else {
                if (previewContext.lastPreviewWrapper) {
                    element.y = previewContext.lastPreviewWrapper.element!.y! + previewContext.lastPreviewWrapper.element!.height + previewWrapper.offsetLastElementTop
                }
            }
        }

        // 判断需不需要分页
        if (data.currentPage!.elementList!.length > 0 && (await isNeedNewPage(element.y, data.bottom) || await isNeedNewPage(element.y! + element.height, data.bottom))) {
            element.y = 1
            data.currentPage!.offsetTop = 1
        }

        previewContext.elementChangeHeightIs = false

        if (element.type == 'HorizontalLine' || element.type == 'VerticalLine'
            || element.type == 'DottedHorizontalLine' || element.type == 'DottedVerticalLine'
            || element.type == 'Rect') {
            data.currentPage!.elementList!.push(previewWrapper);
            await nextTick()
        } else {
            // 需要data
            let previewDataTmp: any

            if (element.field) {
                previewDataTmp = previewData.value[element.field]
            }

            if (!previewDataTmp) {
                previewDataTmp = formatter(element, variable)
            }

            if (!previewDataTmp) {
                previewDataTmp = element.data
            }

            if (!previewDataTmp) {
                continue
            }
            if (element.type == 'Image') {
                element.data = previewDataTmp
                data.currentPage!.elementList!.push(previewWrapper);
                await nextTick()
            } else if (element.type == 'Text' || element.type == 'PageNum' || element.type == 'TextTime') {
                if (element.contentType == 'Text') {
                    previewContext.elementChangeHeightIs = await autoTextElement(previewWrapper, previewDataTmp)
                }
                if (element.contentType == 'QrCode') {
                    data.currentPage!.elementList!.push(previewWrapper);
                    await nextTick()
                }
                if (element.contentType == 'Barcode') {
                    data.currentPage!.elementList!.push(previewWrapper);
                    await nextTick()
                }
            } else if (element.type == 'Table') {
                element.runtimeOption = parse(stringify(element.runtimeOption, 'parent'), {} as RuntimeElementOption)
                element.runtimeOption.rowList = reactive([])
                previewContext.elementChangeHeightIs = (await autoTableRow(previewWrapper, previewDataTmp, 0))!
            }
        }

        if (previewContext.elementChangeHeightIs) {
            // 重新计算顶部偏移
            data.currentPage!.offsetTop = await computeBottom(previewWrapper)
            console.log("顶部偏移" + data.currentPage!.offsetTop)
        }

        previewContext.lastPreviewWrapper = previewWrapper
    }

    async function autoTextElement(previewWrapper: PreviewWrapper, previewData: string) {
        // let previewWrapper = {element: element} as PreviewWrapper
        let element = previewWrapper.element!
        element.data = previewData
        data.currentPage!.elementList!.push(previewWrapper);
        await nextTick()
        console.log(previewData)

        const height = itemRefs[previewWrapper.element!.id].$el.clientHeight;
        // const height = itemRefs[previewWrapper.element.id].clientHeight;
        console.log(height)
        if (previewWrapper.element!.y! + px2unit(height) < data.bottom) {
            return false
        } else {
            console.log(element)
        }

        let mid = await binary_search(previewWrapper, previewData, 1, previewData.length)
        console.log(mid)

        if (mid > 0 && mid < previewData.length) {
            console.log('文本分页')
            await newPage()
            element = copyElementRefValueId(element)
            previewWrapper.element = element
            element.y = data.top
            // console.log(element)
            await autoTextElement(previewWrapper, previewData.substring(mid + 1, previewData.length))
            return true
            // data.currentPage.offsetTop = computeBottom({element: element} as PreviewWrapper)
        }

        return false
    }

    async function autoTableRow(previewWrapper: PreviewWrapper, previewData: Array<any>, index: number) {
        // console.log(data)
        // let previewWrapper = {element: element}
        data.currentPage!.elementList!.push(previewWrapper);
        let element = previewWrapper.element!
        await nextTick()
        const table = itemRefs[element.id]
        // console.log(table)
        if (!table) {
            return
        }

        let isNewPage = false
        for (let i = index; i < previewData.length; i++) {
            const datum = previewData[i]
            if (!datum['autoIncrement']) {
                datum['autoIncrement'] = i + 1
                // console.log(i + 1)
            }
            const rowList = []
            for (let j = 0; j < element.columnList!.length; j++) {
                initElement(element.columnList![j], j)
                element.columnList![j].data = datum[element.columnList![j].field!]
                rowList.push(copyElementRefValueId(element.columnList![j]))
            }
            element.runtimeOption.rowList!.push(rowList)
            await nextTick()
            // console.log(table.height())
            // console.log(mm2px(element.y) + table.$el.clientHeight, mm2px(data.bottom))
            if (await isNeedNewPage(unit2px(element.y) + table.$el.clientHeight, unit2px(data.bottom))) {
                // 删除刚才创建的
                // console.log(element.runtimeOption.rowList)
                element.runtimeOption.rowList!.pop()
                element = copyElementRefValueId(element)
                previewWrapper.element = element
                element.runtimeOption = parse(stringify(element.runtimeOption, 'parent'), {} as RuntimeElementOption)
                element.runtimeOption.rowList = reactive([])
                element.y = data.top + 1
                await autoTableRow(previewWrapper, previewData, i)
                isNewPage = true
                // data.currentPage.offsetTop = await computeBottom({element: element} as PreviewWrapper)
                break
            }
        }

        return isNewPage
    }

    /**
     * 单位 px
     */
    async function isNeedNewPage(y: number | undefined, bottom: number | undefined, callback?: () => void) {
        if (y! > bottom!) {
            if (callback) {
                callback()
            }
            await newPage()
            return true
        }
        return false
    }

    async function newPage() {
        data.currentPage = reactive({
            id: crypto.randomUUID(),
            width: data.panel.width,
            height: data.panel.height,
            offsetTop: 0,
            elementList: []
        } as any)
        pageList.push(data.currentPage!)
        // 处理页头，页脚
        await nextTick()
        getPanelDiv()

        if (data.panel.pageHeader) {
            let preview = {element: data.panel.pageHeader} as PreviewWrapper
            data.currentPage!.elementList!.push(preview)
            data.top = (await computeBottom(preview))!
        }
        if (data.panel.pageFooter) {
            let preview = {element: data.panel.pageFooter} as PreviewWrapper
            data.currentPage!.elementList!.push(preview)
            data.bottom = (await computeTop(preview))!
        }
    }

    async function computeBottom(previewWrapper: PreviewWrapper) {
        await nextTick()
        if (!itemRefs[previewWrapper.element!.id]) {
            return
        }
        const div = itemRefs[previewWrapper.element!.id].$el as HTMLDivElement
        return numberUtil.toFixed(px2unit(numberUtil.sumScale(div.offsetTop, div.offsetHeight)))
    }

    async function computeTop(previewWrapper: PreviewWrapper) {
        await nextTick()
        if (!itemRefs[previewWrapper.element!.id]) {
            return
        }
        const div = itemRefs[previewWrapper.element!.id].$el as HTMLDivElement
        console.log(div.offsetTop)
        return numberUtil.toFixed(px2unit(div.offsetTop))
    }

    async function computeTextHeight(previewWrapper: PreviewWrapper, previewDataTmp: any) {
        previewWrapper.element!.data = previewDataTmp
        await nextTick()
        const itemRef = itemRefs[previewWrapper.element!.id];
        // console.log(div)
        if (!itemRef) {
            debugger
            console.log(itemRef)
            return
        }
        const height = itemRefs[previewWrapper.element!.id].$el.clientHeight;
        // const height = itemRefs[previewWrapper.element.id].clientHeight;
        return previewWrapper.element!.y! + px2unit(height) < data.bottom;
    }

    async function binary_search(previewWrapper: PreviewWrapper, previewData: string, low: number, height: number): Promise<any> {
        if (low > height) {
            // console.log("low > height")
            return -1;
        }
        const mid = Math.floor((height + low) / 2);
        let isH = await computeTextHeight(previewWrapper, previewData.substring(0, mid + 2))
        let isL = await computeTextHeight(previewWrapper, previewData.substring(0, mid + 1))
        // console.log(data.substring(0, mid + 1))
        // console.log(mid)
        // if (!isH && !isL) {
        //   return -1
        // }
        if (isL && !isH) {
            console.log('返回')
            return mid;
        } else if (!isH) {
            height = mid - 1;
            console.log("减少", height)
            return binary_search(previewWrapper, previewData, low, height);
        } else if (isL) {
            low = mid + 1;
            console.log("增加", low)
            return binary_search(previewWrapper, previewData, low, height);
        } else {
            return -1
        }
    }

    function getPanelDiv() {
        return previewContent.value![previewContent.value!.length - 1]
    }
}



