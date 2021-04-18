const crypto = require('crypto');
const bcrypt=require("bcrypt")

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

const getNomeCrittografato=(nome)=>{

}

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

const criptaPasswordPerInvio=async (chiaro)=>{
    const salt=await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(chiaro, salt)
    return hashedPassword
}

module.exports = {
    encrypt,
    decrypt,
    criptaPasswordPerInvio
};