-- ============================================================
-- Seed: "Grade 7 General Knowledge" Live Quest set (20 questions)
--
-- NOT a migration. Run manually, same pattern as seed_test_user.sql:
--   Supabase Dashboard -> SQL Editor -> paste -> Run
-- Safe to re-run.
--
-- live_quest_sets rows are private to their author, so every staff member
-- at run time gets their own copy (skipped if they already have a set with
-- this title). Re-run after adding new teachers to give them one too.
-- Question shape matches createBlankQuestion() in src/lib/liveQuest.js.
--
-- Undo:
--   delete from public.live_quest_sets where title = 'Grade 7 General Knowledge';
-- ============================================================

begin;

insert into public.live_quest_sets (owner_id, title, questions)
select s.id, 'Grade 7 General Knowledge', $json$[
  {"id":"6f1c0a01-0000-4000-8000-000000000001","type":"multiple-choice","question":"What is the largest planet in our solar system?","options":["Earth","Saturn","Jupiter","Neptune"],"correctIndexes":[2],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000002","type":"multiple-choice","question":"What is the capital city of the Philippines?","options":["Cebu City","Manila","Quezon City","Davao City"],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000003","type":"true-false","question":"Water boils at 100 °C at sea level.","options":[true,false],"correctIndexes":[0],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000004","type":"multiple-choice","question":"Which gas do plants take in from the air to make food?","options":["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],"correctIndexes":[2],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000005","type":"multiple-choice","question":"How many continents are there on Earth?","options":["5","6","7","8"],"correctIndexes":[2],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000006","type":"true-false","question":"The Pacific Ocean is the largest ocean on Earth.","options":[true,false],"correctIndexes":[0],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000007","type":"multiple-choice","question":"Who is the national hero of the Philippines?","options":["Andres Bonifacio","Jose Rizal","Apolinario Mabini","Emilio Aguinaldo"],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000008","type":"multiple-choice","question":"What is 12 × 8?","options":["84","96","104","108"],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000009","type":"true-false","question":"A spider is an insect.","options":[true,false],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-00000000000a","type":"multiple-choice","question":"What is the hardest natural substance on Earth?","options":["Gold","Iron","Diamond","Quartz"],"correctIndexes":[2],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-00000000000b","type":"multiple-choice","question":"Which planet is known as the Red Planet?","options":["Venus","Mars","Mercury","Jupiter"],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-00000000000c","type":"multiple-choice","question":"What is the national language of the Philippines?","options":["English","Cebuano","Filipino","Spanish"],"correctIndexes":[2],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-00000000000d","type":"true-false","question":"The Sun is a star.","options":[true,false],"correctIndexes":[0],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-00000000000e","type":"multiple-choice","question":"Which organ pumps blood around the human body?","options":["Lungs","Liver","Brain","Heart"],"correctIndexes":[3],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-00000000000f","type":"multiple-choice","question":"How many sides does a hexagon have?","options":["5","6","7","8"],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000010","type":"multiple-choice","question":"Which is the longest river in the world?","options":["Amazon","Nile","Yangtze","Mississippi"],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000011","type":"true-false","question":"Sound travels faster than light.","options":[true,false],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000012","type":"multiple-choice","question":"What is the chemical symbol for water?","options":["O2","H2O","CO2","HO"],"correctIndexes":[1],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000013","type":"multiple-choice","question":"Who painted the Mona Lisa?","options":["Michelangelo","Vincent van Gogh","Leonardo da Vinci","Pablo Picasso"],"correctIndexes":[2],"seconds":null,"points":"standard","imageUrl":null},
  {"id":"6f1c0a01-0000-4000-8000-000000000014","type":"multiple-choice","question":"Which of these is a mammal?","options":["Shark","Dolphin","Penguin","Crocodile"],"correctIndexes":[1],"seconds":null,"points":"double","imageUrl":null}
]$json$::jsonb
from public.staff s
where not exists (
  select 1 from public.live_quest_sets l
  where l.owner_id = s.id and l.title = 'Grade 7 General Knowledge'
);

commit;
