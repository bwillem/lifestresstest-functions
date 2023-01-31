import { HttpFunction } from '@google-cloud/functions-framework'
import puppeteer from 'puppeteer';
import storageService from './storage';

const generatePdf: HttpFunction = async (req, res) => {
  if (req.method !== 'POST') throw new Error(`${req.method} not supported`)

  console.debug('userId: ', req.query.userId)

  const { userId } = req.query
  if (!userId) throw new Error('Missing userId')

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = `https://lifestresstest.com/stress-test-report?dd=${userId}`

  console.log('navigating to ', url)

  await page.goto(url, { waitUntil: 'networkidle0' });
  const file = await page.pdf();

  console.debug('file created')

  await browser.close();
  await storageService.upload({ filename: `${userId}-report.pdf`, file })

  res.sendStatus(200)
}

export {
  generatePdf,
}
