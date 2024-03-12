from drawer import Drawer
from glyph import Glyph
from line import Line
from bezier_tools import Bezier
from numpy import array
from numpy.linalg import norm

class MAT:
    def __init__(self, drawer: Drawer):
        self.drawer = drawer

    def two_prong(self, glyph: Glyph, line: Line, t: float):
        if line.ltype == 'M' or line.ltype == 'Z':
            return
        if line.ltype == 'L':
            bp1 = line.last_point
            radius = 35
            dx = line.points[0] - line.last_point[0]
            dy = line.points[1] - line.last_point[1]
            line_normal = array([-dy, dx])/norm(array([-dy, dx]))
            normal = array(bp1) + line_normal
            p1 = radius*line_normal + array(bp1)
        elif line.ltype == 'Q':
            bezier = Bezier([line.last_point, line.points[0:2], line.points[2:4]])
            bp1 = bezier.point(t)
            radius = 35
            normal = bezier.normal(t) + array(bp1)
            p1 = radius*array(bezier.normal(t)) + array(bp1)
        self.drawer.box([bp1[0]+5, bp1[1]+5], [bp1[0]-5, bp1[1]-5], "red")
        self.drawer.line(bp1[0], bp1[1], p1[0], p1[1], "red")
        closest_line = glyph.closest_line(p1)
        while True:
            bp2 = closest_line.closest_point(p1)
            if abs(norm(array(p1) - array(bp2)) - norm(array(p1) - array(bp1))) < 0.01:
                self.drawer.circle(p1[0], p1[1], radius, "blue")
                self.drawer.line(p1[0], p1[1], bp2[0], bp2[1], "blue")
                return (p1, radius)
            
            f_a = (normal[1] - bp1[1]) / (normal[0] - bp1[0]) if (normal[0] - bp1[0]) != 0 else 0.01
            f_b = bp1[1] - f_a * bp1[0]

            x = (bp2[0]**2 + bp2[1]**2 - bp1[0]**2 - bp1[1]**2 - f_b*(2*bp2[1] - 2*bp1[1]))/(f_a*(2*bp2[1] - 2*bp1[1]) - 2*bp1[0] + 2*bp2[0])
            y = f_a*x + f_b
            
            p1 = [x, y]
            radius = norm(array(p1) - array(bp1))

            
