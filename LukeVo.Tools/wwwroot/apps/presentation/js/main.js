﻿class PresentationApp {

    txtFiles = document.querySelector("#txt-files");
    lstPreview = document.querySelector("#lst-preview");

    pnlSelectPrompt = document.querySelector("#pnl-select-prompt");
    pnlOptions = document.querySelector("#pnl-options");
    pnlPresentation = document.querySelector("#pnl-presentation");

    imgMain = document.querySelector("#img-main");

    initialize() {
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.keyCode == 79) {
                e.preventDefault();
                this.selectFiles();
            }
        });

        this.txtFiles.addEventListener("change",
            () => this.onFileSelected());

        document.querySelector("#btn-slideshow-start").addEventListener("click",
            () => this.onSlideShowStartButtonClick());
        document.querySelector("#btn-slideshow-start-current").addEventListener("click",
            () => this.onSlideShowStartCurrentButtonClick());

        this.lstPreview.addDelegate("click", "img",
            (e, target) => this.onPreviewImageClick(e, target));

        document.querySelector("#pnl-sorts").addDelegate("click", "[data-sort-by]",
            (e, target) => this.onSortCommandClick(e, target));

        document.addEventListener("fullscreenchange",
            () => this.onFullScreenLeft());

        this.imgMain.addEventListener("click",
            () => this.proceed(1));
    }

    selectFiles() {
        this.txtFiles.click();
    }

    onFileSelected() {
        const files = this.selectingFiles = Array.from(this.txtFiles.files);

        if (!files || !files.length) {
            return;
        }

        this.txtFiles.value = "";

        this.sortFiles("name", true);
        this.showFileList();
    }

    showFileList() {
        const lst = this.lstPreview;

        lst.innerHTML = "";

        let counter = 0;
        for (let file of this.selectingFiles) {
            const img = document.createElement("img");
            const url = img.src = URL.createObjectURL(file);

            if (counter == 0) {
                img.classList.add("active");
                this.imgMain.src = img.src;
            }

            file.index = counter;
            file.url = url;
            img.setAttribute("data-index", counter);
            counter++;

            this.lstPreview.append(img);
        }

        this.pnlSelectPrompt.classList.add("d-none");
        this.pnlOptions.classList.remove("d-none");
    }

    onSlideShowStartButtonClick() {
        this.setMainImage(0);

        this.showSlideShow();
    }

    onSlideShowStartCurrentButtonClick() {
        this.showSlideShow();
    }

    onPreviewImageClick(_, target) {
        this.lstPreview.querySelector(".active").classList.remove("active");
        target.classList.add("active");

        let index = Number(target.getAttribute("data-index"));
        this.setMainImage(index);
    }

    onSortCommandClick(_, target) {
        let by = target.getAttribute("data-sort-by");
        this.sortFiles(by, false);

        this.showFileList();
    }

    sortFiles(by, reset) {
        if (reset || by != this.sortingAttr) {
            this.sortAsc = true;
        } else {
            this.sortAsc = !this.sortAsc;
        }

        let asc = this.sortAsc;
        this.sortingAttr = by;
        this.selectingFiles = this.selectingFiles.sort((a, b) => {
            let result = 0;

            if (a[by] > b[by]) {
                result = 1;
            } else {
                result = -1;
            }

            if (!asc) {
                result = -result;
            }

            return result;
        });
    }

    setMainImage(index) {
        if (index == this.showingIndex) {
            return;
        }

        this.showingIndex = index;
        let file = this.selectingFiles[index];

        this.imgMain.src = file.url;
    }

    setPreviewActive(index) {
        let target = this.lstPreview.querySelector(`[data-index='${index}']`);
        this.onPreviewImageClick(null, target);
        target.scrollIntoView();
    }

    async showSlideShow() {
        try {
            await this.pnlPresentation.requestFullscreen();
        } catch (e) {
            console.error(e);
            alert(e);
        }
    }

    onFullScreenLeft() {
        this.setPreviewActive(this.showingIndex);
    }

    proceed(delta) {
        let next = this.showingIndex + delta;
        if (next < 0) {
            next = 0;
        }

        if (next >= this.selectingFiles.length) {
            next = this.selectingFiles.length - 1;
        }

        this.setMainImage(next);
    }

}

(function () {
    new PresentationApp().initialize();
})();