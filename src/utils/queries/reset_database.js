const reset_query =
  "delete from notes; \
  delete from taking_medication; \
  delete from taking_otc; \
  delete from binary_adls; \
  delete from eating; \
  delete from fluids; \
  delete from ambulation; \
  delete from vitals; \
  delete from blood_pressure";

export default reset_query;
