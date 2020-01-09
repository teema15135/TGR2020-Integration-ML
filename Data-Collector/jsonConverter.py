"""
80:E1:26:07:C4:0A is Gate 3
80:E1:26:07:D2:6F is Gate 36
80:E1:26:07:E3:79 is Gate 18
80:E1:26:07:E0:F2 is Gate 21

topic 30 is near 36
topic 33 is near 21
topic 15 is near 3
topic 121 is near 18
"""

import json

def arrAvg(arr):
    if len(arr) == 0:
        return '-130'
    sum = 0
    for i in arr:
        sum += i
    return str(int(sum / len(arr)))


with open('morning.json') as json_file:
    global data
    data = json.load(json_file)

last_time = ''

data_array = []
data_near_03 = ['', [], [], [], [], '"3"']
data_near_18 = ['', [], [], [], [], '"18"']
data_near_21 = ['', [], [], [], [], '"21"']
data_near_36 = ['', [], [], [], [], '"36"']

for key in data:
    mac = data[key]['mac_addr']
    rssi = data[key]['rssi']
    topic = data[key]['topic']
    timestamp = data[key]['timestamp']
    time_min = timestamp.split(' ')[1]
    time_min = time_min.split(':')
    topic_number = topic.split('/')[4]
    time_min.pop(2)
    time_min = ':'.join(time_min)

    data_on_this = []

    if topic_number == '15':
        data_on_this = data_near_03
    elif topic_number == '121':
        data_on_this = data_near_18
    elif topic_number == '33':
        data_on_this = data_near_21
    elif topic_number == '30':
        data_on_this = data_near_36
    else:
        print('no topic match', topic)
        exit(1)

    if last_time != time_min:
        data_array.append(data_on_this)
        data_near_03 = ['', [], [], [], [], '"3"']
        data_near_18 = ['', [], [], [], [], '"18"']
        data_near_21 = ['', [], [], [], [], '"21"']
        data_near_36 = ['', [], [], [], [], '"36"']
    
    data_on_this[0] = '"' + time_min + '"'

    if mac == '80:E1:26:07:C4:0A':
        data_on_this[1].append(rssi)
        # is Gate 3
    elif mac == '80:E1:26:07:E3:79':
        data_on_this[2].append(rssi)
        # is Gate 18
    elif mac == '80:E1:26:07:E0:F2':
        data_on_this[3].append(rssi)
        # is Gate 21
    elif mac == '80:E1:26:07:D2:6F':
        data_on_this[4].append(rssi)
        # is Gate 36
    last_time = time_min

for row in data_array:
    row[1] = arrAvg(row[1])
    row[2] = arrAvg(row[2])
    row[3] = arrAvg(row[3])
    row[4] = arrAvg(row[4])
    
f = open('./data.csv', '+a')
for row in data_array:
    f.write('\n' + ','.join(row))
f.close()