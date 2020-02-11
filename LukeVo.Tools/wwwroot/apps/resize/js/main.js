import * as ResizeStrat from "./resize-strat.js";
import * as Output from "./output.js";
import { Resizer } from "./resizer.js";

class ResizeApp {

    secFiles = document.querySelector("#section-files");
    txtFiles = document.querySelector("#txt-files");
    gallery = document.querySelector("gallery");

    frmNewSize = document.querySelector("#frm-new-size");
    txtWidth = document.querySelector("#txt-size-w");
    txtHeight = document.querySelector("#txt-size-h");
    sizes = document.querySelector("sizes");
    txtFilename = document.querySelector("#txt-filename");
    btnDownload = document.querySelector("#btn-download");

    initialize() {
        const settings = this.getSavedSettings();
        for (let size of settings.sizes) {
            this.addSize(size[0], size[1]);
        }

        let opt = document.querySelector(`input[name="resize-strat"][value="${settings.strat}"]`);
        if (opt) {
            opt.checked = true;
        }

        opt = document.querySelector(`input[name="output-type"][value="${settings.output}"]`);
        if (opt) {
            opt.checked = true;
        }

        this.txtFilename.value = settings.name;

        this.addEventListeners();
    }

    addEventListeners() {
        this.secFiles.addEventListener("click",
            () => this.chooseFile());

        this.secFiles.addEventListener("dragover",
            () => event.preventDefault());

        this.secFiles.addEventListener("drop",
            () => this.onItemsDropped());

        this.txtFiles.addEventListener("change",
            () => this.onFileInputChanged());

        this.frmNewSize.addEventListener("submit",
            () => this.onAddSizeButtonClick());

        this.sizes.addDelegate("click", "i.fa-trash",
            (e, target) => this.onDeleteSizeButtonClick(e, target));

        this.btnDownload.addEventListener("click",
            () => this.onDownloadButtonClickAsync());

        document.querySelector("#btn-add-size").addEventListener("click",
            () => this.onAddSizeButtonClick());

        document.body.addEventListener("keydown", (e) => {
            let shouldPD = true;

            switch (e.keyCode) {
                case 79:
                    if (e.ctrlKey) {
                        this.chooseFile();
                    } else {
                        shouldPD = false;
                    }

                    break;
                default:
                    shouldPD = false;
                    break;
            }

            if (shouldPD) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        });
    }

    onItemsDropped() {
        event.preventDefault();

        if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) {
            return;
        }

        this.onFilesChosen(event.dataTransfer.files);
    }

    onDeleteSizeButtonClick(e, target) {
        const size = target.closest("size");
        if (!size) {
            return;
        }

        size.remove();
    }

    async onDownloadButtonClickAsync() {
        try {
            this.btnDownload.setAttribute("disabled", "");

            if (!this.selectingFiles || !this.selectingFiles.length) {
                throw Language.getLanguageText("BulkResize_Error_FileRequired");
            }

            const fileNameTemplate = this.txtFilename.value;
            const selectedRS = document.querySelector("input[name='resize-strat']:checked").value;
            const selectedOutput = document.querySelector("input[name='output-type']:checked").value;

            const resizeStrat = new ResizeStrat[`${selectedRS}ResizeStrat`]();
            const output = new Output[`${selectedOutput}Export`]();

            const sizes = [];
            this.sizes.querySelectorAll(":scope > size").forEach(size => {
                const w = parseInt(size.getAttribute("data-w"));
                const h = parseInt(size.getAttribute("data-h"));
                sizes.push(new ResizeStrat.Size(w, h));
            });

            await this.saveSettings({
                strat: selectedRS,
                name: fileNameTemplate,
                output: selectedOutput,
                sizes: sizes.map(q => [q.w, q.h]),
            });

            for (let file of this.selectingFiles) {
                for (let size of sizes) {
                    const img = await Resizer.resizeAsync(file, size, resizeStrat);

                    let srcFileName = file.name;
                    const lastDot = srcFileName.lastIndexOf(".");

                    if (lastDot > -1) {
                        srcFileName = srcFileName.substr(0, lastDot);
                    }

                    const fileName = fileNameTemplate.formatUnicorn(srcFileName, size.w, size.h);

                    await output.exportFileAsync(fileName, img);
                }
            }

            await output.finalizeExportAsync();
        } catch (e) {
            alert(e);
            console.error(e);
        } finally {
            this.btnDownload.removeAttribute("disabled");
        }
    }

    chooseFile() {
        this.txtFiles.click();
    }

    onFileInputChanged() {
        const files = this.txtFiles.files;

        if (!files || !files.length) {
            return;
        }

        this.onFilesChosen(files);
        this.txtFiles.value = "";
    }

    onFilesChosen(files) {
        // Always clone the file array
        this.selectingFiles = Array.from(files);

        // Show the preview
        this.gallery.innerHTML = "";
        const frag = new DocumentFragment();

        for (let file of files) {
            const el = document.createElement("item");
            el.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
            el.title = file.name;

            frag.append(el);
        }
        this.gallery.append(frag);
    }

    onAddSizeButtonClick() {
        event.preventDefault();

        try {
            if (!this.frmNewSize.reportValidity()) {
                return;
            }

            const w = parseInt(this.txtWidth.value);
            const h = parseInt(this.txtHeight.value);

            this.addSize(w, h);
        } catch (e) {
            console.error(e);
        }
    }

    addSize(w, h) {
        if (this.sizes.querySelector(`[data-w="${w}"][data-h="${h}"]`)) {
            return;
        }

        const size = document.createElement("size");
        size.classList.add("badge", "badge-primary", "size");
        size.setAttribute("data-w", w);
        size.setAttribute("data-h", h);

        const textSpan = document.createElement("span");
        textSpan.innerHTML = `${w} x ${h}`
        size.append(textSpan);

        const btnRemove = document.createElement("i");
        btnRemove.classList.add("fa", "fa-trash");
        size.append(btnRemove);

        this.sizes.append(size);
    }

    getSavedSettings() {
        let raw = localStorage.getItem("settings");
        if (!raw) {
            return ResizeApp.DEFAULT_SETTINGS;
        }

        return JSON.parse(raw);
    }

    saveSettings(settings) {
        localStorage.setItem("settings", JSON.stringify(settings));
    }

}
ResizeApp.DEFAULT_SETTINGS =
{
    sizes: [
        [512, 512],
        [256, 256],
        [192, 192],
        [128, 128],
        [96, 96],
        [72, 72],
        [64, 64],
        [48, 48],
        [32, 32],
        [24, 24],
        [16, 16],
    ],
    strat: "Contain",
    name: "{0}-{1}.png",
    output: "Zip",
};


(function () {
    new ResizeApp().initialize();
})();