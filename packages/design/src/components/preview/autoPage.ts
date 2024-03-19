import {parse, stringify} from "@myprint/design/utils/utils";
import {px2unit, unit2px} from "@myprint/design/utils/devicePixelRatio";
import {nextTick, reactive, Ref} from "vue";
import {MyElement, FormatterVariable, Panel, PreviewWrapper, RuntimeElementOption} from "@myprint/design/types/entity";
import {copyElementRefValueId, formatter, getCurrentPanel} from "@myprint/design/utils/elementUtil";
import numberUtil from "@myprint/design/utils/numberUtil";

interface PreviewContext {
    elementChangeHeightIs: boolean,
    currentPreview: PreviewWrapper
}

export async function autoPage(pageList: Array<Panel>, previewContent: Ref<HTMLDivElement[] | undefined>, itemRefs: any, previewData: Ref<any>) {
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
        return copyElementRefValueId(v) as PreviewWrapper
    })

    // 排序
    previewElementList.sort((o1, o2) => {
        return o1.y - o2.y
    })

    // 初始化element offsetTop
    let offsetLastElementTop = 0

    for (let previewWrapper of previewElementList) {
        previewWrapper.offsetLastElementTop = numberUtil.subScale(previewWrapper.y, offsetLastElementTop)
        offsetLastElementTop = numberUtil.sumScale(previewWrapper.y, previewWrapper.height)
        // console.log(previewWrapper.element.y, offsetLastElementTop, previewWrapper.element.label, previewWrapper)
    }

    let previewContext = {
        elementChangeHeightIs: false,
        currentPreview: undefined!
    } as PreviewContext

    for (let i = 0; i < previewElementList.length; i++) {
        const previewWrapper = previewElementList[i];

        // 计算顶部需不需要偏移
        if (previewWrapper.label == '文本1112') {
            console.log(previewWrapper.y)
        }
        if (data.currentPage.offsetTop > 0) {
            if (previewContext.elementChangeHeightIs) {
                previewWrapper.y = numberUtil.sumScale(data.currentPage.offsetTop, previewWrapper.offsetLastElementTop)
            } else {
                if (previewContext.currentPreview) {
                    previewWrapper.y = previewContext.currentPreview.y + previewContext.currentPreview.height + previewWrapper.offsetLastElementTop
                }
            }
        }

        // 判断需不需要分页
        if (data.currentPage.elementList.length > 0 && (await isNeedNewPage(previewWrapper.y, data.bottom) || await isNeedNewPage(previewWrapper.y + previewWrapper.height, data.bottom))) {
            previewWrapper.y = 1
            data.currentPage!.offsetTop = 1
        }

        previewContext.elementChangeHeightIs = false
        previewContext.currentPreview = previewWrapper

        // 需要data
        let previewDataTmp: any

        if (previewWrapper.field) {
            previewDataTmp = previewData.value[previewWrapper.field]
        }

        if (!previewDataTmp) {
            previewDataTmp = formatter(previewWrapper, variable)
        }

        if (!previewDataTmp) {
            previewDataTmp = previewWrapper.data
        }

        if (previewWrapper.type == 'Image') {
            previewWrapper.data = previewDataTmp
            data.currentPage.elementList.push(previewWrapper);
            await nextTick()
        } else if (previewWrapper.type == 'Text' || previewWrapper.type == 'PageNum' || previewWrapper.type == 'TextTime') {
            if (previewWrapper.contentType == 'Text') {
                previewContext.elementChangeHeightIs = await autoTextElement(previewContext, previewDataTmp, true)
            }
            if (previewWrapper.contentType == 'QrCode') {
                data.currentPage.elementList.push(previewWrapper);
                await nextTick()
            }
            if (previewWrapper.contentType == 'Barcode') {
                data.currentPage.elementList.push(previewWrapper);
                await nextTick()
            }
        } else if (previewWrapper.type == 'DataTable') {
            previewWrapper.runtimeOption = parse(stringify(previewWrapper.runtimeOption, 'parent', 'target'), {} as RuntimeElementOption)
            previewContext.elementChangeHeightIs = await autoTableRow(previewContext, previewDataTmp, 0)
        } else if (previewWrapper.type == 'Container') {
            // element.runtimeOption = parse(stringify(element.runtimeOption, 'parent', 'target'), {} as RuntimeElementOption)
            // previewContext.elementChangeHeightIs = await autoTableRow(previewWrapper, previewDataTmp, 0)
            console.log(previewWrapper)
            data.currentPage.elementList.push(previewWrapper);
        } else {
            // console.log(previewWrapper)
            data.currentPage.elementList.push(previewWrapper);
        }

        if (previewContext.elementChangeHeightIs) {
            // 重新计算顶部偏移
            data.currentPage.offsetTop = await computeBottom(previewWrapper)
            console.log("顶部偏移" + data.currentPage.offsetTop)
        }

        previewContext.currentPreview = previewWrapper
    }

    async function autoTextElement(previewContext: PreviewContext, previewData: string, first: boolean) {
        let previewWrapper = previewContext.currentPreview
        previewWrapper.data = previewData
        previewWrapper.heightIs = false
        data.currentPage.elementList.push(previewWrapper);
        await nextTick()
        // console.log(previewData)

        const height = itemRefs[previewWrapper.id].$el.clientHeight;

        // console.log(previewWrapper.previewWrapper.id, height, previewWrapper.previewWrapper.runtimeOption.height)
        if (first && height < previewWrapper.runtimeOption.height) {
            previewWrapper.heightIs = true
            console.log('小')
            return false
        } else {
            // console.log('大')
            // previewWrapper.previewWrapper.previewRuntimeOption.heightIs = false
        }

        // console.log(height)
        if (previewWrapper.y! + px2unit(height) < data.bottom) {
            return false
        } else {
            // console.log(previewWrapper)
        }

        let mid = await binary_search(previewWrapper, previewData, 1, previewData.length)
        // console.log(mid)

        if (mid > 0 && mid < previewData.length) {
            console.log('文本分页')
            await newPage()
            previewContext.currentPreview = copyElementRefValueId(previewWrapper)
            // previewWrapper.element = previewWrapper
            previewContext.currentPreview.y = data.top
            // console.log(previewWrapper)
            await autoTextElement(previewContext, previewData.substring(mid + 1, previewData.length), false)
            return true
            // data.currentPage.offsetTop = computeBottom({previewWrapper: previewWrapper} as PreviewWrapper)
        }

        return false
    }

    async function autoTableRow(previewContext: PreviewContext, previewData: Array<any>, index: number) {
        let previewWrapper = previewContext.currentPreview
        // console.log(previewWrapper.option.tableHeightType)
        if (previewWrapper.option.tableHeightType == 'AUTO') {
            previewWrapper.heightIs = false
        }

        data.currentPage.elementList.push(previewWrapper);
        // let previewWrapper = previewWrapper
        await nextTick()
        const table = itemRefs[previewWrapper.id]
        // console.log(table)
        if (!table) {
            return false
        }

        let isNewPage = false

        const bodyList = previewWrapper.bodyList[0]

        for (let i = index; i < previewData.length; i++) {
            const datum = previewData[i]
            if (!datum['autoIncrement']) {
                datum['autoIncrement'] = i + 1
                // console.log(i + 1)
            }
            const rowList: MyElement[] = []
            for (let j = 0; j < bodyList.length; j++) {
                // initElement(previewWrapper.headList[j], j)
                const head = previewWrapper.headList[j]
                // console.log(datum)
                bodyList[j].data = datum[head.field!]
                rowList.push(copyElementRefValueId(bodyList[j]))
            }
            previewWrapper.bodyList.push(rowList)
            await nextTick()
            // console.log(table.height())
            // console.log(mm2px(previewWrapper.y) + table.$el.clientHeight, mm2px(data.bottom))
            if (await isNeedNewPage(unit2px(previewWrapper.y) + table.$el.clientHeight, unit2px(data.bottom))) {
                // 删除刚才创建的
                // console.log(previewWrapper.runtimeOption.rowList)
                previewWrapper.bodyList.pop()
                previewContext.currentPreview = copyElementRefValueId(previewWrapper)
                previewWrapper = previewContext.currentPreview
                previewWrapper.runtimeOption = parse(stringify(previewWrapper.runtimeOption, 'parent'), {} as RuntimeElementOption)
                previewWrapper.bodyList = [bodyList]
                previewWrapper.y = data.top + 1
                await autoTableRow(previewContext, previewData, i)
                isNewPage = true
                // data.currentPage.offsetTop = await computeBottom({previewWrapper: previewWrapper} as PreviewWrapper)
                break
            }
        }

        return isNewPage
    }

    /**
     * 单位 px
     */
    async function isNeedNewPage(y: number | undefined, bottom: number | undefined, callback?: () => void) {
        if (y! > bottom! + 1) {
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
            let preview = data.panel.pageHeader as PreviewWrapper
            data.currentPage!.elementList!.push(preview)
            data.top = (await computeBottom(preview))!
        }
        if (data.panel.pageFooter) {
            let preview = data.panel.pageFooter as PreviewWrapper
            data.currentPage!.elementList!.push(preview)
            data.bottom = (await computeTop(preview))!
        }
    }

    async function computeBottom(previewWrapper: PreviewWrapper) {
        await nextTick()
        if (!itemRefs[previewWrapper.id]) {
            return
        }
        const div = itemRefs[previewWrapper.id].$el as HTMLDivElement
        return numberUtil.toFixed(px2unit(numberUtil.sumScale(div.offsetTop, div.offsetHeight)))
    }

    async function computeTop(previewWrapper: PreviewWrapper) {
        await nextTick()
        if (!itemRefs[previewWrapper.id]) {
            return
        }
        const div = itemRefs[previewWrapper.id].$el as HTMLDivElement
        console.log(div.offsetTop)
        return numberUtil.toFixed(px2unit(div.offsetTop))
    }

    async function computeTextHeight(previewWrapper: PreviewWrapper, previewDataTmp: any) {
        previewWrapper.data = previewDataTmp
        await nextTick()
        const itemRef = itemRefs[previewWrapper.id];
        // console.log(div)
        if (!itemRef) {
            // debugger
            console.log(itemRef)
            return
        }
        const height = itemRefs[previewWrapper.id].$el.clientHeight;
        // const height = itemRefs[previewWrapper.element.id].clientHeight;
        return previewWrapper.y! + px2unit(height) < data.bottom;
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



