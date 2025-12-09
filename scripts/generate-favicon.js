const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
    console.log('🎨 Generating custom "PB" favicon...\n');

    // Create SVG with "PB" text
    const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="512" height="512" rx="80" fill="url(#grad)"/>
        <text 
            x="50%" 
            y="50%" 
            dominant-baseline="central" 
            text-anchor="middle" 
            font-family="Arial, sans-serif" 
            font-size="280" 
            font-weight="bold" 
            fill="white"
            letter-spacing="-10"
        >PB</text>
    </svg>
    `;

    const svgBuffer = Buffer.from(svg);

    try {
        // Generate PNG favicons in different sizes
        const sizes = [16, 32, 48, 64, 128, 256];
        
        console.log('📦 Generating PNG favicons...');
        for (const size of sizes) {
            await sharp(svgBuffer)
                .resize(size, size)
                .png({ quality: 90, compressionLevel: 9 })
                .toFile(path.join(__dirname, '..', 'public', `favicon-${size}x${size}.png`));
            console.log(`  ✓ Generated favicon-${size}x${size}.png`);
        }

        // Generate main favicon.png (32x32)
        await sharp(svgBuffer)
            .resize(32, 32)
            .png({ quality: 90, compressionLevel: 9 })
            .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));
        console.log('  ✓ Generated favicon.png (32x32)');

        // Generate apple-touch-icon (180x180)
        await sharp(svgBuffer)
            .resize(180, 180)
            .png({ quality: 90, compressionLevel: 9 })
            .toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));
        console.log('  ✓ Generated apple-touch-icon.png (180x180)');

        // Save SVG version
        fs.writeFileSync(
            path.join(__dirname, '..', 'public', 'favicon.svg'),
            svg
        );
        console.log('  ✓ Generated favicon.svg');

        // Generate ICO file (multi-size)
        console.log('\n📦 Generating favicon.ico...');
        await sharp(svgBuffer)
            .resize(32, 32)
            .toFormat('png')
            .toFile(path.join(__dirname, '..', 'app', 'favicon.ico'));
        console.log('  ✓ Generated app/favicon.ico (32x32)');

        // Display file sizes
        console.log('\n📊 File sizes:');
        const publicDir = path.join(__dirname, '..', 'public');
        const appDir = path.join(__dirname, '..', 'app');
        
        const files = [
            { path: path.join(publicDir, 'favicon.png'), name: 'favicon.png' },
            { path: path.join(publicDir, 'favicon.svg'), name: 'favicon.svg' },
            { path: path.join(appDir, 'favicon.ico'), name: 'app/favicon.ico' },
            { path: path.join(publicDir, 'apple-touch-icon.png'), name: 'apple-touch-icon.png' }
        ];

        let totalSize = 0;
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                const stats = fs.statSync(file.path);
                const sizeKB = (stats.size / 1024).toFixed(2);
                totalSize += stats.size;
                console.log(`  ${file.name}: ${sizeKB} KB`);
            }
        });

        console.log(`\n✅ Total size: ${(totalSize / 1024).toFixed(2)} KB (was 764 KB)`);
        console.log(`💾 Saved: ${((764 - totalSize / 1024) / 764 * 100).toFixed(1)}%\n`);

    } catch (error) {
        console.error('❌ Error generating favicon:', error);
        process.exit(1);
    }
}

generateFavicon();
