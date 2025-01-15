function decrypt(encryptedText, key) {
    let decrypted = '';
    for (let i = 0; i < encryptedText.length; i++) {
        decrypted += String.fromCharCode(encryptedText.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
}