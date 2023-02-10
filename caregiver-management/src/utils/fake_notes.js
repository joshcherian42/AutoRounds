const fake_notes = {
    "-1": {
      priority: 2,
      time: "7:07:13 AM",
      caregiver_name: "Jeff",
      resident_first_name: "Alex",
      resident_last_name: "Salinas",
      body: "Alex has a doctor's appointment tomorrow morning. His son is going to drive him.",
    },
    "-2": {
      priority: 1,
      time: "7:48:31 AM",
      caregiver_name: "Jeff",
      resident_first_name: "Jess",
      resident_last_name: "Lutz",
      body: "Jess didn't want to get out of bed again yesterday. That was the second time this week.",
    },
    "-3": {
      priority: 0,
      time: "2:24:57 PM",
      caregiver_name: "Pat",
      resident_first_name: "Stanley",
      resident_last_name: "Sherman",
      body: "The pollen is messing with Stanley's allergies. He asked for decongestant.",
    },
    "-4": {
      priority: 0,
      time: "11:07:42 AM",
      caregiver_name: "Pat",
      resident_first_name: "Susie",
      resident_last_name: "Takeda",
      body: "Susie was grumpy this morning, was refusing care.",
    },
    "-5": {
      priority: 1,
      time: "10:43:27 AM",
      caregiver_name: "Libby",
      resident_first_name: "Harold",
      resident_last_name: "Parker",
      body: "Harold's been complaining about being tired", // It may be blood pressure meds
    },
    "-6": {
      priority: 1,
      time: "12:42:59 PM",
      caregiver_name: "Jeff",
      resident_first_name: "Mike",
      resident_last_name: "Kent",
      body: "Mike will be outside the facility this afternoon to take his grandkids to a movie. He will need wheelchair accessible transport.",
    },
    "-7": {
      priority: 2,
      time: "1:19:13 PM",
      caregiver_name: "Libby",
      resident_first_name: "Nick",
      resident_last_name: "Miller",
      body: "Nick has stopped going to the afternoon exercise class in the activity room. Keep an eye on his activity levels.",
    },
    "-8": {
      priority: 0,
      time: "2:59:20 PM",
      caregiver_name: "Pat",
      resident_first_name: "Evelyn",
      resident_last_name: "Davis",
      body: "Evelyn joined the dominoes group that plays in the screened porch.",
    },
    "-9": {
      priority: 2,
      time: "9:05:33 AM",
      caregiver_name: "Pat",
      resident_first_name: "Jack",
      resident_last_name: "Jacobs",
      body: "Jack seemed disoriented at breakfast this morning.",
    },
    "-10": {
      priority: 1,
      time: "11:02:18 PM",
      caregiver_name: "Allie",
      resident_first_name: "Jack",
      resident_last_name: "Jacobs",
      body: "Jack was wandering in the halls. I walked him back to his room.",
    },
    "-12": {
      priority: 0,
      time: "7:57:44 AM",
      caregiver_name: "Allie",
      resident_first_name: "Mike",
      resident_last_name: "Kent",
      body: "Mike's been less social lately, spending a lot of time in his room. I encouraged him to join the dominoes group",
    },
    "-13": {
      priority: 0,
      time: "9:02:26 AM",
      caregiver_name: "Jeff",
      resident_first_name: "Nick",
      resident_last_name: "Miller",
      body: "Nick was pleasant this morning",
    },
    "-14": {
      priority: 0,
      time: "9:20:10 AM",
      caregiver_name: "Pat",
      resident_first_name: "Harold",
      resident_last_name: "Parker",
      body: "Harold went for a walk after breakfast, so he's trying to be more active",
    },
    "-15": {
      priority: 0,
      time: "9:13:19 AM",
      caregiver_name: "Libby",
      resident_first_name: "Susie",
      resident_last_name: "Takeda",
      body: "Susie went back to her room to read after Stanley and Harold joined her in the hearth room",
    },
    "-16": {
      priority: 1,
      time: "10:11:05 AM",
      caregiver_name: "Jeff",
      resident_first_name: "Jess",
      resident_last_name: "Lutz",
      body: "Jess' hair was messy this morning. She said she wanted to get it cut since it's getting long",
    },
    "-17": {
      priority: 0,
      time: "10:15:08 AM",
      caregiver_name: "Jeff",
      resident_first_name: "Alex",
      resident_last_name: "Salinas",
      body: "Alex is really into coffee right now. He's had an extra cup after breakfast. Glad he's staying hydrated",
    },
    "-18": {
      priority: 2,
      time: "10:32:45 AM",
      caregiver_name: "Libby",
      resident_first_name: "Evelyn",
      resident_last_name: "Davis",
      body: "Evelyn has a bruise on her lower leg. She said that she doesn't remember how it happened." // Keep an eye on if it seems swollen or she complains of discomfort",
    },
    "-19": {
      priority: 0,
      time: "10:40:46 AM",
      caregiver_name: "Libby",
      resident_first_name: "Stanley",
      resident_last_name: "Sherman",
      body: "Stanley has been enjoying doing the crossword with Harold",
    },
    "-20": {
      priority: 0,
      time: "2:15:31 PM",
      caregiver_name: "Jeff",
      resident_first_name: "Jack",
      resident_last_name: "Jacobs",
      body: "Jack went outside the facility today to visit with his brother.",
    },
    "-21": {
      priority: 0,
      time: "3:59:21 PM",
      caregiver_name: "Allie",
      resident_first_name: "Jess",
      resident_last_name: "Lutz",
      body: "Jess and Susie are discussing starting a book club",
    },
    "-22": {
      priority: 0,
      time: "4:02:05 PM",
      caregiver_name: "Allie",
      resident_first_name: "Susie",
      resident_last_name: "Takeda",
      body: "Susie socialized with Jess this afternoon. Her mood was better",
    },
    "-23": {
      priority: 0,
      time: "3:35:15 PM",
      caregiver_name: "Pat",
      resident_first_name: "Evelyn",
      resident_last_name: "Davis",
      body: "Evelyn went outside the facility today to go to the yarn store",
    },
    "-40": {
      priority: 2,
      time: "7:03:26 AM",
      caregiver_name: "Pat",
      resident_first_name: "Alex",
      resident_last_name: "Salinas",
      body: "Alex has a doctor's appointment w/ bloodwork. FLUIDS ONLY. Need medications list. Transport at 8:15am",
    },
    "-41": {
      priority: 0,
      time: "12:30:02 PM",
      caregiver_name: "Laura",
      resident_first_name: "Nick",
      resident_last_name: "Miller",
      body: "Nick's knee has been bothering him.",
    },
  };

  export default fake_notes;