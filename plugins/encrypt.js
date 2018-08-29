import * as CryptoJS from 'crypto-js'

export const AESEncrypto = (str, key = "a263e73bd9083ae6") => {
    key = PaddingLeft(key, 16);
    key = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.AES.encrypt(str, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

const PaddingLeft = (key, length) => {
    let pkey = key.toString();
    let l = pkey.length;
    if (l < length) {
        pkey = new Array(length - l + 1).join('0') + pkey;
    } else if (l > length) {
        pkey = pkey.slice(length);
    }
    return pkey;
}