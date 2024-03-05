from math import pi
from matplotlib import lines
from drawer import Drawer
from line import Line
from numpy import arccos, array, dot
from bezier_tools import Bezier
from numpy.linalg import norm

class Glyph:
    def __init__(self, unicode: str, svg_path: str):
        self.unicode = unicode
        self.svg_path = svg_path
        self.lines: list[Line] = []
        self.__parse_svg_path()
        self.__process_lines()
        self.scale(1, -1)

    def __parse_svg_path(self):
        last_num = 0
        floating_point = 0
        is_last_num = False
        is_negative = False
        for c in self.svg_path:
            if c.isalpha():
                if is_last_num:
                    if is_negative:
                        last_num *= -1
                    current_line = self.lines.pop()
                    current_line.points.append(last_num)
                    self.lines.append(current_line)
                    last_num = 0
                    floating_point = 0
                    is_last_num = False
                    is_negative = False
                self.lines.append(Line(c))
            elif c.isnumeric():
                if floating_point == 0:
                    last_num *= 10
                last_num += 0.1**floating_point * int(c)
                if floating_point > 0:
                    floating_point += 1
                is_last_num = True
            elif c == "-":
                is_negative = True
            elif c == ".":
                floating_point += 1
            else:
                if is_last_num:
                    if is_negative:
                        last_num *= -1
                    current_line = self.lines.pop()
                    current_line.points.append(last_num)
                    self.lines.append(current_line)
                    last_num = 0
                    floating_point = 0
                    is_last_num = False
                    is_negative = False


    def __process_lines(self):
        last_x = None
        last_y = None
        last_ctrl_x = None
        last_ctrl_y = None
        for line in self.lines:
            line.set_last_point(last_x, last_y)
            line.set_last_control_point(last_ctrl_x, last_ctrl_y)
            line.process_line(True)
            if len(line.points) >= 2:
                last_x = line.points[len(line.points) - 2]
                last_y = line.points[len(line.points) - 1]
                if len(line.points) >= 4:
                    last_ctrl_x = line.points[0]
                    last_ctrl_y = line.points[1]
                else:
                    last_ctrl_x = None
                    last_ctrl_y = None
            else:
                last_x = None
                last_y = None
                
    def svg_code(self) -> str:
        output = ""
        for line in self.lines:
            output += line.svg_line() + '\n'
        output.removesuffix('\n')
        return output

    def transform(self, x: float, y: float):
        for line in self.lines:
            line.transform(x, y)

    def scale(self, x: float, y: float):
        for line in self.lines:
            line.scale(x, y)
    
    def print_glyph(self):
        print("[" + self.unicode + "]")
        for line in self.lines:
            print("\t", end="")
            line.print_line()
        print(self.svg_code())
        print()
     
    def draw_glyph(self, drawer: Drawer):
        for line in self.lines:
            line.draw_line(drawer)

    def closest_line(self, point: list[float]) -> Line:
        closest_line = self.lines[0]
        closest_distance = closest_line.distance_to_line(point)
        for line in self.lines:
            distance = line.distance_to_line(point)
            if distance < closest_distance:
                closest_distance = distance
                closest_line = line
           
        return closest_line
    
    def last_line(self, line: Line) -> Line:
        index = self.lines.index(line)
        if index == 0:
            last_index = len(self.lines) - 1
        else:
            last_index = index - 1
        last_l = self.lines[last_index]
        if last_l.ltype == 'M' or last_l.ltype == 'Z':
            return self.last_line(self.lines[last_index])
        else:
            return last_l
        
            
        
    
    def sharp_corners(self, drawer) -> list[list[float]]:
        sharp_corners = []
        for i, line in enumerate(self.lines):
            last_line = self.last_line(line)
            
            first_tangent = None
            second_tangent = None

            if line.ltype == 'M' or line.ltype == 'Z':
                continue
            elif line.ltype == 'L':
                first_tangent = array([line.points[0] - line.last_point[0], line.points[1] - line.last_point[1]])
                first_tangent /= norm(first_tangent)
            else:
                if len(line.points) < 4:
                    print("Error: Quadratic bezier with less than 4 points")
                    print(line.ltype)
                bezier = Bezier([line.last_point, line.points[0:2], line.points[2:4]])
                first_tangent = bezier.tangent(0)
            if last_line.ltype == 'L':
                second_tangent = array([last_line.points[0] - last_line.last_point[0], last_line.points[1] - last_line.last_point[1]])
                second_tangent /= norm(second_tangent)
            else:
                if len(last_line.points) < 4:
                    print("Error: Quadratic last bezier with less than 4 points")
                    print(last_line.ltype)
                bezier = Bezier([last_line.last_point, last_line.points[0:2], last_line.points[2:4]])
                second_tangent = bezier.tangent(1)

            angle = dot(first_tangent, second_tangent)
            if(angle < 0.9 and angle > -0.9):
                drawer.line(line.last_point[0], line.last_point[1], line.last_point[0] + first_tangent[0]*20, line.last_point[1] + first_tangent[1]*20, "red")
                drawer.line(last_line.points[0], last_line.points[1], last_line.points[0] + second_tangent[0]*20, last_line.points[1] + second_tangent[1]*20, "blue")
                sharp_corners.append(line.last_point)
            
        return sharp_corners