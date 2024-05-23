from math import sqrt
from bezier_tools import Bezier
from numpy.linalg import norm
from numpy import array

class Line:
    def __init__(self, ltype: str = "", points: list = []):
        self.ltype = ltype
        self.points = points.copy()
        self.last_point = []
        self.last_control_point = []
        self.last_M_point = []

    def set_last_M_point(self, x: float, y: float):
        if x is not None and y is not None:
            self.last_M_point = [x, y]

    def set_last_point(self, x: float, y: float):
        if x is not None and y is not None:
            self.last_point = [x, y]
    
    def set_last_control_point(self, x: float, y: float):
        if x is not None and y is not None:
            self.last_control_point = [x, y]

    def print_line(self):
        print('[' + self.ltype + ']', end='->')
        print(self.points)
    
    def print_line_point_notation(self, accuracy: float = 0.1):
        line_str = ""
        last_point = self.last_point
        if(self.ltype == 'L'):
            line_str += '{' + str(last_point[0]) + ', ' + str(last_point[1]) + '},' + '\n'
        elif self.ltype == 'Q':
                step = accuracy
                t = step
                while t < 1:
                    bezier = Bezier([self.last_point, self.points[0:2], self.points[2:4]])
                    b_point = bezier.point(t)
                    line_str += '{' + str(last_point[0]) + ', ' + str(last_point[1]) + '},' + '\n'
                    last_point = b_point
                    t += step
                b_point = bezier.point(1)
                line_str += '{' + str(last_point[0]) + ', ' + str(last_point[1]) + '},' + '\n'
        elif self.ltype == 'M':
            line_str += "M\n"
            pass
        elif self.ltype == 'Z':
            line_str += '{' + str(self.last_point[0]) + ', ' + str(self.last_point[1]) + '},' + '\n'
            line_str += "Z\n"
        return line_str

    def svg_line(self) -> str:
        output = self.ltype
        for p in self.points:
            output += ' ' + str(p)
        return output
            
    def scale(self, x: float, y: float):
        if len(self.points)%2 == 0:
            for i in range(0, len(self.points), 2):
                self.points[i] *= x
                self.points[i + 1] *= y
            if len(self.last_point) > 1:
                self.last_point[0] *= x
                self.last_point[1] *= y
            if len(self.last_control_point) > 1:
                self.last_control_point[0] *= x
                self.last_control_point[1] *= y
            if len(self.last_M_point) > 1:
                self.last_M_point[0] *= x
                self.last_M_point[1] *= y
        else:
            print("Can't scale")

    def transform(self, x: float, y: float):
        if len(self.points)%2 == 0:
            for i in range(0, len(self.points), 2):
                self.points[i] += x
                self.points[i + 1] += y
            if len(self.last_point) > 1:
                self.last_point[0] += x
                self.last_point[1] += y
            if len(self.last_control_point) > 1:
                self.last_control_point[0] += x
                self.last_control_point[1] += y
            if len(self.last_M_point) > 1:
                self.last_M_point[0] += x
                self.last_M_point[1] += y
        else:
            print("Can't transform")
    
    def process_line(self, to_absolute: bool = True):
        if self.ltype == 'v' or self.ltype == 'V':
            self.ltype = 'l'
            self.points.insert(0, 0)
        elif self.ltype == 'h' or self.ltype == 'H':
            self.ltype = 'l'
            self.points.append(0)
        elif self.ltype == 'T' or self.ltype == 't':
            self.ltype = 'Q'
            control_point_x = 0
            control_point_x = 0
            if len(self.last_control_point) < 2:
                control_point_x = self.last_point[0]
                control_point_y = self.last_point[1]
            else:
                lcp_lp_vec_x = 2*self.last_point[0] - self.last_control_point[0]
                lcp_lp_vec_y = 2*self.last_point[1] - self.last_control_point[1]
                control_point_x = lcp_lp_vec_x
                control_point_y = lcp_lp_vec_y
            self.points.insert(0, control_point_y)
            self.points.insert(0, control_point_x)
            self.points[2] += self.last_point[0]
            self.points[3] += self.last_point[1]
        

        if to_absolute and self.ltype.islower():
            self.ltype = self.ltype.upper()
            for i in range(len(self.points)):
                if len(self.last_point) == 2:
                    if i%2 == 0:
                        self.points[i] += self.last_point[0]
                    else:
                        self.points[i] += self.last_point[1]

    def distance_to_line(self, point: list[float]):
        if self.ltype == 'L':
            if(self.points[0] - self.last_point[0] == 0):
                if point[1] > max(self.points[1], self.last_point[1]):
                    return norm(array([self.points[0], max(self.points[1], self.last_point[1])]) - array(point))
                elif point[1] < min(self.points[1], self.last_point[1]):
                    return norm(array([self.points[0], min(self.points[1], self.last_point[1])]) - array(point))
                else:
                    return abs(self.points[0] - point[0])
                
            if(self.points[1] - self.last_point[1] == 0):
                if point[0] > max(self.points[0], self.last_point[0]):
                    return norm(array([max(self.points[0], self.last_point[0]), self.points[1]]) - array(point))
                elif point[0] < min(self.points[0], self.last_point[0]):
                    return norm(array([min(self.points[0], self.last_point[0]), self.points[1]]) - array(point))
                else:
                    return abs(self.points[1] - point[1])
            
            a = (self.points[1] - self.last_point[1])/ (self.points[0] - self.last_point[0])
            b = self.last_point[1] - a * self.last_point[0]
            
            x0 = ((point[0]/a) + point[1] - b)/(a + 1/a)
            y0 = a*x0 + b
            if x0 > max(self.points[0], self.last_point[0]):
                x0 = max(self.points[0], self.last_point[0])
                y0 = a*x0 + b
                return norm(array([x0, y0]) - array(point))
            elif x0 < min(self.points[0], self.last_point[0]):
                x0 = min(self.points[0], self.last_point[0])
                y0 = a*x0 + b
                return norm(array([x0, y0]) - array(point))
            else:
                return abs(a*point[0] - point[1] + b) / (a**2 + 1)**0.5
        elif self.ltype == 'Q':
            b = Bezier([self.last_point, self.points[0:2], self.points[2:4]])
            cp = b.closest_point(point)
            return norm(array(cp) - array(point))
        elif self.ltype == 'M':
            return sqrt((self.points[0] - point[0])**2 + (self.points[1] - point[1])**2)
        else:
            return sqrt((self.last_point[0] - point[0])**2 + (self.last_point[1] - point[1])**2)
    
    def closest_point(self, point: list[float]):
        if self.ltype == 'L':
            if(self.points[0] - self.last_point[0]) == 0:
                if point[1] > max(self.points[1], self.last_point[1]):
                    return [self.points[0], max(self.points[1], self.last_point[1])]
                elif point[1] < min(self.points[1], self.last_point[1]):
                    return [self.points[0], min(self.points[1], self.last_point[1])]
                else:
                    return [self.points[0], point[1]]
                
            if(self.points[1] - self.last_point[1] == 0):
                if point[0] > max(self.points[0], self.last_point[0]):
                    return [max(self.points[0], self.last_point[0]), self.points[1]]
                elif point[0] < min(self.points[0], self.last_point[0]):
                    return [min(self.points[0], self.last_point[0]), self.points[1]]
                else:
                    return [point[0], self.points[1]]
                
            a = (self.points[1] - self.last_point[1])/ (self.points[0] - self.last_point[0])
            b = self.last_point[1] - a * self.last_point[0]
            x = (a*(point[1] - b) + point[0])/(a**2 + 1)
            y = a*x + b

            if x > max(self.points[0], self.last_point[0]):
                x = max(self.points[0], self.last_point[0])
            elif x < min(self.points[0], self.last_point[0]):
                x = min(self.points[0], self.last_point[0])
            
            if y > max(self.points[1], self.last_point[1]):
                y = max(self.points[1], self.last_point[1])
            elif y < min(self.points[1], self.last_point[1]):
                y = min(self.points[1], self.last_point[1])

            return [x, y]
        elif self.ltype == 'M':
            return self.points
        elif self.ltype == 'Q':
            b = Bezier([self.last_point, self.points[0:2], self.points[2:4]])
            return b.closest_point(point)
        