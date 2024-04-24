from parser import parseFont, parseFontsToJson, parseJsonFontMat
from sys import argv
from subprocess import run
import fitz
import json

from gcode import Gcode

def pdf_unit_to_mm(pdf_unit: float) -> float:
    inches = pdf_unit / 72
    return inches * 25.4


fontsInFile = []

for p in range(1, len(argv) - 1):
    inputFontPath = argv[p]
    #log 23:36-24-04
    print("inputfontpath test (parse-svg):", inputFontPath)
    glyphs = parseFont(inputFontPath)
    fontsInFile.append((inputFontPath, glyphs))

fontsPath = argv[len(argv) - 1]

file = open("fonts.json", 'w')
file.write(parseFontsToJson(fontsInFile)) # To trzeba wysłać do JSa
file.close()

doc = fitz.open(fontsPath)
page = doc[0]
pdf_dict = page.get_text("rawdict")

result = run(["node", 'svg_parser/mat-js/script.js'], input=parseFontsToJson(fontsInFile), capture_output=True, text=True)
print(result.stderr.strip())
answer=result.stdout.strip()
file = open("fonts.json", 'w')
file.write(answer) 
file.close()

fonts = json.loads(answer)
fonts = fonts['fonts']

fonts_glyphs = []
for font in fonts:
    fonts_glyphs.append(parseJsonFontMat(font))

file = open("gcode.gcode", 'w')
output: str = 'G21\n'
output += 'G17\n'
output += 'G90\n'
output += 'M3 S14000\n'
file.write(output)
block_index = -1
for b in pdf_dict['blocks']:
    block_index += 1
    for c in b['lines'][0]['spans'][0]['chars']:
        for i in range(len(fonts_glyphs[0])):
            if len(fonts_glyphs[block_index][i][0].unicode) > 1:
                print(fonts_glyphs[block_index][i][0].unicode, " ", i, " ", block_index)
            if ord(fonts_glyphs[block_index][i][0].unicode) == ord(c['c']):
                glyph = fonts_glyphs[block_index][i][0]
                circles = fonts_glyphs[block_index][i][1]
                glyph.scale_and_move_to_bbox(c['bbox'][0], c['bbox'][1], c['bbox'][2], c['bbox'][3])
                glyph.transform(-70, -70)
                glyph.scale(0.1, 0.1)
                radiuses = []
                max_radius = 0
                for circle in circles:
                    if circle['radius'] > max_radius:
                        max_radius = circle['radius']
                scale_factor = 2.5 / max_radius
                for circle in circles:
                    radiuses.append(circle['radius'] * scale_factor)
                    
                file.write(Gcode.lines_to_Gcode_with_radius(glyph.lines, radiuses, 90, 5, 0, 30))
                break

file.write('G0 Z10\n')
file.write('M5\n')
file.write('M30\n')
file.close()
