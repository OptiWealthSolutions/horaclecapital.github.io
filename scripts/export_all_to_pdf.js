import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4321';
const EXPORT_DIR = './exported_articles';

async function exportToPdf(url, outputPath) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log(`Exporting: ${url} -> ${outputPath}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Add a small delay to ensure any fonts or images are fully rendered
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: { top: '2cm', right: '1.5cm', bottom: '2cm', left: '1.5cm' },
      printBackground: true,
      displayHeaderFooter: false,
    });
    console.log(`Successfully exported: ${outputPath}`);
  } catch (error) {
    console.error(`Error exporting ${url}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function run() {
  const rapportsFiles = fs.readdirSync('./src/content/rapports').filter(f => f.endsWith('.md'));
  const recherchesFiles = fs.readdirSync('./src/content/recherches').filter(f => f.endsWith('.md'));

  const reports = rapportsFiles.map(f => ({
    url: `${BASE_URL}/reports/${f.replace('.md', '')}`,
    path: `${EXPORT_DIR}/reports/${f.replace('.md', '.pdf')}`
  }));

  const research = recherchesFiles.map(f => ({
    url: `${BASE_URL}/recherches/${f.replace('.md', '')}`,
    path: `${EXPORT_DIR}/research/${f.replace('.md', '.pdf')}`
  }));

  const allArticles = [...reports, ...research];

  console.log(`Found ${allArticles.length} articles to export.`);

  for (const article of allArticles) {
    await exportToPdf(article.url, article.path);
  }

  console.log('Finished exporting all articles.');
}

run().catch(console.error);
