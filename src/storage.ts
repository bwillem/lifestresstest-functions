import { Storage } from "@google-cloud/storage"

const bucket = 'lst-reports'
const storage = new Storage()

interface UploadOpts {
    filename: string
    file: Buffer
}

const upload = async ({ filename, file }: UploadOpts) => {
    const _file = storage.bucket(bucket).file(filename)

    console.debug('uploading file: ', filename)

    try {
        await _file.save(file)
    } catch (e) {
        console.error(e)
        throw new Error('Saving file to GCS failed')
    }
}

const storageService = {
    upload,
}

export default storageService