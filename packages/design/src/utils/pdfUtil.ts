import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';


// a4
let a4Width = 595.28;
let a4Height = 841.89;

let defaultOptions = {
    name: new Date().getTime(),
    scale: window.devicePixelRatio * 2,
    padding: 0,
    dpi: 144, // 设置dpi，会使图片高清一些
    width: a4Width,
    height: a4Height,
    allowTaint: true
}

/**
 * 单页打印
 * @param pageDomList
 * @param options
 */
export async function toPdf(pageDomList:any, options:any) {
    let doc = new JsPDF(undefined, 'px', [options.width, options.height]);
    // options = Object.assign(defaultOptions, options);
    // console.log(pageDomList)
    console.log(options)
    defaultOptions.width = options.width
    defaultOptions.height = options.height
    for (let i = 0; i < pageDomList.length; i++) {
        let pageDom = pageDomList[i]
        // console.log(pageDom)
      const  canvas = await html2canvas(pageDom, defaultOptions);
        // 生成的画布元素宽高（需要收缩回原比例大小）
        // console.log(canvas.width,  canvas.height)
        // console.log(options.scale)
        let canvasWidth = canvas.width / defaultOptions.scale;
        let canvasHeight = canvas.height / defaultOptions.scale;
        console.log(canvasWidth, canvasHeight)

        // 页面等比例缩放后宽高
        // let pageWidth = a4Width;
        // let pageHeight = (a4Width / canvasWidth) * canvasHeight;


        //返回图片dataURL，参数：图片格式和清晰度(0-1)
        let jpeg = canvas.toDataURL('image/jpeg', 1.0);
        // console.log(canvasHeight, options.height)
        // let img = document.createElement("img");
        // img.src = jpeg
        // img.style.zIndex = 99999
        // document.body.append(img)

        //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]

        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        // doc.addImage(jpeg, 'JPEG', 0, 0, canvasWidth, canvasHeight); // 从图片顶部开始打印

        doc.addImage(jpeg, 'JPEG', 0, 0, canvasWidth, canvasHeight); // 从图片顶部开始打印

        // doc.output('dataurlnewwindow');
        // doc.save(options.name + '.pdf');

        if (i + 1 < pageDomList.length) {
            doc.addPage()
        }
    }

    const blob = doc.output("blob")
    window.open(URL.createObjectURL(blob));

}
