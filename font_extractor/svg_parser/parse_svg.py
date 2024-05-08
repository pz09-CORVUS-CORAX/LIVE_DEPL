from copy import deepcopy
from fontparser import parseFont, parseFontsToJson, parseJsonFontMat
from sys import argv
from subprocess import run
import fitz
import json

from gcode import Gcode

def pdf_unit_to_mm(pdf_unit: float) -> float:
    inches = pdf_unit / 72
    return inches * 25.4


fontsInFile = []

for p in range(1, len(argv) - 4):
    inputFontPath = argv[p]
    glyphs = parseFont(inputFontPath)
    fontsInFile.append((inputFontPath, glyphs))

fontsPath = argv[len(argv) - 4]
drillAngle = float(argv[len(argv) - 3])
drillActiveHeight = float(argv[len(argv) - 2])
drillMovementSpeed = float(argv[len(argv) - 1])

file = open("fonts.json", 'w')
file.write(parseFontsToJson(fontsInFile)) # To trzeba wysłać do JSa
file.close()

doc = fitz.open(fontsPath)
page = doc[0]
pdf_dict = page.get_text("rawdict")

# Printing bounding boxes
# doc = fitz.open('test_2.pdf')
doc = fitz.open(fontsPath)
page_2 = doc[0]
page_2.clean_contents()
        

result = run(["node", 'font_extractor/svg_parser/mat-js/script.js'], input=parseFontsToJson(fontsInFile), capture_output=True, text=True, encoding='utf-8')
print(result.stderr.strip())
answer=result.stdout.strip()
file = open("fonts.json", 'w')
file.write(answer) 
file.close()

file = open('pdf_text.json', 'w')
file.write(json.dumps(pdf_dict))
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
        size = b['lines'][0]['spans'][0]['size']
        ascender = b['lines'][0]['spans'][0]['ascender']
        descender = b['lines'][0]['spans'][0]['descender']
        for i in range(len(fonts_glyphs[block_index])):           
            if ord(fonts_glyphs[block_index][i][0].unicode) == ord(c['c']):
                glyph = deepcopy(fonts_glyphs[block_index][i][0])
                original_glyph = fontsInFile[block_index][1][i]
                circles = fonts_glyphs[block_index][i][1]
                scale_factor = glyph.scale_and_move_to_bbox(c['bbox'][0], c['bbox'][1], c['bbox'][2], c['bbox'][3], original_glyph)
                glyph.transform(-30, -50)
                glyph.scale(0.03937007874, 0.03937007874) #Inches to mm conversion
                radiuses = []
                for circle in circles:
                    radiuses.append(circle['radius'] * scale_factor) 
                    
                file.write(Gcode.lines_to_Gcode_with_radius(glyph.lines, radiuses, drillAngle, drillActiveHeight, drillMovementSpeed))
                break


file.write('G0 Z10\n')
file.write('M5\n')
file.write('M30\n')
file.close()
