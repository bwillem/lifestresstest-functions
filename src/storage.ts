import * as fetch from 'isomorphic-fetch'
import * as FormData from 'form-data'

interface UploadOpts {
    filename: string
    file: Buffer
}

const upload = async ({ filename, file }: UploadOpts) => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('title', filename)
    formData.append('caption', 'Report file')

    console.debug('uploading file: ', filename)

    try {
        if (!process.env.password) throw new Error('Missing password')
        await fetch('https://lifestresstest.com/wp-json/wp/v2/media', {
            method: 'post',
            headers: {
                Authorization: `Basic admin:${Buffer.from(process.env.password).toString('base64')}`
            },
            body: formData,
        })
        console.debug('file uploaded successfully')
    } catch (e) {
        console.error(e)
        throw new Error('Saving file to GCS failed')
    }

}

const storageService = {
    upload,
}

export default storageService