/**
 * @param time Date/String/Number
 * @param fmt 'yyyy-MM-dd hh:mm:ss'  'yyyy-MM-dd'
 * @description formatDate('2020/9/11')
 * @returns '2020-09-11 12:03:11' '2020-09-11'
 */
export function formatDate(time: string | number | Date, fmt: string): string {
    time = new Date(time);
    const o: { [key: string]: number | string } = {
        'M+': time.getMonth() + 1,                   //月份
        'd+': time.getDate(),                        //日
        'h+': time.getHours(),                       //小时
        'm+': time.getMinutes(),                     //分
        's+': time.getSeconds(),                     //秒
        'q+': Math.floor((time.getMonth() + 3) / 3), //季度
        'S': time.getMilliseconds()                  //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k] as string) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}
