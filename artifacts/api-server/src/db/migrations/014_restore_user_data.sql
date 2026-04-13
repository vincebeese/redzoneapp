-- Restore deals, sessions, and messages from original production snapshots.
-- user_id remapped from ef8dd2c0-fc83-4d44-817a-0de8f9f1b522 to current admin fd45dd6a-db02-4097-8773-6101d1518d6f.

-- DEALS (6)
INSERT INTO deals (id, user_id, name, company, zone, deal_value, close_date, status, turn_count, reasoning_thread, context_summary, last_compressed_at, created_at, updated_at) VALUES (4, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'Saas/tech example', 'Acme tech corp', 'yellow', 120000, '2026-06-30', 'active', 1, NULL, NULL, NULL, '2026-03-30 18:34:18.445282+00', '2026-03-30 18:35:45.611234+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO deals (id, user_id, name, company, zone, deal_value, close_date, status, turn_count, reasoning_thread, context_summary, last_compressed_at, created_at, updated_at) VALUES (5, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'Built upsell', 'Built', 'green', 120000, '2026-04-30', 'active', 5, NULL, NULL, NULL, '2026-03-30 19:32:12.632901+00', '2026-03-30 20:08:10.237998+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO deals (id, user_id, name, company, zone, status, deal_value, close_date, turn_count, created_at, updated_at) VALUES (6, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'B2B logistics', 'B2 Logistics company', 'green', 'active', 250000, '2026-06-30', 1, '2026-04-01 14:11:34.96742+00', '2026-04-01 14:12:04.620687+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO deals (id, user_id, name, company, zone, status, deal_value, close_date, turn_count, created_at, updated_at) VALUES (7, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'B2B Logistics 2', 'B2B Logistics 2', 'green', 'active', 251000, '2026-06-30', 1, '2026-04-01 15:08:17.164072+00', '2026-04-01 15:08:33.077033+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO deals (id, user_id, name, company, zone, status, deal_value, close_date, turn_count, created_at, updated_at) VALUES (8, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'Meridian Health', 'Meridian Health', 'red', 'active', 350000, '2026-05-29', 1, '2026-04-01 15:13:54.107522+00', '2026-04-01 15:14:15.456806+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO deals (id, user_id, name, company, zone, status, deal_value, close_date, turn_count, created_at, updated_at) VALUES (9, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'Meridian Health 2', 'Meridian Health 2', 'red', 'active', 251000, '2026-05-29', 1, '2026-04-01 15:21:38.925031+00', '2026-04-01 15:22:29.593843+00') ON CONFLICT (id) DO NOTHING;
SELECT setval('deals_id_seq', (SELECT MAX(id) FROM deals));

-- SESSIONS (15)
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (4, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'mindset', '2026-03-27 15:14:35.345436+00', '2026-03-27 15:14:35.345436+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (6, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-03-27 16:47:21.678026+00', '2026-03-27 16:57:32.89808+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (7, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'mindset', '2026-03-27 16:59:31.800757+00', '2026-03-27 17:00:05.628802+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (8, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-03-27 17:02:58.722024+00', '2026-03-27 17:03:52.458648+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (9, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'mindset', '2026-03-27 17:05:12.118526+00', '2026-03-27 17:05:54.611025+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (10, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'mindset', '2026-03-27 17:06:42.386591+00', '2026-03-27 17:10:41.811863+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (11, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-03-27 17:10:46.208377+00', '2026-03-27 17:14:32.221093+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (12, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-03-27 19:39:59.296953+00', '2026-03-27 19:46:59.503612+00', '[Attached document: Katie Wilson - Built - March 13.pdf]
---
Katie Wilson - Built - March 13 
@0:00 - Katie Wilson (getbuilt.com) 
Morning. How are you doing? 
 
@0:02 - Vince Beese (vincebeese.com) 
Can you hear me? 
 
@0:03 - Katie Wilson (getbuilt.com) 
I can hear you. 
 
@0:05 - Vince Beese (vincebeese.com) 
How are you? 
 
@0:07 - Katie Wilson (getbuilt.com) 
Good. 
 
@0:08 - Vince Beese (vincebeese.com) 
You''re in Nashville? I got home late last night. Okay. 
 
@0:14 - Katie Wilson (getbuilt.com) 
But was there this week. It confused me because I booked a time at 930. And then I saw it on 
my personal calendar at 1030. 
I was like, no. We figured it out, right? 

 
@0:26 - Vince Beese (vincebeese.com) 
Yes. 
 
@0:29 - Katie Wilson (getbuilt.com) 
Well, great. So, yeah, go ahead. Sorry. 
 
@0:33 - Vince Beese (vincebeese.com) 
Go ahead. Yeah. I mean, I sent you that email. My thoughts are, let''s do a workshop, right? And 
let''s focus on, based on the six or eight calls I listened to, the consistency that I saw with them is 
loosely ending calls with an idea. 
of a next step, but not like, okay, Tuesday at 10, we''re going to do review this. know what 
mean? 
Like define next step. The calendar to push harder, right? And then the lack of probing into 
questions. If someone says something, they just write it down and take it for what it''s worth and 
not probe harder, you know? 
I really appreciate it. 
 
@1:15 - Katie Wilson (getbuilt.com) 
Like, I really appreciated you reading those calls and putting so much thought, or maybe it was 
a little, I don''t know, but it seemed like it was a very thoughtful response. 
I sent it to, you might have seen, I sent it to Scott Trena, the GM as well. He''s like, yeah, this is 
the kind of feedback we need, you know? 
 
@1:33 - Vince Beese (vincebeese.com) 
Yeah, it''s hard. You know, I wanted to be, I tried to be somewhat sensitive to Katie, you know 
what mean? 
Because some of them probably have not seen that, you know, as detailed feedback in it. And 
it''s like, it''s not like you''re not doing a good job. 

You are, but you''re missing opportunities, you know? 
 
@1:52 - Katie Wilson (getbuilt.com) 
Well, the specific examples, it''s not like, oh, you could have done better here. But it was like, 
what you could have said was this. 
Like, I thought, I think. And that was the most helpful because even me, like, I know when 
they''re doing things that I''m like, oh, that''s not quite right. 
I just sometimes don''t know what, like, really great looks like. I know it''s not really great, but 
what''s really great look like is, yeah. 
 
@2:18 - Vince Beese (vincebeese.com) 
Yeah, look, I think even the most experienced people need that level of engagement, feedback, 
you know. It''s not just the folks just starting off. 
It''s like we all miss stuff, and it''s good to get, hey, at this point you could have done this and so 
on and so forth, right? 
And so, good. I''m glad you thought the feedback was good. Yeah, and like I said, I said to Trina, 
and he was like, yes. 
Unfortunately, what was interesting about the one of Colt''s deals, I predicted he wasn''t going to 
win it, and he didn''t win it. 
So I''m like, I wish I wasn''t right, but, you know, I could sense that. It just wasn''t. And sometimes, 
to his point, like sometimes there''s nothing you can do. 
And sometimes if you recognize the situation, there is something to do, right? So. 
 
@3:12 - Katie Wilson (getbuilt.com) 
Well, and just, I mean, we don''t have to talk about it too long. I''ll just give one, like his deals are 
tough because he''s just coming into these deals that were like closing Q1. 
Like he just got his account plate. He''s talking to them in some cases for the first time in like six 
months, nine months, a year that these clients have been talked to because they''re so small. 

So, you know, it really doesn''t leave him a lot of time to like change, make any change. Right. 
But I think now he''s got some like reps in now. 
Right. 
 
@3:38 - Vince Beese (vincebeese.com) 
Which I think is helpful. 
 
@3:39 - Katie Wilson (getbuilt.com) 
Now, when he starts looking at his Q2 and his Q3 deals, he can actually like talk to them before 
the renewal, you know, and actually have the opportunity to like make changes. 
Like the kids, the kid wants to learn. 
 
@3:52 - Vince Beese (vincebeese.com) 
He wants to get better. He''s completely motivated. You''ve got a good employee that, you know, 
he''s going to be a sponge. 
He''s going to want to get better and better. So, yeah, well, you know, I mean, some people, they 
just get discouraged. 
They don''t want to put the work in. They don''t want to get better. So, yeah, that''s good. 
 
@4:13 - Katie Wilson (getbuilt.com) 
That''s why I hired him. Actually, you know, when he first interviewed, I was like, I don''t know. But 
I put him on this like six week program, you know, and I made him meet with me every week 
and like tell me what he was learning and like listen to his calls and stuff. 
And he put in a lot of work in those six weeks. so I was like, all right, this guy, you know, better. 
And what''s the guy, forget the guy''s name that just joined your team, that more enterprise level 
guy? 
 
@4:36 - Vince Beese (vincebeese.com) 

Chris. Chris just joined the team. Chris Hart. No, no, no. The guy you moved over. So my only 
fear is that Colt needs to be careful about the feedback he gets from Spencer because 
Spencer''s dealing with strategic, big deals, a lot of detail. 
And, you know, mean, like there''s a big difference between the two types of deals that are both 
working. Because I see, he saw his templates and he''s like, wow, boom. 
I''m like, but yeah, dude, that''s just like, your people will be like, what are you talking about? You 
know what mean? 
Let''s simplify this. Oh, it''s a really good point. 
 
@5:15 - Katie Wilson (getbuilt.com) 
And like the team is, yeah, they''re so excited that Spencer''s on the team and he has so much 
wealth to share and knowledge to share. 
And it''s so great, but you''re right. 
 
@5:26 - Vince Beese (vincebeese.com) 
He''s on a different level. He''s working with a different level of client and, you know, I can see 
he''s very set in the way he likes to do things and his format and, again, all good things, but may 
not translate well for other folks, right? 
Yeah, totally. 
 
@5:43 - Katie Wilson (getbuilt.com) 
Well, okay. So I think, by the way, and I think I mentioned this to you, like one more macro 
backdrop thing of what''s going on. 
Maybe I haven''t because I haven''t talked to in so long because we were at our kickoff, et cetera. 
We''ve been asked, oh, by leadership, by Rick. 
Rich, your bud, we''ve been asked by Rich and the other executive team members, so not just 
him, but he''s driving it, to put together a plan to basically rebuild all of our functions. 
So when I say we, it''s like every single function owner, implementation, marketing, product, 
engineering, everybody that owns a function, rebuild the function to be like AI native. 

What would it look like if this function, you could rebuild it from scratch, AI native, and then put 
together plans to like get there, like starting with a 30-day plan, like what can you accomplish in 
30 days? 
And so anyway, a lot of my time and energy has also been spent on like formulating this plan, 
like the first draft is due next week. 
were given like four weeks to put this plan together, but two weeks for a draft, essentially two 
weeks because it''s due, it''s due on Tuesday and that''s when we were assigned it. 
So a lot of my time and energy has been put into, you know, just thinking about not only. Like, 
removing friction for the sales folks, Because that''s, like, I feel like sometimes that''s my, one of 
my number one jobs with them. 
Like, how can I just remove friction so that they can focus on what they need to do? And so 
some of it is automating things that take them a long time. 
Like, they''re going to four different systems to get data. Okay, like, let''s bring it all together and 
make a nice user interface and those things. 
But then what I''m planning to do, just as an FYI as well, all the playbooks that we built out and 
the kind of gates to move things from stage to stage, it''s like, we can also automate that, like, 
within Gong to say, hey, like, how many of the five things that we said had to be done before we 
moved to the next stage? 
Did it hit, right? So it''ll help us. So the playbooks will be even more important. Number one, I''m 
ramping my last new hire. 
His name is Chris. He just started, by the way, this week. And number two, like, as I''m thinking 
about this AI native plan, where, yeah, the playbooks, the resources that we put together, you 
know, we talk. 
We about this before. There has to be accountability there, right? You can''t just write them and 
then shelf them. 
That''s helpful for a month or two, but then it becomes less helpful. So I''m really excited that we 
took the time to do those things, and now I can natively integrate it with Gong and put together 
deal scorecards using those things, etc. 
So that''s going to be a big piece of the plan. Or not a big piece, but a piece of the plan. 
And then, like I said, just how can we maybe do something to automate sales coaching, like 
focus on sales coaching, and then make the data and the systems, all the different places that 
they need to go together to get account context, make that information easily more accessible, 
and then building the ROI business cases, right? 

 
@8:42 - Vince Beese (vincebeese.com) 
Can I share something with you that I''ve been working on for, gosh, on and off for like the last 
six months? 
So I already created an AI coach. I have some sellers that I coach as part of my practice, 
individuals. 
And I created for that. An AI coach, Coach Bench, that''s just this. So they can go in, they could 
say, hey, I''m working on this deal. 
Here''s where I''m stuck. What do you want? What should I do? And it''s all based on Red Zone, 
right? 
And it''s actually really, really good. And I said, you know what? That''s good, but I need to take 
this to the next level. 
So I started working on this one that would incorporate the entire playbook or the entire system. 
So when someone comes on, for example, it''s a wizard. 
It says, what deal? Tell me what deal you''re working on. Oh, I''m working on such and such deal. 
Okay, where are you in the deal? 
Here''s where I am with the deal. And it just works with the rep on, okay, you should have 
already run this play in this play. 
Have you run that yet? No, I haven''t. Who''s your champion? It''s John Smith. Okay, do you have 
the economic buyer? 
Right? No, I don''t. Well, here it is. Here''s the person that this company. So my point is, I know 
where everyone''s going. 
Someone needs a coach that sits by their side when it comes. And advice on their deal. Hey, 
what was your last call? 
Okay, throw your transcript to the last call. Let''s review that together. So I''m literally building this, 
and it''s pretty close to a prototype. 
And I''m looking for a few beta customers to try this. Can you guys be open to that? 
 
@10:19 - Katie Wilson (getbuilt.com) 

I mean, potentially, because, you know, we''re kind of like, all the software is now releasing like 
coaches and things too. 
And it''s, you know, I don''t, I''ve tried one of them. I don''t. 
 
@10:31 - Vince Beese (vincebeese.com) 
But this would be, I would eventually, it''d be generic to be, well, it would be using my framework 
again, but past beta for organizations, I would then configure it specifically for you guys, 
meaning this is your framework. 
This is how you guys go to market, all that fun stuff. It''d be very specific. 
 
@10:51 - Katie Wilson (getbuilt.com) 
I mean, I would say, would I be interested in learning more about what a beta looks like? Like, 
absolutely. 
Because this is something that we need to focus on. And we''re going AF natives. 
 
@11:03 - Vince Beese (vincebeese.com) 
When you were saying this and what the directive is from Rich and the company, this is exactly 
it. It''s to hold accountability and to give them that real-time coaching that they need. 
Not something happened, but it''s more like a lot of stuff that Gong does and all those other 
ones, it''s like this thing happened, now you need to do that. 
Where my system is like, yeah, this thing happened, but also proactively, here''s the things you 
should be doing, right? 
But it''ll do the other one too, right? 
 
@11:34 - Katie Wilson (getbuilt.com) 
Like if try to call, because I really think, again, that feedback that you gave was really valuable. 
It''s the same themes. 

So again, separate it. The post-call, this is what you could have done better. And it''s the same 
themes. And then the next time someone has a call that''s still listening, it''s like, well, you tried to 
do those things I told you, but you didn''t do it very well. 
Here''s another way. Or you didn''t try what I told you at all. 
 
@11:56 - Vince Beese (vincebeese.com) 
Like, what the heck are you thinking? 
 
@11:58 - Katie Wilson (getbuilt.com) 
Yep. Yep. 
 
@12:00 - Vince Beese (vincebeese.com) 
Yeah, you''re absolutely right. 
 
@12:01 - Katie Wilson (getbuilt.com) 
And this is the way that people are going. And whether it''s not right now, like in six months, you 
better believe that everyone will be or should be. 
 
@12:09 - Vince Beese (vincebeese.com) 
I think everyone''s, I''m in two different classes in regards to AI on my own, right? Like, and 
everybody''s in the same boat. 
Everybody thinks they''re further behind than everybody else, but everybody''s in the same 
ocean, right? Varying degrees of knowledge and what they''re doing. 
But at the end of the day, it''s still, I''m using an LLM to help me figure out some things and 
people that have created and put the time and effort into creating the right prompts to do a 
certain thing. 
So like, for example, what I use, I move from OpenAI to Claude because they have connectors. 
You can connect into HubSpot. 

You can connect into, and I''m creating what''s called projects and it does a specific thing, right? 
So you don''t have to get crazy. 
I mean, like it''s, it''s just. And being a solopreneur, it makes my life way more efficient. But I still 
have to do the work. 
I still have to think. I still have to be creative, right? I just use it as my assistant. And I think if 
you''re a seller, you''re a director, you''re a manager, it''s the same thing. 
You''re going to say, hey, let''s look at John''s pipeline. Where is your weakness with John''s 
pipeline right now, right? 
Or let''s look at John''s last three calls and what does he need to improve? Like, it''s just you still 
have to do your job as a leader or an individual contributor. 
It just makes your life a lot easier. And it''s like, just think about the small thing of like doing a 
call. 
You know, in the old days, we take notes while we''re doing a call. Well, you miss things while 
you''re taking notes. 
Now I''m transcribing this as we speak. I won''t miss a thing from this conversation. And I have all 
this data to say, okay, well, what did Katie and I talk about last time? 
What do I have to do? And what does she have to? I mean, I don''t miss anything, you know? 
It''s crazy how like it''s like there''s a lot of bad to get up with AI. But like. All the good stuff, it''s 
overwhelming. 
There''s so much. 
 
@14:05 - Katie Wilson (getbuilt.com) 
It is overwhelming. And I''ll tell you, I''ve had a first glance at everybody''s plans, because I said 
the first draft is due Tuesday. 
were like 40 pages. Who knows? They were probably all written by AI. But I''m like, I put 
together a one page. 
 
@14:19 - Vince Beese (vincebeese.com) 
Well, I bet you, I guarantee you those ones that are 40 pages were absolutely written by AI for 
sure. 

It''s just too much info sometimes. 
 
@14:26 - Katie Wilson (getbuilt.com) 
But it''s good to have that level of detail. Like, need to obviously get to that point with the detail, 
but I like to start high level. 
Anyway. Yeah. 
 
@14:35 - Vince Beese (vincebeese.com) 
My recommendation was, one, let''s do a quick workshop to kind of walk these folks through. 
But, like, what I''m doing with a lot of my clients like this, where I do a project, is I think it also 
comes down to just consistent coaching. 
And so I''ve offered a coaching package that''s a retainer base that I come in on a weekly basis 
and work on the team on certain things. 
And then once a quarter, we do a quarterly business. To focus on, again, getting better at the 
skill of sales and doing your job. 
So I don''t know if that''s going to be of interest to you guys, but that''s what I''d like to also work 
on. 
 
@15:12 - Katie Wilson (getbuilt.com) 
Yeah, I think, I think, like, I think up leveling the team, and not only, by the way, and I know we 
talked about this before, not only the account management team, but also the AE team is like a 
big priority for Scott Trena in general, right? 
Like, and again, nobody''s just, just continuous coaching improvement, like excellence, right? 
Seeking excellence is important across the board. I mean, I''d be interested in like both, let''s say 
both things, like learning more about like what this beta looks like, and I''d be interested in what 
this package looks like. 
I also know that, again, internally with all of our IT, AI tools that we''re building, we''re also 
exploring like, you know, how can we do coaching on call? 
Calls based on, you know, like send in a really great call into Gong or wherever, and then 
develop, you know, compare your call to that call, right? 

Like have your playbooks and say, where did you go off the playbook? So we''re also internally 
trying to do some, trying to develop some of that AI first, AI native sales thing. 
So right now we''re, like I said, this is just a directive two weeks ago. We''re just putting together 
our plans, like sales coaching is a big, is a part of the plan for the sales team. 
So to the extent, yeah, you can get me info on these two things. 
 
@16:35 - Vince Beese (vincebeese.com) 
Because your GM is also the sales leader for the AEs, am I right? 
 
@16:39 - Katie Wilson (getbuilt.com) 
Yeah, well, there''s, you might have met, Scott Thisson is like my kind of equivalent. 
 
@16:44 - Vince Beese (vincebeese.com) 
Yeah, I met with Scott. And then Scott Trena is overall. Wait, no, I met Scott Trena. 
 
@16:49 - Katie Wilson (getbuilt.com) 
Yes, he''s the GM. Scott Thisson, so I guess you didn''t meet with him, which is fine, but he runs 
the AEs. 
So he runs the AEs, I run the AMs and CSMs, and we both. 
 
@17:01 - Vince Beese (vincebeese.com) 
And you shared the feedback with who? The call feedback? With Scott Trena, the GM. 
 
@17:07 - Katie Wilson (getbuilt.com) 
I''ve always been talking about the GM, yeah. But he sits over everything, and he''s putting his 
plan together. We''re all putting our plans together, and sales coaching, continuous sales 

coaching, improvement and excellence is a big piece of all of our plans, even our solutions 
engineers, right? 
It''s like, how do we come to all of our calls? And, you know, it''s just across the board. It''s what 
can we do with AI to make sure we''re always, yeah, bringing our best, super prepared 
beforehand, and then afterward, like coaching, et cetera, to get better for the next one. 
 
@17:42 - Vince Beese (vincebeese.com) 
Which solution are you guys landing on or using more often? 
 
@17:48 - Katie Wilson (getbuilt.com) 
We internally right now, and I wouldn''t necessarily, I don''t even know if I would say we''re landing 
on it, but we are, we just got our Enterprise Clawed license. 
So we''ve been using it individually for, I don''t I personally have only been using it about two 
weeks, and it''s pretty amazing. 
And I think that''s been the thought overall. So we just got our enterprise license, I think, literally 
yesterday. So Claude is, I think, the tool that we''re generating. 
They keep doing this. 
 
@18:15 - Vince Beese (vincebeese.com) 
They keep leapfrogging each other, right? So Claude right now, here''s how someone educated 
me on it. OpenAI is more like a consumer-based product, where Claude is more B2B-focused. 
B2B, exactly. And I see a lot of people moving to it. 
 
@18:31 - Katie Wilson (getbuilt.com) 
I''ve only been using it for two weeks, so I''m still kind I''ve only been using it for two weeks. 
 
@18:35 - Vince Beese (vincebeese.com) 
Okay. 

 
@18:35 - Katie Wilson (getbuilt.com) 
But I''ve built, like, yeah, the connectors. I brought data together, built, like, client health scores. 
Like, how can you take, write your gong transcripts overlaid with your product and usage data? 
And you have a really nice, like, client database. 
 
@18:48 - Vince Beese (vincebeese.com) 
And it creates nice documents, too, you know? Yeah. 
 
@18:52 - Katie Wilson (getbuilt.com) 
But the other thing with Claude that''s really interesting, and I just get this info from, like, people I 
follow on Twitter or their website. 
Bye It''s like they come out with these skills all the time. They have a sales skill. They have their 
legal skill. 
You can just download their skills. 
 
@19:11 - Vince Beese (vincebeese.com) 
Isn''t it crazy? Isn''t it crazy? 
 
@19:15 - Katie Wilson (getbuilt.com) 
Yeah. I mean, the day they came out with their legal skills. 
 
@19:17 - Vince Beese (vincebeese.com) 
So a couple of things. You want to get something on the calendar for next week? Yes, let''s do 
that. 
It looks good universally for folks. 

 
@19:27 - Katie Wilson (getbuilt.com) 
Well, I''m going to try for middle of the week. And then what does this look like? Is it one hour? 
it two one-hour sessions? 
 
@19:35 - Vince Beese (vincebeese.com) 
think let''s do one hour. I find people zone out after an hour. And, you know, I think what I''ll come 
up with is specifically, here''s the two agenda items, and they''ll have to come into the call with 
some of their deals that they''re working on. 
And we''ll have to, you know, use those in the conversation, right? So it''s a, it''s a, let''s talk about 
these two things, come in with these deals. 
And we''re going to workshop them in real time, right? Yeah. 
 
@20:06 - Katie Wilson (getbuilt.com) 
Oh, you know what? Tuesday, nobody is traveling. There''s a lot of travel going on. You say St. 
 
@20:14 - Vince Beese (vincebeese.com) 
Patty''s Day. I don''t care. It doesn''t matter to me. 
 
@20:23 - Katie Wilson (getbuilt.com) 
Tuesday would be great. Let me just figure out if we can do, okay, 11 to 12. 
 
@20:31 - Vince Beese (vincebeese.com) 
Can you do afternoon on Tuesday or is it morning? You definitely do four to five. 
 
@20:36 - Katie Wilson (getbuilt.com) 

I don''t know if that''s too, you know, we kind of work on central time a little. that''s three to four 
central. 
 
@20:40 - Vince Beese (vincebeese.com) 
That works for me. Four to five is perfect. Okay. 
 
@20:45 - Katie Wilson (getbuilt.com) 
Okay. I''m going to do this right now. me put Spencer''s the only one I didn''t check. Let me see 
him. 
Oh, he''s not available, but that''s fine. Everybody else is. I''m going to say cold. 
 
@20:57 - Vince Beese (vincebeese.com) 
Four Eastern to five Eastern, correct? Okay, that works. The 17th. Yeah, and use your invite, if 
you don''t mind. 
Yeah, I am. 
 
@21:09 - Katie Wilson (getbuilt.com) 
Travis doesn''t have a thing, right? Oh, no, that''s right. Okay, what are we calling this? I just call it 
the, I don''t know, the workshop. 
 
@21:19 - Vince Beese (vincebeese.com) 
Sales workshop. Yeah, sales workshop. And, you know, we''ll go over, again, the two areas that I 
sent you in the email that, based on the calls, where help is like, you know, getting client 
commitments and deep probing questions, right? 
So digging deeper is one topic, and, you know, getting commitments of whether it''s a calendar 
invite or when it''s going to get closed and that sort of thing. 
Those are the two main topics. Okay. 
 

@21:52 - Katie Wilson (getbuilt.com) 
So, for example, Colt, your last call was such and such. 
 
@21:56 - Vince Beese (vincebeese.com) 
How did you end the call? You know, and we''ll... Walk through it. 
 
@22:01 - Katie Wilson (getbuilt.com) 
Okay. What could have you done differently now? 
 
@22:03 - Vince Beese (vincebeese.com) 
I would have done this. Great. There you go. 
 
@22:07 - Katie Wilson (getbuilt.com) 
So could you just send me – so I just sent that. Could you just send me – I''ll send you 
something before end of day, a description that you can use to send around a team. 
 
@22:19 - Vince Beese (vincebeese.com) 
Great. 
 
@22:20 - Katie Wilson (getbuilt.com) 
And what they need to be prepared with or whatever, because I just sent it and said hold. 
 
@22:26 - Vince Beese (vincebeese.com) 
You put something on Wednesday. I don''t know if you knew that. Sorry, didn''t – Not only that, 
you did it from 2.30 to 3.30. 

Sorry, sorry, sorry. 
 
@22:33 - Katie Wilson (getbuilt.com) 
It was on a different screen. 
 
@22:35 - Vince Beese (vincebeese.com) 
I''m like, wrong day, wrong time. Yeah, no, you know why? 
 
@22:39 - Katie Wilson (getbuilt.com) 
Because I started on Wednesday. It''s like a – I''m going to – you know what? I''m blaming it on 
this stupid Gmail calendar. 
It''s like kind of a bug of theirs, actually. That''s what I''m – I''m saying it''s their fault, not mine, FYI. 
It''s not a Katie problem. 
 
@22:56 - Vince Beese (vincebeese.com) 
It''s technology. No, it''s not. It''s technology. It''s technology. 
 
@22:59 - Katie Wilson (getbuilt.com) 
Because I – I see it now. 
 
@23:00 - Vince Beese (vincebeese.com) 
Four to five. Hold. Got it. I will. I''ll give you a description that you can then send around the 
team, put it into the invite, all that fun stuff. 
Okay. Awesome. And then, go ahead. 
 

@23:14 - Katie Wilson (getbuilt.com) 
No, I was going to say, and then send me what these two things look like, right? Whether it''s 
beta and or like, I think you said retainer. 
And like I said, internally, we''re doing some things with AI as well. 
 
@23:26 - Vince Beese (vincebeese.com) 
I''m going to position it, by the way, for both your organization and Scott''s organization. Scott''s 
organization. Do you care if I reach out to Rich and catch up with him? 
I don''t care. 
 
@23:39 - Katie Wilson (getbuilt.com) 
You should definitely. Believe it or I haven''t spoken to Rich since October. 
 
@23:43 - Vince Beese (vincebeese.com) 
Yeah. 
 
@23:44 - Katie Wilson (getbuilt.com) 
Yeah. You kind of mentioned that. But yeah, reach out to him. 
 
@23:48 - Vince Beese (vincebeese.com) 
purposely didn''t want to, you know, I don''t know why. I should have. But I haven''t caught up with 
him in so I''m going to catch up with him. 
 
@23:55 - Katie Wilson (getbuilt.com) 
He, just a macro view of what''s going on. I think I told you. So we recently got a new CFO, 
which is great. 

 
@24:03 - Vince Beese (vincebeese.com) 
We''ll be kind of growing our RevOps. 
 
@24:06 - Katie Wilson (getbuilt.com) 
Rich, I don''t know if I told you this, and if there''s too much info, if you don''t care, let me know. 
But, you know, we have two sides of the business, our lender side, which is the side I work on. 
It''s got Trina, all the people you''ve talked to on the lender side of business, which is, you know, 
98% of our revenue, right? 
We also have a side that sells to, like, owners and developers. And the goal, ultimately, is to 
have these two sides of the business, really, like, the product that you sell to lenders. 
You can also have a product that you sell to the owners and developers. They can use it to 
communicate. 
It''s like the flywheel. Is that more of a consumer type of product? Well, it''s direct to an owner or 
developer, like, managing their construction projects versus a lender who''s managing the 
money, etc. 
So they actually will, like, ideally talk to each other. And then the owner development one has 
payments embedded in it as well. 
So if you''re an owner running a project, you can... can pay your GCs, pay your subs, pay your 
vendors, all on that product. 
And then you can communicate with your lender if your lender has our product. So this is going 
to be the year where the two sides really come together. 
But this is what I was going to say. Rich was acting as the general manager of that 
owner-developer side of the business and the president. 
You know, he wears many hats because he''s great. But we recently found somebody internally 
to kind of take over the GM duties of that business. 
So now Rich is fully, you know, doing his special projects, et cetera, across the company. He 
doesn''t have his, like, day job at the company, which was running that business. 
So it''s going to be really great, I guess is what I''m saying. So he will have more time. 

 
@25:45 - Vince Beese (vincebeese.com) 
He''s – I just want to – you know, that''s cool. I figured he''s always busy, first of all. He''s always 
working on 50,000 things, too. 
So his personal and, you know, building a compound, you know. I don''t know. 
 
@26:03 - Katie Wilson (getbuilt.com) 
But yeah, definitely feel free to reach out. 
 
@26:08 - Vince Beese (vincebeese.com) 
I think these two things that I''ll put together and share with you, I think they''re obviously very 
complimentary for all sales, not just account management, right? 
I mean, and, you know, especially the enterprise sellers, quite frankly, I think they''ll really dig the 
automation of the tool, quite frankly, because all the things, the templates we talk about and do, 
that will be now in this tool. 
So, hey, create me a mutual action plan. Great. Here''s what I''m missing to be able to do that. 
Into your colors, all that stuff. 
Like it''s, you know, or a presentation proposal. Put together the deck. It''s got to be a Google. 
Here we go. 
Okay. Here''s what I''m missing. And builds it. You know what mean? Yeah. I mean, that''s what''s 
your point. 
 
@26:52 - Katie Wilson (getbuilt.com) 
That''s what we''re all, we all need to work towards. 
 
@26:54 - Vince Beese (vincebeese.com) 
Nobody needs to manually put stuff together anymore. You know what mean? There''s those 
days are over. You shouldn''t have to. 

Go to a PowerPoint and move images around and all that. That''s just why. That''s always the 
prettiness factor and the format factor shouldn''t be something we have to worry about anymore. 
You know, it''s what''s the thoughts. What are you trying to project? What are you trying to 
explain? That''s you, the creative process, you know? 
Yeah. All right. I''ll share that with you. I''ve got the date. I''ll give you the description by the end of 
the day and we will go from there. 
Awesome. 
 
@27:26 - Katie Wilson (getbuilt.com) 
And then if you end up reaching out to him, let me know how it goes. I''ll, like I said, when I get 
info from you, I''ll share it with Scott Trena. 
I''ll also share it when you talk to Rich or all with Scott Trena. Like we also have a small sales 
side on that owner development side of the business. 
You know, again, like I don''t know if we will move this direction, but I think it''s good to have this 
info and, you know, it can be, it doesn''t, to your point, have to be just me. 
It can be new sales, current sales, and the other side of the business. So we should consider it 
across all of them. 
 
@27:55 - Vince Beese (vincebeese.com) 
Awesome. All right, Katie. Have a great weekend. Talk to you soon.
---

Built prompt. Built is a current client and we are about to enter transition and conclude the first two phases of the project. I have recommended that they hire me as a coach, not just for the AM team for for the entire sales organization. in addition they as a company are looking for creative ways to utilize AI so i would also like to propose red zone selling ai coach.

Katie Wilson is my main point of contact but this would ultimately be signed off my her boss Scott Traina the GM and head of the entire gtm team. 

Here is my last call with Katie where i propose the coaching and AI solution. 

Before building the proposal, provide me your thoughts on the best way to tackle this.

one other piece of context, i have a personal relationship with rich williams who is the president of Built. we worked together at Experian.') ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (13, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-03-30 18:44:53.462074+00', '2026-03-30 18:45:19.006568+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (14, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-04-01 14:03:39.848999+00', '2026-04-01 14:04:17.602083+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (15, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'mindset', '2026-04-01 14:08:18.988778+00', '2026-04-01 14:08:43.783089+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (16, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-04-01 15:04:13.149012+00', '2026-04-01 15:04:45.746071+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (17, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'mindset', '2026-04-01 15:06:30.744992+00', '2026-04-01 15:06:53.765442+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (18, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-04-01 19:03:11.039011+00', '2026-04-02 12:29:30.91302+00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sessions (id, user_id, mode_slug, created_at, updated_at, title) VALUES (19, 'fd45dd6a-db02-4097-8773-6101d1518d6f', 'coach', '2026-04-02 16:01:22.929062+00', '2026-04-02 16:07:00.004028+00', NULL) ON CONFLICT (id) DO NOTHING;
SELECT setval('sessions_id_seq', (SELECT MAX(id) FROM sessions));

-- SESSION MESSAGES (46)
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (6, 6, 'assistant', 'Here''s my diagnosis before you walk into that room.

---

**THE DIAGNOSIS**

This is a Green Zone play with Red Zone stakes. You have access most reps would kill for — a personal relationship at the president level — and the risk is that you treat it like a friendly catch-up instead of a high-stakes alignment call. The other risk: you assume the relationship does the selling for you. It doesn''t. It gets you in the room. You still have to earn the yes.

---

**THE PLAY: Champion Activation Play (G6) + Closing Triangulation (R2)**

You''re running two plays simultaneously here. He''s not just an executive you''re briefing — he''s potentially your champion. And before he endorses anything, you need to know if he''s actually aligned, or just being collegial.

Here''s how to run the call:

**1. Open with curiosity, not the proposal.**

Don''t lead with "here''s what I want you to endorse." Lead with:

*"Before I walk you through anything, I want to understand what''s top of mind for you on [their business area]. What are you trying to solve in the next 6 months that matters most to you personally?"*

Let him talk. You''ll learn whether this cross-sell actually maps to something he cares about — or whether it''s a solution looking for a problem.

**2. Connect the proposal to his priorities, not yours.**

Once he''s told you what he cares about, frame the cross-sell in his language:

*"What I''m bringing you maps directly to what you just described. Let me show you why I think this is worth your endorsement internally."*

If it doesn''t map — you need to know that before you ask for anything.

**3. Test for real endorsement, not polite support.**

This is where most reps lose the play. They leave thinking they have an endorser. They don''t. They have someone who said "sounds good."

Ask this directly:

*"I want to be straight with you — I''m not just looking for you to like the idea. I need to know if you''d be willing to walk this into [the economic buyer / the committee] with your name on it. Is this something you''d personally sponsor?"*

That question separates real champions from friendly contacts.

**4. Understand the internal landscape.**

Even with a personal connection, you don''t know who else is in the room after you hang up:

*"Who else is going to have a voice in this decision? And is there anyone I should be talking to — or that you''d want me to loop in — before this moves forward?"*

---

**ONE NEXT ACTION**

Before the call, pull up the Champion Activation Playbook (G6) and fill out what you actually know about his priorities, his internal credibility, and who he influences. Do that today — not the night before.
→ [Champion Activation Playbook (G6)](https://docs.google.com/spreadsheets/d/1UmUNbPVhW2mqPWh3MvNxwo_sUoGzXnTa)

---

**ARTIFACT OFFER**

Want me to build you a pre-call briefing doc for this specific meeting — mapped to his role, your cross-sell, and the questions you should be asking in sequence?', '2026-03-27 16:49:50.879844+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (7, 6, 'user', 'yes but first one correction. I dont like the advice your provide in 3. above. it was too aggressive, tone it down. ok?', '2026-03-27 16:54:10.326006+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (8, 6, 'assistant', 'Fair enough. Here''s the reframe on point 3:

The goal isn''t to corner him — it''s to get clarity before you leave the call, while the relationship is warm. Try this instead:

*"I really value your perspective on this. As we wrap up, I''d love to know — how do you see this landing internally? Is this something you''d feel comfortable putting your weight behind as it moves through the process?"*

That''s still a direct question. You''re still testing for real commitment. But it gives him room to be honest with you rather than feeling put on the spot. And because of the personal history, he''ll tell you the truth if you ask it that way.

The signal you''re listening for is the same — does he lean in or hedge? But the tone matches the relationship.

---

Does that land better? If yes, I''ll build the pre-call briefing doc now.', '2026-03-27 16:54:17.440936+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (9, 6, 'user', 'yes and yet', '2026-03-27 16:54:41.192055+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (10, 6, 'assistant', 'Got it — and what''s the "yet"? What else do you want to adjust or add before I build the doc?', '2026-03-27 16:54:43.671776+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (11, 6, 'user', 'yes', '2026-03-27 16:54:49.418868+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (12, 6, 'assistant', 'Got it. Building the pre-call briefing doc now — but I need three quick inputs to make it specific:

1. **What is the cross-sell?** What product or solution are you proposing?
2. **What do you know about his current priorities?** What''s he focused on inside the business right now — even if it''s a guess based on your history with him?
3. **Who else is involved in this decision?** Do you know who he''d need to bring this to after your call?

Give me those three and I''ll build it out.', '2026-03-27 16:54:52.978913+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (13, 6, 'user', '1:1 Coach for the org and AI coach for the sellers. Rich is pushing the team hard on utilizing AI across the org. Scott Traina and Chris Devito are the key stakeholders i need to convince.', '2026-03-27 16:56:34.956587+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (14, 6, 'assistant', 'Perfect. One more — what''s your relationship with Scott and Chris right now? Have you met them, or are they cold to you?', '2026-03-27 16:56:37.219318+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (15, 6, 'user', 'i had one conversation with Scott in December last year before i completed the last project and have not met Chris yet.', '2026-03-27 16:57:19.500124+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (16, 6, 'assistant', 'Here''s the coaching.

---

**THE DIAGNOSIS**

You have a warm champion in Rich, a lukewarm connection in Scott, and a blind spot in Chris. This deal won''t close on Rich''s enthusiasm alone. You need to multi-thread before this call — not after. The risk right now is you walk into a call where Rich is nodding, Scott is skeptical, and Chris is a ghost you''ve never met who kills it quietly.

---

**THE PLAY: Multi-Thread Play (G2) + Champion Activation Playbook (G6)**

Rich is your champion. Use him to open the door to both Scott and Chris *before* you make your pitch. You want to walk into that conversation with at least a warm intro to Chris and a refreshed connection with Scott — not cold.

Here''s how you run it with Rich:

---

**THE SCRIPT — Champion Activation Ask**

*"Rich, before we get into the formal proposal, I want to make sure I''m set up to actually land this with your team. Scott and I connected briefly back in December, but I haven''t met Chris yet. Would you be willing to do a quick intro — even just a note saying you''re bringing me in to look at this? I want them to hear about this from you first, not cold from me."*

Then for Scott — your re-engagement line:

*"Scott, Rich and I have been talking about what an AI coaching layer could look like for the sales team. Given your role, I wanted to reconnect and get your perspective before we go any further — what matters most to you when you think about AI adoption with sellers?"*

---

**ONE NEXT ACTION**

Before your next call with Rich, send him a two-line text or email asking him to intro you to Chris. Today. Don''t wait until after the pitch.

---

Want me to write that intro request to Rich as a ready-to-send message right now?', '2026-03-27 16:57:32.892395+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (17, 7, 'user', 'I just lost a big deal that would have made my march number.', '2026-03-27 16:59:54.19631+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (18, 7, 'assistant', 'Losing a deal that would have made your number stings — especially this late in March. That''s real.

---

**REFRAME**

Here''s what this moment actually is: a data point, not a verdict. The deal is gone, but the quarter isn''t over, and more importantly, your ability to close isn''t defined by one loss. What you''re feeling right now is the pull toward rumination — replaying what went wrong, questioning yourself. That''s the pattern that kills performance in the stretch run. Elite closers don''t live there.

---

**THE MENTAL PLAY — Short Memory Protocol**

This is a two-part reset, and you''re going to do it right now.

**Part 1 — Debrief in 5 minutes, not 5 hours.**
Answer these three questions only:
- What was in my control that I''d do differently?
- What was outside my control entirely?
- What''s one execution adjustment I''m taking into the next deal?

Write it down. That''s your processing time. Close the file.

**Part 2 — Personal Win Inventory.**
Name one deal you closed that felt impossible at some point. Recall the specific moment you pushed through it. That''s not in the past — that''s evidence of who you are as a closer. Anchor to it.

---

**THE ACTION**

You have time left in March. In the next 60 minutes, pull up your pipeline and identify the one deal closest to the finish line that you''ve been treating as a secondary priority. Book a call or send a direct message to that buyer today — not a "checking in" message. A closing move. Put yourself back in the driver''s seat before end of day.

The quarter isn''t over. Get back to work.', '2026-03-27 17:00:05.614114+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (19, 8, 'user', 'I dont think my sales manager likes me.', '2026-03-27 17:03:09.449854+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (20, 8, 'assistant', 'That sounds like more than a tough deal. I''m not the right resource for what you''re describing — talk to someone you trust.

When you''re ready to dig back into the pipeline, I''m here.', '2026-03-27 17:03:11.980578+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (21, 8, 'user', 'fair enough, what can you help me with?', '2026-03-27 17:03:43.333039+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (22, 8, 'assistant', 'I''m your on-demand sales coach, built on the Red Zone Selling™ methodology.

Here''s where I live:

**Any live deal you''re in right now.** Tell me what''s happening — a prospect that went quiet, a champion who''s lost their spine, a close that''s stalling, a competitor that just showed up, a discovery call you''re prepping for — and I''ll tell you exactly what play to run and what to say.

**Specific selling situations like:**
- "I''ve been ghosted for 3 weeks — what do I do?"
- "My champion just told me the CFO is now involved"
- "I have a close call tomorrow and I''m not confident"
- "My prospect keeps saying ''we''re still evaluating'' but won''t give me a timeline"
- "I need to disqualify this deal without burning the relationship"

**What I''ll give you:**
- A diagnosis of what''s actually happening in the deal
- The specific play to run
- Exact language and scripts you can use today
- One clear next action

Think of it as having a seasoned enterprise closer on speed dial.

**So — what deal are you working right now?**', '2026-03-27 17:03:52.425545+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (23, 9, 'user', 'man i have send 200 emails today with no responses.', '2026-03-27 17:05:41.705773+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (24, 9, 'assistant', '## STEP 1 — ACKNOWLEDGE

200 emails, zero responses. That''s a grind, and the silence hits different when you''re putting in that kind of volume.

---

## STEP 2 — REFRAME

Here''s what''s actually happening: you''re confusing activity with process. Sending 200 emails isn''t a closing move — it''s a volume move, and volume without signal is just noise. The pattern showing up right now is **playing not to lose** — staying busy so it feels like forward motion, but avoiding the harder, more exposed actions that actually move deals. The question isn''t how many emails you sent. It''s whether you sent the *right* ones to the *right* people with the *right* message.

---

## STEP 3 — THE MENTAL PLAY: OWN THE CLOSE

Great closers don''t outsource outcomes to an inbox. They engineer responses. So here''s the play — pull up the last 10 emails you sent and answer this honestly:

- **Who** received it? Decision-maker or noise?
- **Why** would they respond? Is there a specific, compelling reason in that email to reply today?
- **What** are you asking them to do? Is the call to action clear and low-friction?

If you can''t answer all three quickly, the email wasn''t ready to send.

---

## STEP 4 — THE ACTION

Pick the **5 best targets** from today''s send list — highest fit, highest title, highest urgency potential. Call them. Right now. Use the email as your opener: *"I sent you a note earlier — wanted to connect directly."* Five calls in the next 60 minutes beats 200 emails sitting in inboxes.

Get off email. Get on the phone.', '2026-03-27 17:05:54.606482+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (25, 10, 'user', 'i need to put together a prospecting plan. our ICP are main industries are real estate, healthcare, energy, and insurance. our buyer is the owner, media buyer, marketing - the person responsible for media purchases. the deals size vary but start at $500 and can be thousands of dollars. what do you need from me to build a plan?', '2026-03-27 17:09:50.930637+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (26, 10, 'assistant', 'I''m built for the mental game — mindset, momentum, confidence, and the Closer Mentality framework from Red Zone Selling.

**Prospecting plans, ICP mapping, and outreach strategy aren''t in my lane.**

For that, you want:

- **Red Zone Selling Coach — Strategy Mode** if that''s available to you
- Or bring that question directly to your manager or a sales strategist who can build the targeting and sequencing with you

**What I''m here for:** When you''ve got the plan and the pressure is on — a deal stalling, confidence dropping, end-of-quarter bearing down, a big call you need to get your head right for — that''s when you come to me.

What''s the mental game challenge you''re dealing with right now?', '2026-03-27 17:09:57.238023+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (27, 10, 'user', 'my bad you''re right. i thought i was in coach mode.', '2026-03-27 17:10:39.049185+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (28, 10, 'assistant', 'No worries. Go find Strategy Mode and build that plan.

When you''re ready to get your head right and execute it — I''m here.', '2026-03-27 17:10:41.805559+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (29, 11, 'user', 'i need to put together a prospecting plan. our ICP are main industries are real estate, healthcare, energy, and insurance. our buyer is the owner, media buyer, marketing - the person responsible for media purchases. the deals size vary but start at $500 and can be thousands of dollars. what do you need from me to build a plan?', '2026-03-27 17:10:50.762794+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (30, 11, 'assistant', 'Good starting point. Before I build this out, I need a few more things to make the plan actually useful — not generic.

**Tell me these four things:**

1. **What does your product/service do?** Specifically — what problem does it solve for the media buyer or owner in those industries? One sentence is fine.

2. **What''s your current outreach motion?** Cold calls, email, LinkedIn, referrals — what are you actually doing today to prospect?

3. **What''s working and what isn''t?** Even a rough read — "I''m getting responses on LinkedIn but no one books a call" tells me a lot.

4. **What''s your goal for this plan?** Pipeline volume (how many deals), a specific revenue target, breaking into a new vertical — what does success look like?

Give me those four and I''ll build you a real prospecting plan — by vertical, by buyer type, with plays and language you can run immediately.', '2026-03-27 17:10:57.636624+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (31, 11, 'user', 'we offer a variety of advertising offers both digital and print to help our customer build their brand and exposure to their audience
today we are mostly reliant on inbound leads and personal relatonships but want to start doing outreach
Inbound is working but not enought, we need to be more proactive
our goal is to start generating pipeline for long term sustainability and growth and expand our industry focus into healthcare and insurance', '2026-03-27 17:14:03.497877+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (32, 11, 'assistant', 'Perfect. That''s enough to build a real plan.

Here''s the diagnosis before I give you the plan:

---

**THE DIAGNOSIS**

You have a proof-of-concept business — inbound and relationships are working, which means your offer converts when people find you. The problem is you have no repeatable outbound engine. You''re also sitting on two underpenetrated verticals (healthcare and insurance) with no systematic way to break in. This is a classic **Yellow Zone problem** — you need to qualify and fill the top of the funnel before anything else matters.

---

**THE PLAY: Vertical-First Prospecting Plan**

Here''s how I''d structure this. Four components.

---

**1. LOCK YOUR ICP BY VERTICAL**

Don''t prospect all four industries at once. You''ll spread thin and sound generic. Prioritize like this:

- **Tier 1 (Expand Now):** Healthcare + Insurance — these are your growth targets
- **Tier 2 (Protect + Grow):** Real Estate + Energy — you likely have wins here already, mine them for referrals and case studies

For each vertical, your buyer is slightly different:
- **Real Estate:** Owner or Marketing Director at a brokerage, developer, or property management firm
- **Healthcare:** Practice owner, Office Manager, or Marketing Coordinator at a clinic, dental group, specialty practice
- **Insurance:** Agency owner or Marketing Manager at an independent agency or regional carrier
- **Energy:** Owner or VP Marketing at a local/regional provider or service company

---

**2. BUILD YOUR OUTBOUND MOTION — 3 CHANNELS**

Start with three channels. Run them in parallel.

**Channel 1 — LinkedIn (your fastest path to healthcare and insurance)**
- Connect with practice owners, agency owners, and marketing managers in your target geo
- Lead with relevance, not a pitch

Opening message template:
> *"Hi [Name] — I work with [healthcare practices / insurance agencies] in [region] helping them build brand visibility and drive more patient/client acquisition through both digital and print advertising. Would it be worth a 15-minute conversation to see if what we do could be useful for you?"*

**Channel 2 — Cold Email**
- Target lists by vertical using tools like Apollo, ZoomInfo, or even LinkedIn Sales Navigator
- One email per vertical, written to their specific pain

Healthcare opener:
> *"Most practices I talk to are great at delivering care but invisible outside their existing patient base. We help fix that with advertising that actually reaches the right local audience — both online and in print. Worth a quick conversation?"*

Insurance opener:
> *"Independent agencies are competing against direct carriers with massive ad budgets. We help level that playing field with targeted digital and print campaigns built around your local market. Open to a 15-minute call?"*

**Channel 3 — Referral Mining (your unfair advantage)**
- You have existing relationships. Use them.
- For every current client, ask one question: *"Who else in your network do you know that''s trying to grow their brand and could use more exposure?"*
- This is your warm pipeline you''re not tapping.

---

**3. QUALIFY FAST — DON''T WASTE TIME**

At your deal size ($500–thousands), you can''t afford long sales cycles on bad-fit prospects. Use the **4F Deal Filter (Y3)** on every new conversation:

- **Fit** — Are they in your ICP vertical? Do they buy advertising?
- **Friction** — Is there a reason they can''t move? (locked in a contract, no budget cycle)
- **Funding** — Do they have budget or control budget?
- **Forecast** — Can this close in a reasonable window?

If they fail two or more — move on fast.

---

**4. SET A WEEKLY OUTBOUND NUMBER AND HOLD IT**

This is where most teams fail. They prospect in bursts. You need a cadence.

Start here:
- **20 LinkedIn outreach touches per week**
- **20 cold emails per week**
- **5 referral asks per week from existing clients**
- **Goal: 3–5 new conversations per week**

That''s a realistic pipeline engine at your stage.

---

**ONE NEXT ACTION**

This week — before you do anything else — identify **10 healthcare prospects and 10 insurance prospects** in your target geography using LinkedIn. Name, title', '2026-03-27 17:14:32.211677+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (33, 12, 'user', '[Attached document: Katie Wilson - Built - March 13.pdf]
---
Katie Wilson - Built - March 13 
@0:00 - Katie Wilson (getbuilt.com) 
Morning. How are you doing? 
 
@0:02 - Vince Beese (vincebeese.com) 
Can you hear me? 
 
@0:03 - Katie Wilson (getbuilt.com) 
I can hear you. 
 
@0:05 - Vince Beese (vincebeese.com) 
How are you? 
 
@0:07 - Katie Wilson (getbuilt.com) 
Good. 
 
@0:08 - Vince Beese (vincebeese.com) 
You''re in Nashville? I got home late last night. Okay. 
 
@0:14 - Katie Wilson (getbuilt.com) 
But was there this week. It confused me because I booked a time at 930. And then I saw it on 
my personal calendar at 1030. 
I was like, no. We figured it out, right? 

 
@0:26 - Vince Beese (vincebeese.com) 
Yes. 
 
@0:29 - Katie Wilson (getbuilt.com) 
Well, great. So, yeah, go ahead. Sorry. 
 
@0:33 - Vince Beese (vincebeese.com) 
Go ahead. Yeah. I mean, I sent you that email. My thoughts are, let''s do a workshop, right? And 
let''s focus on, based on the six or eight calls I listened to, the consistency that I saw with them is 
loosely ending calls with an idea. 
of a next step, but not like, okay, Tuesday at 10, we''re going to do review this. know what 
mean? 
Like define next step. The calendar to push harder, right? And then the lack of probing into 
questions. If someone says something, they just write it down and take it for what it''s worth and 
not probe harder, you know? 
I really appreciate it. 
 
@1:15 - Katie Wilson (getbuilt.com) 
Like, I really appreciated you reading those calls and putting so much thought, or maybe it was 
a little, I don''t know, but it seemed like it was a very thoughtful response. 
I sent it to, you might have seen, I sent it to Scott Trena, the GM as well. He''s like, yeah, this is 
the kind of feedback we need, you know? 
 
@1:33 - Vince Beese (vincebeese.com) 
Yeah, it''s hard. You know, I wanted to be, I tried to be somewhat sensitive to Katie, you know 
what mean? 
Because some of them probably have not seen that, you know, as detailed feedback in it. And 
it''s like, it''s not like you''re not doing a good job. 

You are, but you''re missing opportunities, you know? 
 
@1:52 - Katie Wilson (getbuilt.com) 
Well, the specific examples, it''s not like, oh, you could have done better here. But it was like, 
what you could have said was this. 
Like, I thought, I think. And that was the most helpful because even me, like, I know when 
they''re doing things that I''m like, oh, that''s not quite right. 
I just sometimes don''t know what, like, really great looks like. I know it''s not really great, but 
what''s really great look like is, yeah. 
 
@2:18 - Vince Beese (vincebeese.com) 
Yeah, look, I think even the most experienced people need that level of engagement, feedback, 
you know. It''s not just the folks just starting off. 
It''s like we all miss stuff, and it''s good to get, hey, at this point you could have done this and so 
on and so forth, right? 
And so, good. I''m glad you thought the feedback was good. Yeah, and like I said, I said to Trina, 
and he was like, yes. 
Unfortunately, what was interesting about the one of Colt''s deals, I predicted he wasn''t going to 
win it, and he didn''t win it. 
So I''m like, I wish I wasn''t right, but, you know, I could sense that. It just wasn''t. And sometimes, 
to his point, like sometimes there''s nothing you can do. 
And sometimes if you recognize the situation, there is something to do, right? So. 
 
@3:12 - Katie Wilson (getbuilt.com) 
Well, and just, I mean, we don''t have to talk about it too long. I''ll just give one, like his deals are 
tough because he''s just coming into these deals that were like closing Q1. 
Like he just got his account plate. He''s talking to them in some cases for the first time in like six 
months, nine months, a year that these clients have been talked to because they''re so small. 

So, you know, it really doesn''t leave him a lot of time to like change, make any change. Right. 
But I think now he''s got some like reps in now. 
Right. 
 
@3:38 - Vince Beese (vincebeese.com) 
Which I think is helpful. 
 
@3:39 - Katie Wilson (getbuilt.com) 
Now, when he starts looking at his Q2 and his Q3 deals, he can actually like talk to them before 
the renewal, you know, and actually have the opportunity to like make changes. 
Like the kids, the kid wants to learn. 
 
@3:52 - Vince Beese (vincebeese.com) 
He wants to get better. He''s completely motivated. You''ve got a good employee that, you know, 
he''s going to be a sponge. 
He''s going to want to get better and better. So, yeah, well, you know, I mean, some people, they 
just get discouraged. 
They don''t want to put the work in. They don''t want to get better. So, yeah, that''s good. 
 
@4:13 - Katie Wilson (getbuilt.com) 
That''s why I hired him. Actually, you know, when he first interviewed, I was like, I don''t know. But 
I put him on this like six week program, you know, and I made him meet with me every week 
and like tell me what he was learning and like listen to his calls and stuff. 
And he put in a lot of work in those six weeks. so I was like, all right, this guy, you know, better. 
And what''s the guy, forget the guy''s name that just joined your team, that more enterprise level 
guy? 
 
@4:36 - Vince Beese (vincebeese.com) 

Chris. Chris just joined the team. Chris Hart. No, no, no. The guy you moved over. So my only 
fear is that Colt needs to be careful about the feedback he gets from Spencer because 
Spencer''s dealing with strategic, big deals, a lot of detail. 
And, you know, mean, like there''s a big difference between the two types of deals that are both 
working. Because I see, he saw his templates and he''s like, wow, boom. 
I''m like, but yeah, dude, that''s just like, your people will be like, what are you talking about? You 
know what mean? 
Let''s simplify this. Oh, it''s a really good point. 
 
@5:15 - Katie Wilson (getbuilt.com) 
And like the team is, yeah, they''re so excited that Spencer''s on the team and he has so much 
wealth to share and knowledge to share. 
And it''s so great, but you''re right. 
 
@5:26 - Vince Beese (vincebeese.com) 
He''s on a different level. He''s working with a different level of client and, you know, I can see 
he''s very set in the way he likes to do things and his format and, again, all good things, but may 
not translate well for other folks, right? 
Yeah, totally. 
 
@5:43 - Katie Wilson (getbuilt.com) 
Well, okay. So I think, by the way, and I think I mentioned this to you, like one more macro 
backdrop thing of what''s going on. 
Maybe I haven''t because I haven''t talked to in so long because we were at our kickoff, et cetera. 
We''ve been asked, oh, by leadership, by Rick. 
Rich, your bud, we''ve been asked by Rich and the other executive team members, so not just 
him, but he''s driving it, to put together a plan to basically rebuild all of our functions. 
So when I say we, it''s like every single function owner, implementation, marketing, product, 
engineering, everybody that owns a function, rebuild the function to be like AI native. 

What would it look like if this function, you could rebuild it from scratch, AI native, and then put 
together plans to like get there, like starting with a 30-day plan, like what can you accomplish in 
30 days? 
And so anyway, a lot of my time and energy has also been spent on like formulating this plan, 
like the first draft is due next week. 
were given like four weeks to put this plan together, but two weeks for a draft, essentially two 
weeks because it''s due, it''s due on Tuesday and that''s when we were assigned it. 
So a lot of my time and energy has been put into, you know, just thinking about not only. Like, 
removing friction for the sales folks, Because that''s, like, I feel like sometimes that''s my, one of 
my number one jobs with them. 
Like, how can I just remove friction so that they can focus on what they need to do? And so 
some of it is automating things that take them a long time. 
Like, they''re going to four different systems to get data. Okay, like, let''s bring it all together and 
make a nice user interface and those things. 
But then what I''m planning to do, just as an FYI as well, all the playbooks that we built out and 
the kind of gates to move things from stage to stage, it''s like, we can also automate that, like, 
within Gong to say, hey, like, how many of the five things that we said had to be done before we 
moved to the next stage? 
Did it hit, right? So it''ll help us. So the playbooks will be even more important. Number one, I''m 
ramping my last new hire. 
His name is Chris. He just started, by the way, this week. And number two, like, as I''m thinking 
about this AI native plan, where, yeah, the playbooks, the resources that we put together, you 
know, we talk. 
We about this before. There has to be accountability there, right? You can''t just write them and 
then shelf them. 
That''s helpful for a month or two, but then it becomes less helpful. So I''m really excited that we 
took the time to do those things, and now I can natively integrate it with Gong and put together 
deal scorecards using those things, etc. 
So that''s going to be a big piece of the plan. Or not a big piece, but a piece of the plan. 
And then, like I said, just how can we maybe do something to automate sales coaching, like 
focus on sales coaching, and then make the data and the systems, all the different places that 
they need to go together to get account context, make that information easily more accessible, 
and then building the ROI business cases, right? 

 
@8:42 - Vince Beese (vincebeese.com) 
Can I share something with you that I''ve been working on for, gosh, on and off for like the last 
six months? 
So I already created an AI coach. I have some sellers that I coach as part of my practice, 
individuals. 
And I created for that. An AI coach, Coach Bench, that''s just this. So they can go in, they could 
say, hey, I''m working on this deal. 
Here''s where I''m stuck. What do you want? What should I do? And it''s all based on Red Zone, 
right? 
And it''s actually really, really good. And I said, you know what? That''s good, but I need to take 
this to the next level. 
So I started working on this one that would incorporate the entire playbook or the entire system. 
So when someone comes on, for example, it''s a wizard. 
It says, what deal? Tell me what deal you''re working on. Oh, I''m working on such and such deal. 
Okay, where are you in the deal? 
Here''s where I am with the deal. And it just works with the rep on, okay, you should have 
already run this play in this play. 
Have you run that yet? No, I haven''t. Who''s your champion? It''s John Smith. Okay, do you have 
the economic buyer? 
Right? No, I don''t. Well, here it is. Here''s the person that this company. So my point is, I know 
where everyone''s going. 
Someone needs a coach that sits by their side when it comes. And advice on their deal. Hey, 
what was your last call? 
Okay, throw your transcript to the last call. Let''s review that together. So I''m literally building this, 
and it''s pretty close to a prototype. 
And I''m looking for a few beta customers to try this. Can you guys be open to that? 
 
@10:19 - Katie Wilson (getbuilt.com) 

I mean, potentially, because, you know, we''re kind of like, all the software is now releasing like 
coaches and things too. 
And it''s, you know, I don''t, I''ve tried one of them. I don''t. 
 
@10:31 - Vince Beese (vincebeese.com) 
But this would be, I would eventually, it''d be generic to be, well, it would be using my framework 
again, but past beta for organizations, I would then configure it specifically for you guys, 
meaning this is your framework. 
This is how you guys go to market, all that fun stuff. It''d be very specific. 
 
@10:51 - Katie Wilson (getbuilt.com) 
I mean, I would say, would I be interested in learning more about what a beta looks like? Like, 
absolutely. 
Because this is something that we need to focus on. And we''re going AF natives. 
 
@11:03 - Vince Beese (vincebeese.com) 
When you were saying this and what the directive is from Rich and the company, this is exactly 
it. It''s to hold accountability and to give them that real-time coaching that they need. 
Not something happened, but it''s more like a lot of stuff that Gong does and all those other 
ones, it''s like this thing happened, now you need to do that. 
Where my system is like, yeah, this thing happened, but also proactively, here''s the things you 
should be doing, right? 
But it''ll do the other one too, right? 
 
@11:34 - Katie Wilson (getbuilt.com) 
Like if try to call, because I really think, again, that feedback that you gave was really valuable. 
It''s the same themes. 

So again, separate it. The post-call, this is what you could have done better. And it''s the same 
themes. And then the next time someone has a call that''s still listening, it''s like, well, you tried to 
do those things I told you, but you didn''t do it very well. 
Here''s another way. Or you didn''t try what I told you at all. 
 
@11:56 - Vince Beese (vincebeese.com) 
Like, what the heck are you thinking? 
 
@11:58 - Katie Wilson (getbuilt.com) 
Yep. Yep. 
 
@12:00 - Vince Beese (vincebeese.com) 
Yeah, you''re absolutely right. 
 
@12:01 - Katie Wilson (getbuilt.com) 
And this is the way that people are going. And whether it''s not right now, like in six months, you 
better believe that everyone will be or should be. 
 
@12:09 - Vince Beese (vincebeese.com) 
I think everyone''s, I''m in two different classes in regards to AI on my own, right? Like, and 
everybody''s in the same boat. 
Everybody thinks they''re further behind than everybody else, but everybody''s in the same 
ocean, right? Varying degrees of knowledge and what they''re doing. 
But at the end of the day, it''s still, I''m using an LLM to help me figure out some things and 
people that have created and put the time and effort into creating the right prompts to do a 
certain thing. 
So like, for example, what I use, I move from OpenAI to Claude because they have connectors. 
You can connect into HubSpot. 

You can connect into, and I''m creating what''s called projects and it does a specific thing, right? 
So you don''t have to get crazy. 
I mean, like it''s, it''s just. And being a solopreneur, it makes my life way more efficient. But I still 
have to do the work. 
I still have to think. I still have to be creative, right? I just use it as my assistant. And I think if 
you''re a seller, you''re a director, you''re a manager, it''s the same thing. 
You''re going to say, hey, let''s look at John''s pipeline. Where is your weakness with John''s 
pipeline right now, right? 
Or let''s look at John''s last three calls and what does he need to improve? Like, it''s just you still 
have to do your job as a leader or an individual contributor. 
It just makes your life a lot easier. And it''s like, just think about the small thing of like doing a 
call. 
You know, in the old days, we take notes while we''re doing a call. Well, you miss things while 
you''re taking notes. 
Now I''m transcribing this as we speak. I won''t miss a thing from this conversation. And I have all 
this data to say, okay, well, what did Katie and I talk about last time? 
What do I have to do? And what does she have to? I mean, I don''t miss anything, you know? 
It''s crazy how like it''s like there''s a lot of bad to get up with AI. But like. All the good stuff, it''s 
overwhelming. 
There''s so much. 
 
@14:05 - Katie Wilson (getbuilt.com) 
It is overwhelming. And I''ll tell you, I''ve had a first glance at everybody''s plans, because I said 
the first draft is due Tuesday. 
were like 40 pages. Who knows? They were probably all written by AI. But I''m like, I put 
together a one page. 
 
@14:19 - Vince Beese (vincebeese.com) 
Well, I bet you, I guarantee you those ones that are 40 pages were absolutely written by AI for 
sure. 

It''s just too much info sometimes. 
 
@14:26 - Katie Wilson (getbuilt.com) 
But it''s good to have that level of detail. Like, need to obviously get to that point with the detail, 
but I like to start high level. 
Anyway. Yeah. 
 
@14:35 - Vince Beese (vincebeese.com) 
My recommendation was, one, let''s do a quick workshop to kind of walk these folks through. 
But, like, what I''m doing with a lot of my clients like this, where I do a project, is I think it also 
comes down to just consistent coaching. 
And so I''ve offered a coaching package that''s a retainer base that I come in on a weekly basis 
and work on the team on certain things. 
And then once a quarter, we do a quarterly business. To focus on, again, getting better at the 
skill of sales and doing your job. 
So I don''t know if that''s going to be of interest to you guys, but that''s what I''d like to also work 
on. 
 
@15:12 - Katie Wilson (getbuilt.com) 
Yeah, I think, I think, like, I think up leveling the team, and not only, by the way, and I know we 
talked about this before, not only the account management team, but also the AE team is like a 
big priority for Scott Trena in general, right? 
Like, and again, nobody''s just, just continuous coaching improvement, like excellence, right? 
Seeking excellence is important across the board. I mean, I''d be interested in like both, let''s say 
both things, like learning more about like what this beta looks like, and I''d be interested in what 
this package looks like. 
I also know that, again, internally with all of our IT, AI tools that we''re building, we''re also 
exploring like, you know, how can we do coaching on call? 
Calls based on, you know, like send in a really great call into Gong or wherever, and then 
develop, you know, compare your call to that call, right? 

Like have your playbooks and say, where did you go off the playbook? So we''re also internally 
trying to do some, trying to develop some of that AI first, AI native sales thing. 
So right now we''re, like I said, this is just a directive two weeks ago. We''re just putting together 
our plans, like sales coaching is a big, is a part of the plan for the sales team. 
So to the extent, yeah, you can get me info on these two things. 
 
@16:35 - Vince Beese (vincebeese.com) 
Because your GM is also the sales leader for the AEs, am I right? 
 
@16:39 - Katie Wilson (getbuilt.com) 
Yeah, well, there''s, you might have met, Scott Thisson is like my kind of equivalent. 
 
@16:44 - Vince Beese (vincebeese.com) 
Yeah, I met with Scott. And then Scott Trena is overall. Wait, no, I met Scott Trena. 
 
@16:49 - Katie Wilson (getbuilt.com) 
Yes, he''s the GM. Scott Thisson, so I guess you didn''t meet with him, which is fine, but he runs 
the AEs. 
So he runs the AEs, I run the AMs and CSMs, and we both. 
 
@17:01 - Vince Beese (vincebeese.com) 
And you shared the feedback with who? The call feedback? With Scott Trena, the GM. 
 
@17:07 - Katie Wilson (getbuilt.com) 
I''ve always been talking about the GM, yeah. But he sits over everything, and he''s putting his 
plan together. We''re all putting our plans together, and sales coaching, continuous sales 

coaching, improvement and excellence is a big piece of all of our plans, even our solutions 
engineers, right? 
It''s like, how do we come to all of our calls? And, you know, it''s just across the board. It''s what 
can we do with AI to make sure we''re always, yeah, bringing our best, super prepared 
beforehand, and then afterward, like coaching, et cetera, to get better for the next one. 
 
@17:42 - Vince Beese (vincebeese.com) 
Which solution are you guys landing on or using more often? 
 
@17:48 - Katie Wilson (getbuilt.com) 
We internally right now, and I wouldn''t necessarily, I don''t even know if I would say we''re landing 
on it, but we are, we just got our Enterprise Clawed license. 
So we''ve been using it individually for, I don''t I personally have only been using it about two 
weeks, and it''s pretty amazing. 
And I think that''s been the thought overall. So we just got our enterprise license, I think, literally 
yesterday. So Claude is, I think, the tool that we''re generating. 
They keep doing this. 
 
@18:15 - Vince Beese (vincebeese.com) 
They keep leapfrogging each other, right? So Claude right now, here''s how someone educated 
me on it. OpenAI is more like a consumer-based product, where Claude is more B2B-focused. 
B2B, exactly. And I see a lot of people moving to it. 
 
@18:31 - Katie Wilson (getbuilt.com) 
I''ve only been using it for two weeks, so I''m still kind I''ve only been using it for two weeks. 
 
@18:35 - Vince Beese (vincebeese.com) 
Okay. 

 
@18:35 - Katie Wilson (getbuilt.com) 
But I''ve built, like, yeah, the connectors. I brought data together, built, like, client health scores. 
Like, how can you take, write your gong transcripts overlaid with your product and usage data? 
And you have a really nice, like, client database. 
 
@18:48 - Vince Beese (vincebeese.com) 
And it creates nice documents, too, you know? Yeah. 
 
@18:52 - Katie Wilson (getbuilt.com) 
But the other thing with Claude that''s really interesting, and I just get this info from, like, people I 
follow on Twitter or their website. 
Bye It''s like they come out with these skills all the time. They have a sales skill. They have their 
legal skill. 
You can just download their skills. 
 
@19:11 - Vince Beese (vincebeese.com) 
Isn''t it crazy? Isn''t it crazy? 
 
@19:15 - Katie Wilson (getbuilt.com) 
Yeah. I mean, the day they came out with their legal skills. 
 
@19:17 - Vince Beese (vincebeese.com) 
So a couple of things. You want to get something on the calendar for next week? Yes, let''s do 
that. 
It looks good universally for folks. 

 
@19:27 - Katie Wilson (getbuilt.com) 
Well, I''m going to try for middle of the week. And then what does this look like? Is it one hour? 
it two one-hour sessions? 
 
@19:35 - Vince Beese (vincebeese.com) 
think let''s do one hour. I find people zone out after an hour. And, you know, I think what I''ll come 
up with is specifically, here''s the two agenda items, and they''ll have to come into the call with 
some of their deals that they''re working on. 
And we''ll have to, you know, use those in the conversation, right? So it''s a, it''s a, let''s talk about 
these two things, come in with these deals. 
And we''re going to workshop them in real time, right? Yeah. 
 
@20:06 - Katie Wilson (getbuilt.com) 
Oh, you know what? Tuesday, nobody is traveling. There''s a lot of travel going on. You say St. 
 
@20:14 - Vince Beese (vincebeese.com) 
Patty''s Day. I don''t care. It doesn''t matter to me. 
 
@20:23 - Katie Wilson (getbuilt.com) 
Tuesday would be great. Let me just figure out if we can do, okay, 11 to 12. 
 
@20:31 - Vince Beese (vincebeese.com) 
Can you do afternoon on Tuesday or is it morning? You definitely do four to five. 
 
@20:36 - Katie Wilson (getbuilt.com) 

I don''t know if that''s too, you know, we kind of work on central time a little. that''s three to four 
central. 
 
@20:40 - Vince Beese (vincebeese.com) 
That works for me. Four to five is perfect. Okay. 
 
@20:45 - Katie Wilson (getbuilt.com) 
Okay. I''m going to do this right now. me put Spencer''s the only one I didn''t check. Let me see 
him. 
Oh, he''s not available, but that''s fine. Everybody else is. I''m going to say cold. 
 
@20:57 - Vince Beese (vincebeese.com) 
Four Eastern to five Eastern, correct? Okay, that works. The 17th. Yeah, and use your invite, if 
you don''t mind. 
Yeah, I am. 
 
@21:09 - Katie Wilson (getbuilt.com) 
Travis doesn''t have a thing, right? Oh, no, that''s right. Okay, what are we calling this? I just call it 
the, I don''t know, the workshop. 
 
@21:19 - Vince Beese (vincebeese.com) 
Sales workshop. Yeah, sales workshop. And, you know, we''ll go over, again, the two areas that I 
sent you in the email that, based on the calls, where help is like, you know, getting client 
commitments and deep probing questions, right? 
So digging deeper is one topic, and, you know, getting commitments of whether it''s a calendar 
invite or when it''s going to get closed and that sort of thing. 
Those are the two main topics. Okay. 
 

@21:52 - Katie Wilson (getbuilt.com) 
So, for example, Colt, your last call was such and such. 
 
@21:56 - Vince Beese (vincebeese.com) 
How did you end the call? You know, and we''ll... Walk through it. 
 
@22:01 - Katie Wilson (getbuilt.com) 
Okay. What could have you done differently now? 
 
@22:03 - Vince Beese (vincebeese.com) 
I would have done this. Great. There you go. 
 
@22:07 - Katie Wilson (getbuilt.com) 
So could you just send me – so I just sent that. Could you just send me – I''ll send you 
something before end of day, a description that you can use to send around a team. 
 
@22:19 - Vince Beese (vincebeese.com) 
Great. 
 
@22:20 - Katie Wilson (getbuilt.com) 
And what they need to be prepared with or whatever, because I just sent it and said hold. 
 
@22:26 - Vince Beese (vincebeese.com) 
You put something on Wednesday. I don''t know if you knew that. Sorry, didn''t – Not only that, 
you did it from 2.30 to 3.30. 

Sorry, sorry, sorry. 
 
@22:33 - Katie Wilson (getbuilt.com) 
It was on a different screen. 
 
@22:35 - Vince Beese (vincebeese.com) 
I''m like, wrong day, wrong time. Yeah, no, you know why? 
 
@22:39 - Katie Wilson (getbuilt.com) 
Because I started on Wednesday. It''s like a – I''m going to – you know what? I''m blaming it on 
this stupid Gmail calendar. 
It''s like kind of a bug of theirs, actually. That''s what I''m – I''m saying it''s their fault, not mine, FYI. 
It''s not a Katie problem. 
 
@22:56 - Vince Beese (vincebeese.com) 
It''s technology. No, it''s not. It''s technology. It''s technology. 
 
@22:59 - Katie Wilson (getbuilt.com) 
Because I – I see it now. 
 
@23:00 - Vince Beese (vincebeese.com) 
Four to five. Hold. Got it. I will. I''ll give you a description that you can then send around the 
team, put it into the invite, all that fun stuff. 
Okay. Awesome. And then, go ahead. 
 

@23:14 - Katie Wilson (getbuilt.com) 
No, I was going to say, and then send me what these two things look like, right? Whether it''s 
beta and or like, I think you said retainer. 
And like I said, internally, we''re doing some things with AI as well. 
 
@23:26 - Vince Beese (vincebeese.com) 
I''m going to position it, by the way, for both your organization and Scott''s organization. Scott''s 
organization. Do you care if I reach out to Rich and catch up with him? 
I don''t care. 
 
@23:39 - Katie Wilson (getbuilt.com) 
You should definitely. Believe it or I haven''t spoken to Rich since October. 
 
@23:43 - Vince Beese (vincebeese.com) 
Yeah. 
 
@23:44 - Katie Wilson (getbuilt.com) 
Yeah. You kind of mentioned that. But yeah, reach out to him. 
 
@23:48 - Vince Beese (vincebeese.com) 
purposely didn''t want to, you know, I don''t know why. I should have. But I haven''t caught up with 
him in so I''m going to catch up with him. 
 
@23:55 - Katie Wilson (getbuilt.com) 
He, just a macro view of what''s going on. I think I told you. So we recently got a new CFO, 
which is great. 

 
@24:03 - Vince Beese (vincebeese.com) 
We''ll be kind of growing our RevOps. 
 
@24:06 - Katie Wilson (getbuilt.com) 
Rich, I don''t know if I told you this, and if there''s too much info, if you don''t care, let me know. 
But, you know, we have two sides of the business, our lender side, which is the side I work on. 
It''s got Trina, all the people you''ve talked to on the lender side of business, which is, you know, 
98% of our revenue, right? 
We also have a side that sells to, like, owners and developers. And the goal, ultimately, is to 
have these two sides of the business, really, like, the product that you sell to lenders. 
You can also have a product that you sell to the owners and developers. They can use it to 
communicate. 
It''s like the flywheel. Is that more of a consumer type of product? Well, it''s direct to an owner or 
developer, like, managing their construction projects versus a lender who''s managing the 
money, etc. 
So they actually will, like, ideally talk to each other. And then the owner development one has 
payments embedded in it as well. 
So if you''re an owner running a project, you can... can pay your GCs, pay your subs, pay your 
vendors, all on that product. 
And then you can communicate with your lender if your lender has our product. So this is going 
to be the year where the two sides really come together. 
But this is what I was going to say. Rich was acting as the general manager of that 
owner-developer side of the business and the president. 
You know, he wears many hats because he''s great. But we recently found somebody internally 
to kind of take over the GM duties of that business. 
So now Rich is fully, you know, doing his special projects, et cetera, across the company. He 
doesn''t have his, like, day job at the company, which was running that business. 
So it''s going to be really great, I guess is what I''m saying. So he will have more time. 

 
@25:45 - Vince Beese (vincebeese.com) 
He''s – I just want to – you know, that''s cool. I figured he''s always busy, first of all. He''s always 
working on 50,000 things, too. 
So his personal and, you know, building a compound, you know. I don''t know. 
 
@26:03 - Katie Wilson (getbuilt.com) 
But yeah, definitely feel free to reach out. 
 
@26:08 - Vince Beese (vincebeese.com) 
I think these two things that I''ll put together and share with you, I think they''re obviously very 
complimentary for all sales, not just account management, right? 
I mean, and, you know, especially the enterprise sellers, quite frankly, I think they''ll really dig the 
automation of the tool, quite frankly, because all the things, the templates we talk about and do, 
that will be now in this tool. 
So, hey, create me a mutual action plan. Great. Here''s what I''m missing to be able to do that. 
Into your colors, all that stuff. 
Like it''s, you know, or a presentation proposal. Put together the deck. It''s got to be a Google. 
Here we go. 
Okay. Here''s what I''m missing. And builds it. You know what mean? Yeah. I mean, that''s what''s 
your point. 
 
@26:52 - Katie Wilson (getbuilt.com) 
That''s what we''re all, we all need to work towards. 
 
@26:54 - Vince Beese (vincebeese.com) 
Nobody needs to manually put stuff together anymore. You know what mean? There''s those 
days are over. You shouldn''t have to. 

Go to a PowerPoint and move images around and all that. That''s just why. That''s always the 
prettiness factor and the format factor shouldn''t be something we have to worry about anymore. 
You know, it''s what''s the thoughts. What are you trying to project? What are you trying to 
explain? That''s you, the creative process, you know? 
Yeah. All right. I''ll share that with you. I''ve got the date. I''ll give you the description by the end of 
the day and we will go from there. 
Awesome. 
 
@27:26 - Katie Wilson (getbuilt.com) 
And then if you end up reaching out to him, let me know how it goes. I''ll, like I said, when I get 
info from you, I''ll share it with Scott Trena. 
I''ll also share it when you talk to Rich or all with Scott Trena. Like we also have a small sales 
side on that owner development side of the business. 
You know, again, like I don''t know if we will move this direction, but I think it''s good to have this 
info and, you know, it can be, it doesn''t, to your point, have to be just me. 
It can be new sales, current sales, and the other side of the business. So we should consider it 
across all of them. 
 
@27:55 - Vince Beese (vincebeese.com) 
Awesome. All right, Katie. Have a great weekend. Talk to you soon.
---

Built prompt. Built is a current client and we are about to enter transition and conclude the first two phases of the project. I have recommended that they hire me as a coach, not just for the AM team for for the entire sales organization. in addition they as a company are looking for creative ways to utilize AI so i would also like to propose red zone selling ai coach.

Katie Wilson is my main point of contact but this would ultimately be signed off my her boss Scott Traina the GM and head of the entire gtm team. 

Here is my last call with Katie where i propose the coaching and AI solution. 

Before building the proposal, provide me your thoughts on the best way to tackle this.

one other piece of context, i have a personal relationship with rich williams who is the president of Built. we worked together at Experian.', '2026-03-27 19:45:26.76018+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (34, 12, 'assistant', '# Coach Mode — Strategic Read Before You Build

---

## THE DIAGNOSIS

You''re not in a typical sales situation. You''re an incumbent vendor transitioning out of a project engagement into a recurring revenue relationship — and you''re doing it while the company is actively mid-transformation. The timing is unusually good, but the deal has a structural risk: Katie is your champion and she''s bought in, but the real economic decision sits with Scott Trena (GM) who you haven''t directly engaged on this, and Rich Williams (President) who you have a personal relationship with but haven''t activated.

You have three things working for you and one thing that could kill the deal if you''re not careful.

---

## WHAT''S WORKING

**1. The mandate is already created — you didn''t have to create urgency.**
Rich and the executive team just issued a company-wide directive: rebuild every function AI-native. Sales coaching with AI is literally on Katie''s to-do list with a deadline. You''re not pitching a solution to a problem they might have someday. You''re responding to an active initiative with a hard due date. That''s rare. Don''t waste it.

**2. Your credibility is already established.**
You reviewed calls. You gave specific feedback. Katie sent it to the GM who said "this is the feedback we need." You''ve already demonstrated value at the decision-maker level without being in the room. That call review was essentially a free proof of concept.

**3. You have a back-channel to the President.**
Rich Williams. Former colleague. He''s now freed up from his GM duties and has more bandwidth. This isn''t just a nice-to-have — this is your closing triangulation asset.

---

## WHAT COULD KILL IT

**Single-threaded through Katie.**
Katie is engaged and advocating, but she''s told you directly — Scott Trena signs off. Scott Thisson runs the AEs. Rich is the president. You have a champion. You do not yet have multi-threaded alignment. If this goes to Scott Trena cold — meaning he sees a proposal without any prior direct context from you — it''s going to feel like a vendor pitch, not a strategic partnership continuation. That''s the risk.

---

## THE PLAY: Multi-Thread + Champion Co-Intro (Green Zone into Red Zone)

Here''s how I''d sequence this before you write a single word of a proposal:

**Move 1 — Activate Katie as an internal seller, not just a buyer.**
Before you send anything, get back on the phone with Katie and ask her one question:

*"Before I put the proposal together, I want to make sure this lands right with Scott Trena. What does he already know about what we''ve been working on, and what would make this an easy yes for him?"*

That question does two things. It tells you how warm or cold Scott actually is. And it prompts Katie to think about how she''s going to position this internally — which activates her as a champion, not just a receiver of your proposal.

**Move 2 — Use the Rich relationship as your executive bridge, not a shortcut.**
Don''t use Rich to go around Katie or Scott. Use him to go above and alongside. Send Rich a short personal note — not a pitch — that references your shared history, acknowledges the AI-native directive he''s driving, and says you have something you''d like to show him that''s directly relevant to what his team is building. One paragraph. Personal tone. No deck attached.

Here''s the note:

> *"Rich — hope you''re well. I''ve been working with Katie and the team on the lender side for the past few months and it''s been a great partnership. Heard about the AI-native directive you''re driving across functions — it lines up almost exactly with something I''ve been building. Would love to grab 20 minutes to show you what I have in mind and see if it fits where you''re taking things. No agenda beyond that. Let me know if you have a window."*

That''s it. Short. Personal. No pressure. But it multi-threads you to the President before the proposal hits Scott''s desk.

**Move 3 — Structure the proposal as two distinct offers, not one.**
From the call, you have two things to propose: the coaching retainer and the AI Coach beta. Don''t bundle them into one price. Present them as complementary but independently valuable. Here''s why: Scott Trena and Rich may have different appetites. The GM may want to pilot the coaching retainer first. Rich may be more excited about', '2026-03-27 19:45:58.728746+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (35, 13, 'user', 'I''m an AE at a data analytics software company. I have a deal with a mid-market SaaS company, about 300 employees, in the project management space. I got introduced through a mutual connection to their VP of Operations, who I''ve had two calls with.
On the first call she told me their reporting is a mess — teams are pulling data from three different tools and nothing syncs up. She said it''s causing delays in their weekly exec meetings because the numbers are always wrong or late. I sent over a demo and she liked what she saw. Second call she said her team is "definitely interested" and asked me to put together some pricing.
I have pricing ready to send. I''m planning to follow up with her this week and attach the pricing to the email. I think this one is moving in the right direction. What should I do next?', '2026-03-30 18:44:56.810572+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (36, 13, 'assistant', '## What''s Actually Happening Here

You have a VP of Ops who likes the demo and asked for pricing. That feels like momentum — but you''re about to make a classic mid-funnel mistake: sending pricing into a vacuum. You don''t have a champion yet, you haven''t confirmed budget authority, and you have zero visibility into who else has to say yes before this closes. Pricing without that context doesn''t accelerate deals — it stalls them, because it lands with no one to champion it internally.

---

## The Play: Multi-Thread Play + Stakeholder Map (G1 + G2)

Before that pricing email goes out, you need to use this moment to earn access upward and outward. The VP asked for pricing — that''s leverage. Use it to get a meeting, not to send an attachment.

Here''s exactly how to run it:

**Don''t send pricing in an email. Request a call to walk through it.**

This is your Scheduled Next Step Play inside a Multi-Threading setup. The goal of that call isn''t to present numbers — it''s to:

1. Confirm who else is in the room when decisions like this get made
2. Get her to tell you if there''s a budget conversation that needs to happen
3. Ask if the exec team (who''s apparently suffering the most from bad reporting) should be looped in

---

## The Script

Here''s the email to send:

> **Subject: Pricing + next step**
>
> [Name] —
>
> Good timing on the pricing ask — I''ve got something ready that I think will make sense for where you are.
>
> Rather than just attach a number, I''d rather walk you through it together so I can tailor it based on your rollout priorities. Would also be helpful to understand if there''s anyone else — finance, your CTO, or even your CEO — who would want visibility before this moves forward.
>
> Can we find 30 minutes this week or next? I want to make sure when we put something in front of your team, it''s buttoned up and easy to say yes to.
>
> [Your name]

That last line does two things: positions you as thoughtful, and signals that you expect more than just her approval.

---

## On That Call — Run the Stakeholder Map Play

When you get her on the phone, ask this directly:

> *"When something like this moves forward — a new platform touching multiple teams — who typically needs to weigh in before it''s official? I want to make sure we''re not creating any surprises for you internally."*

Listen hard. She''ll either name the people (great — now you know who to thread), or she''ll say "it''s really just me" (which you should pressure-test — a VP of Ops at a 300-person company rarely signs a software deal solo).

---

## One Next Action

Send that email today — before end of business. Don''t attach pricing. Request the 30-minute walkthrough call. Get it on the calendar before the weekend.

---

Want me to build out a Stakeholder Map (G1) for this deal based on what you know so far? It''ll show you exactly where your blind spots are before that next call.', '2026-03-30 18:45:18.95431+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (2, 1, 'assistant', 'ZONE: Yellow — pre-qualified. You have executive access before a confirmed deal, which means this call is pure qualification and first impression. One bad prep job and you lose the shot.

---

## THE DIAGNOSIS

This isn''t a sales call yet — it''s an audition. The president is deciding if you''re worth their time. Most reps show up with a deck and a product pitch. That''s the wrong move. Your job on this call is to ask sharp questions, demonstrate you''ve done your homework, and walk away with either a qualified deal or a clear disqualify signal.

Two risks I''ll flag right now:

- **Timeline:** You don''t know yet if they have a pressing reason to solve this now or if this is exploratory. That changes everything about how you run the call.
- **Cost of inaction:** No established pain = no urgency. You need to surface what''s bleeding if they don''t fix this.

---

## THE PLAY: Deep Pain Probe (Y4) + Qualification Call Checklist (Y5)

Here''s how to prep:

**1. Do your homework — 30 minutes minimum**
- Read their last 2 earnings calls, press releases, or LinkedIn posts from the president
- Know their product category, competitive position, and any recent news (funding, expansion, leadership changes)
- Identify 2-3 business challenges common to companies in their stage/space that you solve

**2. Build your opening question**
Don''t pitch first. Open with something that shows you''ve done the work:

*"Before I tell you anything about us — I spent some time looking at [company]. It looks like you''re navigating [specific challenge or growth moment]. Is that where the pressure is right now, or is it coming from somewhere else?"*

**3. Run the 3-Layer Pain Probe**
Layer 1 — Surface the problem: *"What''s the thing your team is dealing with that made this meeting worth your time?"*
Layer 2 — Business impact: *"What does that cost you — in revenue, headcount, time, or missed goals?"*
Layer 3 — Personal stakes: *"If this doesn''t get fixed this year, what does that mean for you personally?"*

**4. Test priority and timeline**
*"Is this a top-3 initiative for you right now, or is this more exploratory at this stage?"*
*"Is there a specific date, event, or milestone that''s creating urgency on your end?"*

**5. End with a next step ask — not a close**
*"Based on what we''ve talked about, does it make sense to bring [your champion or next stakeholder] into the conversation? I''d want to make sure we''re not wasting your team''s time."*

---

## ONE NEXT ACTION

**By end of this week:** Complete your research on the president and the company, then write out your 3 opening questions. Don''t wing this call — show up with a point of view on their business and a clear agenda for what you need to learn.

---

Want me to build you a **Qualification Call Prep Sheet** using the Y5 Qualification Call Checklist tailored to this specific call? Give me the company name, what you sell, and what you know about why they agreed to the meeting — I''ll build it out.', '2026-03-31 18:44:37.395784+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (37, 14, 'user', '"I just finished a coaching session with one of my AEs. Here''s the situation: She''s a mid-level enterprise AE, about 3 years in. The deal she walked me through is with a mid-market SaaS company — around 400 employees. She''s been working it for 90 days. She has a solid champion in a VP of RevOps, but she''s never gotten in front of the CFO or the CEO, who are the actual economic buyers. Her champion keeps saying he''ll set up the intro but it hasn''t happened. She has a next step on the calendar — a product deep dive — but no exec access and no business case built yet. She thinks the deal is in great shape. What are the real gaps here and how would you coach her on them?"', '2026-04-01 14:03:47.897208+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (38, 14, 'assistant', 'ZONE: Green — stalled. The deal has motion (champion, calendar invite, 90 days of engagement) but it''s structurally fragile: no economic buyer access, no business case, and a champion who''s promising introductions he hasn''t delivered. This deal feels active but it isn''t advancing.

---

## THE DIAGNOSIS

Your AE thinks momentum equals progress. It doesn''t. A product deep dive with a VP of RevOps who can''t sign the check is activity, not advancement. Ninety days in with no CFO or CEO access and no business case isn''t "great shape" — it''s a deal that''s comfortable but going nowhere.

The real problem here is two things happening at once:

**1. The champion is either blocked or not actually championing.**
When a champion keeps promising an exec intro and not delivering, there are only three explanations: he doesn''t have the access he implied, he''s not confident enough in the business case to put his credibility on the line, or he''s managing you — keeping you engaged without risking exposure inside. Your AE needs to find out which one it is. Because if he can''t or won''t get her in the room, he''s not a champion. He''s a contact.

**2. No business case = no urgency, no exec access, no close.**
The CFO and CEO aren''t going to take a meeting about a product. They''ll take a meeting about a business problem with a dollar amount attached. Right now, your AE has nothing to bring them. The product deep dive is premature — and it might actually be burning time she could use to build the case that gets her in the door.

**Risk flag — timeline:** Has anyone confirmed when this needs to be solved? Is there a business event, a board review, a fiscal year trigger — or is the close date something your AE put in Salesforce? If there''s no timeline anchored to a buyer need, there''s no urgency.

**Risk flag — cost of inaction:** Has your AE quantified what delay costs this company? If the answer is no, the CFO meeting will never happen — because there''s no reason for the CFO to show up.

---

## THE PLAYS

### Play 1: Champion Activation Playbook (G6)
Your AE needs to stop waiting for the champion to deliver the intro and start helping him *want* to deliver it. Champions don''t make introductions because you asked nicely. They make introductions when they''re personally invested in the outcome and have a business case that makes them look smart for bringing it forward.

Coach her to have this direct conversation with her VP of RevOps:

> *"[Name], I want to make sure I''m setting you up well here. We''re 90 days in and I know there are decisions that need to happen above your level. Here''s where I want your honest read: what would make it easy for you to bring the CFO into this conversation? And what''s your biggest hesitation right now about doing that?"*

That question does two things: it surfaces whether he has access issues or credibility concerns, and it opens the door to co-building the business case — which is what makes the intro possible.

---

### Play 2: Business Case Builder (G4)
The exec meeting isn''t going to be scheduled until there''s a reason for executives to show up. Right now there isn''t one. Your AE needs to co-build a business case *with* the champion — not hand him a slide deck, but sit down and build it together so he owns it.

Coach her to come out of the product deep dive with the inputs she needs:
- What does the current state cost them? (time, headcount, revenue leakage)
- What''s the measurable outcome if this is solved?
- What happens to the business if it *isn''t* solved by [specific date]?

That last question is the urgency anchor. It gets you to cost of inaction and it gives the champion a reason to say to the CFO: *"We need to look at this now."*

---

### Play 3: Friction Preload Play (G3)
Before the product deep dive, your AE should set the agenda with an intent test. Don''t just let the meeting be a feature walkthrough. Use it to co-create the path to a decision:

> *"Before we get into the product, I want to make sure we''re building toward something concrete. Can we take 10 minutes at the start to align on what a decision process looks like on your end — and', '2026-04-01 14:04:17.573776+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (39, 15, 'user', '"I''m having a bad quarter. I''m at 40% of quota with 6 weeks left. I''ve been grinding but nothing is closing. I have a handful of deals in my pipeline but honestly I don''t know if any of them are real. I''m starting to press — discounting earlier, following up too much, probably showing desperation. I know it''s not working but I don''t know how to reset. What do I do?"', '2026-04-01 14:08:23.178376+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (40, 15, 'assistant', '## STEP 1 — ACKNOWLEDGE

You''re in a real hole, you know exactly what you''re doing wrong, and you can''t stop doing it. That''s not a lack of awareness — that''s a pattern that''s taken over your process. Let''s break it.

---

## STEP 2 — REFRAME

What you''re describing has a name: **playing not to lose**. It shows up exactly the way you described it — early discounting, over-follow-up, desperation energy leaking into every touchpoint. The problem isn''t your pipeline. It''s that you''ve shifted from engineering outcomes to seeking approval, and prospects can feel it. Every unnecessary discount, every extra check-in email is a signal that you''ve lost confidence in the value you''re selling. That signal destroys deals faster than any competitor will.

Here''s the harder truth: the pressing is making the pipeline worse, not better. You are the reason deals are stalling right now — not the market, not the buyers, not bad timing. Which means you are also the solution.

---

## STEP 3 — THE MENTAL PLAY: Pipeline Audit + Play to Win Reset

Two moves, run them together.

**First: Pipeline Audit — strip it to what''s real.**
Take your pipeline right now and force-rank every deal into one of two buckets:

- **Real** — there is a defined problem, a named decision-maker who has engaged, and a reason they would buy in the next 6 weeks
- **Not Real** — it''s in your pipeline because you need it to be, not because the evidence says so

No middle ground. No "maybe." Be brutal. Most reps in your situation are carrying 60% fiction and spending their energy managing deals that were never going to close. Knowing what''s real is not depressing — it''s the first act of a closer.

**Second: Play to Win Reset — for every real deal, ask one question:**
*"What would a great closer do on this deal today — not to avoid losing it, but to actually win it?"*

That question will surface the move you''ve been avoiding. The conversation you''ve been softening. The ask you haven''t made. That''s your play. The rep who asks for the business with confidence, at the right moment, with no apology — that rep closes. You know how to be that rep. You''ve done it before.

---

## STEP 4 — THE ACTION

In the next 60 minutes: **Do the pipeline audit. In writing.**

Open a blank doc. List every deal. Force it into Real or Not Real. No maybes. When you''re done, you''ll have a short list of deals worth your full energy — and you''ll have stopped bleeding time and confidence into the fiction column.

Then pick the single most closeable real deal and write down the one move you''ve been avoiding on it. That''s your first call tomorrow morning.

Six weeks is not nothing. But it requires you to be a closer right now, not a follow-up machine. Start with what''s real.', '2026-04-01 14:08:43.759622+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (41, 16, 'user', '"I just finished a coaching session with one of my AEs. She''s a mid-level enterprise AE, about 3 years in. The deal she walked me through is with a mid-market SaaS company, around 400 employees. She''s been working it for 90 days. She has a solid champion in a VP of RevOps, but she''s never gotten in front of the CFO or the CEO, who are the actual economic buyers. Her champion keeps saying he''ll set up the intro but it hasn''t happened. She has a next step on the calendar — a product deep dive — but no exec access and no business case built yet. She thinks the deal is in great shape. What are the real gaps here and how would you coach her on them?"', '2026-04-01 15:04:20.128942+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (42, 16, 'assistant', 'ZONE: Green — fragile. The deal has momentum on the surface — active champion, scheduled next step, 90 days of engagement — but it''s single-threaded to a VP who hasn''t delivered exec access, and there''s no business case anchoring the value for the people who actually sign.

Here''s what''s actually happening: her champion is comfortable. He''s engaged, he likes the product, and he keeps the relationship warm — but he hasn''t sold internally yet. The fact that the CFO and CEO intro hasn''t happened after 90 days isn''t a scheduling problem. It''s a signal that either he doesn''t have the internal credibility to make that introduction, he hasn''t built the case to justify it, or he''s protecting his lane and doesn''t want exec scrutiny on a project he owns. Any of those three is a problem. A champion who won''t open doors is a sponsor, not a seller. And right now, she''s about to run a product deep dive — adding more technical depth — without confirming who actually has to approve this deal.

The two plays she needs to run are the **Champion Activation Play** and the **Business Case Builder**, in that order.

The Champion Activation Play is the immediate intervention. She needs to stop waiting for the intro to happen and have a direct conversation with her champion about what it takes to get to the CFO and CEO. Not a gentle nudge — a real conversation. Something like this:

*"I want to be straight with you — we''re 90 days in, and I know the product fits your needs. But we''ve never gotten in front of [CFO name] or [CEO name], and I know deals at this size require their sign-off. I want to make sure I''m not setting you up to get stuck internally. What would it take to get 30 minutes with them before we get too deep into procurement? I can make it easy for you — I''ll build the executive brief, I''ll own the agenda, I''ll make you look good walking in. I just need the room."*

That language does three things: it names the risk honestly, it gives her champion a path that feels low-effort and high-credibility, and it tests whether he''s actually willing to use it. If he pushes back or deflects again, she has her answer about whether this deal has legs.

Then, in parallel, she needs to start the **Business Case Builder** — not for the product deep dive, but as the vehicle for the executive conversation. The CFO and CEO aren''t going to engage with a product demo. They''re going to engage with a business case that quantifies what this problem is costing them and what the upside looks like. Her champion needs to co-create that with her so he walks into that intro with something credible in his hands. Right now there''s no financial anchor in this deal — no confirmed cost of inaction, no ROI framing — and that means even if she gets the exec meeting, she''ll walk in underprepared.

One more thing worth flagging: the product deep dive on the calendar is not a real milestone unless it leads to exec access. She should use that meeting to advance two things — confirm the business case numbers with her champion, and lock a specific date for the exec intro as a condition of moving the evaluation forward. Not "let''s try to get that set up" — an actual date on the calendar before she walks out of that deep dive.

The bottom line: this deal isn''t in great shape — it''s comfortable, which is a different thing. She has a champion who likes her but hasn''t sold internally, no economic buyer access after 90 days, and no business case. The next move is a direct Champion Activation conversation before the product deep dive, where she asks for the exec intro by name, offers to own the prep, and uses the Business Case Builder to give her champion something worth walking in with.

Want me to build the Business Case Builder or a Key Stakeholder Map for this deal so she has the artifacts ready before that deep dive?', '2026-04-01 15:04:45.701395+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (43, 17, 'user', '"I''m having a bad quarter. I''m at 40% of quota with 6 weeks left. I''ve been grinding but nothing is closing. I have a handful of deals in my pipeline but honestly I don''t know if any of them are real. I''m starting to press — discounting earlier, following up too much, probably showing desperation. I know it''s not working but I don''t know how to reset. What do I do?"', '2026-04-01 15:06:40.665445+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (44, 17, 'assistant', 'You''re behind, you know it, and the moves you''re making right now are making it worse — earlier discounts, over-follow-up, desperation signals. That''s not a grind problem. That''s a closer who has shifted from playing to win to playing not to lose.

Here''s what that shift costs you: buyers can feel it. When you discount before they ask, you''re telling them the deal is in trouble. When you follow up three times without a response, you''re training them to ignore you. The pressure you''re carrying is leaking into your execution, and it''s doing the opposite of what you need. The first thing to fix is not the pipeline — it''s the posture. You need to get back to running the process like someone who believes they can win, not someone who''s afraid of losing.

The play right now is **Pipeline Triage**. Not in your head — in writing, in the next 60 minutes. Take every deal in your pipeline and force-rank it into one of two buckets: Real or Not Real. Real means there is a defined problem, a named decision-maker who has actually engaged with you, and a legitimate reason to buy in the next six weeks. Not Real means the deal is in your pipeline because you need it to be there. No middle ground, no maybes, no "it could happen." Be brutal. What you''ll likely find is that you have two or three real deals and a set of wishes dressed up as pipeline. That''s not a disaster — that''s clarity. You cannot close a deal that was never real. But you can close the ones that are, if you stop treating them all the same and start running hard at the ones that actually have a pulse.

Once you know which deals are real, pick the one closest to a decision and write down — right now, in the next 60 minutes — one specific action you''ve been avoiding that a great closer would take today to move it forward. Then go do that thing.', '2026-04-01 15:06:53.741989+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (45, 18, 'user', 'are you there?', '2026-04-02 12:29:28.37511+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (46, 18, 'assistant', 'Yeah, I''m here. What''s the situation?', '2026-04-02 12:29:30.890695+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (47, 19, 'user', 'below is a transcript of an interview my client had with a sales leader. review and provide a summary of the call, pov on how she did on the call and based on this call what she should do. erica is my client on the call.

CHRIS: It''s interesting. Morning, Erica.
ERICA: Hi, Chris. How are you?
CHRIS: I''m well, thanks. How are you?
ERICA: Um, I am happy that tomorrow is Good Friday.
CHRIS: Yeah, yeah. Are you taking the day off, or do you have it off?
ERICA: No, I''m not taking it off. Of course, my kids have it off.
CHRIS: My kids have it off as well. My wife takes it off, though, because she, we''re hosting on Sunday, so she wanted to use the day to get ready. But yeah, my kids are both off. Um, so, one of those weird days where I have a normal day and they don''t, it''s like, how are we gonna make this all work?
ERICA: Yeah, yeah. So I am hoping that a couple of my clients have the day off and it''s a bit quieter so that I can get some things done. I could use some time. But yeah. Um, in terms of time, I have us till 10:30. Do you have a hard stop at 10:30 today?
CHRIS: I do actually have a hard stop, yeah. Um, myself and Dan, one of the AEs on my team, and then Mario, our CEO, were doing a prep for an upcoming call with Wells Fargo. So I do need to join that. But I, this is your time. Um, I enjoyed our previous conversation, but I know that you had some additional questions. So love to answer those and get right into it.
CHRIS: And I just froze —
ERICA: Yeah, you are frozen. I don''t know why. Let me turn off my video and see if this fixes anything.
ERICA: Okay. Yep, there you go. You''re back on. 
CHRIS: Never saw that before.
ERICA: Awesome. Um, so, oh, before we get started, do you mind if I transcribe this call?
CHRIS: Not at all.
ERICA: All right, I''m gonna do it from my phone, so I know that we need to officially ask. Okay, there we go. Um, so, in terms of the objective for the call, I personally would like us both to walk away with a 90% — I would say — feeling of knowing whether or not we could work together. The 10%, the other 10% would be, obviously, some of the mechanics, logistical things, and, you know, weigh in from probably other parties on your side, and my ability to talk with them. But I would really love for this call — you coming out of this call, for me and you — to know where we stand. Here''s how I wanted to structure the call. You tell me if you want to kind of make some changes and, you know, where you want to get some specific things out of it. I''d love to hear a little bit about you as a leader. I wanna kind of shift to the team dynamics, and then specifically hone in on the role itself, if that''s okay.
CHRIS: Sounds great. Yeah. Let''s do it. Sure.
ERICA: Awesome. So, I''d love to hear a little bit about you as a leader. You know, what — I know that''s a little bit of an awkward question, but — how do you lead? What is your style?
CHRIS: Yeah. Open-ended. So a couple of things. I think as a sales leader, I lead the way that I wanted to be led when I was an individual contributor. Now, that works really well for some people and less well for others. And candidly, it works really well for some of the managers I reported to, and less well for others. So what do I mean by that? I really value people who operate with a high degree of accountability. But with that, I also provide a high degree of autonomy. So if you have a plan, and you are visibly executing against that plan, other than just checking in occasionally to get the updates that I need to run up to the chain, my job is pure servant leadership. I will start every meeting with, what do you need? What''s getting in the way? How do I support you? Where that doesn''t work as well, candidly, is when — and I don''t say this because I assume any malicious intent or anything, I just think some people just don''t operate as well with that level of autonomy. And if you''re coming to me saying, well, what''s the next step? Two things. One is I''m trusting you to know that better than I will, because you''ll know the account, you''ll know the buyers, you''ll know the challenges. You know all those things better than I will. But number two, I think that just — there''s too much passivity there. I don''t know if we talked about this in our last conversation. But I want to be very, very — to your point about getting to 90% — I want you to have context of the team as part of that. So I joined at the beginning of this year. Last year, the team went through a lot of changes. I won''t unpack all of them. Happy to get into it later if you want, but Dan, who I mentioned, who I have to drop in 20 minutes to discuss Wells — Dan''s been with the company for 5 years, top performer, literally just closed a $250,000 deal, which is the name of the game. And yet he had 4 managers last year, and that is a difficult environment for even the highest performer to operate in. So I say that to say that I get that last year was a challenging year for the team. And part of my job as a leader is to recognize that, and be empathetic as I implement changes and as I put into place my operating rhythm — the team''s already had a lot of "do this, no, no, no, now do this." So I''m trying to be mindful of that. However, one of the people on the team that I inherited — all I heard was, "well, I was told this before, and this was good enough before." That person''s no longer here. So there is an element of — I will provide anyone with a high degree of autonomy, but if I don''t see it, and if there''s no ownership to operate within that environment, we''re going to have a hard conversation. And part of the reason why we have this opening is, number one, I needed to grow the team regardless. And number two, I''m backfilling for Jason. And that creates even more urgency for me to move through this process quickly. I''ll pause there. I could probably say more about my style, but is that a hopeful start?
ERICA: Yes, that''s really good. I love hearing that because what I have found is — on one of my last teams — different individuals operated a little differently. There was a lot of leniency there, which is fine until shifts occur in the territories and you inherit a client from someone else that operates very differently with the manager that you''re all operating under. And so that''s when some things begin to surface and you realize — I ask about the team dynamics because I think it''s important for us all to be, while we''ll have individual ways of doing things, it''s important for us all to have the same expectation in how we drive the client, if that makes sense.
CHRIS: Yeah, I think that''s really true. And very timely, because we just turned the corner on the end of Q1. As I said, Dan — the whole entire team contributed, which I''m excited about. And because Dan''s deal was obviously a bigger deal, we were significantly above our team number. So I couldn''t be happier with the performance. But there are still questions about, well, what are my expectations, and what will they be over time? So I''m still in a setting and reinforcing expectations mode. And I''m excited that we''re adding people to the team because it gives me an opportunity to reestablish expectations with someone new and then use that as an opportunity for us to have more of a standard. The team wasn''t really all over the place — one exception — but if you have multiple managers, like, my big thing, just to be more in the weeds: like any business, we have a CRM, we track activity. If there is a focus account — I''ll use Wells as an example — and marketing is investing in that focus account, and our partnerships team is investing in that focus account, well then my team needs to do its part, so we''re gonna track some of that. There''s just an aspect of — I expect the account owner to do their job and make sure Salesforce is up to date, like basics like that. But what I really care about is creating new opportunities. At the end of the day, that''s what I care about the most. So I kind of view inviting Wells to an event as necessary but not sufficient. What really matters to me is, are we identifying new entry points into the organization? Are we creating new opportunities? Are we qualifying those opportunities? And then, if we agree they''re qualified, is there a plan to execute against it? That''s what I really care about. But my job is to help the business run efficiently — and if marketing and partnerships and product are all doing certain things with an expectation to grow Wells, my team needs to do the same thing, and part of that just needs to be as basic as updating Salesforce. Back to the team dynamic — I''ll use this as an opportunity to call out that I inherited a team of 4 sellers. We are supported by a team of 4 sales engineers. They don''t report directly to me, but you can see that as kind of a dotted line relationship. And then more broadly, we are supported by a team of 5 account managers. In Quantum, the AE role is responsible for driving account growth, both new and existing customer relationships. The account manager is responsible for making sure the account is expandable. So we have two in the box working on existing account relationships. That might be a little bit different than what you''re accustomed to. But I say all that to say that across that whole ecosystem — sellers, sales engineers, and account managers — by my count, 13 of the 15 individuals are male. So as it relates to team dynamic, we''re not very gender balanced. That''s just something you should be aware of. It''s certainly not by my design because I''ve inherited all of this, but I do think two things. One is, I''ve always felt that our customer-facing team should reflect the teams that we''re working with. And that''s bad if we''re all male. And also — I''ll just speak candidly — there are going to be buyers out there that want to work with a woman. That''s fine. And so that is something that I am being thoughtful of. But I say that because if I''m in your shoes, it''s like, alright, well, this is kind of a new role in some ways. We haven''t had a lot of gender diversity across the team. And again, I''m not sure why — I just wanted to flag that.
ERICA: Sure. Um, okay, getting a little bit more granular, because I know we''re kind of at the halfway point — and I appreciate you digging into those details around the team. A couple of things that, for whatever reason, I keep going back to in my preparation. And so maybe if I get this answer from you, it will help me move forward. You referenced, in our last conversation, that the business is expecting some significant growth, specifically because there was a little bit of a disruption. So they''re always expecting growth. But I''m curious if you have a specific number — I''m kind of curious to understand at a high level, what are your expectations in terms of growth for the overall team?
CHRIS: Yeah. So to get into the numbers, my team target is $7 million in new ARR. We will renew a similar number this year — which is to say we have $7 million in contracts that are up for renewal, and we are reasonably confident that those will renew flat, or with some modest upsell. So $7 million renewal — and again, that''s a partnership between the sellers on my team, the account managers, and to some extent even our senior leadership that''s been really involved in those. That''s the renewal motion. And then separately, we have an expansion motion and a new customer acquisition motion. So all three of those things are happening at once. My goal is to obviously renew every one of those dollars and to add to the vertical by $7 million new ARR. That''s my primary KPI. But I believe that we can do north of 11. So my target is really, at a team level, 150% attainment. I mentioned one of my sellers is already at 200%, so he''s off to a great start. We have some significant expansion opportunities already in our pipeline. I feel really confident the team''s gonna get to seven. I have much less confidence in our ability to get to $10.5, $11.5 — whatever — that is my goal, and I don''t right now have enough confidence in that. So that''s for 2026. You asked about 2025 — and again, I wasn''t here for this — but I can say that because the business overall was verticalized, that meant that in some cases accounts were moving from someone who, I''ll just use TD Bank as an example — we had a seller in Toronto who owned TD Bank. Now, because that''s now considered a BFSI account, someone on my team owns it, so there was an account transition. That was very disruptive to the business. I think it was disruptive to the entire business, but I think it was more disruptive to BFSI — in part because those are already long sales cycles, and in part because there was then leadership change in the midst of that. And I mentioned folks on my team having 4 managers in a year. So yeah, the team underperformed. It''s that simple. To a man, they would all say they underperformed.
ERICA: Gotcha. Um, so specific to the role that you''re hiring for — you referenced there being 2 openings and it sounds like you are purely focused on more of a hunter or a seller. I''m just trying to get a feel for: are there 2 types of roles? How are you categorizing the specific individual that will join your team? And then I have some subsequent questions.
CHRIS: Great question. So right now I have 3 sellers in seat, all of whom have approximately 20 assigned accounts. Of those 20 assigned accounts, approximately 5 are existing customer relationships. And of those 20 accounts, approximately fewer than 10 — so seven, eight, nine — are what we call focus accounts. And again, that goes back to what I said earlier — that''s where marketing is investing additional dollars. I have 2 territories waiting for the right candidate that are already defined. There''s a little bit of opportunity to do some horse trading between them. But all you would need to know is essentially there are 40-45 accounts that are unassigned. Of those, approximately 20% are customer relationships. So just like the other sellers, this person would be inheriting existing customer relationships, and then inheriting unassigned accounts of which, again, fewer than 10 — let''s say 6 — are going to be considered focus accounts. So they''ll be receiving disproportionate investment from marketing, from our partnerships team, from our executive team. We have what''s called the GAB — it''s an advisory board, they''re basically paid to get us into executive conversations. So all of that is part of that focus group. I''m looking for someone — two people, really — to come in and own a territory of 20-ish accounts, 5 customer accounts, and fewer than 10 focus accounts, and be maniacally focused on building that business. That''s the short answer. Now if you want to get into what those accounts are —
ERICA: I don''t need to know.
CHRIS: Well, I think it''s worth getting into at some point, so you have an expectation — because I am looking for someone to be motivated by the opportunity. There are some big accounts. There''s PNC Bank, there''s TD Bank, there''s Vanguard. These are, in any other organization, the absolute crème de la crème. And I need to know that you are gonna be maniacally focused on figuring out how to grow those relationships.
ERICA: So if I understand correctly, the individual that you referenced as the account manager — you describe them as making sure the accounts are expandable — they''re really responsible for making sure there''s value and a good scenario at the account, so that the other individual can go out and do what they need to do knowing that someone else is — okay, that''s kind of what it is.
CHRIS: And I''ll elaborate, because part of the reason I''m happy to talk about this more is that I''m new, so I''m learning some of this. Every organization deals with existing customer ownership and expansion a little bit differently. But I''ll make it more concrete. We work with First Citizens Bank, which is in your backyard — I think you''re familiar with them. That relationship was initiated first via Silicon Valley Bank, which First Citizens then bought. So we have a really solid, healthy, multi-year relationship with Silicon Valley Bank, which is now essentially the commercial arm of First Citizens. And if you were to talk to our account management team, they would say it''s great — greens across the board. But if we look at it at a macro level, we''d say we''re really siloed. We only really work with the analytics team. And First Citizens is going through so many other changes that go beyond their commercial business, and we''re not a part of that. So in my mind, that is a yellow account. It needs a really strong sales leader to understand the macro landscape, to work with the account manager so that we continue to have a strong champion within that one part of the business, but also — in a respectful way — to say, this isn''t good enough. We have to do more. And to get really specific — we learned that the adoption of the platform is lower than it should be, even within Silicon Valley. So my point of view is, we haven''t earned the right to expand the relationship until we solve that. Yes, it''s great, and yes, there''s been great partnership, and I''m thrilled that the renewal went through and CSAT is high — all of that is great — but let''s also recognize that there''s an opportunity to expand the relationship significantly, and there''s a small window to do it because they''re going through all these internal changes, moving from one platform to another with this consolidation strategy. To me, that''s the fun part of the job. You have a partner, you have a very good team. They will do things like, if for whatever reason a page isn''t loading on our site, they''re fixing that. Which is important. But it''s not good enough to just get the renewal. You really have to recognize — it''s my responsibility to have a plan to drive growth from this relationship. And I like using existing renewals as a compelling event to do that. That''s where the partnership with the AM is tightest. If we have an existing — I don''t want to get into the weeds too much — but if we renew flat, technically the account manager owns that, but I still feel like you need to be in that conversation. You earn the right to expand it by being part of the relationship, even if they''re not giving us more dollars. That''s where it comes into play.
ERICA: Gotcha. So your $7 million is going to come from that expansion, as well as any net new logos that are up for the taking. Got it.
CHRIS: Correct. And again, if you think about how the accounts have been assigned, about 80% of every rep''s territory is net new. I don''t expect them to close all 80% in one year, but you should have a plan. There should be a strategy for where you''re gonna break in, how you''re gonna do that — and then whatever you need from me or the rest of the business to be successful, you need to know what that is and be advocating for it.
ERICA: Sure. Um — okay, so that is helpful. Let me just look — we have four minutes left. I want to, um, get into a little bit more rapid fire. I really apologize. Timelines — what kind of timeline are you looking at? And I understand it''s important to get the right candidate in the role, as well as probably something that gives you enough runway to make an impact on the $7 million, given that you have 2 openings. Help me understand if you''re prioritizing those — like how do those fall and where you''re thinking in that way?
CHRIS: So now that we''ve closed the $250,000 deal I referenced earlier, my absolute top priority is filling these 2 roles. I want to find the right person — someone who will have a positive impact on the team this year, because I don''t, in my mind, see how we get from $7 million to $10.5 million right now. So I need someone to add to that. And I want someone who is gonna be a positive contributor to this team going forward. I wouldn''t have taken this job if I didn''t feel like there was a lot of opportunity. At Medallia, where I worked previously, BFSI was the largest vertical in the company by a considerable margin — and that''s just not the case here. So I know it can be done. Yeah, so I''m looking for someone who''s motivated to do all of that. I don''t want to hire too quickly — I really don''t want to make that mistake. So I''m kind of talking out of both sides of my mouth. Being tactical though, I will say that we are getting together as a team in late April, and I would love to have this role filled by then, because having everyone together and presenting their plan for the second half of the year is an important part of how I like to run the team. We''re already behind on filling these two roles for a variety of reasons. But I think April is an important month for us because we''re already making some account transitions, so the team fully recognizes that''s happening, that we have new people coming in. That expectation setting is all happening in a really positive way — to come into a team that''s in a good place, and yet still put everyone on notice that we''re gonna pick up the pace, is really exciting. And I would love to have someone on board by the end of the month to do that.
ERICA: Gotcha. Um, I know we have a minute left, and I just think it might be important to give you an idea of how I would approach the territory in general. I do a lot of collaboration today, and we do have someone that kind of maintains the account. It really — they''re not strong. Our delivery mechanism is frankly just not strong. So it leans a lot on the client executive. I do a lot of strategic account planning where we are mapping — I like to understand the business first. What are the business goals? What are the drivers? I want to understand what their fiscal year looks like, so what are their milestones? I kind of want to prioritize things based on entry points — what that business needs to get done, what relationships we have, who are the stakeholders — and then map out the sequence of things. Can we do this all at one time? Where do I — I mean, some of those should be basics for anyone entering this role, but I thought it might be helpful to just talk a little bit about that. And then have a really strong partnership with the individual, where it makes sense, that is managing the day-to-day — and where can I complement, where can I supplement, to make it a strong bridge to buy. You know, it''s April — by September, we''re talking to the next line of business because we have proved these things, we evangelized it, and we''re moving in that direction. So that''s very general and broad, but I thought it might be helpful to give you an idea.
CHRIS: Um, travel — can I just comment on that quickly? — and I just let them know I''ll be a couple minutes late. I think that''s exactly right, and that''s how I like to think of it as well. Again, particularly because the accounts that we''re talking about are all very large and complex. Just to use First Citizens as an example — which is by no means the largest account we work with — you have the commercial bank, you have what they call FCB Direct, which is the legacy CIT business, you have their traditional omni-channel retail network. That retail network has changed because they acquired branches from SVEMO. You''ve got a lot of people that have different working styles and expectations, a very different regulatory landscape, new competitive threats. So unpacking all of that — I''m a little old school, but just literally getting stuff down on paper and saying, this is what I see, let''s talk about it, let''s talk to other people on the team. You know, what do you know about this account, or what do you know about this person? Oh, they used to work at this other bank. Just getting it down on paper and then continuously iterating on it — that''s what''s really important. Not to look backwards, but just for context — the person on the team that''s no longer here — one of the real friction points we had was, I''d say, "show me your account plan," and it just wouldn''t change. And I would say, you''re either not doing your job, or you''re not doing the 10% that I need to see from you to know that you''re doing your job. That''s how we get better together.
ERICA: I love that. And since it''s a large Gartner client — one of my peers in our business — oh, I probably shouldn''t have told you that. Anyways. We do a lot of strategic planning. We do a lot of strategic planning around strategizing between him and I around that particular account. But great relationships there. So really good to know. Um, I''m gonna be cognizant of the time. Chris, I''d really like to progress to the next step. I''m curious — in our 90% objective — I''m curious how you feel about me as a candidate. Would you hire me if all the things were in place? The logistics, compensation, all of the other stuff, and you were the sole decision maker?
CHRIS: Well, to clarify, I''m not the sole decision maker. I have a disproportionate voice in the process, but Roxana explained — we run a very thorough process. It has a number of steps. It involves meeting with one of our sales engineers, doing a presentation, ultimately meeting with our CRO, and then as a final step, everyone in the company meets with our CEO. So we''re actually still pretty early in that process. And I mentioned wanting to have someone by the end of the month — I want those things to happen really fast. So number one, I want to understand your ability to move that quickly, if you think this is a good fit. And I will say the thing that I think will come up in some of those other conversations is your ability to communicate a real point of view on building pipeline with net new accounts. Because I think the experiences you''ve had at Gartner and elsewhere — I know that you can navigate a complex organization. But getting in cold is a challenge, right? And probably more so now than ever before. So that''s the thing that I think people will want to hear about. What have you done successfully, and what would you plan to do moving forward? If you were given an account list today that had 16 or so net new logos on it — I''ll use PNC Bank or TD Bank as examples — what is it that you would do to make sure that we are successful within those accounts in the next 18 months? It doesn''t happen overnight, so it needs continuous focus and execution. And so I think that''s the thing that I would encourage you to think about and be prepared to discuss in future conversations. Is that fair?
ERICA: Absolutely. That completely makes sense.
CHRIS: Okay. I do have to drop, but I''m really glad we set up more time. I hope I answered most of your questions.
ERICA: You did, you did. It was very helpful. Very, very helpful.
CHRIS: Alright, thank you so much.
ERICA: All righty. Thanks, Chris. Bye bye.
CHRIS: Bye bye. Bye bye.', '2026-04-02 16:04:05.670593+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (48, 19, 'assistant', 'ZONE: Green — with urgency. Chris has signaled strong positive intent, flagged Erica as someone he wants to move quickly, and given her a direct roadmap for what the next steps look like. This deal is moving, but there''s a specific gap Chris named at the end that Erica needs to close before the next conversation.

---

## CALL SUMMARY

This was a second conversation between Erica and Chris, a sales leader at Quantum hiring for 2 open AE roles on his BFSI vertical team. The call covered:

- **Chris''s leadership style** — high autonomy, high accountability. He fired someone who couldn''t operate in that model.
- **Team context** — 3 sellers in seat, 4 SEs, 5 AMs. 13 of 15 are male. Came through a disruptive verticalization and leadership churn year. Dan is the standout — just closed $250K.
- **The role** — Hunter-leaning. ~20 accounts per rep, ~5 existing customers, ~6-8 focus accounts. Territory already defined, with some flexibility.
- **The target** — $7M new ARR. Chris believes $10.5-11.5M is possible but doesn''t have the confidence yet. Needs these 2 hires to get there.
- **Timeline** — End of April. Team offsite in late April. He wants a hire before then. He said it explicitly.
- **Process** — SE interview, presentation, CRO, CEO. Still early. Roxana is involved.
- **Chris''s closing signal** — He told Erica exactly what the objection will be in the next rounds: her ability to demonstrate cold pipeline development on net new logos. He gave her the assignment unprompted.

---

## POV ON HOW ERICA DID

**The good:**

Erica ran a structured interview. She opened with a clear objective — the "90%" framing — and set an agenda. That''s professional and confident. She asked about team dynamics, growth targets, role specifics, and the hiring timeline. Those are the right questions. She also closed by asking directly: "Would you hire me if all the things were in place?" That took guts and it was the right move.

Her description of how she approaches territory — strategic account planning, understanding fiscal year milestones, mapping entry points, sequencing relationships — landed well. Chris validated it directly. She showed she can navigate complex accounts.

**The gaps:**

**She ran out of time on herself.** The ratio of this conversation was probably 80/20 Chris talking. She gathered intel, but she didn''t sell. The last 60 seconds — where she described her approach to territory — was the most important thing she said all call, and it was rushed and incomplete because they were out of time.

**She didn''t close the loop on Chris''s gap.** When Chris said "the thing people will want to hear about is your ability to build cold pipeline on net new accounts" — Erica said "absolutely, that completely makes sense." That was a missed moment. She should have given him at least one specific example right there, even in 30 seconds. Instead she deferred entirely to a future conversation. Chris handed her the exact objection and she didn''t address it at all.

**She disclosed something she shouldn''t have.** The Gartner client reference — she caught herself mid-sentence and said "I probably shouldn''t have told you that." That''s a credibility nick. Small, but real. In a process that goes to a CRO and a CEO, details like that get noticed.

**She didn''t nail down next steps.** The call ended with "I want to move quickly if you''re a good fit" from Chris, but no specific date, no confirmed next step, no "when can we get the SE conversation scheduled?" The door is open but nothing is on the calendar.

---

## WHAT ERICA SHOULD DO NOW

**The play here is the Champion Activation Play + Scheduled Next Step Play, running simultaneously.**

Chris is not her champion — he''s the hiring manager and has a disproportionate voice, but the process runs through Roxana and ultimately through the CRO and CEO. Erica needs to treat Chris like a champion who can move the internal process for her, and she needs to give him something to work with.

Here''s the immediate move:

**Step 1 — Send a follow-up email within 24 hours.** Not a', '2026-04-02 16:04:38.045323+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (49, 19, 'user', 'can you provide the rest of the recommendation, you cut off?', '2026-04-02 16:06:35.319091+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO session_messages (id, session_id, role, content, created_at) VALUES (50, 19, 'assistant', 'ZONE: Green — with urgency. Picking up where I left off.

---

## WHAT ERICA SHOULD DO NOW

**The play here is Champion Activation Play + Scheduled Next Step Play, running simultaneously.**

Chris is not her champion — he''s the hiring manager with a disproportionate voice, but the process runs through Roxana and ultimately the CRO and CEO. Erica needs to treat Chris like a champion who can accelerate the internal process, and she needs to give him something to work with.

---

**Step 1 — Send a follow-up email within 24 hours.**

Not a thank you note. A strategic follow-up that does three things:

1. Confirms she heard his feedback and addresses the cold pipeline gap directly
2. Signals she''s ready to move at his pace
3. Makes it easy for him to take the next internal step

Here''s the email:

---

*Chris —*

*Really appreciated the conversation this morning. A few things stuck with me that I want to address directly.*

*You were candid about what the next conversations will focus on — specifically my ability to build cold pipeline on net new logos. Fair. Here''s how I think about it:*

*When I''m handed an account like PNC or TD Bank with no existing relationship, the first thing I do is resist the urge to go wide. I go deep on one entry point — usually the intersection of a known business priority and a relationship I can activate, either through a mutual connection, a referral from within the existing book, or a relevant insight I can bring to the table that earns the first conversation. I don''t cold call for the sake of activity. I build a thesis on the account first — what''s their fiscal year pressure, what''s their competitive exposure, who''s likely championing internal change — and I use that to create a reason to engage that''s relevant to them, not just to me. That''s the approach I''d bring to the 16 net new logos in this territory.*

*On timeline — I''m aligned with your April goal. I''m ready to move through the process quickly. Whatever the next step is — the SE conversation, the presentation — I''m available and prepared to move this week or next.*

*What''s the best way to get that scheduled?*

*Erica*

---

**Step 2 — Prepare the net new pipeline narrative before the SE conversation.**

Chris told her exactly what the objection is going to be. Every interviewer from the SE to the CRO to the CEO is going to probe the same thing: can she develop cold accounts? She needs a tight, specific, repeatable story that answers:

- One specific example of breaking into a net new enterprise account cold
- What the entry point was
- How she built the relationship over time
- What it resulted in

Not a general answer. A specific story with a named account, a timeline, and an outcome. If she doesn''t have a clean version of this story ready, that''s the number one thing to work on before the next conversation.

---

**Step 3 — Get clarity on the process from Roxana.**

Chris mentioned Roxana runs the process. Erica should reach out to Roxana directly — not to go around Chris, but to make sure she understands exactly what the remaining steps are, who she''ll be meeting with, and what each conversation is designed to evaluate. The more she knows about the process, the better she can prepare for each stage.

A simple message:

*Hi Roxana — I had a great conversation with Chris this morning and I''m excited about moving forward. He mentioned the process includes an SE conversation, a presentation, and meetings with the CRO and CEO. Can you help me understand the sequencing and timing so I can make sure I''m prepared and available to move quickly?*

---

## THE ONE NEXT ACTION

**Erica sends the follow-up email to Chris today — before end of business — addressing the cold pipeline gap directly and asking for the next step to be scheduled.**

Everything else follows from that. If she waits, the momentum Chris signaled at the end of that call starts to cool. He told her he wants someone by end of April. That window is now. The email is the move.

---

Want me to build out the full net new pipeline narrative framework she can use to prep for the next round of interviews? I can give her a structured story format she can adapt to her own experience.', '2026-04-02 16:06:59.974602+00') ON CONFLICT (id) DO NOTHING;
SELECT setval('session_messages_id_seq', (SELECT MAX(id) FROM session_messages));