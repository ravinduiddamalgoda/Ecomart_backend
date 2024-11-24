function generatePassword() {
    const length = 8;
    const lowerCharset = "abcdefghijklmnopqrstuvwxyz";
    const upperCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberCharset = "0123456789";
    const specialCharset = "!@#$%^&*()_+=-";
    const allCharset = lowerCharset + upperCharset + numberCharset + specialCharset;

    let password = "";
    password += lowerCharset[Math.floor(Math.random() * lowerCharset.length)];
    password += upperCharset[Math.floor(Math.random() * upperCharset.length)];
    password += numberCharset[Math.floor(Math.random() * numberCharset.length)];
    password += specialCharset[Math.floor(Math.random() * specialCharset.length)];

    for (let i = password.length; i < length; i++) {
        password += allCharset[Math.floor(Math.random() * allCharset.length)];
    }

    // Shuffle the password to ensure randomness
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}

module.exports = generatePassword;
