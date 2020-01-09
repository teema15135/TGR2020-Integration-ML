"""
80:E1:26:07:C4:0A is 3
80:E1:26:07:D2:6F is 36
80:E1:26:07:E3:79 is 18
80:E1:26:07:E0:F2 is 21

topic 30 is 36
topic 33 is 21
topic 15 is 3
topic 121 is 18
"""

import json

with open('morning.json') as json_file:
    global data
    data = json.load(json_file)

for key in data:
    data[key]