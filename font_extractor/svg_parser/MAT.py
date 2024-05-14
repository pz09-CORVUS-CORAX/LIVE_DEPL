from drawer import Drawer
from glyph import Glyph
from line import Line
from bezier_tools import Bezier
from numpy import array
from numpy.linalg import norm

class idiots_node:
    def __init__(self, point: list[float], radius: float):
        self.point = point
        self.radius = radius
        self.next = None

class MAT:
    def __init__(self, drawer: Drawer):
        self.drawer = drawer

    def two_prong(self, glyph: Glyph, line: Line, t: float):
        if line.ltype == 'M' or line.ltype == 'Z':
            return
        if line.ltype == 'L':
            radius = 30
            dx = line.points[0] - line.last_point[0]
            dy = line.points[1] - line.last_point[1]
            line_normal = array([-dy, dx])/norm(array([-dy, dx]))
            bp1 = (1-t) * array(line.last_point) + t * array(line.points)
            normal = array(bp1) + line_normal
            p1 = radius*line_normal + array(bp1)
        elif line.ltype == 'Q':
            bezier = Bezier([line.last_point, line.points[0:2], line.points[2:4]])
            bp1 = bezier.point(t)
            radius = 45
            normal = bezier.normal(t) + array(bp1)
            p1 = radius*array(bezier.normal(t)) + array(bp1)
        #self.drawer.box([bp1[0]+5, bp1[1]+5], [bp1[0]-5, bp1[1]-5], "red")
        #self.drawer.line(bp1[0], bp1[1], p1[0], p1[1], "red")
        closest_line = glyph.closest_line(p1)
        while True:
            bp2 = closest_line.closest_point(p1)
            if abs(norm(array(p1) - array(bp2)) - norm(array(p1) - array(bp1))) < 0.01:
                # self.drawer.circle(p1[0], p1[1], radius, "blue")
                # self.drawer.box([p1[0]+2, p1[1]+2], [p1[0]-2, p1[1]-2], "red")
                #self.drawer.line(p1[0], p1[1], bp2[0], bp2[1], "blue")
                return (p1, radius)
            
            f_a = (normal[1] - bp1[1]) / (normal[0] - bp1[0]) if (normal[0] - bp1[0]) != 0 else 0.01
            f_b = bp1[1] - f_a * bp1[0]

            x = (bp2[0]**2 + bp2[1]**2 - bp1[0]**2 - bp1[1]**2 - f_b*(2*bp2[1] - 2*bp1[1]))/(f_a*(2*bp2[1] - 2*bp1[1]) - 2*bp1[0] + 2*bp2[0])
            y = f_a*x + f_b
            
            p1 = [x, y]
            radius = norm(array(p1) - array(bp1))


    def closest_node(self, graph: list[idiots_node], node: idiots_node) -> idiots_node:
        closest_node = graph[0]
        closest_distance = norm(array(node.point) - array(closest_node.point))
        for n in graph:
            distance = norm(array(node.point) - array(n.point))
            if distance < closest_distance:
                closest_distance = distance
                closest_node = n
        return closest_node

    def idiots_path(self, glyph: Glyph):
        idiots_graph = []
        for i in range(1, len(glyph.lines)-1):
            line = glyph.lines[i]
            MATs = []
            MATs.append(self.two_prong(glyph, line, 0.1))
            MATs.append(self.two_prong(glyph, line, 0.25))
            MATs.append(self.two_prong(glyph, line, 0.5))
            MATs.append(self.two_prong(glyph, line, 0.75))
            MATs.append(self.two_prong(glyph, line, 0.9))
            for point, radius in MATs:
                node = idiots_node(point, radius)
                if len(idiots_graph) == 0:
                    idiots_graph.append(node)
                    continue
                closest_node = self.closest_node(idiots_graph, node)
                idiots_graph.append(node)
                if(closest_node.next is not None):
                    node.next = closest_node.next
                    closest_node.next = node
                else:
                    closest_node.next = node

        for node in idiots_graph:
            # self.drawer.circle(node.point[0], node.point[1], node.radius, "blue")
            if node.next is not None:
                self.drawer.line(node.point[0], node.point[1], node.next.point[0], node.next.point[1], "blue")

                