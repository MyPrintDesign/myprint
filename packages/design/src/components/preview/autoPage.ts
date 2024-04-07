import { parse, stringify } from '@myprint/design/utils/utils'
import { px2unit, unit2px } from '@myprint/design/utils/devicePixelRatio'
import { nextTick, reactive, Ref } from 'vue'
import {
    MyElement,
    FormatterVariable,
    Panel,
    PreviewWrapper,
    RuntimeElementOption
} from '@myprint/design/types/entity'
import {
    copyPreviewWrapper,
    element2PreviewWrapper,
    formatter,
    getCurrentPanel
} from '@myprint/design/utils/elementUtil'
import numberUtil from '@myprint/design/utils/numberUtil'

interface PreviewContext {
    autoPageIs: boolean,
    currentPreview: PreviewWrapper
    panel: Panel
    pageList: any[]
    currentPage: any
    top: number
    bottom: number
    pagingRepetition: boolean
}

// 退货单里面的审核驳回，如何影响退货通知单呢 ？如果一个退货通知单 有多个退货单
export async function autoPage(pageList: Array<Panel>, previewContent: Ref<HTMLDivElement[] | undefined>, itemRefs: any, previewData: Ref<any>) {
    const variable = {
        pageIndex: 0,
        pageSize: 0,
        nowDate: new Date()
    } as FormatterVariable

    // 初始化element offsetTop
    let offsetLastElementTop = 0
    const fixedPreviewElementList: PreviewWrapper[] = []
    const previewElementList: PreviewWrapper[] = []
    const pageNumElementList: PreviewWrapper[] = []

    let previewContext = {
        currentPreview: undefined!,
        autoPageIs: false,
        panel: getCurrentPanel(),
        pageList: [],
        currentPage: undefined! as any,
        top: 0,
        bottom: getCurrentPanel().height, // 单位 mm
        pagingRepetition: true
    } as PreviewContext

    // 处理elementWrapper
    for (let myElement of previewContext.panel.elementList) {
        const previewElement = element2PreviewWrapper(myElement)
        // 处理嵌套 pageNum
        if (previewElement.previewWrapperList != null && previewElement.previewWrapperList.length > 0) {
            for (let i = previewElement.previewWrapperList.length - 1; i >= 0; i--) {
                const pageNumPreviewElement = previewElement.previewWrapperList[i]
                if (pageNumPreviewElement.type == 'PageNum') {
                    pageNumPreviewElement.x = pageNumPreviewElement.x + previewElement.x
                    pageNumPreviewElement.y = pageNumPreviewElement.y + previewElement.y

                    pageNumElementList.push(pageNumPreviewElement)
                    previewElement.previewWrapperList.splice(i, 1)
                }
            }
        }

        if (myElement.type == 'PageNum') {
            pageNumElementList.push(previewElement)
        } else if (previewElement.option.fixed) {
            fixedPreviewElementList.push(previewElement)
        } else {
            previewElementList.push(previewElement)
        }
    }

    // 排序
    previewElementList.sort((o1, o2) => {
        return o1.y - o2.y
    })

    // 计算每个元素距离上个元素的距离
    for (let previewWrapper of previewElementList) {
        previewWrapper.offsetLastElementTop = numberUtil.subScale(previewWrapper.y, offsetLastElementTop)
        offsetLastElementTop = numberUtil.sumScale(previewWrapper.y, previewWrapper.height)
    }
    // 固定高度 表格分页打印
    while (previewContext.pagingRepetition) {
        previewContext.pagingRepetition = false
        previewContext.currentPreview = undefined!

        await newPage()
        await installPreviewElement(previewElementList)
    }

    previewContext.autoPageIs = false
    await installPreviewElement(fixedPreviewElementList)

    variable.pageSize = pageList.length
    // 每页设置页码
    for (let i = 0; i < pageList.length; i++) {
        previewContext.currentPage = pageList[i]
        variable.pageIndex = i + 1
        await installPreviewElement(pageNumElementList)
    }

    async function installPreviewElement(previewElementList: PreviewWrapper[]) {
        for (let i = 0; i < previewElementList.length; i++) {
            let previewWrapper = previewElementList[i]

            // 计算顶部需不需要偏移
            if (!previewWrapper.option.fixed) {
                // 页面顶部有偏移
                // debugger
                if (previewContext.currentPage.offsetTop > 0 && previewContext.currentPreview) {
                    if (previewContext.currentPreview.heightIs) {
                        previewWrapper.y = previewContext.currentPreview.y + previewContext.currentPreview.height + previewWrapper.offsetLastElementTop
                    } else {
                        // debugger
                        previewWrapper.y = numberUtil.sumScale(previewContext.currentPage.offsetTop, previewWrapper.offsetLastElementTop)
                    }
                }

                // 判断需不需要分页
                if (previewContext.currentPage.elementList.length > 0 && (await isNeedNewPage(previewWrapper.y, previewContext.bottom) || await isNeedNewPage(previewWrapper.y + previewWrapper.height, previewContext.bottom))) {
                    previewWrapper.y = 1
                    previewContext.currentPage!.offsetTop = 1
                }
            }

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
                previewContext.currentPage.elementList.push(previewWrapper)
                await nextTick()
            } else if (previewWrapper.type == 'Text' || previewWrapper.type == 'PageNum' || previewWrapper.type == 'TextTime') {

                if (previewWrapper.type == 'PageNum') {
                    previewWrapper = copyPreviewWrapper(previewWrapper)
                    previewContext.currentPreview = previewWrapper
                    previewElementList[i] = previewWrapper
                }

                if (previewWrapper.contentType == 'Text') {
                    await autoTextElement(previewDataTmp, true)
                }
                if (previewWrapper.contentType == 'QrCode') {
                    previewContext.currentPage.elementList.push(previewWrapper)
                    await nextTick()
                }
                if (previewWrapper.contentType == 'Barcode') {
                    previewContext.currentPage.elementList.push(previewWrapper)
                    await nextTick()
                }
            } else if (previewWrapper.type == 'DataTable') {
                let tableRowIndex = 0
                // debugger
                if (previewWrapper.tableRowIndex != undefined) {
                    tableRowIndex = previewWrapper.tableRowIndex

                    previewWrapper = copyPreviewWrapper(previewWrapper)
                    previewContext.currentPreview = previewWrapper
                    previewElementList[i] = previewWrapper

                    previewWrapper.bodyList.length = 1
                    previewWrapper.tableRowIndex = undefined!
                }
                await autoTableRow(previewContext, previewDataTmp, tableRowIndex)
            } else if (previewWrapper.type == 'Container') {
                // element.runtimeOption = parse(stringify(element.runtimeOption, 'parent', 'target'), {} as RuntimeElementOption)
                // await autoTableRow(previewWrapper, previewDataTmp, 0)
                // console.log(previewWrapper)
                previewContext.currentPage.elementList.push(previewWrapper)
            } else {
                // console.log(previewWrapper)
                previewContext.currentPage.elementList.push(previewWrapper)
            }

            if (!previewContext.currentPreview.heightIs) {
                // 重新计算顶部偏移
                previewContext.currentPage.offsetTop = await computeBottom(previewContext.currentPreview)
                console.log('顶部偏移' + previewContext.currentPage.offsetTop)
            }

            previewContext.currentPreview = previewWrapper
        }
    }

    async function autoTextElement(previewData: string, first: boolean) {
        let previewWrapper = previewContext.currentPreview
        // console.log(previewWrapper)
        previewWrapper.data = previewData
        previewWrapper.heightIs = false
        previewContext.currentPage.elementList.push(previewWrapper)
        await nextTick()
        // console.log(previewData)

        const height = itemRefs[previewWrapper.id].$el.clientHeight

        // console.log(previewWrapper.previewWrapper.id, height, previewWrapper.previewWrapper.runtimeOption.height)
        if (first && height < previewWrapper.runtimeOption.height) {
            previewWrapper.heightIs = true
            // console.log('小')
            return false
        } else {
            // console.log('大')
            // previewWrapper.previewWrapper.previewRuntimeOption.heightIs = false
        }

        // console.log(height)
        if (previewWrapper.y + px2unit(height) < previewContext.bottom) {
            return false
        } else {
            // console.log(previewWrapper)
        }

        let mid = await binary_search(previewWrapper, previewData, 1, previewData.length)
        // console.log(mid)

        if (mid > 0 && mid < previewData.length) {
            console.log('文本分页')
            if (previewContext.autoPageIs) {
                await newPage()
                previewContext.currentPreview = element2PreviewWrapper(previewWrapper)
                // previewWrapper.element = previewWrapper
                previewContext.currentPreview.y = previewContext.top
                // console.log(previewWrapper)
                await autoTextElement(previewData.substring(mid + 1, previewData.length), false)
                return true
            }
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

        previewContext.currentPage.elementList.push(previewWrapper)
        // let previewWrapper = previewWrapper
        await nextTick()
        const table = itemRefs[previewWrapper.id]
        // console.log(table)
        if (!table) {
            return false
        }

        const bodyList = previewWrapper.bodyList[0]
        previewWrapper.bodyList.length = 0

        for (let i = index; i < previewData.length; i++) {
            const datum = previewData[i]
            // console.log(previewData, i, datum)
            if (!datum['autoIncrement']) {
                datum['autoIncrement'] = i + 1
                // console.log(i + 1)
            }
            const rowList: MyElement[] = []
            for (let j = 0; j < previewWrapper.headList.length; j++) {
                // initElement(previewWrapper.headList[j], j)
                const head = previewWrapper.headList[j]
                // console.log(datum)
                bodyList[j].data = datum[head.field!]
                rowList.push(element2PreviewWrapper(bodyList[j]))
            }
            previewWrapper.bodyList.push(rowList)
            await nextTick()
            // console.log(table.height())

            if (previewWrapper.option.tableHeightType == 'FIXED') {
                // 固定高度
                // debugger
                if (table.$el.childNodes[1].clientHeight > unit2px(previewWrapper.height)) {
                    // debugger
                    // console.log(i)
                    if (i == index) {
                        previewWrapper.tableRowIndex = i + 1
                        previewContext.pagingRepetition = true
                    } else {
                        previewWrapper.bodyList.pop()
                        previewWrapper.tableRowIndex = i
                        previewContext.pagingRepetition = true
                    }
                    break
                }
            }

            if (await isNeedNewPage(unit2px(previewWrapper.y) + table.$el.clientHeight, unit2px(previewContext.bottom))) {
                // 删除刚才创建的
                // console.log(previewWrapper.runtimeOption.rowList)
                previewWrapper.bodyList.pop()
                previewContext.currentPreview = element2PreviewWrapper(previewWrapper)
                previewWrapper = previewContext.currentPreview
                previewWrapper.runtimeOption = parse(stringify(previewWrapper.runtimeOption, 'parent'), {} as RuntimeElementOption)
                previewWrapper.bodyList = [bodyList]
                previewWrapper.y = previewContext.top + 1
                await autoTableRow(previewContext, previewData, i)
                // data.currentPage.offsetTop = await computeBottom({previewWrapper: previewWrapper} as PreviewWrapper)
                break
            }
        }

    }

    /**
     * 单位 px
     */
    async function isNeedNewPage(y: number | undefined, bottom: number | undefined, callback?: () => void) {

        if (!previewContext.autoPageIs) {
            return false
        }

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

        if (previewContext.currentPage != undefined) {
            previewContext.autoPageIs = false
            await installPreviewElement(fixedPreviewElementList)
        }

        previewContext.currentPage = reactive({
            id: crypto.randomUUID(),
            width: previewContext.panel.width,
            height: previewContext.panel.height,
            offsetTop: 0,
            elementList: []
        } as any)
        previewContext.pageList.push(previewContext.currentPage)
        previewContext.autoPageIs = true
        pageList.push(previewContext.currentPage!)
        // 处理页头，页脚

        await nextTick()
        getPanelDiv()

        if (previewContext.panel.pageHeader) {
            let preview = previewContext.panel.pageHeader as PreviewWrapper
            previewContext.currentPage!.elementList!.push(preview)
            previewContext.top = (await computeBottom(preview))!
        }
        if (previewContext.panel.pageFooter) {
            let preview = previewContext.panel.pageFooter as PreviewWrapper
            previewContext.currentPage!.elementList!.push(preview)
            previewContext.bottom = (await computeTop(preview))!
        }
    }

    async function computeBottom(previewWrapper: PreviewWrapper) {
        await nextTick()
        if (!itemRefs[previewWrapper.id]) {
            return
        }
        const div = itemRefs[previewWrapper.id].$el as HTMLDivElement
        // debugger
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
        const itemRef = itemRefs[previewWrapper.id]
        // console.log(div)
        if (!itemRef) {
            // debugger
            console.log(itemRef)
            return
        }
        const height = itemRefs[previewWrapper.id].$el.clientHeight
        // const height = itemRefs[previewWrapper.element.id].clientHeight;
        return previewWrapper.y! + px2unit(height) < previewContext.bottom
    }

    async function binary_search(previewWrapper: PreviewWrapper, previewData: string, low: number, height: number): Promise<any> {
        if (low > height) {
            // console.log("low > height")
            return -1
        }
        const mid = Math.floor((height + low) / 2)
        let isH = await computeTextHeight(previewWrapper, previewData.substring(0, mid + 2))
        let isL = await computeTextHeight(previewWrapper, previewData.substring(0, mid + 1))
        // console.log(data.substring(0, mid + 1))
        // console.log(mid)
        // if (!isH && !isL) {
        //   return -1
        // }
        if (isL && !isH) {
            console.log('返回')
            return mid
        } else if (!isH) {
            height = mid - 1
            console.log('减少', height)
            return binary_search(previewWrapper, previewData, low, height)
        } else if (isL) {
            low = mid + 1
            console.log('增加', low)
            return binary_search(previewWrapper, previewData, low, height)
        } else {
            return -1
        }
    }

    function getPanelDiv() {
        return previewContent.value![previewContent.value!.length - 1]
    }
}



