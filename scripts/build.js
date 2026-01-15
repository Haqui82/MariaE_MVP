const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  await fs.rm(dest, { recursive: true, force: true });
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    // Copy HTML files from Front-End/html to dist/
    const htmlSrc = path.join(__dirname, '..', 'Front-End', 'html');
    const htmlDest = path.join(__dirname, '..', 'dist');
    await copyDir(htmlSrc, htmlDest);
    console.log('✓ HTML files copied to dist/');

    // Copy CSS files to dist/css/
    const cssSrc = path.join(__dirname, '..', 'Front-End', 'css');
    const cssDest = path.join(__dirname, '..', 'dist', 'css');
    await copyDir(cssSrc, cssDest);
    console.log('✓ CSS files copied to dist/css/');

    // Copy JS files to dist/js/
    const jsSrc = path.join(__dirname, '..', 'Front-End', 'js');
    const jsDest = path.join(__dirname, '..', 'dist', 'js');
    await copyDir(jsSrc, jsDest);
    console.log('✓ JS files copied to dist/js/');

    // Copy images to dist/images/
    const imagesSrc = path.join(__dirname, '..', 'Front-End', 'html', 'images');
    const imagesDest = path.join(__dirname, '..', 'dist', 'images');
    await copyDir(imagesSrc, imagesDest);
    console.log('✓ Images copied to dist/images/');

    // Copy imagenes to dist/imagenes/
    const imagenesSrc = path.join(__dirname, '..', 'Front-End', 'html', 'imagenes');
    const imagenesDest = path.join(__dirname, '..', 'dist', 'imagenes');
    await copyDir(imagenesSrc, imagenesDest);
    console.log('✓ Imagenes copied to dist/imagenes/');

    // Copy fonts to dist/fonts/
    const fontsSrc = path.join(__dirname, '..', 'Front-End', 'fonts');
    const fontsDest = path.join(__dirname, '..', 'dist', 'fonts');
    await copyDir(fontsSrc, fontsDest);
    console.log('✓ Fonts copied to dist/fonts/');

    console.log('Build completed: dist/ created with all assets');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
})();