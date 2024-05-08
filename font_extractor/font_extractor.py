import os
import fontforge   
from sys import argv

if len(argv) < 2:
    print("Usage: fontforge -script font_extractor.py pdf_path...")
    quit()

fontsInFile = []


inputFontPath = argv[1]
inputFontPath=inputFontPath.replace('"', '')
print("here inputen:", inputFontPath)
fontsInFile = fontforge.fontsInFile(inputFontPath)
print("fontsinfile:", fontsInFile)
for fName in fontsInFile:
    currentFontName = fName
    inputFontFont = inputFontPath + "(" + currentFontName + ")"
    font = fontforge.open(inputFontFont)
    font.generate(fName + ".svg")
    print("fontczykihu:",font)

fonts_string = ".svg ".join(fontsInFile)
fonts_string = fonts_string + ".svg " + argv[1]
#log 23:32-24-04
print("test fontS_string", fonts_string)

os.system("python3 font_extractor/svg_parser/parse_svg.py " + fonts_string)
    