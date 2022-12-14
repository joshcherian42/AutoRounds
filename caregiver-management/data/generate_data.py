import json
from datetime import timedelta, datetime
import random
import numpy as np
from tqdm import tqdm

# Medication info
medications = {
    'Atorvastatin': {
        'dose': '40 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Sertraline': {
        'dose': '40 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Omeprazole': {
        'dose': '20 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Lisinopril': {
        'dose': '10 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Xarelto': {
        'dose': '10 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Lidocaine Patch': {
        'dose': '4%',
        'frequency': '1',
        'type': 'prescription'
    },
    'Metformin': {
        'dose': '500 mg',
        'frequency': '2',
        'type': 'prescription'
    },
    'Crestor': {
        'dose': '10 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Vaseretic': {
        'dose': '10-25 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Lexapro': {
        'dose': '5 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Evista': {
        'dose': '60 mg',
        'frequency': '1',
        'type': 'prescription'
    },
    'Multivitamin': {
        'dose': '1',
        'frequency': '1',
        'type': 'prescription'
    },

    'Ferrous Sulfate': {
        'dose': '1',
        'frequency': '1',
        'type': 'prescription'
    }
}

# Prescriptions ids
prescriptions = {
    1: [1, 2, 3, 4, 5, 6],
    2: [7, 8, 9, 10, 11, 12, 13, 14],
    3: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    4: [27, 28, 29, 30, 31, 32],
    5: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    6: [45, 46],
    7: [47, 48, 49, 50, 51, 52, 53],
    8: [54, 55, 56],
    9: [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68]
}

# Prescriptions with freq > 1
mult_freq = {
    1: [4],
    3: [26],
    5: [36],
    7: [48],
    9: [58]
}

# Average weight per resident_id
weights = {
    1: 179,
    2: 178,
    3: 210,
    4: 153,
    5: 140,
    6: 165,
    7: 175,
    8: 187,
    9: 144
}


def timestamp(val):
    return str(val).replace(' ', 'T')


def with_assistance_helper(resident_id, metric):
    dressing_assistance_residents = [3, 4, 6, 7, 8, 9]
    eating_assistance_residents = [1, 3, 4, 6, 8, 9]
    showering_assistance_residents = [6, 8]
    if metric == 'dressing' and resident_id in dressing_assistance_residents:
        return True
    if metric == 'eating' and resident_id in eating_assistance_residents:
        if resident_id == 1 or resident_id == 3:
            return random.randint(1, 3) != 3
        else:
            return True
    if metric == 'showering' and resident_id in showering_assistance_residents:
        return True
    return False


def gen_prescriptions(resident_id):
    # Generate insert statements for database in order to get
    # auto-generated prescription_ids

    random_num = 0
    while (random_num == 0):
        random_num = np.random.choice(len(medications.keys()))
    pres = np.random.choice(np.arange(len(medications.keys())),
                            size=random_num, replace=False)

    output = "insert into prescriptions (fk_resident_id, name, drug_type, dosage, frequency) values "
    base_str = "({_id}, '{name}', '{drug_type}', '{dosage}', '{frequency}')"
    values = []
    for num in pres:
        name = list(medications.keys())[num]
        values.append(base_str.format(_id=resident_id, name=name, drug_type=medications[name]["type"],
                                      dosage=medications[name]["dose"], frequency=medications[name]["frequency"]))
    output += ", ".join(values)
    print(output)



def gen_resident_data(resident_id):
    start_date = datetime(2022, 1, 1)
    end_date = datetime(2022, 6, 30)
    delta = end_date - start_date

    ambulation = {'data': []}
    bathroom = {'data': []}
    blood_pressure = {'data': []}
    dressing = {'data': []}
    eating = {'data': []}
    fluids = {'data': []}
    glucose = {'data': []}
    heart_rate = {'data': []}
    taking_medication = {'data': []}
    showering = {'data': []}
    weight = {'data': []}

    dia_low = 72
    dia_high = 85
    sys_low = 110
    sys_high = 125

    for d in tqdm(range(delta.days + 1)):
        end_day = start_date + timedelta(days=d, hours=22)

        # Mealtimes are 8am-9am, 12pm-1pm, 6pm-7pm w/ shift noise
        # Medication is taken during mealtimes with noise
        breakfast_start = start_date + \
            timedelta(days=d, hours=8, minutes=random.randint(0, 30))
        breakfast_end = breakfast_start + \
            timedelta(minutes=random.randint(30, 60))
        lunch_start = start_date + \
            timedelta(days=d, hours=12, minutes=random.randint(0, 30))
        lunch_end = lunch_start + timedelta(minutes=random.randint(30, 60))
        dinner_start = start_date + \
            timedelta(days=d, hours=18, minutes=random.randint(0, 30))
        dinner_end = dinner_start + timedelta(minutes=random.randint(30, 60))
        pairs = [[breakfast_start, breakfast_end], [
            lunch_start, lunch_end], [dinner_start, dinner_end]]

        for pair in pairs:
            eating['data'].append({'fk_resident_id': resident_id,
                                   'start_time': timestamp(pair[0]),
                                   'end_time': timestamp(pair[1]),
                                   'value': random.randint(650, 750),
                                   'with_assistance': with_assistance_helper(resident_id, 'eating')
                                   })
        for i, med in enumerate(prescriptions[resident_id]):
            val = breakfast_start + timedelta(minutes=random.randint(1, 6))
            taking_medication['data'].append(
                {'fk_prescription_id': med, 'timestamp': timestamp(val)})
        if resident_id in mult_freq:
            for i, med in enumerate(mult_freq[resident_id]):
                val = dinner_start + timedelta(minutes=random.randint(1, 6))
                taking_medication['data'].append(
                    {'fk_prescription_id': med, 'timestamp': timestamp(val)})

        # Generate set of random times for activities
        num_light = ['light' for x in range(np.random.choice(2) + 1)]
        num_moderate = ['moderate' for x in range(1)]
        num_vigorous = ['vigorous' for x in range(1)]

        least_active_residents = [2, 3, 6, 7, 8]
        active_residents = [1, 4, 9]
        most_active_residents = [5]

        if resident_id in least_active_residents:
            light_budget = random.randint(30, 60)
        else:
            light_budget = random.randint(42, 71)

        if resident_id in most_active_residents:
            moderate_budget = random.randint(33, 42)
        elif resident_id in active_residents:
            moderate_budget = random.randint(21, 33)
        else:
            moderate_budget = random.randint(15, 28)

        if resident_id in least_active_residents:
            vigorous_budget = 0
        else:
            vigorous_budget = random.randint(8, 11)

        morning_window = list(np.arange((lunch_start - breakfast_end).total_seconds() // 60) +
                              (breakfast_end - start_date).total_seconds() // 60)
        afternoon_window = list(np.arange((dinner_start - lunch_end).total_seconds() // 60) +
                                (lunch_end - start_date).total_seconds() // 60)
        evening_window = list(np.arange((end_day - dinner_end).total_seconds() // 60) +
                              (dinner_end - start_date).total_seconds() // 60)

        light_durations = []
        for i in range(len(num_light)):
            if i == len(num_light) - 1:
                light_durations.append(light_budget)
            else:
                duration = random.randint(5, light_budget//2)
                light_durations.append(duration)
                light_budget -= duration

        phys = []
        taken = set([])
        total_phys = num_light + num_moderate + num_vigorous
        ind = 0
        light_ind = 0

        # Assign times for physical activities
        while(ind < len(total_phys)):
            event = total_phys[ind]
            val = np.random.choice(3)

            if val == 0:
                window = morning_window
            if val == 1:
                window = afternoon_window
            if val == 2:
                window = evening_window

            if event == "light":
                duration = light_durations[light_ind]
                light_ind += 1
            if event == "moderate":
                duration = moderate_budget
            if event == "vigorous":
                duration = vigorous_budget

            a = np.random.choice(window)
            b = a + duration

            before = len(taken)
            taken.update(list(np.arange(a, b)))
            after = len(taken)

            if b not in window or after - before != duration:
                # Invalid partition; reset
                phys = []
                taken = set([])
                ind = 0
                light_ind = 0

            else:
                phys.append([event, a, b, val])
                ind += 1

        # Add data and remove options
        for val in phys:
            ambulation['data'].append({'fk_resident_id': resident_id,
                                       'start_time': timestamp(start_date + timedelta(minutes=val[1])),
                                       'end_time': timestamp(start_date + timedelta(minutes=val[2])),
                                       'activity_type': val[0]
                                       })
            if val[3] == 0:
                morning_window = [x for x in morning_window if x not in range(
                    int(val[1]), int(val[2]))]
            if val[3] == 1:
                afternoon_window = [
                    x for x in afternoon_window if x not in range(int(val[1]), int(val[2]))]
            if val[3] == 2:
                evening_window = [x for x in evening_window if x not in range(
                    int(val[1]), int(val[2]))]

        # Using the remaining options, determine remaining times at random
        num_fluid = ['fluid' for x in range(np.random.choice(4) + 3)]
        num_toilet = ['toilet' for x in range(np.random.choice(2) + 3)]
        total_events = num_fluid + num_toilet

        random.shuffle(total_events)
        window = morning_window + afternoon_window + evening_window
        times = np.random.choice(window, len(total_events), replace=False)

        for i, ele in enumerate(total_events):
            val = timestamp(start_date + timedelta(minutes=times[i]))
            if ele == "fluid":
                fluids['data'].append({'fk_resident_id': resident_id,
                                       'timestamp': val,
                                       'value': 8
                                       })
            if ele == "toilet":
                bathroom['data'].append({'adl_type': 'bathroom',
                                         'fk_resident_id': resident_id,
                                         'timestamp': val
                                         })

        # Showering + Dressing in the morning between 7-8am and at night between 10-11pm
        dressing_morning_min = random.randint(15, 59)
        dressing_evening_min = random.randint(15, 59)
        dressing_morning = start_date + \
            timedelta(days=d, hours=7, minutes=dressing_morning_min)
        dressing_evening = start_date + \
            timedelta(days=d, hours=22, minutes=dressing_evening_min)
        if resident_id in [2, 3, 4, 5, 6]:
            showering_time = start_date + \
                timedelta(days=d, hours=7, minutes=dressing_morning_min - 10)
            bathroom_morning = start_date + \
                timedelta(days=d, hours=7, minutes=dressing_morning_min - 15)
            bathroom_evening = start_date + \
                timedelta(days=d, hours=22, minutes=dressing_evening_min - 10)
        else:
            showering_time = start_date + \
                timedelta(days=d, hours=22, minutes=dressing_evening_min - 10)
            bathroom_morning = start_date + \
                timedelta(days=d, hours=7, minutes=dressing_morning_min - 10)
            bathroom_evening = start_date + \
                timedelta(days=d, hours=22, minutes=dressing_evening_min - 15)

        dressing['data'].append({'adl_type': 'dressing',
                                 'fk_resident_id': resident_id,
                                 'timestamp': timestamp(dressing_morning),
                                 'with_assistance': with_assistance_helper(resident_id, 'dressing')
                                 })
        dressing['data'].append({'adl_type': 'dressing',
                                 'fk_resident_id': resident_id,
                                 'timestamp': timestamp(dressing_evening),
                                 'with_assistance': with_assistance_helper(resident_id, 'dressing')
                                 })
        showering['data'].append({'adl_type': 'showering',
                                  'fk_resident_id': resident_id,
                                  'timestamp': timestamp(showering_time),
                                  'with_assistance': with_assistance_helper(resident_id, 'showering')
                                  })
        bathroom['data'].append({'adl_type': 'bathroom',
                                 'fk_resident_id': resident_id,
                                 'timestamp': timestamp(bathroom_morning)
                                 })
        bathroom['data'].append({'adl_type': 'bathroom',
                                 'fk_resident_id': resident_id,
                                 'timestamp': timestamp(bathroom_evening)
                                 })

        # Weight: measured once daily
        weight_time = start_date + \
            timedelta(days=d, hours=7, minutes=random.randint(0, 15))
        weight['data'].append({'vital_type': 'weight',
                               'fk_resident_id': resident_id,
                               'timestamp': timestamp(weight_time),
                               'value': weights[resident_id] + random.randint(-3, 3)
                               })

        # Vitals (heart_rate, weight, glucose) recorded daily in the morning
        for h in range(24):
            day = start_date + timedelta(days=d, hours=h)
            if h == 7:
                heart_rate['data'].append({'vital_type': 'heart_rate',
                                           'fk_resident_id': resident_id,
                                           'timestamp': timestamp(day),
                                           'value': random.randint(90, 120)
                                           })

                glucose['data'].append({'vital_type': 'glucose',
                                        'fk_resident_id': resident_id,
                                        'timestamp': timestamp(day),
                                        'value': weights[resident_id] + random.randint(-3, 3)
                                        })
            elif h == 8 or (h == 18 and resident_id in [1, 2, 3, 7, 9]):
                if resident_id != 3 or end_day <= datetime(2022, 4, 15):

                    blood_pressure['data'].append({'fk_resident_id': resident_id,
                                                   'timestamp': timestamp(day),
                                                   'dia': random.randint(72, 85),
                                                   'sys': random.randint(110, 125)
                                                   })
                else:
                    if end_day <= datetime(2022, 6, 16):
                        dia_low += 0.18
                        dia_high += 0.18
                        sys_low += 0.34
                        sys_high += 0.34
                    else:
                        dia_low -= 0.285
                        dia_high -= 0.285
                        sys_low -= 0.535
                        sys_high -= 0.535

                    blood_pressure['data'].append({'fk_resident_id': resident_id,
                                                   'timestamp': timestamp(day),
                                                   'dia': random.randint(int(dia_low), int(dia_high)),
                                                   'sys': random.randint(int(sys_low), int(sys_high))
                                                   })
            elif (h == 9 or h == 13 or h == 19):
                # higher glucose right after eating
                glucose['data'].append({'vital_type': 'glucose',
                                        'fk_resident_id': resident_id,
                                        'timestamp': timestamp(day),
                                        'value': random.randint(160, 170)
                                        })
            else:
                heart_rate['data'].append({'vital_type': 'heart_rate',
                                           'fk_resident_id': resident_id,
                                           'timestamp': timestamp(day),
                                           'value': 'null'
                                           })
                glucose['data'].append({'vital_type': 'glucose',
                                        'fk_resident_id': resident_id,
                                        'timestamp': timestamp(day),
                                        'value': random.randint(95, 110)
                                        })
                blood_pressure['data'].append({'fk_resident_id': resident_id,
                                               'timestamp': timestamp(day),
                                               'dia': 'null',
                                               'sys': 'null'})
    return {"ambulation": ambulation, "bathroom": bathroom, "blood_pressure": blood_pressure,
            "dressing": dressing, "eating": eating, "fluids": fluids,
            "glucose": glucose, "heart_rate": heart_rate, "taking_medication": taking_medication,
            "showering": showering, "weight": weight}


if __name__ == "__main__":

    sources = ["ambulation", "bathroom", "blood_pressure", "dressing", "eating", "fluids", "glucose",
               "heart_rate", "taking_medication", "showering", "weight"]
    outfiles = {"ambulation": "ambulation.json", "bathroom": "bathroom.json",
                "blood_pressure": "blood_pressure.json", "dressing": "dressing.json",
                "eating": "eating.json", "fluids": "fluid.json", "glucose": "glucose.json",
                "heart_rate": "heart_rate.json", "taking_medication": "medication.json",
                "showering": "showering.json", "weight": "weight.json"}
    pairs = {x: [outfiles[x], {'data': []}] for x in sources}

    for i in range(1, 9 + 1):
        results = gen_resident_data(i)
        for val in sources:
            pairs[val][1]['data'] += results[val]['data']

    # Write to file
    for val in sources:
        pair = pairs[val]
        with open(pair[0], "w") as i:
            json.dump(pair[1], i)
