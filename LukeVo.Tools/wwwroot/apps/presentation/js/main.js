﻿class PresentationApp {

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
            } else if (e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 32) {
                this.onNavigationKeyPressed(true);
            } else if (e.keyCode == 37 || e.keyCode == 38) {
                this.onNavigationKeyPressed(false);
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

        document.querySelector("#btn-open").addEventListener("click",
            () => this.selectFiles());
        document.querySelector("#btn-slideshow-start").addEventListener("click",
            () => this.onSlideShowStartButtonClick());
        document.querySelector("#btn-slideshow-start-current").addEventListener("click",
            () => this.onSlideShowStartCurrentButtonClick());

        this.lstPreview.addDelegate("click", ".img",
            (e, target) => this.onPreviewImageClick(e, target));

        document.querySelector("#pnl-sorts").addDelegate("click", "[data-sort-by]",
            (e, target) => this.onSortCommandClick(e, target));

        document.addEventListener("fullscreenchange",
            () => this.onFullScreenLeft());

        this.imgMain.addEventListener("click",
            () => this.proceed(1));
    }

    onNavigationKeyPressed(shouldGoNext) {
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

        this.sortFiles("powerpoint", true);
        this.showFileList();
    }

    async showFileList() {
        const lst = this.lstPreview;

        lst.innerHTML = "";

        let counter = 0;
        for (let file of this.selectingFiles) {
            const img = document.createElement("div");
            img.className = "img";

            const url = URL.createObjectURL(file);
            img.style.backgroundImage = `url(${url})`;
            
            file.index = counter;
            file.url = url;
            img.setAttribute("data-index", counter);
            counter++;

            img.title = file.name;

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

        const compareByNameFunc = (a, b) => {
            if (a.name == b.name) {
                return 0;
            } else if (a.name < b.name) {
                return -1;
            } else {
                return 1;
            }
        };
        let compareFunc = compareByNameFunc;

        switch (by) {
            case "lastModified":
                compareFunc = (a, b) => {
                    if (a.lastModified == b.lastModified) {
                        return 0;
                    } else if (a.lastModified < b.lastModified) {
                        return -1;
                    } else {
                        return 1;
                    }
                };

                break;
            case "powerpoint":
                compareFunc = (a, b) => {
                    try {
                        let nameA = this.getPowerPointNumFromFileName(a.name);
                        let nameB = this.getPowerPointNumFromFileName(b.name);

                        return nameA - nameB;
                    } catch (e) {
                        // Fallback to name
                        return compareByNameFunc(a, b);
                    }
                };

                break;
        }

        const asc = this.sortAsc;
        this.sortingAttr = by;
        this.selectingFiles = this.selectingFiles.sort((a, b) => {
            let result = compareFunc(a, b);

            if (!asc) {
                result = -result;
            }

            return result;
        });
    }

    getPowerPointNumFromFileName(fullName) {
        let name = this.getFileName(fullName);
        name = name.substr(5); // Remove "Slide" prefix

        return parseInt(name);
    }

    getFileName(fullName) {
        let lastDot = fullName.lastIndexOf(".");

        if (lastDot == -1) {
            return fullName;
        } else {
            return fullName.substr(0, lastDot);
        }
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