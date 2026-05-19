import puppeteer from 'puppeteer';
import fs from 'fs';

async function generateCarouselPDF() {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  // On attend que le serveur Astro soit bien prêt sur le port 4321
  try {
    await page.goto('http://localhost:4321/tools/linkedin-carousel', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
  } catch (e) {
    console.error("Erreur : Impossible d'accéder au serveur Astro. Assurez-vous qu'il tourne sur http://localhost:4321");
    await browser.close();
    process.exit(1);
  }

  // On définit le viewport pour correspondre au format LinkedIn (1080x1350)
  await page.setViewport({
    width: 1080,
    height: 1350,
    deviceScaleFactor: 2 // Pour une haute résolution
  });

  // Export en PDF avec les dimensions exactes des slides
  // Puppeteer va gérer les sauts de page définis dans le CSS
  await page.pdf({
    path: 'carousel_horacle_academy.pdf',
    width: '1080px',
    height: '1350px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  await browser.close();
  console.log('✅ Succès : Le carrousel a été généré dans carousel_horacle_academy.pdf');
}

generateCarouselPDF();
