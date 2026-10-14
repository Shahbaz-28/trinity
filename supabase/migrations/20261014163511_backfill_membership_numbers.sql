-- Backfill plausible membership/enrollment numbers for the seeded demo
-- providers now that the UI displays a "Verified" badge with this number.
-- Accountant isn't a centrally-registered title in India, so those two stay
-- null — matching how the application form treats that category as optional.

update public.provider_profiles set membership_number = 'KER/0456/2017' where name = 'Justin John';
update public.provider_profiles set membership_number = 'KA/0932/2019' where name = 'Rhea Mathew';
update public.provider_profiles set membership_number = '214589' where name = 'Priya Sharma';
update public.provider_profiles set membership_number = '198732' where name = 'Arjun Mehta';
update public.provider_profiles set membership_number = 'DL/1123/2012' where name = 'Kavita Rao';
update public.provider_profiles set membership_number = 'MAH/0897/2015' where name = 'Rohan Verma';
update public.provider_profiles set membership_number = 'ACS-34521' where name = 'Sneha Iyer';
update public.provider_profiles set membership_number = 'ACS-28764' where name = 'Vikram Singh';
update public.provider_profiles set membership_number = '305612' where email = 'professional@trinity.demo';
