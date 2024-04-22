import os
import fontforge   
from sys import argv

if len(argv) < 2:
    print("Usage: fontforge -script font_extractor.py pdf_path...")
    quit()

fontsInFile = []


inputFontPath = argv[1]
fontsInFile = fontforge.fontsInFile(inputFontPath)
print(fontsInFile)
for fName in fontsInFile:
    currentFontName = fName
    inputFontFont = inputFontPath + "(" + currentFontName + ")"
    font = fontforge.open(inputFontFont)
    font.generate(fName + ".svg")
    print(font)

fonts_string = ".svg ".join(fontsInFile)
fonts_string = fonts_string + ".svg " + argv[1]

os.system("python svg_parser/parse_svg.py " + fonts_string)
    