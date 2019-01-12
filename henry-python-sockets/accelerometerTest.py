import time
import Adafruit_ADXL345

accel = Adafruit_ADXL345.ADXL345()

while True:
    x, y, z = accel.read()
    print('X={0}, Y={1}, Z={2}'.format(x, y, z))
    time.sleep(0.5)
