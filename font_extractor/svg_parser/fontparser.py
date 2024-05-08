import json
from xml.dom.minidom import parse
from drawer import Drawer
from gcode import Gcode
from bezier_tools import Bezier
from MAT import MAT
from numpy import array
from numpy.linalg import norm

from glyph import Glyph

def parseFont(path_to_font: str) -> list[Glyph]:
    glyphs = []
    document = parse(path_to_font)

    for g in document.getElementsByTagName("glyph"):
        if g.hasAttribute("d") and g.getAttribute("unicode"):
            glyphUnicode = g.getAttribute("unicode")
            glyphSvgPath = g.getAttribute("d")
            glyph_horiz_adv_x = g.getAttribute("horiz-adv-x")
            glyphs.append(Glyph(glyphUnicode, glyphSvgPath, float(glyph_horiz_adv_x)))
            
    return glyphs

def parseFontsToJson(fonts: list[tuple[str, list[Glyph]]])  -> str:
    jsonOutput = {}
    jsonOutput["fonts"] = []
    for font in fonts:
        glyphs = [] 
        for glyph in font[1]:
            g = {}
            g["unicode"] = glyph.unicode
            g["svg"] = glyph.svg_code()
            glyphs.append(g)
        jsonOutput["fonts"].append({"name": font[0], "glyphs": glyphs})
    return json.dumps(jsonOutput)

def parseJsonFontMat(jsonFont):
    glyphs = []
    for glyph in jsonFont['glyphs']:
        glyphs.append((Glyph(glyph['unicode'], glyph['mat']['svg']), glyph['mat']['circles']))

    return glyphs