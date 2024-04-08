import { Buffer } from 'node:buffer'
const {
    scryptSync,
    createDecipheriv
} = await import('node:crypto')

const algorithm = 'aes-192-cbc'

const key = scryptSync(process.env.SECRET_APP_JWT, 'salt', 24)

const iv = Buffer.alloc(16, 0)

const decipher = createDecipheriv(algorithm, key, iv)

export const decrypt = (hash) => {
    let decrypted = decipher.update(hash, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}