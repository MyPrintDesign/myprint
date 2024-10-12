import {
    downloadImg2Base64,
    generateUUID,
    parse,
    replaceSpacesOutsideHTMLTags,
    stringify
} from '@myprint/design/utils/utils';
import { px2unit, unit2px } from '@myprint/design/utils/devicePixelRatio';
import { nextTick, reactive, Ref } from 'vue-demi';
import {
    FormatterVariable,
    MyElement,
    Panel,
    PreviewContainerWrapper,
    PreviewContext,
    PreviewWrapper,
    RuntimeElementOption,
    TableCellElement
} from '@myprint/design/types/entity';
import { element2PreviewWrapper, formatter } from '@myprint/design/utils/elementUtil';
import numberUtil from '@myprint/design/utils/numberUtil';
import {
    lastHeadList,
    previewRowStatisticsList,
    previewTableStatisticsList,
    statisticsData
} from '@myprint/design/utils/table/dataTable';
import { isEmpty } from 'lodash';

export async function autoPage(previewEl: Ref<HTMLDivElement[] | undefined>, pageList: Array<PreviewContainerWrapper>, panel: Panel, previewDataList?: any[]) {
    if (previewDataList == null) {
        previewDataList = [{}];
    }
    const variable = {
        pageIndex: 0,
        pageSize: 0,
        nowDate: new Date()
    } as FormatterVariable;

    // 初始化element offsetTop
    let offsetLastElementTop = 0;
    const fixedPreviewElementList: PreviewWrapper[] = [];
    const previewElementList: PreviewWrapper[] = [];

    let previewContext = {
        currentPreview: undefined!,
        autoPageIs: false,
        previewData: {},
        panel: panel,
        pageList: [],
        currentPage: undefined! as any,
        top: 0,
        bottom: panel.height, // 单位 mm
        pagingRepetition: true
    } as PreviewContext;
    // 处理elementWrapper
    for (let myElement of previewContext.panel.elementList) {
        handleElement(myElement);
    }

    if (previewContext.panel.pageHeader) {
        handleElement(previewContext.panel.pageHeader);
    }
    if (previewContext.panel.pageFooter) {
        handleElement(previewContext.panel.pageFooter);
    }

    function handleElement(myElement: MyElement) {
        const previewElement = element2PreviewWrapper(myElement);
        if (previewElement.previewWrapperList != null && previewElement.previewWrapperList.length > 0) {
            for (let i = previewElement.previewWrapperList.length - 1; i >= 0; i--) {
                const pageNumPreviewElement = previewElement.previewWrapperList[i];
                // 处理嵌套 pageNum
                if (pageNumPreviewElement.option.fixed) {
                    pageNumPreviewElement.x = pageNumPreviewElement.x + previewElement.x;
                    pageNumPreviewElement.y = pageNumPreviewElement.y + previewElement.y;

                    fixedPreviewElementList.push(pageNumPreviewElement);
                    previewElement.previewWrapperList.splice(i, 1);
                }
            }
        }
        // if (elementTypeContainerList.includes(previewElement.type)) {
        // previewElement.previewWrapperList = [];
        // }

        if (previewElement.option.fixed) {
            fixedPreviewElementList.push(previewElement);
        } else {
            previewElementList.push(previewElement);
        }
    }

    // 排序
    previewElementList.sort((o1, o2) => {
        return o1.y - o2.y;
    });

    // 计算每个元素距离上个元素的距离
    for (let previewWrapper of previewElementList) {
        previewWrapper.offsetLastElementTop = numberUtil.subScale(previewWrapper.y, offsetLastElementTop);
        offsetLastElementTop = numberUtil.sumScale(previewWrapper.y, previewWrapper.height);
    }

    for (let previewData of previewDataList) {
        previewContext.previewData = previewData;
        // 固定高度 表格分页打印
        while (previewContext.pagingRepetition) {
            previewContext.pagingRepetition = false;
            previewContext.currentPreview = undefined!;

            await newPage();
            await installPreviewElement(previewElementList);
        }

        previewContext.pagingRepetition = true;
    }

    previewContext.autoPageIs = false;
    variable.pageSize = pageList.length;
    // 每页设置页码
    // 组装固定元素
    for (let i = 0; i < pageList.length; i++) {
        previewContext.currentPage = pageList[i];
        variable.pageIndex = i + 1;
        await installPreviewElement(fixedPreviewElementList);
    }

    // 所有的都处理完，如果是自动高度，要重新计算一下高度
    if (panel.pageSize == 'AutoHeight') {
        await nextTick();
        const lastElementChild = previewEl.value![0].lastElementChild;
        if (lastElementChild) {
            const rect = lastElementChild.getBoundingClientRect();
            pageList[0].height = px2unit(rect.bottom, panel);
            panel.runtimeOption.printRealHeight = pageList[0].height;
        }
    }

    async function installPreviewElement(previewElementList: PreviewWrapper[]) {
        for (let i = 0; i < previewElementList.length; i++) {
            const oldPreviewWrapper = previewElementList[i];
            let previewWrapper = element2PreviewWrapper(previewElementList[i]);

            // 计算顶部需不需要偏移
            if (!previewWrapper.option.fixed) {
                // 页面顶部有偏移
                // debugger
                if (previewContext.currentPage.offsetTop > 0 && previewContext.currentPreview) {
                    if (previewContext.currentPreview.heightIs) {
                        previewWrapper.y = previewContext.currentPreview.y + previewContext.currentPreview.height + previewWrapper.offsetLastElementTop;
                    } else {
                        // debugger
                        previewWrapper.y = numberUtil.sumScale(previewContext.currentPage.offsetTop, previewWrapper.offsetLastElementTop);
                    }

                }

                // 判断需不需要分页
                // console.log(await isNeedNewPage(previewWrapper.y, previewContext.bottom));
                // console.log(await isNeedNewPage(previewWrapper.y + previewWrapper.height, previewContext.bottom));
                if (previewWrapper.type != 'PageFooter'
                    && previewContext.currentPage.previewWrapperList.length > 0
                    && (await isNeedNewPage(previewWrapper.y, previewContext.bottom) || await isNeedNewPage(previewWrapper.y + previewWrapper.height, previewContext.bottom))) {
                    previewWrapper.y = 1;
                    previewContext.currentPage!.offsetTop = 1;
                }
            }

            if (previewWrapper.option.fixed && previewWrapper.option.displayStrategy != undefined) {
                switch (previewWrapper.option.displayStrategy) {
                    case 'firstPage':
                        if (variable.pageIndex != 1) {
                            continue;
                        }
                        break;
                    case 'lastPage':
                        if (variable.pageIndex != variable.pageSize) {
                            continue;
                        }
                        break;
                    case 'none':
                        continue;
                    case 'oddPage':
                        if (variable.pageIndex % 2 != 1) {
                            continue;
                        }
                        break;
                    case 'evenPage':
                        if (variable.pageIndex % 2 != 0) {
                            continue;
                        }
                        break;
                }
            }

            previewContext.currentPreview = previewWrapper;

            // 需要data
            let previewDataTmp: any;

            if (previewWrapper.field) {
                // 打印数据
                previewDataTmp = previewContext.previewData[previewWrapper.field];
            }

            if (!previewDataTmp) {
                // 格式化数据
                previewDataTmp = formatter(previewWrapper, variable);
            }

            if (!previewDataTmp) {
                // 设计数据
                previewDataTmp = previewWrapper.data;
            }

            if (previewWrapper.type == 'Image') {
                previewWrapper.data = previewDataTmp;
                // 如果是图片地址，则下载下来
                if (!isEmpty(previewWrapper.data) && (previewWrapper.data as string).startsWith('http')) {
                    // 网络图片，下载下来
                    try {
                        previewWrapper.data = await downloadImg2Base64(previewWrapper.data);
                    } catch (e: any) {
                        previewWrapper.data = '图片加载错误';
                    }
                }
                previewContext.currentPage.previewWrapperList.push(previewWrapper);
                await nextTick();
            } else if (previewWrapper.type == 'Text' || previewWrapper.type == 'PageNum' || previewWrapper.type == 'TextTime') {

                if (previewWrapper.type == 'PageNum') {
                    previewWrapper = element2PreviewWrapper(previewWrapper);
                    previewContext.currentPreview = previewWrapper;
                    previewElementList[i] = previewWrapper;
                }

                if (previewWrapper.contentType == 'Text') {
                    if (previewDataTmp) {
                        previewDataTmp = replaceSpacesOutsideHTMLTags(previewDataTmp);
                    }
                    await autoTextElement(previewDataTmp, true);
                }

                previewWrapper.data = previewDataTmp;
                if (previewWrapper.contentType == 'QrCode') {
                    previewContext.currentPage.previewWrapperList.push(previewWrapper);
                    await nextTick();
                }
                if (previewWrapper.contentType == 'Barcode') {
                    previewContext.currentPage.previewWrapperList.push(previewWrapper);
                    await nextTick();
                }
            } else if (previewWrapper.type == 'DataTable') {
                let tableRowIndex = 0;
                await autoTableRow(previewContext, previewDataTmp, tableRowIndex);
            } else if (previewWrapper.type == 'Container') {
                previewContext.currentPage.previewWrapperList.push(previewWrapper);
                const tmpPage = previewContext.currentPage;
                previewContext.currentPage = previewWrapper;
                previewWrapper.previewWrapperList = [];
                await installPreviewElement(oldPreviewWrapper.previewWrapperList);
                previewContext.currentPage = tmpPage;
            } else if (previewWrapper.type == 'PageHeader') {
                previewContext.currentPage.previewWrapperList.push(previewWrapper);
                const tmpPage = previewContext.currentPage;
                previewContext.currentPage = previewWrapper;
                previewWrapper.previewWrapperList = [];
                await installPreviewElement(oldPreviewWrapper.previewWrapperList);
                previewContext.currentPage = tmpPage;
            } else if (previewWrapper.type == 'PageFooter') {
                previewContext.currentPage.previewWrapperList.push(previewWrapper);
                const tmpPage = previewContext.currentPage;
                previewContext.currentPage = previewWrapper;
                previewWrapper.previewWrapperList = [];
                await installPreviewElement(oldPreviewWrapper.previewWrapperList);
                previewContext.currentPage = tmpPage;
            } else {
                previewContext.currentPage.previewWrapperList.push(previewWrapper);
            }

            if (!previewContext.currentPreview.heightIs) {
                // 重新计算顶部偏移
                previewContext.currentPage.offsetTop = (await computeBottom(previewContext.currentPreview))!;
            }

            previewContext.currentPreview = previewWrapper;
        }
    }

    async function autoTextElement(previewData: string, first: boolean) {
        let previewWrapper = previewContext.currentPreview;
        previewWrapper.data = previewData;
        previewWrapper.heightIs = false;
        previewContext.currentPage.previewWrapperList.push(previewWrapper);
        await nextTick();
        const height = previewWrapper.target.clientHeight;

        /**
         * 非自动高度
         */
        if (previewWrapper.option.autoTextHeight == null || !previewWrapper.option.autoTextHeight) {
            previewWrapper.heightIs = true;
            return false;
        }

        if (first && height < previewWrapper.runtimeOption.height) {
            previewWrapper.heightIs = true;
            // console.log('小')
            return false;
        } else {
            // console.log('大')
        }

        // console.log(height)
        if (previewWrapper.y + px2unit(height, panel) < previewContext.bottom) {
            return false;
        } else {
            // console.log(previewWrapper)
        }

        let mid = await binary_search(previewWrapper, previewData, 1, previewData.length);
        // console.log(mid)

        if (mid > 0 && mid < previewData.length) {
            // console.log('文本分页');
            if (previewContext.autoPageIs) {
                await newPage();
                previewContext.currentPreview = element2PreviewWrapper(previewWrapper);
                // previewWrapper.element = previewWrapper
                previewContext.currentPreview.y = previewContext.top;
                // console.log(previewWrapper)
                await autoTextElement(previewData.substring(mid + 1, previewData.length), false);
                return true;
            }
            // data.currentPage.offsetTop = computeBottom({previewWrapper: previewWrapper} as PreviewWrapper)
        }

        return false;
    }

    async function autoTableRow(previewContext: PreviewContext, previewDataList: Array<any>, index: number) {
        if (previewDataList == null) {
            previewDataList = [];
        }
        let previewWrapper = previewContext.currentPreview;
        if (previewWrapper.option.tableHeightType == 'AUTO') {
            previewWrapper.heightIs = false;
        }

        previewContext.currentPage.previewWrapperList.push(previewWrapper);
        await nextTick();
        const table = previewWrapper.target;
        if (!table) {
            return false;
        }
        const tableHeadList = [...previewWrapper.tableHeadList];
        const headList = lastHeadList(tableHeadList);
        const bodyList = previewWrapper.tableBodyList[0];
        if (previewWrapper.statisticsList == null) {
            previewWrapper.statisticsList = [];
        }
        const tableStatisticsList = [...previewWrapper.statisticsList];
        const tableStatisticsSize = tableStatisticsList.length;
        let statisticsListWrapper: Record<number, any[]> = {};
        let tableStaticsListWrapper: Record<number, any[]> = {};
        if (previewWrapper.tableHeadHiddenIs) {
            previewWrapper.tableHeadList.length = 0;
            for (let j = 0; j < bodyList.length; j++) {
                bodyList[j].runtimeOption.width = headList[j].runtimeOption.width;
            }

            // 设置第一行的宽度<不然表格宽度有问题
        }
        previewWrapper.tableBodyList.length = 0;
        previewWrapper.statisticsList.length = 0;
        if (index < previewDataList.length) {
            previewTableStatisticsList(tableStatisticsList, previewWrapper.statisticsList, statisticsListWrapper, headList);
        }
        const previewDataTmpList: any[] = [];
        let i = index;
        for (; i < previewDataList.length + tableStatisticsSize; i++) {
            const rowList: TableCellElement[] = [];
            if (i < previewDataList.length) {
                const previewData = previewDataList[i];
                previewDataTmpList.push(previewData);
                // 序号
                if (!previewData['autoIncrement']) {
                    previewData['autoIncrement'] = i + 1;
                }
                for (let j = 0; j < headList.length; j++) {
                    const head = headList[j];
                    bodyList[j].data = previewData[head.field!];
                    rowList.push(element2PreviewWrapper(bodyList[j]));
                }

                previewWrapper.tableBodyList.push(rowList);
            } else {
                // debugger
                // 计算
                const tableStatisticsIndex = i - previewDataList.length;
                const rowList = [...tableStatisticsList[tableStatisticsIndex]];
                let hasCell = previewRowStatisticsList(rowList, tableStaticsListWrapper, headList, 'tableStatisticsIs');
                if (hasCell) {
                    previewWrapper.statisticsList.push(rowList);
                }
            }

            await nextTick();
            // console.log(table.height())

            if (previewWrapper.option.tableHeightType == 'FIXED') {
                // 固定高度
                if (table.childNodes[1].clientHeight > unit2px(previewWrapper.height, panel)) {
                    if (i == index) {
                        previewWrapper.previewTableRowIndex = i + 1;
                        previewContext.pagingRepetition = true;
                    } else {
                        previewWrapper.tableBodyList.pop();
                        previewDataTmpList.pop();
                        previewWrapper.previewTableRowIndex = i;
                        previewContext.pagingRepetition = true;
                    }
                    statisticsData(previewDataTmpList, statisticsListWrapper);
                    if (i >= previewDataList.length) {
                        statisticsData(previewDataList, tableStaticsListWrapper);
                    }
                    previewDataTmpList.pop();
                    break;
                }
            }

            if (await isNeedNewPage(unit2px(previewWrapper.y, panel) + table.clientHeight, unit2px(previewContext.bottom, panel))) {
                // 删除刚才创建的
                previewWrapper.tableBodyList.pop();
                previewDataTmpList.pop();
                // 统计
                statisticsData(previewDataTmpList, statisticsListWrapper);
                // if (i >= previewDataList.length) {
                //     statisticsData(previewDataList, tableStaticsListWrapper);
                // }
                previewContext.currentPreview = element2PreviewWrapper(previewWrapper);
                previewWrapper = previewContext.currentPreview;
                if (!previewWrapper.option.tablePageHeadIs) {
                    previewWrapper.tableHeadHiddenIs = true;
                }
                previewWrapper.tableHeadList = [...tableHeadList];
                previewWrapper.statisticsList = [...tableStatisticsList];
                previewWrapper.runtimeOption = parse(stringify(previewWrapper.runtimeOption, 'parent'), {} as RuntimeElementOption);
                previewWrapper.tableBodyList = [bodyList];
                previewWrapper.y = previewContext.top + 1;
                await autoTableRow(previewContext, previewDataList, i);
                // data.currentPage.offsetTop = await computeBottom({previewWrapper: previewWrapper} as PreviewWrapper)
                break;
            }
        }

        if (i >= previewDataList.length) {
            statisticsData(previewDataTmpList, statisticsListWrapper);
        }
        statisticsData(previewDataList, tableStaticsListWrapper);
    }

    /**
     * 单位 px
     */
    async function isNeedNewPage(y: number | undefined, bottom: number | undefined, callback?: () => void) {

        if (!previewContext.autoPageIs) {
            return false;
        }
        if (previewContext.panel.pageSize == 'AutoHeight') {
            return false;
        }

        // 为啥+1
        if (y! > bottom! + 1) {
            if (callback) {
                callback();
            }
            await newPage();
            return true;
        }
        return false;
    }

    async function newPage() {
        previewContext.currentPage = reactive({
            id: generateUUID(),
            width: previewContext.panel.width,
            height: previewContext.panel.height,
            offsetTop: 0,
            previewWrapperList: []
        } as any);
        previewContext.pageList.push(previewContext.currentPage);
        previewContext.autoPageIs = true;
        pageList.push(previewContext.currentPage!);
        // 处理页头，页脚

        await nextTick();
        // getPanelDiv();

        if (previewContext.panel.pageHeader) {
            let preview = previewContext.panel.pageHeader as PreviewWrapper;
            previewContext.currentPage!.previewWrapperList!.push(preview);
            previewContext.top = (await computeBottom(preview))!;
        }
        if (previewContext.panel.pageFooter) {
            let preview = previewContext.panel.pageFooter as PreviewWrapper;
            previewContext.currentPage!.previewWrapperList!.push(preview);
            previewContext.bottom = (await computeTop(preview))!;
        }
    }

    async function computeBottom(previewWrapper: PreviewWrapper) {
        await nextTick();
        if (!previewWrapper.target) {
            return;
        }
        const div = previewWrapper.target;
        // debugger
        return numberUtil.toFixed(px2unit(numberUtil.sumScale(div.offsetTop, div.offsetHeight), panel));
    }

    async function computeTop(previewWrapper: PreviewWrapper) {
        await nextTick();
        if (!previewWrapper.target) {
            return;
        }
        const div = previewWrapper.target;
        // console.log(div.offsetTop);
        return numberUtil.toFixed(px2unit(div.offsetTop, panel));
    }

    async function computeTextHeight(previewWrapper: PreviewWrapper, previewDataTmp: any) {
        previewWrapper.data = previewDataTmp;
        await nextTick();
        const itemRef = previewWrapper.target;
        // console.log(div)
        if (!itemRef) {
            // debugger
            return;
        }
        const height = previewWrapper.target.clientHeight;
        return previewWrapper.y + px2unit(height, panel) < previewContext.bottom;
    }

    async function binary_search(previewWrapper: PreviewWrapper, previewData: string, low: number, height: number): Promise<any> {
        if (low > height) {
            // console.log("low > height")
            return -1;
        }
        const mid = Math.floor((height + low) / 2);
        let isH = await computeTextHeight(previewWrapper, previewData.substring(0, mid + 2));
        let isL = await computeTextHeight(previewWrapper, previewData.substring(0, mid + 1));
        // console.log(data.substring(0, mid + 1))
        // console.log(mid)
        // if (!isH && !isL) {
        //   return -1
        // }
        if (isL && !isH) {
            // console.log('返回');
            return mid;
        } else if (!isH) {
            height = mid - 1;
            // console.log('减少', height);
            return binary_search(previewWrapper, previewData, low, height);
        } else if (isL) {
            low = mid + 1;
            // console.log('增加', low);
            return binary_search(previewWrapper, previewData, low, height);
        } else {
            return -1;
        }
    }
}



