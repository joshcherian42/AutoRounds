const prescription_query =
  "insert into prescriptions (fk_resident_id, name, dosage, frequency, drug_type) values (1, 'Omeprazole', '20 mg', '1', 'prescription'), (1, 'Lisinopril', '10 mg', '1', 'prescription'), (1, 'Atorvastatin', '40 mg', '1', 'prescription'), (1, 'Metformin', '500 mg', '2', 'prescription'), (1, 'Sertraline', '40 mg', '1', 'prescription'), (1, 'Lexapro', '5 mg', '1', 'prescription');";

export default prescription_query;

//  (1, 'Acetaminophen', '500 mg', '1', 'otc'), (1, 'Pseudoephedrine', '60 mg', '1', 'otc'),
