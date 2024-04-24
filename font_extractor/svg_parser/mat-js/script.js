import { svgToMat } from './index.js';

process.stdin.on('data', (data) => {
    // Parse JSON data
    const jsonData = JSON.parse(data);
    // console.log('Glyph:', jsonData[0].glyphs[0]);

    // Log received data
    jsonData.fonts.forEach((font, f_index) => font.glyphs.forEach((glyph, g_index) => jsonData.fonts[f_index].glyphs[g_index].mat = svgToMat(glyph.svg)));
    console.log(JSON.stringify(jsonData));

    // Process data as needed
    // For example, you can access jsonData.key
});