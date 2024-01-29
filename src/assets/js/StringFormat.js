function firstCharCap(str, token) {
    const strArr = str.split(token);
    str = ''
    for (let i = 0; i < strArr.length; i++) {
        const s = strArr[i];
        str += s.charAt(0).toUpperCase() + s.substring(1) + ' '
    }

    return str.trim()
}

export { firstCharCap }