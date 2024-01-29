function fileToDataUrl(file, callback) {
    const reader = new FileReader
    reader.onload = e => {
        callback(e.target.result)
    }
    reader.readAsDataURL(file)
}

export {
    fileToDataUrl
}