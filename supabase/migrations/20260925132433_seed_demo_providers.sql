-- Seed the 10 demo providers from lib/mock-data.ts as real, approved,
-- login-less rows (profile_id stays null) so /providers has content to
-- browse before any real professional signs up.

insert into public.provider_profiles
  (name, category, specialization, experience_years, location, avatar_initial, rating, reviews_count, status)
values
  ('Justin John', 'Advocate', 'Corporate & Business Law', 8, 'Kochi', 'J', 4.8, 120, 'approved'),
  ('Rhea Mathew', 'Advocate', 'Civil & Property Law', 6, 'Bengaluru', 'R', 4.7, 95, 'approved'),
  ('Priya Sharma', 'CA', 'GST & Tax Filing', 9, 'Mumbai', 'P', 4.9, 214, 'approved'),
  ('Arjun Mehta', 'CA', 'Bookkeeping & Payroll', 6, 'Bengaluru', 'A', 4.7, 132, 'approved'),
  ('Kavita Rao', 'Advocate', 'Trademark & IP Law', 11, 'Delhi', 'K', 4.8, 189, 'approved'),
  ('Rohan Verma', 'Advocate', 'Business & Contract Law', 8, 'Pune', 'R', 4.6, 97, 'approved'),
  ('Sneha Iyer', 'Company Secretary', 'ROC & Compliance', 7, 'Chennai', 'S', 4.9, 156, 'approved'),
  ('Vikram Singh', 'Company Secretary', 'MSME & Company Registration', 5, 'Jaipur', 'V', 4.5, 74, 'approved'),
  ('Ananya Desai', 'Accountant', 'Virtual CFO Services', 10, 'Hyderabad', 'A', 4.8, 168, 'approved'),
  ('Manish Gupta', 'Accountant', 'Payroll & Financial Reporting', 4, 'Ahmedabad', 'M', 4.4, 58, 'approved');
