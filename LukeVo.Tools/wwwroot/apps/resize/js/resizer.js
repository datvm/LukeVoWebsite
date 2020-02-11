import { Size } from "./resize-strat.js";

export class Resizer {

    static async resizeAsync(src, destSize, resizeStrat) {
        const url = URL.createObjectURL(src);

        const img = await Resizer.loadImageAsync(url);
        const srcSize = Resizer.getImageSize(img);
        const resizeResult = resizeStrat.resize(srcSize, destSize);
        const srcRect = resizeResult.src;
        const destRect = resizeResult.dest;
        const fileSize = resizeResult.size;

        const canvas = document.createElement("canvas");
        canvas.width = fileSize.w;
        canvas.height = fileSize.h;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";        
        ctx.drawImage(img,
            srcRect.x, srcRect.y, srcRect.w, srcRect.h,
            destRect.x, destRect.y, destRect.w, destRect.h);

        return await new Promise(resolve => {
            canvas.toBlob(resolve, "image/png");
        });
        
    }

    static getImageSize(img) {
        return new Size(img.naturalWidth, img.naturalHeight);
    }

    static loadImageAsync(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () =>
                resolve(img);
            img.onerror = reject;

            img.src = url;
        });
    }

}