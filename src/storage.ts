import * as fetch from 'isomorphic-fetch'
import * as FormData from 'form-data'
import { Blob } from 'buffer'

interface UploadOpts {
    filename: string
    buffer: Buffer
}

const upload = async ({ filename, buffer }: UploadOpts) => {
    const formData = new FormData()

    console.debug('uploading file: ', filename)

    formData.append('file', buffer, filename)
    formData.append('title', filename)
    formData.append('caption', 'Report file')

    try {
        if (!process.env.password) throw new Error('Missing password')
        const r = await fetch('https://lifestresstest.com/wp-json/wp/v2/media', {
            method: 'post',
            headers: {
                Authorization: `Basic ${Buffer.from(`admin:${process.env.password}`).toString('base64')}`
                // Authorization: `Basic admin:${process.env.password}`
            },
            body: formData,
        })
        if (!r.ok) throw new Error(JSON.stringify(r.body))
        console.debug(JSON.stringify(r.body))
        console.debug('file uploaded successfully')
    } catch (e) {
        console.error(e)
        throw new Error('File upload failed')
    }
}

const storageService = {
    upload,
}

export default storageService