from os import close
from MAT import MAT
from xml.dom.minidom import parse
from drawer import Drawer
from gcode import Gcode
from bezier_tools import Bezier
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
            glyphs.append(Glyph(glyphUnicode, glyphSvgPath))
            
    return glyphs


drawer = Drawer()

glyphs = parseFont('abc.svg')
current_glyph = glyphs[1]
    
current_glyph.scale(-0.03, 0.03)    
current_glyph.transform(20, 10)    

file = open("gcode.gcode", 'w')
file.write(Gcode.lines_to_Gcode_bezier_G1(glyphs[0].lines, 0.1))
file.close()


current_glyph.scale(-10, 10)    
#glyphs[0].draw_glyph(drawer)

# bez = Bezier([[-100, 0], [100, 150], [700, -100]])
# bez.draw(drawer)
# bez.draw_quadratic_bounding_box(drawer)

def on_mouse_down(x, y):
    p = [x,y]
    drawer.box([p[0]+5, p[1]+5], [p[0]-5, p[1]-5], "red")
    
    closest_line = current_glyph.closest_line(p)
    closest_point = closest_line.closest_point(p)
    drawer.line(p[0], p[1], closest_point[0], closest_point[1], "blue")

drawer.set_on_mouse_click(on_mouse_down)

for line in current_glyph.lines:
    if line.ltype == 'Q':
        b = Bezier([line.last_point, line.points[0:2], line.points[2:4]])
        b.draw(drawer)
        #b.draw_quadratic_bounding_box(drawer)
    elif line.ltype == 'L':
        drawer.line(line.last_point[0], line.last_point[1], line.points[0], line.points[1])

for p in current_glyph.sharp_corners(drawer):
    drawer.box([p[0]+5, p[1]+5], [p[0]-5, p[1]-5], "green")

MAT = MAT(drawer)
MAT.two_prong(current_glyph, current_glyph.lines[2], 0.5)
for i in range(1, len(current_glyph.lines)-1):
    l = current_glyph.lines[i]
    MAT.two_prong(current_glyph, l, 0.5)

current_glyph.print_glyph()

drawer.update()
