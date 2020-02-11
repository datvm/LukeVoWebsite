export class BaseExport {

    async exportFileAsync(fileName, blob) { }
    async finalizeExportAsync() { }

    downloadBlob(fileName, blob) {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.target = "_blank";
        a.click();
    }

}

export class ZipExport extends BaseExport {

    constructor() {
        super();
        this.zip = new JSZip();
    }

    async exportFileAsync(fileName, blob) {
        this.zip.file(fileName, blob, {
            binary: true,
        });
    }

    async finalizeExportAsync() {
        const blob = await this.zip.generateAsync({ type: "blob" });
        this.downloadBlob("resized.zip", blob);
    }

}

export class FilesExport extends BaseExport {

    async exportFileAsync(fileName, blob) {
        this.downloadBlob(fileName, blob);
    }

}