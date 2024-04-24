import tkinter

class Drawer:
    def __init__(self, width: int = 1000, height: int = 1000, on_mouse_click = None):
        self.window = tkinter.Tk()
        self.width = width
        self.height = height
        self.canvas = tkinter.Canvas(self.window, height=height, width=width)
        self.canvas.create_line(width/2, 0, width/2, height)
        self.canvas.create_line(0, height/2, width, height/2)
        self.on_mouse_click = on_mouse_click 
        self.canvas.bind("<Button-1>", self.mouse_click)

    def line(self, x0: float, y0: float, x1: float, y1: float, color: str = "black"):
        self.canvas.create_line(self.width/2 + x0, self.height/2 + y0, self.width/2 + x1, self.height/2 + y1, fill=color)
        self.canvas.pack()

    def box(self, p1: list[float], p2: list[float], color: str = "black"):
        self.canvas.create_rectangle(self.width/2 + p1[0], self.height/2 + p1[1], self.width/2 + p2[0], self.height/2 + p2[1], outline=color)
        self.canvas.pack()

    def circle(self, x: float, y: float, r: float, color: str = "black"):
        self.canvas.create_oval(self.width/2 + x - r, self.height/2 + y - r, self.width/2 + x + r, self.height/2 + y + r, outline=color)
        self.canvas.pack()

    def __bezier(self, x0: float, y0: float, x1: float, y1: float, x2: float, y2: float, t: float):
        x = ((1-t)*(1-t))*x0 + 2*(1-t)*t*x1 + t*t*x2
        y = ((1-t)*(1-t))*y0 + 2*(1-t)*t*y1 + t*t*y2
        return [x,y]

    def bezier(self, x0: float, y0: float, x1: float, y1: float, x2: float, y2: float):
        step = 0.01
        last_x = x0
        last_y = y0
        t = step
        while t <= 1-step:
            bezier = self.__bezier(x0, y0, x1, y1, x2, y2, t)
            self.line(last_x, last_y, bezier[0], bezier[1])
            last_x = bezier[0]
            last_y = bezier[1]
            t += step
        bezier = self.__bezier(x0, y0, x1, y1, x2, y2, 1)
        self.line(last_x, last_y, bezier[0], bezier[1])

    def mouse_click(self, event):
        self.on_mouse_click(event.x - self.width/2, event.y - self.height/2)

    def set_on_mouse_click(self, on_mouse_click):
        self.on_mouse_click = on_mouse_click
        self.canvas.bind("<Button-1>", self.mouse_click)


    def update(self):
        self.window.mainloop()
