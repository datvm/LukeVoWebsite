export class Size {

    constructor(w, h) {
        this.w = w;
        this.h = h;
    }

}

export class Rect {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

}

export class ResizeRects {

    constructor(src, dest, size) {
        this.src = src;
        this.dest = dest;
        this.size = size;
    }

}

export class BaseResizeStrat {

    resize(src, dest) {
        return new ResizeRects(
            new Rect(0, 0, src.w, src.h),
            new Rect(0, 0, dest.w, dest.h)
        );
    }

}

export class StretchResizeStrat extends BaseResizeStrat {

    resize(src, dest) {
        return new ResizeRects(
            new Rect(0, 0, src.w, src.h),
            new Rect(0, 0, dest.w, dest.h),
            dest
        );
    }

}

export class WidthResizeStrat extends BaseResizeStrat {

    resize(src, dest) {
        const ratio = src.w / src.h;
        const h = dest.w / ratio;

        return new ResizeRects(
            new Rect(0, 0, src.w, src.h),
            new Rect(0, 0, dest.w, h),
            new Size(dest.w, h)
        );
    }

}

export class HeightResizeStrat extends BaseResizeStrat {

    resize(src, dest) {
        const ratio = src.w / src.h;
        const w = dest.h * ratio;

        return new ResizeRects(
            new Rect(0, 0, src.w, src.h),
            new Rect(0, 0, w, dest.h),
            new Size(w, dest.h)
        );
    }

}

export class CoverResizeStrat extends BaseResizeStrat {

    resize(src, dest) {
        const ratio = Math.min(src.w / dest.w, src.h / dest.h);
        const destW = src.w / ratio;
        const destH = src.h / ratio;
        const destX = (dest.w - destW) / 2;
        const destY = (dest.h - destH) / 2;

        return new ResizeRects(
            new Rect(0, 0, src.w, src.h),
            new Rect(destX, destY, destW, destH),
            dest
        );
    }

}

export class ContainResizeStrat extends BaseResizeStrat {

    resize(src, dest) {
        const ratio = Math.max(src.w / dest.w, src.h / dest.h);
        const destW = src.w / ratio;
        const destH = src.h / ratio;
        const destX = (dest.w - destW) / 2;
        const destY = (dest.h - destH) / 2;

        return new ResizeRects(
            new Rect(0, 0, src.w, src.h),
            new Rect(destX, destY, destW, destH),
            dest
        );
    }

}