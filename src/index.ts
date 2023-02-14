import { HttpFunction } from '@google-cloud/functions-framework'
import puppeteer from 'puppeteer';
import storageService from './storage';

const generatePdf: HttpFunction = async (req, res) => {
  if (req.method !== 'POST') throw new Error(`${req.method} not supported`)

  console.debug('reportId: ', req.query.reportId)

  const { reportId } = req.query
  if (!reportId) throw new Error('Missing reportId')

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = `https://lifestresstest.com/stress-test-report?dd=${reportId}`

  console.log('navigating to ', url)

  await page.goto(url, { waitUntil: 'networkidle0' });
  const file = await page.pdf();

  console.debug('file created')

  await browser.close();
  await storageService.upload({ filename: `${reportId}-report.pdf`, file })

  res.sendStatus(200)
}

export {
  generatePdf,
}
