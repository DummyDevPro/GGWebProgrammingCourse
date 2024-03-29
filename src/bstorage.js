const ls = sessionStorage;

function saveToLocalStorage(obj) {
    Object.keys(obj).forEach(key => {
        ls.setItem(key, obj[key])
    })
}

function loadLocalStorage(key) {
    return ls.getItem(key) == 'null' ? null : ls.getItem(key)
}

function clearSessionStorage() {
    ls.clear()
}

export {
    saveToLocalStorage,
    loadLocalStorage,
    clearSessionStorage
}