from math import ceil, sqrt, tan
from queue import Queue
from line import Line

class Gcode:
    def lines_to_Gcode_bezier_G1(lines: list[Line], accuracy: float):
        output: str = 'G21\n'
        output += 'G17\n'
        output += 'G90\n'
        output += 'M03\n'

        for line in lines:
            if line.ltype == 'M':
                output += 'G0 X'
                output += str(line.points[0])
                output += ' Y'
                output += str(line.points[1])
                output += ' F30\n'
                output += 'G0 Z-3 F3'
                output += '\n'
            elif line.ltype == 'Q':
                step = accuracy
                t = step
                while t <= 1-step:
                    bezier = _bezier(line.last_point[0], line.last_point[1], line.points[0], line.points[1], line.points[2], line.points[3], t)
                    output += 'G1 X'
                    output += str(bezier[0])
                    output += ' Y'
                    output += str(bezier[1])
                    output += '\n'
                    t += step

                bezier = _bezier(line.last_point[0], line.last_point[1], line.points[0], line.points[1], line.points[2], line.points[3], 1)
                output += 'G1 X'
                output += str(bezier[0])
                output += ' Y'
                output += str(bezier[1])
                output += '\n'

            elif line.ltype == 'L':
                output += 'G1 X'
                output += str(line.points[0])
                output += ' Y'
                output += str(line.points[1])
                output += '\n'
            elif line.ltype == 'Z':
                output += 'G0 Z0 F30\n'

        output += 'M05\n'
        output += 'M30\n'
        return output
    
    

    def lines_to_Gcode_with_G5(lines: list[Line]):
        last_line: Line = None
        output: str = "G90 G17\n"
        for line in lines:
            if line.ltype == 'M':
                output += 'G0 X'
                output += str(line.points[0])
                output += ' Y'
                output += str(line.points[1])
                output += '\n'
            elif line.ltype == 'Q':
                start_point = [last_line.points[0], last_line.points[1]]
                quad_ctrl_point = [line.points[0], line.points[1]]
                end_point = [line.points[2], line.points[3]]

                cubic_ctrl_point_0 = [(2/3)*(quad_ctrl_point[0] - start_point[0]), (2/3)*(quad_ctrl_point[1] - start_point[1])]
                cubic_ctrl_point_1 = [(2/3)*(quad_ctrl_point[0] - end_point[0]), (2/3)*(quad_ctrl_point[1] - end_point[1])]
                output += 'G5 I'
                output += str(cubic_ctrl_point_0[0])
                output += ' J'
                output += str(cubic_ctrl_point_0[1])
                output += ' P'
                output += str(cubic_ctrl_point_1[0])
                output += ' Q'
                output += str(cubic_ctrl_point_1[1])
                output += ' X'
                output += str(end_point[0])
                output += ' Y'
                output += str(end_point[1])
                output += '\n'
            elif line.ltype == 'L':
                output += 'G0 X'
                output += str(line.points[0])
                output += ' Y'
                output += str(line.points[1])
                output += '\n'
            last_line = line
        return output
    
    def lines_to_Gcode_with_radius(lines, radiuses, millAngle, millHeight, maxMaterialHeight, millTravelSpeed, accuracy: float = 0.1):
        output = ''
        non_milling_travel_speed = 100

        last_height = 0
        height = 0
        last_mill_radius = 0
        last_point = [0, 0]

        left_paths: list[str] = []
        right_paths: list[str] = []

        is_last_M = False
        i = 0
        for line in lines:
            if line.ltype == 'Z':
                i -= 1
            height = heightForRadius(radiuses[i], millAngle)
            # if height > 0.9*millHeight:
            #     height = 0.9*millHeight
            millRadius = tan(millAngle/2) * height
            # passage_times = ceil(radiuses[i]/millRadius)
            passage_times = 1
            if line.ltype == 'M':
                output += 'G0 X'
                output += str(line.points[0])
                output += ' Y'
                output += str(line.points[1])
                output += ' Z5'
                output += ' F' + str(non_milling_travel_speed) + '\n'
                # Oblicz głębokość jeżeli radius > od frezu to zakolejkuj wyrównywanie jeżeli wysokość ostateczna > max materiału to exception
                output += 'G1 Z' + str(-height)
                output += ' F' + str(millTravelSpeed) + '\n'
            elif line.ltype == 'Q':
                step = accuracy
                t = step
                while t <= 1-step:
                    current_h = (1 - t) * last_height + t * height #lerp
                    bezier = _bezier(line.last_point[0], line.last_point[1], line.points[0], line.points[1], line.points[2], line.points[3], t)
                    output += 'G1 X'
                    output += str(bezier[0])
                    output += ' Y'
                    output += str(bezier[1])
                    output += ' Z'
                    output += str(-current_h)
                    output += '\n'
                    t += step

                bezier = _bezier(line.last_point[0], line.last_point[1], line.points[0], line.points[1], line.points[2], line.points[3], 1)
                output += 'G1 X'
                output += str(bezier[0])
                output += ' Y'
                output += str(bezier[1])
                output += ' Z'
                output += str(-height)
                output += '\n'

            elif line.ltype == 'L':
                output += 'G1 X'
                output += str(line.points[0])
                output += ' Y'
                output += str(line.points[1])
                output += ' Z'
                output += str(-height)
                output += '\n'
            elif line.ltype == 'Z':
                output += 'G0 Z5 F' + str(non_milling_travel_speed) + '\n'
                height = 0

            for passage in range(passage_times - 1):
                left_paths.append('')
                right_paths.append('')
            
            for passage in range(passage_times - 1):
                # last_drilled_radius = (passage + 1) * last_mill_radius
                # drilled_radius = (passage + 1) * millRadius
                last_drilled_radius = 1
                drilled_radius = 1
                #Policzyc height i radius
                if line.ltype == 'M':
                    is_last_M = True
                elif line.ltype == 'Q':
                    right_v = normal_right(last_point[0], last_point[1], line.points[2], line.points[3])
                    if is_last_M:
                        is_last_M = False
                        #G0 na ostatni punkt
                        right_paths[passage] += 'G0 X'
                        right_paths[passage] += str(last_point[0] + (right_v[0] * last_drilled_radius))
                        right_paths[passage] += ' Y'
                        right_paths[passage] += str(last_point[1] + (right_v[1] * last_drilled_radius))
                        right_paths[passage] += ' Z0'
                        right_paths[passage] += ' F' + str(millTravelSpeed) + '\n'
                        # Oblicz głębokość jeżeli radius > od frezu to zakolejkuj wyrównywanie jeżeli wysokość ostateczna > max materiału to exception
                        right_paths[passage] += 'G1 Z' + str(-last_height)
                        right_paths[passage] += ' F' + str(millTravelSpeed) + '\n'
                        
                        left_paths[passage] += 'G0 X'
                        left_paths[passage] += str(last_point[0] - (right_v[0] * last_drilled_radius))
                        left_paths[passage] += ' Y'
                        left_paths[passage] += str(last_point[1] - (right_v[1] * last_drilled_radius))
                        left_paths[passage] += ' Z0'
                        left_paths[passage] += ' F' + str(millTravelSpeed) + '\n'
                        # Oblicz głębokość jeżeli radius > od frezu to zakolejkuj wyrównywanie jeżeli wysokość ostateczna > max materiału to exception
                        right_paths[passage] += 'G1 Z' + str(-last_height)
                        right_paths[passage] += ' F' + str(millTravelSpeed) + '\n'
                    
                    step = accuracy
                    t = step
                    while t <= 1-step:
                        current_r = (1 - t) * last_drilled_radius + t * drilled_radius
                        current_h = (1 - t) * last_height + t * height #lerp
                        bezier = _bezier(line.last_point[0], line.last_point[1], line.points[0], line.points[1], line.points[2], line.points[3], t)
                        right_paths[passage] += 'G1 X'
                        right_paths[passage] += str(bezier[0] + (right_v[0] * current_r))
                        right_paths[passage] += ' Y'
                        right_paths[passage] += str(bezier[1] + (right_v[1] * current_r))
                        right_paths[passage] += ' Z'
                        right_paths[passage] += str(-current_h)
                        right_paths[passage] += '\n'

                        left_paths[passage] += 'G1 X'
                        left_paths[passage] += str(bezier[0] - (right_v[0] * current_r))
                        left_paths[passage] += ' Y'
                        left_paths[passage] += str(bezier[1] - (right_v[1] * current_r))
                        left_paths[passage] += ' Z'
                        left_paths[passage] += str(-current_h)
                        left_paths[passage] += '\n'
                        t += step

                    bezier = _bezier(line.last_point[0], line.last_point[1], line.points[0], line.points[1], line.points[2], line.points[3], 1)
                    right_paths[passage] += 'G1 X'
                    right_paths[passage] += str(bezier[0] + (right_v[0] * radiuses[i] * (passage + 1)))
                    right_paths[passage] += ' Y'
                    right_paths[passage] += str(bezier[1] + (right_v[1] * radiuses[i] * (passage + 1)))
                    right_paths[passage] += ' Z'
                    right_paths[passage] += str(-height)
                    right_paths[passage] += '\n'

                    left_paths[passage] += 'G1 X'
                    left_paths[passage] += str(bezier[0] - (right_v[0] * radiuses[i] * (passage + 1)))
                    left_paths[passage] += ' Y'
                    left_paths[passage] += str(bezier[1] - (right_v[1] * radiuses[i] * (passage + 1)))
                    left_paths[passage] += ' Z'
                    left_paths[passage] += str(-height)
                    left_paths[passage] += '\n'

                elif line.ltype == 'L':
                    right_v = normal_right(last_point[0], last_point[1], line.points[0], line.points[1])
                    if is_last_M:
                        is_last_M = False
                        #G0 na ostatni punkt
                        right_paths[passage] += 'G0 X'
                        right_paths[passage] += str(last_point[0] + (right_v[0] * radiuses[i-1] * (passage + 1)))
                        right_paths[passage] += ' Y'
                        right_paths[passage] += str(last_point[1] + (right_v[1] * radiuses[i-1] * (passage + 1)))
                        right_paths[passage] += ' Z0'
                        right_paths[passage] += ' F' + str(millTravelSpeed) + '\n'
                        # Oblicz głębokość jeżeli radius > od frezu to zakolejkuj wyrównywanie jeżeli wysokość ostateczna > max materiału to exception
                        right_paths[passage] += 'G1 Z' + str(-last_height)
                        right_paths[passage] += ' F' + str(millTravelSpeed) + '\n'
                        
                        left_paths[passage] += 'G0 X'
                        left_paths[passage] += str(last_point[0] - (right_v[0] * radiuses[i-1] * (passage + 1)))
                        left_paths[passage] += ' Y'
                        left_paths[passage] += str(last_point[1] - (right_v[1] * radiuses[i-1] * (passage + 1)))
                        left_paths[passage] += ' Z0'
                        left_paths[passage] += ' F' + str(millTravelSpeed) + '\n'
                        # Oblicz głębokość jeżeli radius > od frezu to zakolejkuj wyrównywanie jeżeli wysokość ostateczna > max materiału to exception
                        right_paths[passage] += 'G1 Z' + str(-last_height)
                        right_paths[passage] += ' F' + str(millTravelSpeed) + '\n'

                    right_paths[passage] += 'G1 X'
                    right_paths[passage] += str(line.points[0] + (right_v[0] * radiuses[i] * (passage + 1)))
                    right_paths[passage] += ' Y'
                    right_paths[passage] += str(line.points[1] + (right_v[1] * radiuses[i] * (passage + 1)))
                    right_paths[passage] += ' Z'
                    right_paths[passage] += str(-height)
                    right_paths[passage] += '\n'

                    left_paths[passage] += 'G1 X'
                    left_paths[passage] += str(line.points[0] - (right_v[0] * radiuses[i] * (passage + 1)))
                    left_paths[passage] += ' Y'
                    left_paths[passage] += str(line.points[1] - (right_v[1] * radiuses[i] * (passage + 1)))
                    left_paths[passage] += ' Z'
                    left_paths[passage] += str(-height)
                    left_paths[passage] += '\n'                    
                elif line.ltype == 'Z':
                    output += 'G0 Z0 F' + str(millTravelSpeed) + '\n'
                    height = 0

            i += 1
            last_mill_radius = millRadius
            last_height = height
            last_point = line.points[len(line.points) - 2: len(line.points)]

        for path in left_paths:
            output += path
        for path in right_paths:    
            output += path
        return output


def _bezier(x0, y0, x1, y1, x2, y2, t):
        x = ((1-t)*(1-t))*x0 + 2*(1-t)*t*x1 + t*t*x2
        y = ((1-t)*(1-t))*y0 + 2*(1-t)*t*y1 + t*t*y2
        return (x,y)

def normal_right(x0, y0, x1, y1):
    y = y1 - y0
    x = x1 - x0
    if x == 0 and y == 0:
        print("Point given instead of line")
        return (0,0)
    tangent_len = sqrt(x*x + y*y)
    x /= tangent_len
    y /= tangent_len
    return (y, -x)

# angle in degrees    
def heightForRadius(radius: float, angle: float):
    if angle >= 180 or angle <= 0:
        return 0
    
    mill_tan = tan(angle/2)
    return radius/mill_tan
    