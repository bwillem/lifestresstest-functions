import { HttpFunction } from '@google-cloud/functions-framework'
import puppeteer from 'puppeteer';
import storageService from './storage';

const generatePdf: HttpFunction = async (req, res) => {
  if (req.method !== 'POST') throw new Error(`${req.method} not supported`)

  console.debug('survey_id: ', req.query.survey_id)

  const { survey_id } = req.query
  if (!survey_id) throw new Error('Missing survey_id')

  const browser = await puppeteer.launch({ headless: true, args: ['--user-agent=LST'] });
  const page = await browser.newPage()
  const url = `https://lifestresstest.com/stress-test-report?dd=${survey_id}`

  console.log('navigating to ', url)

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  const buffer = await page.pdf()

  console.debug('file created')

  await browser.close();
  await storageService.upload({ filename: `${survey_id}-report.pdf`, buffer })

  res.sendStatus(200)
}

export {
  generatePdf,
}
