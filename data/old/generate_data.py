import json
from datetime import timedelta, datetime
import random
import numpy as np

start_date = datetime(2021, 1, 1)
end_date = datetime(2021, 12, 31)

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


# Ferrous sulfate 325mg
# Calcium + D 600mg
# Acetaminophen (apap) 325mg
# Vitamin B12 1,000 mcg
# Claritin 10mg daily
# Tums antacid as needed
# Vitamin D 25mcg daily
# Mucinex twice daily
# Miralax as needed

def gen_data(min_value, max_value, unit, filename):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta
    for d in range(delta.days + 1):
        for h in range(0, 7):
            day = start_date + timedelta(days=d, hours=h)
            data['data'].append({'date': str(day).replace(' ', 'T'), unit: 'null'})
        for h in range(7, 23):
            day = start_date + timedelta(days=d, hours=h)
            data['data'].append({'date': str(day).replace(' ', 'T'), unit: random.randint(min_value, max_value)})

    with open(filename, "w") as i:
        json.dump(data, i)


def gen_blood_pressure(min_sys, max_sys, min_dia, max_dia):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta

    for d in range(delta.days + 1):
        for h in range(0, 7):
            day = start_date + timedelta(days=d, hours=h)
            data['data'].append({'date': str(day).replace(' ', 'T'), 'sys': 'null', 'dia': 'null'})
        for h in range(7, 23):
            day = start_date + timedelta(days=d, hours=h)
            data['data'].append({'date': str(day).replace(' ', 'T'), 'sys': random.randint(min_sys, max_sys), 'dia': random.randint(min_dia, max_dia)})

    with open('blood_pressure.json', "w") as i:
        json.dump(data, i)


def gen_glucose(min_value, max_value, unit, filename):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta
    for d in range(delta.days + 1):
        for h in range(0, 7):
            day = start_date + timedelta(days=d, hours=h)
            data['data'].append({'date': str(day).replace(' ', 'T'), unit: 'null'})
        for h in range(7, 23):
            day = start_date + timedelta(days=d, hours=h)
            if (h == 9 or h == 13 or h == 19):  # higher right after eating
                data['data'].append({'date': str(day).replace(' ', 'T'), unit: random.randint(160, 170)})
            else:
                data['data'].append({'date': str(day).replace(' ', 'T'), unit: random.randint(min_value, max_value)})

    with open(filename, "w") as i:
        json.dump(data, i)


def gen_daily(min_value, max_value, unit, filename, hour_time):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta
    for d in range(delta.days + 1):
        if hour_time == -1:
            day = start_date + timedelta(days=d, hours=random.randint(7, 23), minutes=random.randint(0, 59))
        else:
            day = start_date + timedelta(days=d, hours=hour_time, minutes=random.randint(30, 59))
        data['data'].append({'date': str(day).replace(' ', 'T')})

    with open(filename, "w") as i:
        json.dump(data, i)


def gen_eating(min_value, max_value, unit, filename):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta
    for d in range(delta.days + 1):
        for h in [8, 12, 18]:
            rand_minutes = random.randint(0, 30)

            start_time = start_date + timedelta(days=d, hours=h, minutes=rand_minutes)
            end_time = start_time + timedelta(minutes=random.randint(30, 60))

            data['data'].append({'start': str(start_time).replace(' ', 'T'), 'end': str(end_time).replace(' ', 'T'), unit: random.randint(min_value, max_value)})

    with open(filename, "w") as i:
        json.dump(data, i)


def gen_fluid(min_value, max_value, unit, filename):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta

    for d in range(delta.days + 1):
        num_drinks = random.randint(min_value, max_value)

        rand_hours = np.random.choice(np.arange(7, 23), num_drinks, replace=False)

        rand_hours.sort()

        for h in rand_hours:
            day = start_date + timedelta(days=d, hours=int(h))
            data['data'].append({'date': str(day).replace(' ', 'T'), unit: 8})

    with open(filename, "w") as i:
        json.dump(data, i)


def gen_medication(filename):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta
    num_medications = random.randint(0, 14)

    medication_indeces = np.random.choice(np.arange(0, 13), num_medications, replace=False)
    med_keys = list(medications.keys())

    for d in range(delta.days + 1):
        day = start_date + timedelta(days=d, hours=8)
        for m in medication_indeces:
            medication = medications[med_keys[m]]
            data['data'].append({'date': str(day).replace(' ', 'T'), 'name': med_keys[m], 'dosage': medication['dose'], 'frequency': medication['frequency'], 'drug_type': medication['type']})

    with open(filename, "w") as i:
        json.dump(data, i)


def gen_random_datetime(day, cur_start_hour, cur_start_minute):

    if cur_start_hour < 21:
        rand_hour = random.randint(cur_start_hour, 20)
    else:
        rand_hour = cur_start_hour
    rand_minutes = random.randint(0, 59)
    cur_day = day - timedelta(hours=day.hour, minutes=day.minute)

    while ((cur_day + timedelta(hours=rand_hour, minutes=rand_minutes)) <= (cur_day + timedelta(hours=cur_start_hour, minutes=cur_start_minute))):

        if cur_start_hour == 20 and cur_start_minute == 59:
            rand_hour = rand_hour + 1
        elif rand_hour < 21:
            rand_hour = random.randint(rand_hour, 20)
        else:
            rand_hour = rand_hour + 1
        rand_minutes = random.randint(0, 59)

    return [rand_hour, rand_minutes]


# 300 - 500 minutes (42 - 71 minutes a day) # 2 - 3 times a day
# 150 - 300 moderate (21 - 42 minutes a day) # once a day
# 75 vigorous (8 - 11 minutes a day) # in the middle of a moderate?
def gen_ambulation(filename):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta
    for d in range(delta.days + 1):
        num_light_activities = random.randint(1, 3)
        num_moderate_activities = 1

        cur_start_hour = 7
        cur_start_minute = 0
        day = start_date
        for i in range(num_light_activities + num_moderate_activities):
            rand_time = gen_random_datetime(day, cur_start_hour, cur_start_minute)
            start_time = start_date + timedelta(days=d, hours=rand_time[0], minutes=rand_time[1])

            if i == 3:  # moderate activity instance
                exercise_type = 'moderate'
                rand_duration = random.randint(21, 42)
            else:
                exercise_type = 'light'
                rand_duration = random.randint(int(42 / num_light_activities), int(71 / num_light_activities))

            end_time = start_time + timedelta(minutes=rand_duration)

            cur_start_hour = end_time.hour
            cur_start_minute = end_time.minute

            if end_time.hour > 7:
                if random.randint(0, 1) == 1 and exercise_type == 'moderate':  # vigorous activity occured
                    vig_duration = random.randint(8, 11)
                    data['data'].append({'start': str(start_time).replace(' ', 'T'), 'end': str(end_time - timedelta(minutes=vig_duration)).replace(' ', 'T'), 'type': exercise_type})
                    data['data'].append({'start': str(end_time - timedelta(minutes=vig_duration)).replace(' ', 'T'), 'end': str(end_time).replace(' ', 'T'), 'type': 'vigorous'})
                else:
                    data['data'].append({'start': str(start_time).replace(' ', 'T'), 'end': str(end_time).replace(' ', 'T'), 'type': exercise_type})

                day = end_time

    with open(filename, "w") as i:
        json.dump(data, i)


def gen_toileting(min_value, max_value, filename):
    data = {'data': []}
    delta = end_date - start_date   # returns timedelta
    for d in range(delta.days + 1):
        num_trips = random.randint(min_value, max_value)

        cur_start_hour = 7
        cur_start_minute = 0
        day = start_date
        for i in range(num_trips):
            rand_time = gen_random_datetime(day, cur_start_hour, cur_start_minute)
            day = start_date + timedelta(days=d, hours=rand_time[0], minutes=rand_time[1])

            cur_start_hour = day.hour + 2
            cur_start_minute = day.minute

            data['data'].append({'date': str(day).replace(' ', 'T')})

    with open(filename, "w") as i:
        json.dump(data, i)


if __name__ == "__main__":
    # min_value = 90
    # max_value = 120
    # unit = 'bpm'
    # filename = 'heart_rate.json'
    # gen_data(min_value, max_value, unit, filename)

    # Blood Pressure
    # min_sys = 110
    # max_sys = 125
    # min_dia = 72
    # max_dia = 85
    # gen_blood_pressure(min_sys, max_sys, min_dia, max_dia)

    # Glucose
    # min_glucose = 95
    # max_glucose = 110
    # unit = 'mg / dL'
    # filename = 'glucose.json'
    # gen_glucose(min_glucose, max_glucose, unit, filename)

    # Weight
    # min_weight = 160
    # max_weight = 165
    # unit = 'lBs'
    # filename = 'weight.json'
    # gen_daily(min_weight, max_weight, unit, filename)

    # # Toileting
    # min_bathroom = 4
    # max_bathroom = 7
    # filename = 'bathroom.json'
    # gen_toileting(min_bathroom, max_bathroom, filename)

    # # Dressing
    # min_dressing = 1
    # max_dressing = 1
    # unit = 'check'
    # filename = 'dressing.json'
    # gen_daily(min_dressing, max_dressing, unit, filename, 7)

    # # Eating
    # min_eating = 650
    # max_eating = 750
    # unit = 'calories'
    # filename = 'eating.json'
    # gen_eating(min_eating, max_eating, unit, filename)

    # Fluid Intake
    # min_fluid = 4
    # max_fluid = 7
    # unit = 'oz'
    # filename = 'fluid.json'
    # gen_fluid(min_fluid, max_fluid, unit, filename)

    # Ambulation
    # filename = 'ambulation.json'
    # gen_ambulation(filename)

    # # Showering
    # min_shower = 1
    # max_shower = 1
    # unit = 'check'
    # filename = 'showering.json'
    # gen_daily(min_shower, max_shower, unit, filename, 7)

    # filename = 'medication.json'
    # gen_medication(filename)

