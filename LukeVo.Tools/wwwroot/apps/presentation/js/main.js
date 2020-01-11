class PresentationApp {

    txtFiles = document.querySelector("#txt-files");
    lstPreview = document.querySelector("#lst-preview");

    pnlSelectPrompt = document.querySelector("#pnl-select-prompt");
    pnlOptions = document.querySelector("#pnl-options");
    pnlPresentation = document.querySelector("#pnl-presentation");

    imgMain = document.querySelector("#img-main");

    initialize() {
        document.addEventListener("keydown", (e) => {
            let shouldPreventDF = true;

            if (e.ctrlKey && e.keyCode == 79) {
                this.selectFiles();
            } else if (e.keyCode == 39 || e.keyCode == 40) {
                this.onArrowKeyTap(true);
            } else if (e.keyCode == 37 || e.keyCode == 38) {
                this.onArrowKeyTap(false);
            } else if (e.keyCode == 116) {
                if (e.shiftKey) {
                    this.onSlideShowStartCurrentButtonClick();
                } else {
                    this.onSlideShowStartButtonClick();
                }
            } else {
                shouldPreventDF = false;
            }

            if (shouldPreventDF) {
                e.preventDefault();
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

    onArrowKeyTap(shouldGoNext) {
        if (!this.isFullScreen()) {
            return;
        }

        this.proceed(shouldGoNext ? 1 : -1);
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

    async showFileList() {
        const lst = this.lstPreview;

        lst.innerHTML = "";

        let counter = 0;
        for (let file of this.selectingFiles) {
            const img = document.createElement("img");
            const url = img.src = URL.createObjectURL(file);
            
            file.index = counter;
            file.url = url;
            img.setAttribute("data-index", counter);
            counter++;

            this.lstPreview.append(img);
        }

        this.setMainImageAsync(0);
        this.setPreviewActive(0);

        this.pnlSelectPrompt.classList.add("d-none");
        this.pnlOptions.classList.remove("d-none");
    }

    async readFileAsync(file) {
        return await new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    }

    onSlideShowStartButtonClick() {
        this.setMainImageAsync(0);

        this.showSlideShow();
    }

    onSlideShowStartCurrentButtonClick() {
        this.showSlideShow();
    }

    onPreviewImageClick(_, target) {
        let currActive = this.lstPreview.querySelector(".active");

        if (currActive) {
            currActive.classList.remove("active");
        }
        
        target.classList.add("active");

        let index = Number(target.getAttribute("data-index"));
        this.setMainImageAsync(index);
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

    async setMainImageAsync(index) {
        if (index == this.showingIndex) {
            return;
        }

        this.showingIndex = index;
        let file = this.selectingFiles[index];

        if (!file.cache) {
            await this.cacheAsync(index);
        }

        this.imgMain.style.backgroundImage = `url(${file.cache})`;

        // Cache the next and previous, do NOT await here
        if (index > 0) {
            this.cacheAsync(index - 1);
        }

        if (index < this.selectingFiles.length - 1) {
            this.cacheAsync(index + 1);
        }
    }

    setPreviewActive(index) {
        let target = this.lstPreview.querySelector(`[data-index='${index}']`);
        this.onPreviewImageClick(null, target);
        target.scrollIntoView();
    }

    async showSlideShow() {
        if (this.isFullScreen()) {
            return;
        }

        try {
            await this.pnlPresentation.requestFullscreen();
        } catch (e) {
            console.error(e);
            alert(e);
        }
    }

    onFullScreenLeft() {
        if (!this.isFullScreen()) {
            this.setPreviewActive(this.showingIndex);
        }
    }

    proceed(delta) {
        let next = this.showingIndex + delta;
        if (next < 0) {
            next = 0;
        }

        if (next >= this.selectingFiles.length) {
            next = this.selectingFiles.length - 1;
        }

        this.setMainImageAsync(next);
    }

    async cacheAsync(index) {
        let file = this.selectingFiles[index];

        if (file.cache) {
            return;
        }

        file.cache = await this.readFileAsync(file);
    }

    isFullScreen() {
        return document.fullscreenElement;
    }

}

(function () {
    new PresentationApp().initialize();
})();