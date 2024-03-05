import fontforge   
from sys import argv 

if len(argv) < 2:
    print("Usage: fontforge -script font_extractor.py pdf_path...")
    quit()

for p in range(1, len(argv)):
    inputFontPath = argv[p]
    fontsInFile = fontforge.fontsInFile(inputFontPath)
    for f_name in fontsInFile:
        currentFontName = f_name
        inputFontFont = inputFontPath + "(" + currentFontName + ")"
        font = fontforge.open(inputFontFont)
        font.generate(f_name + ".svg")
        print(font)