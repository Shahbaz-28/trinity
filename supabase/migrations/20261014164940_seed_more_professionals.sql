-- Round out the professional roster for a stronger pitch demo: a balanced
-- spread across all four categories, with specializations mapped to the
-- actual services Trinity advertises (GST, bookkeeping, payroll, MSME,
-- business docs, ROC, compliance, trademark, virtual CFO) so every
-- advertised service has at least one, usually two, verified professionals
-- behind it. All approved and pre-verified, same as the original seed batch.

insert into public.provider_profiles
  (name, category, specialization, experience_years, location, avatar_initial, rating, reviews_count, status, membership_number)
values
  ('Neha Kapoor', 'CA', 'GST Registration & Return Filing', 7, 'Pune', 'N', 4.7, 142, 'approved', '187342'),
  ('Rajesh Iyer', 'CA', 'Virtual CFO & Financial Planning', 12, 'Bengaluru', 'R', 4.9, 310, 'approved', '156890'),
  ('Arvind Nair', 'Advocate', 'Trademark & Brand Protection', 9, 'Kochi', 'A', 4.6, 98, 'approved', 'KER/0231/2014'),
  ('Divya Menon', 'Advocate', 'Business Documentation & Contracts', 6, 'Hyderabad', 'D', 4.7, 76, 'approved', 'TS/0789/2018'),
  ('Priyanka Das', 'Company Secretary', 'MSME & Startup Registration', 4, 'Kolkata', 'P', 4.5, 54, 'approved', 'ACS-41209'),
  ('Karan Malhotra', 'Company Secretary', 'ROC Support & Annual Compliance', 8, 'Delhi', 'K', 4.8, 187, 'approved', 'FCS-19087'),
  ('Anjali Reddy', 'Company Secretary', 'Compliance Assistance & Secretarial Audit', 6, 'Hyderabad', 'A', 4.6, 112, 'approved', 'ACS-37654'),
  ('Vivek Choudhary', 'Accountant', 'Bookkeeping & GST Filing Support', 5, 'Jaipur', 'V', 4.4, 63, 'approved', null),
  ('Pooja Agarwal', 'Accountant', 'Payroll & Virtual CFO Support', 7, 'Ahmedabad', 'P', 4.7, 89, 'approved', null);
