-- Structured "problem" tags on provider_profiles, replacing free-text keyword
-- guessing for the homepage "What do you need help with?" picker.
-- Owners can already edit their own descriptive fields (guard trigger only
-- locks status/rating/reviews_count/reviewed_by/reviewed_at/profile_id), so
-- no RLS/trigger change is needed — applicants just pick from a fixed set.

alter table public.provider_profiles
  add column tags text[] not null default '{}';

create index provider_profiles_tags_idx on public.provider_profiles using gin (tags);

-- Backfill existing approved/demo providers from their real specialization text.
update public.provider_profiles set tags = array['bookkeeping-payroll', 'virtual-cfo'] where specialization = 'Payroll & Virtual CFO Support';
update public.provider_profiles set tags = array['bookkeeping-payroll', 'gst-tax'] where specialization = 'Bookkeeping & GST Filing Support';
update public.provider_profiles set tags = array['bookkeeping-payroll'] where specialization = 'Payroll & Financial Reporting';
update public.provider_profiles set tags = array['virtual-cfo'] where specialization = 'Virtual CFO Services';

update public.provider_profiles set tags = array['contracts-business-law'] where specialization = 'Corporate & Business Law';
update public.provider_profiles set tags = array['property-civil'] where specialization = 'Civil & Property Law';
update public.provider_profiles set tags = array['trademark-ip'] where specialization = 'Trademark & IP Law';
update public.provider_profiles set tags = array['contracts-business-law'] where specialization = 'Business & Contract Law';
update public.provider_profiles set tags = array['property-civil'] where specialization = 'Criminal and civil';
update public.provider_profiles set tags = array['trademark-ip'] where specialization = 'Trademark & Brand Protection';
update public.provider_profiles set tags = array['contracts-business-law'] where specialization = 'Business Documentation & Contracts';

update public.provider_profiles set tags = array['gst-tax', 'company-registration'] where specialization = 'GST Registration & Return Filing';
update public.provider_profiles set tags = array['virtual-cfo'] where specialization = 'Virtual CFO & Financial Planning';
update public.provider_profiles set tags = array['bookkeeping-payroll'] where specialization = 'Bookkeeping & Payroll';
update public.provider_profiles set tags = array['gst-tax'] where specialization = 'GST & Tax Filing';

update public.provider_profiles set tags = array['company-registration'] where specialization = 'MSME & Startup Registration';
update public.provider_profiles set tags = array['roc-compliance'] where specialization = 'Compliance Assistance & Secretarial Audit';
update public.provider_profiles set tags = array['roc-compliance'] where specialization = 'ROC Support & Annual Compliance';
update public.provider_profiles set tags = array['company-registration'] where specialization = 'MSME & Company Registration';
update public.provider_profiles set tags = array['roc-compliance'] where specialization = 'ROC & Compliance';
