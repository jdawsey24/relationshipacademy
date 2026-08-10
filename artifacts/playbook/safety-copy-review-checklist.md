# Playbook safety copy — clinical review checklist

**GENERATED — do not hand-edit.** Re-run `scripts/generateSafetyCopyChecklist.ts` after any content change.
Generated from the live corpus: 31 Playbooks.

Reviewer: the owner (LMFT). The `id` on each item is the authoritative anchor — mark **Decision:**
inline, then edit `content/playbook/` by id and re-run `validatePlaybookContent` + `npm test`.

**92 items.** Ordered by review leverage, then crisis-first.

---

## §1 — Shared copy (review once, applies everywhere)

Highest-value decisions in this file. Each block below is written in ONE place and reused, so a
single sign-off covers every Playbook that pulls it in.

### 1. `CRISIS_ESCALATION` (shared constant)  ·  P1

- [x] **Signed off** — Janelle Dawsey, LMFT, 2026-08-05
- *Type:* shared crisis-escalation block
- *Source:* `content/playbook/shared/safety-not-safe.ts`
- *Interpolated into 6 signpost(s)/entries across the corpus* — reviewing this once covers all of them.

> If you're thinking about suicide, harming yourself, or you don't feel able to stay safe, please seek immediate support now. Contact your local crisis service or emergency services, or go to the nearest emergency department. In the United States, you can call or text 988. If you're elsewhere, use the crisis service for your country. If you can, tell someone you trust and stay with them while you connect with support.

**Decision:** Approved as written. Wording unchanged. Presentation changed instead: the block is no longer collapsed behind a link, it renders as a standing help box on the play screen.

### 2. `lit-shared-if-you-dont-feel-safe`  ·  P1

- [x] **Signed off** — Janelle Dawsey, LMFT, 2026-08-05
- *Type:* safety literature (scope=cluster)
- *Used in 3 Playbooks:* `how-to-stop-having-the-same-fight`, `from-roommates-back-to-partners`, `money-work-and-us`

> **If you don't feel safe**
>
> We're putting this first because it matters more than anything else here.
> People in difficult relationships often say some version of: I don't feel emotionally safe. I don't feel safe enough to be honest. I'm careful about how I say things.
> Sometimes that means two people who handle conflict badly and both feel bruised afterwards. Sometimes it means something else.
> **None of the following is a communication problem**
> Being frightened of how they'll react.
> Changing what you say to manage their temper or their mood.
> Being made to feel small, stupid, or unstable on purpose.
> Being blamed for things that were done to you.
> Having your access to money, people, or leaving controlled.
> Being pressured, coerced, or forced into sexual contact.
> Being threatened with harm — to you, to someone you love, or to a pet.
> Physical aggression: being hit or pushed, restrained, blocked from leaving, choked or strangled, or having property broken to frighten you.
> Any other unwanted physical aggression.
> Every tool in this Playbook asks you to raise difficult things and stay in the conversation. If any of the above is happening, that instruction can be the wrong one, and following it could make things worse. This isn't something to solve together through better communication.
> **If you're in immediate danger**
> Contact your local emergency services or get to a place you feel safe. In the United States, that's 911; elsewhere, use your country's emergency number.
> **Where to find the right support**
> A domestic-abuse service, or a professional trained specifically in relationship abuse, can help you understand what's happening and think it through — privately, at your own pace. A general couples counsellor isn't the right place for this, and joint counselling can be unsafe when one person is frightened of the other. You don't have to be certain, or have a word for it, before reaching out.
> They can also help you make a safety plan that fits your circumstances — what you'd do, where you'd go, who you'd tell — whether or not you're thinking about any change right now.
> In the United States, the National Domestic Violence Hotline is free, confidential, and open 24 hours: call 1-800-799-7233, or text START to 88788. If you're elsewhere, look for your country's domestic-abuse helpline.
> One practical note: phone and internet activity can sometimes be seen by someone else. If that's a worry, you might reach out from a device they don't have access to, or from a public computer.
> If none of that fits, and it's genuinely two people who find this hard — the rest of this is for you.

**Decision:** Approved with one addition: the National Domestic Violence Hotline is now named directly (1-800-799-7233, text START to 88788) alongside the existing 'find a domestic-abuse service' guidance, plus a non-US fallback. Deliberately NOT monetised — no affiliate or referral arrangement sits between someone in danger and help.

### 3. `rec-shared-not-safe`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Used in 3 Playbooks:* `how-to-stop-having-the-same-fight`, `from-roommates-back-to-partners`, `money-work-and-us`

> **I don't feel safe enough to be honest with them.**
>
> I don't feel safe enough to be honest with them.
> Please read 'If you don't feel safe' before anything else here. Every tool in this Playbook asks you to raise hard things and stay in the conversation, and that's the wrong advice if you're frightened of how they'll react. You don't have to be sure it's serious to talk to someone about it.

**Decision:** 

---

## §2 — Per-Playbook items

## P1 — Crisis / mental-health escalation

### 4. `lit-c11-checked-out`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* can-we-fix-this

> **When you've already gone quiet**
>
> “I'm emotionally checked out.” “I don't recognise us anymore.” “I don't know if I'm happy anymore.”
> **Two readings, and it matters which**
> You've decided without saying so. Sometimes checking out is the decision, reached quietly and not yet said out loud.
> You've protected yourself from something painful that's still going on. That can be undone, and it isn't a verdict.
> The question that tells them apart is whether it aches. People who are genuinely finished don't feel flat about it — they feel free. If there's an ache, something is still running.
> If the flatness has spread past the relationship — if most things feel this way, or you've stopped expecting anything to get better anywhere — that's worth mentioning to a GP or a therapist. It's a separate thing from this decision, and it makes the decision much harder to make well.

**Decision:** 

### 5. `lit-c15-empty`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* loved-not-just-needed

> **Nothing left to give**
>
> “I'm emotionally drained.” “I don't have anything left to give.” “I don't even know what I need anymore.” “I feel numb.”
> **This is capacity, not character**
> Not: I've become a cold person. Almost certainly untrue, and “I miss giving love freely” is the sign.
> But: the energy this takes has been spent, and it hasn't been topped up, for a long time.
> “I don't even know what I need anymore” is the clearest sign of it. Knowing what you need takes having enough left over to ask the question, and you haven't had that in a while.
> Which means the first useful thing may have nothing to do with the relationship. It may be getting some of yourself back, from wherever you can.
> If the numbness has spread beyond this relationship — if most things feel flat, or you've stopped expecting anything to get better anywhere — that's worth mentioning to a GP or a therapist. Alongside this, not instead of it.

**Decision:** 

### 6. `lit-c16-faq-recovery`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* can-i-trust-you-again

> **What if it's addiction?**
>
> Then this Playbook is the wrong tool, and we'd rather say so than half-help.
> “I don't know where support ends and enabling begins” is a real and specific question, and there's a whole field of knowledge behind it that a relationship Playbook doesn't have. So does “I'm exhausted from worrying”, which is a known experience with known support.
> **Worth looking into**
> Al-Anon or a similar family group — specifically for people alongside someone else's addiction.
> A therapist who works with families affected by addiction, not a couples therapist.
> Your GP, if the worrying is affecting your sleep or your health.
> Some of what's here will still apply — the checking, the images, the question of whether anything has changed. But the support-versus-enabling question needs people who know that territory, and anything less would let you down.

**Decision:** 

### 7. `lit-c16-images`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* can-i-trust-you-again

> **The images that won't stop**
>
> “I don't know how to stop imagining what happened.” “I compare myself to the other person.”
> Unwanted images after a betrayal are very common, and it's one of the parts people are most ashamed of, which keeps them quiet about it.
> Some of it is your mind trying to fill a gap. You have only some of the information about something that mattered a huge amount, and your mind keeps trying to finish the picture. More detail usually makes this worse, not better — which is why the questions that bring no peace often make the images sharper.
> If the images are constant, or you're not sleeping, or they come as though it's happening now — that's worth taking to a therapist rather than handling alone. It's a known response to this kind of wound, and there is specific help for it.

**Decision:** 

### 8. `lit-c25-the-move`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* what-nobody-taught-you-about-healthy-relationships

> **“Why do I keep ending up here?”**
>
> “I want someone to explain why I keep ending up here.” It's a fair thing to ask, and we're going to turn it down — which needs a reason.
> **Why we won't give you the explanation**
> Confident explanations exist — about your childhood, how you attach, what you're drawn to. Some may even be true for you.
> But none of them are solid enough to hand someone as fact. And a wrong explanation, held with confidence, is worse than no explanation. It reshapes how you see yourself around something that might not be true.
> What you can have is smaller and more reliable: the recurring move. Not why you do it — what it is, and when it shows up.
> That's less satisfying than a reason. But it's the part you can actually act on — and “why” turns out not to be needed.
> If you want the why, that's a fair thing to want, and a therapist is the right place for it — with someone who knows your history and can be wrong out loud with you, rather than a text that has to guess.

**Decision:** 

### 9. `lit-c8-stopped-reaching`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* from-roommates-back-to-partners

> **When you've stopped reaching**
>
> “I go through the motions.” “I've stopped expecting things to get better.” “I feel like I've checked out.”
> This is further along the same road, and it usually arrives quietly.
> Nobody starts here. You get here by reaching and not being met, enough times that reaching starts to feel humiliating. So you stop — and stopping brings relief, which is why it holds.
> It's a sensible way to adjust to a situation that kept costing you. But in the end, it becomes the thing keeping the situation in place.
> **The part worth knowing**
> Checked out isn't the same as not caring. People who've genuinely stopped caring don't feel flat about it — they feel free.
> Flat usually means still wanting it and having given up on getting it. Which is painful, and also means something is still there.
> If some of this has spread past the relationship — if you're flat about most things, or you feel disconnected from yourself rather than from them — that's worth mentioning to a GP or a therapist. Not instead of this. Alongside it.

**Decision:** 

### 10. `lit-c9-rule-this-out-first`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* the-intimacy-reset

> **Before you work on this — rule out the physical causes**
>
> We're putting this first because it's the most common thing people spend months not knowing.
> A lot of what shows up as “I've lost interest” or “they don't want me anymore” has a physical cause that has nothing to do with the relationship at all.
> **Common, treatable, and frequently missed**
> Antidepressants. Lower desire is one of the most common side effects, and a lot of people are never told. Often it can be adjusted.
> Perimenopause and menopause. Changes in desire, arousal, and comfort are normal here, and there are options.
> The first year or two after a baby. Very common, and not only for the person who gave birth.
> Thyroid problems, diabetes, and other hormonal conditions.
> Long-term pain or illness — including pain during sex, which should always be checked.
> Other medicines: hormonal birth control, blood pressure medicine, and others.
> Being worn out. Not medical, but really worth naming before anything else.
> If any of these might apply — to either of you — it's worth seeing a GP or another healthcare professional. Do that alongside looking at the relationship, not instead of it. Changes in desire can come from your body, a medication, hormones, feelings, the relationship, or a mix of these. Finding a physical cause doesn't mean the relationship side doesn't matter — or the other way round — and neither one has to be settled before you look at the other.
> This isn't a way of saying it's probably medical and you can relax. Sometimes it is, sometimes it isn't, and often it's some of both. It's just the cheapest thing to check first.

**Decision:** 

### 11. `lit-grievediff-what-this-is`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-grieving-differently

> **What this is for, and what it isn't**
>
> This is about what has happened between the two of you. Not about the loss itself. That needs people who work with it, and we'd rather say so plainly than give you something thinner.
> **Two different weights**
> The grief. That's yours, and it isn't something a relationship guide should be handling. Fertility counsellors and pregnancy loss services are there for exactly this, and they're a lot better at it than anything written for people in general.
> What it has done to the two of you. The different ways you're each responding. The distance that's opened. The questions from other people. That part has very little written for it, and it's what's here.
> Nothing here suggests another option, brings up what else you could do, or has a view about what happens next. Those are the most common things people say, and they're not this add-on's business.

**Decision:** 

### 12. `lit-self-editing`  ·  P1

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* finding-love-that-feels-mutual

> **Editing yourself to stay likable**
>
> When being chosen feels like everything, it can be tempting to hide the parts of you that might cost you the connection.
> You go along. You don't say the real thing. You become easy to like — and a little hard to actually know.
> **Liked vs. known**
> Being liked for an edited version isn't the same as being chosen for you.
> If they pick the edited you, you never find out whether they'd have picked the real one.
> **What this can look like**
> Agreeing when you don't agree
> Hiding a preference, an opinion, or a need
> Waiting to see what they want before you know what you want
> This isn't “overshare on date one.” It's noticing where you erase yourself to stay safe — and letting a little more of the real you show.

**Decision:** 

### 13. `rec-c16-addiction`  ·  P1

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* can-i-trust-you-again

> **I don't know where support ends and enabling begins.**
>
> I don't know where support ends and enabling begins.
> This Playbook is the wrong tool for that, and we'd rather say so than half-help. Support-versus-enabling is a real and specific question, and there's a whole field of knowledge behind it. Depending on what fits, that might be a therapist who knows addiction, a family-support service, or a peer-support group such as Al-Anon. If the worry is affecting your health, a GP can help. And if there's ever fear, coercion, or violence in it, a domestic-abuse service comes first — or emergency services, if you're in immediate danger. Couples work can be part of the picture later, but it isn't the place to start when safety or coercion is involved. Some of what's here will still apply, but that question needs people who know the territory.

**Decision:** 

### 14. `rec-c9-rule-out-first`  ·  P1

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* the-intimacy-reset

> **Something's changed and I don't know why.**
>
> Something's changed and I don't know why.
> Changes in desire can come from many places: your body, a medication, hormones, feelings, the relationship, or a mix of these. Antidepressants and other medicines, pregnancy or the months after a baby, perimenopause or menopause, thyroid conditions, pain, stress, and relationship trouble can all play a part. A GP or the right healthcare professional can help rule out or treat medical causes while you look at the relationship side too. Finding a physical cause doesn't mean the relationship side doesn't matter — and the other way round too.

**Decision:** 

### 15. `rec-grievediff-the-grief`  ·  P1

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* addon-grieving-differently

> **I don't know how to grieve what never happened.**
>
> I don't know how to grieve what never happened.
> That one, and “my body has failed me”, and the way an announcement can take a whole afternoon out of you — those are the heaviest parts of this. They need more than anything written for people in general can offer. One thing worth saying plainly, though: pregnancy or fertility loss is not evidence that you have failed. Fertility counsellors and pregnancy loss services are there for exactly this, and they can hold it far better than we could. We'd rather point you to them than half-help in the place where half-helping matters most. What's here is only the part about the two of you.

**Decision:** 

### 16. `severe-self-worth`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* finding-love-that-feels-mutual · play `what-it-actually-means`

> **If this is bigger than a dating moment**
>
> This Play is for the sting of one dating moment. If what you feel is a belief about yourself that follows you everywhere — or something that's been heavy a long time — that's real. It deserves more than a dating tool. Talking with a mental health professional can really help.

**Decision:** 

### 17. `signpost-c11-flatness`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* can-we-fix-this · play `which-way-does-it-lean`
- *Embeds the shared crisis block* (see §1)

> **If it isn't only this**
>
> If the flatness has spread past the relationship — if most things feel this way, or you've stopped expecting anything to get better anywhere — it can help to talk it through with a GP or another professional. It's separate from this decision, and it can make the decision harder to make well.
> «CRISIS_ESCALATION — reviewed once in §1»

**Decision:** 

### 18. `signpost-c12-not-coping`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* letting-go-without-losing-what-it-meant · play `the-shape-of-a-week`
- *Embeds the shared crisis block* (see §1)

> **If it's more than grief**
>
> Losing a relationship this way can tip into something that needs more than time. If most things feel like this — not just the relationship — or if it's affecting your sleep, your eating, or your ability to get through a day, or it's been like this for a long stretch without lifting, it may help to talk to a GP or another healthcare professional. That isn't a comment on how you're grieving. It's a different thing that can show up alongside it, and it can respond to different kinds of help.
> «CRISIS_ESCALATION — reviewed once in §1»

**Decision:** 

### 19. `signpost-c15-numbness`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* loved-not-just-needed · play `what-i-stopped`
- *Embeds the shared crisis block* (see §1)

> **If the flatness has spread**
>
> If it isn't only this relationship — if most things feel flat, or you've stopped expecting anything to get better anywhere — it can help to talk to a GP or another professional, alongside this rather than instead of it. And if you've had thoughts of suicide, or of hurting yourself, please treat that as urgent.
> «CRISIS_ESCALATION — reviewed once in §1»

**Decision:** 

### 20. `signpost-c16-intrusive`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* can-i-trust-you-again · play `the-checking`

> **If the images are constant**
>
> If you're not sleeping, or the images come as though it's happening now, or they're there most of the day — it can help to take that to a therapist rather than managing it alone. Things like this can happen after a painful betrayal, and there is specific help for them. It doesn't mean anything has gone wrong with you.

**Decision:** 

### 21. `signpost-c16-pressure`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* can-i-trust-you-again · play `which-question-am-i-asking`

> **If you're frightened, or being pressured about what you decide**
>
> If any part of this involves being frightened of them, or being pressured about what you choose, or being made responsible for what happened — that's a different situation and this Playbook doesn't cover it. Please talk to someone: a domestic abuse service, a GP, or a therapist. You don't have to be certain it's serious to ask.

**Decision:** 

### 22. `signpost-c23-alone`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* how-to-make-a-relationship-decision-you-can-trust · play `telling-one-person`

> **If there's no one**
>
> Some people work through this and find there isn't anyone — the relationship took the friendships with it, or there was never much of a network. That's common, and it isn't a failure of yours. A therapist can be a good first person to tell, exactly because there's no history to manage and nothing gets passed on. So can a mental-health support line, or a bereavement line if the loss is what's heaviest — whichever is easier to start with.

**Decision:** 

### 23. `signpost-c25-the-why`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* what-nobody-taught-you-about-healthy-relationships · play `the-recurring-move`

> **If you want the why**
>
> Wanting to understand where it comes from is fair, and a therapist can be a good place to explore it — someone who knows your history, can be wrong out loud with you, and can update it as you go. That's a different thing from a text that has to guess. And it can be worth having if the question matters to you.

**Decision:** 

### 24. `signpost-c26-harm`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* the-cycle-breakers-playbook · play `the-specific-thing`

> **If what you inherited was harmful rather than unhelpful**
>
> There's a difference between a habit you'd rather not carry forward and something that truly harmed you. If it's the second, that's a heavier thing, and it's worth having someone alongside you for it — a therapist, or a service that works with people who grew up in it. A Playbook is a fine place to work on a habit, and the wrong place to work on that.

**Decision:** 

### 25. `signpost-c3-depleted`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* how-to-let-someone-in · play `when-closeness-costs`

> **If everything costs this much**
>
> If it isn't only closeness — if most things are costing more than you've got right now — that's worth talking to someone about. A GP or a therapist. Not because of anything to do with dating. Because running that low in every part of life is worth looking at on its own.

**Decision:** 

### 26. `signpost-c5-cant-tell-anything`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* trust-yourself-to-choose-better · play `wise-or-scared`

> **If this is bigger than dating**
>
> If you don't trust your judgement about anything — work, friends, what you're seeing generally — or if the sense of not being able to tell what's real has spread beyond relationships, it can help to take that to someone. A GP or another professional. And if it's tipping further than that — if you're feeling unsafe, unable to get through an ordinary day, or genuinely unable to tell what's real — please treat that as a reason to reach out sooner rather than later: a GP, an urgent-care or crisis service, or someone you trust. It isn't a dating problem at that point.

**Decision:** 

### 27. `signpost-c6-consumed`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* the-relationship-overthinkers-playbook · play `what-this-is-costing`

> **If it's most of your life, not most of your head**
>
> If this has been eating your sleep, your work, or your other relationships for a while, that's worth talking to someone about. A GP or a therapist. Not because wanting reassurance is a problem — because running at this level for a long time takes a toll that's worth looking at on its own.

**Decision:** 

### 28. `signpost-c6-worth-contingent`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* the-relationship-overthinkers-playbook · play `when-it-doesnt-land`
- *Embeds the shared crisis block* (see §1)

> **If it isn't only about them**
>
> Some of what people write here is less about the relationship and more about whether they're worth anything at all — where being wanted is the only thing that settles it. If that's closer to it for you, it can help to take it to someone who can stay with it — a therapist, a GP, or another professional. It's a bigger question than a dating tool can hold.
> «CRISIS_ESCALATION — reviewed once in §1»

**Decision:** 

### 29. `signpost-c7-not-safe`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* how-to-stop-having-the-same-fight · play `raise-it-anyway`

> **If raising things isn't safe**
>
> If you decide whether to speak based on how angry they'll get, or you've learned to watch your words around their mood, this tool is the wrong one — and following it could make things worse. Please read 'If you don't feel safe', and talk to someone: a domestic abuse service, a GP, or a therapist. You don't have to be sure to ask.

**Decision:** 

### 30. `signpost-c8-self-disconnection`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* from-roommates-back-to-partners · play `have-i-stopped-reaching`
- *Embeds the shared crisis block* (see §1)

> **If it isn't only about them**
>
> Some of what people write here isn't really about the relationship — feeling disconnected from yourself, not remembering the last time anything felt exciting, not feeling like yourself anymore. If that's closer to the mark, it can help to mention it to a GP or another professional. Alongside this, not instead of it — because that part isn't a relationship problem, and a relationship won't fix it.
> «CRISIS_ESCALATION — reviewed once in §1»

**Decision:** 

### 31. `signpost-c9-pressure`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* the-intimacy-reset · play `the-difference-conversation`

> **If they've already said no**
>
> If your partner has told you they don't want to, the answer isn't a better approach. Wanting more than your partner does really does hurt, and it isn't something you can fix on your own — and if you keep trying, it turns into pressure, whatever you mean by it. A qualified sex therapist can help partners look at differences in desire without ever treating consent as negotiable. It's a reasonable thing to want help with, rather than keep working at it alone. Where there's fear, coercion, or retaliation, joint work isn't the right setting — individual support comes first.

**Decision:** 

### 32. `signpost-generalised-hopelessness`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* dating-without-losing-hope · play `them-or-the-pattern`
- *Embeds the shared crisis block* (see §1)

> **This sounds bigger than one person**
>
> Some of what you've written sounds bigger than one person or one app. When the feeling stops being about dating and starts being about you — whether you're worth it, whether anything will work — it can help to say it out loud to someone. A therapist, a GP, a friend who'll actually sit with it. Not because something's wrong with you — because that's heavier than a tool like this is built for.
> «CRISIS_ESCALATION — reviewed once in §1»

**Decision:** 

### 33. `signpost-grievediff-outside`  ·  P1

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* addon-grieving-differently · play `two-ways-of-grieving`

> **You may not be able to do this for each other**
>
> Two people grieving the same loss are both worn down, and sometimes the support has to come from outside. That isn't a failure of the relationship. A fertility counsellor or a pregnancy loss service can hold what neither of you may have to spare right now. For some couples, that eases the pressure rather than adding a problem.

**Decision:** 

## P2 — Safety, abuse, coercive control

### 34. `lit-c18-both-right`  ·  P2

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* money-work-and-us

> **You're probably both right**
>
> The uncomfortable thing about most money disagreements is that neither side is wrong.
> Saving harder makes sense. Spending on a life you're actually living makes sense too. There's no right answer that one of you is just missing.
> **Which changes what you're trying to do**
> Not: convince them. That's what's been happening, and it doesn't work, because they're not being unreasonable.
> But: find out what it means to them, and tell them what it means to you. Then decide something, knowing both.
> “I don't trust how they handle money” is worth looking at closely, because it can mean two very different things. Sometimes it means they're simply okay with more risk than you are. Sometimes it means something has actually gone wrong — debt you found out about late, decisions made without you.
> Those need different responses, and only the first one is a compatibility conversation.
> If money is being controlled rather than disagreed about — if you don't have access, or you have to explain everything you spend, or decisions are made and told to you — that isn't a compatibility question. Please read “If you don't feel safe”.

**Decision:** 

### 35. `lit-c22-what-youre-losing`  ·  P2

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* how-to-love-without-losing-yourself

> **What you're actually afraid of losing**
>
> “I'm afraid commitment means losing myself” is the sentence. It's also very general, and a general fear can't be checked.
> **Worth getting specific about**
> Some things really do go. Time alone, mostly. Full say over your evenings, your money, and where you live. Those losses are real, and worth grieving rather than denying.
> Some things don't go unless you hand them over. Your work, your friendships, your opinions, what you do with a free Saturday, who you are when nobody's watching.
> People mix the two up, and then defend the whole set at once. That's exhausting, and it means the things you could bend on get the same energy as the things you won't.
> Naming which is which makes the fear smaller. Not gone. Smaller and more specific, which is a different thing to carry.
> If the honest answer is that everything on your list is non-negotiable, that's worth knowing too. It may mean this isn't the moment, and that's a real finding, not a failure.

**Decision:** 

### 36. `lit-c24-wrong-choice`  ·  P2

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* is-this-going-somewhere

> **Being afraid of the wrong choice**
>
> “I'm afraid I'll choose the wrong person.” “I'm afraid of wasting more time.”
> Both are reasonable. And both, unhelpfully, push you the same way: don't decide yet.
> **What the fear hides**
> Not deciding is also a decision, and it costs time in exactly the way you're trying to avoid.
> Two years of not-quite-deciding is still two years, gone — and you'll have less to go on at the end than a clear attempt would have given you.
> There's also no version of this where you can't be wrong. Choosing has risk. So does waiting. So does leaving. The choice isn't between risk and safety — it's about which risk.
> “I keep second-guessing relationships” is worth noticing as a pattern, not a verdict on any one person. If it's happened with several, the useful question is about the deciding, not about them.

**Decision:** 

### 37. `lit-c27-if-i-stopped`  ·  P2

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* more-than-what-you-provide

> **“What if I stopped giving so much?”**
>
> It's a real question, and it's scary, because the answer might be that nobody would stay.
> Which is worth saying plainly, instead of talking around it: sometimes people do leave. Not everyone who's been taking will stay when the taking stops.
> **What that would actually tell you**
> Not that you're only worth what you provide. That's the conclusion you're afraid of, and it doesn't follow.
> That those particular people were there for what you provide. Which is information about them — and it's information you don't have right now.
> The cost of not finding out is that you keep paying, on and on, to avoid an answer. And the payment is expensive — it's most of what “I'm drained by relationships that only take” is describing.
> Nothing here says do it all at once, or with everyone. Small and specific is the only version of this you can manage — and it's also the only version that gives you information you can use.

**Decision:** 

### 38. `lit-c27-what-this-is`  ·  P2

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* more-than-what-you-provide

> **What this actually is**
>
> You give a lot. You're good at it. People take it. And somewhere in there, you started to suspect that the giving is the reason anybody stays.
> “I wonder if anyone would still want me if I stopped giving so much” is the sentence underneath the rest.
> **Two beliefs that arrive together**
> That you have to earn being wanted. Which means the giving is never a gift — it's payment, and payments have to keep coming.
> That people mostly want what you provide. Which makes every good thing they do unclear, because it might be about what you provide.
> The guard follows from both. If being known means being judged on what you're worth, keeping some of yourself back makes sense.
> Nothing here will ask you to drop the guard. That would mean opening yourself up more to the thing that hurt you. What's worth looking at is what it costs and what it can't do — and that's a different ask.

**Decision:** 

### 39. `lit-c3-fear-is-accurate`  ·  P2

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* how-to-let-someone-in

> **Some of this fear is just accurate**
>
> We want to say this early, because most things written for people like you skip it.
> Being afraid of getting hurt, after you've been hurt, is not you seeing things wrong. It's a correct reading of something that really happened.
> **None of these needs fixing**
> I'm afraid of getting hurt.
> I'm afraid I'll get hurt again.
> I want love, but I'm scared of it.
> I'm afraid to be vulnerable.
> Those are accurate. Opening up does carry risk. Wanting something you're scared of is an ordinary human thing, not something broken in you. We're not going to try to talk you out of any of it.
> **There's a different sentence that does cause trouble**
> “I'm afraid this person might hurt me” is a reasonable thing to hold while you find out.
> “I don't trust anyone” and “I always expect people to leave” are different. Those have stopped being about anyone in particular.
> Keep the fear. It's doing a job. The only thing worth looking at is where it's answering questions before they've been asked.

**Decision:** 

### 40. `lit-c3-interest-collapse`  ·  P2

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* how-to-let-someone-in

> **When wanting stops the moment it's returned**
>
> “I like people until they like me back.” “I lose interest when someone likes me.” “I like being chased more than being in a relationship.”
> This one confuses people about themselves more than any other, so it's worth naming plainly rather than explaining away.
> Wanting someone at a distance is safe. Nothing is asked of you, nothing can be lost, and the version of them you're wanting is partly one you've made up.
> The moment it's returned, all of that changes at once. It becomes real, it goes both ways, and it becomes something you could lose.
> We're not going to tell you this means you're afraid of intimacy, or anything else about why. We don't know why, and neither does anyone who says it confidently. What's useful is knowing that the drop is something you can expect, and that it arrives at a specific moment rather than because something changed about them.

**Decision:** 

### 41. `lit-c3-what-being-known-costs`  ·  P2

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* how-to-let-someone-in

> **What being known actually costs**
>
> There's a version of this advice that says be your real self and everything follows. That's not what we're going to say, because it isn't true.
> Letting someone see something real does two things at once. It gives them the chance to accept it, which is what you want. And it gives them better information for leaving, which is what you're afraid of.
> Both are real. Anyone pretending only the first one exists is selling something.
> **What changes the maths**
> Size. One true thing, said to one person, is something you can live through in a way that all of it, said to everyone, is not.
> Order. You get to watch what happens to the small thing before deciding about the next one.
> This is not a way to get accepted. It's a way to find out, in steps small enough that finding out doesn't cost everything.

**Decision:** 

### 42. `signpost-c18-financial-control`  ·  P2

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* money-work-and-us · play `the-money-conversation`

> **If money is being controlled rather than disagreed about**
>
> Sharing a budget, talking over big purchases, or agreeing how you'll handle money together is ordinary — this isn't about that. But if you're denied access to money, stopped from working, watched or punished for what you spend, have money taken without agreement, are kept in the dark about the finances, or decisions are made over you under pressure or threat — that isn't a compatibility disagreement, and this tool doesn't apply. Financial control can be a form of abuse. Please read 'If you don't feel safe', and think about talking to a domestic-abuse service. You don't have to be certain to ask.

**Decision:** 

### 43. `signpost-c3-mistreatment`  ·  P2

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* how-to-let-someone-in · play `before-you-go`

> **If something has actually happened**
>
> If what you're describing involves fear, pressure, control, contempt, threats, or harm, this isn't a pattern for you to fix with better communication. Pause this tool and talk privately with a domestic-abuse service, or another qualified professional trained in relationship abuse. They can help you understand what's happening and make a safety plan for your situation. You don't have to be sure before asking.

**Decision:** 

### 44. `signpost-c3-mistreatment-fit`  ·  P2

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* how-to-let-someone-in · play `is-this-right-for-me`

> **If something has actually happened**
>
> If part of what doesn't work is that you're being treated badly — pressure, contempt, being frightened, being controlled — that isn't a fit question, and it isn't something to fix with better communication. Fit assumes two people are both able to choose freely. If any of that fits, talk privately with a domestic-abuse service, or another qualified professional trained in relationship abuse — they can help you understand what's happening and make a safety plan for your situation. You don't have to be sure before asking.

**Decision:** 

### 45. `signpost-c5-safety-concern`  ·  P2

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* trust-yourself-to-choose-better · play `check-it-dont-bury-it`

> **If the concern is about safety**
>
> If what you noticed involves being frightened, pressured, controlled, or hurt, that isn't a concern to test over time. That's a reason to talk to someone now — a friend, a professional, or a domestic abuse service. Please don't wait to be certain about that one.

**Decision:** 

## P3 — Bereavement and grief

### 46. `lit-bereave-changes`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-losing-a-partner

> **Why does it change so much day to day?**
>
> “My grief changes from day to day.” It does, and not knowing what's coming is one of the more exhausting parts — partly because it makes planning anything hard.
> **What people expect, and what happens**
> Expected: a slow, steady fade. Bad, then less bad, then manageable.
> Actual: much less tidy. A good two weeks, then a week worse than any in the first month, often set off by something small and unrelated.
> What this means in practice: a bad day isn't proof you're going backwards, and a good two weeks isn't proof you're through it. Both readings are common, and both cause a lot of needless alarm.
> “My world changed overnight” is worth naming on its own. Sudden loss and expected loss are different experiences. People who had no warning often find the shock and the grief can feel like they overlap, moving at different speeds.

**Decision:** 

### 47. `lit-bereave-companionship`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-losing-a-partner

> **Wanting company**
>
> “I want companionship, but I don't know if my heart is ready.” “Dating again feels like I'm betraying them.” “I don't want to replace them.”
> That last sentence holds the whole problem, and it rests on an assumption worth a look.
> **Replacing and adding are different**
> Replacing assumes there's a single slot — that a new person would take the place the last one had, and so push them out.
> Some people who do this find it doesn't work like that. The new relationship has its own place, and the old one isn't emptied out. Many people find they can hold both.
> “I don't know how to love someone new while honouring my past” is the right question, and one answer people land on is a plain one: by not hiding it. When the old relationship is out in the open rather than worked around, some people find both are easier to hold — though there's no single right way to do this.
> None of this is an argument for dating. Wanting company and not wanting to date both make complete sense — and so does wanting neither.

**Decision:** 

### 48. `lit-bereave-faq-ready`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-losing-a-partner

> **How do I know if I'm ready?**
>
> There's no set point where everyone becomes ready, and the people who tell you there is are guessing. Some are ready in months, some never want to be, and neither says anything about the marriage.
> **Two questions that are more useful than readiness**
> Could I talk about them? Not hide the marriage, not work around it. If the answer is no, that's worth knowing before rather than after.
> Am I wanting company, or wanting the ache to stop? Both are fair. They lead to different decisions.
> “I don't know if I'll ever stop missing them” probably has the answer no — and that isn't the obstacle it looks like. Missing someone forever can go along with a lot, including another relationship.

**Decision:** 

### 49. `lit-bereave-guilt`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-losing-a-partner

> **The guilt about being all right**
>
> “I feel guilty for laughing again.” “I don't know if I'm allowed to be happy.” “I'm afraid moving forward means leaving them behind.”
> These are common, and they're rarely said out loud. They sound irrational, and they don't feel irrational.
> **What the guilt can be doing**
> For some people, grief becomes one of the few kinds of contact they have left — while it's sharp, the person is still there in the day.
> So anything that eases it can feel like a second loss — not a relief but one more step away from them. That can be why feeling all right for an afternoon sometimes brings something that feels like betrayal.
> Which is why the usual comfort lands badly. “They'd want you to be happy” misses the point. The hard part isn't whether you're allowed to be happy. It's that feeling better feels like moving away.
> We don't know what they'd have wanted, and neither does anyone else. Nothing here will tell you what the dead would think — that's not a claim anyone has the right to make for you.

**Decision:** 

### 50. `lit-bereave-nobody-understands`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-losing-a-partner

> **“No one understands this kind of grief”**
>
> Said twice in this material, which is unusual, and we're not going to argue with it.
> **Why it can feel that way**
> Many of the lines people have ready are built for divorce. They offer them because it's what they've got — you'll be better off, you'll find someone, it takes about a year.
> None of those are aimed at what's happened to you. So people who really care can say things that land as if they don't understand — even when they're trying to. That doesn't mean no one can understand, or that you're alone in it. Some people who've been through something like it may come closer than you'd expect.
> There's also a group who do understand, and it's usually other people who've had the same loss. That's not so much a suggestion as a note about where the recognition tends to come from.
> “I don't know who understands this kind of loss” is worth treating as a real question you could actually answer, not just a way of saying how alone it feels. There are usually more people than it seems, and they aren't the obvious ones.

**Decision:** 

### 51. `lit-bereave-still-we`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-losing-a-partner

> **Still “we”**
>
> “I still think of us as we.” “I still wear my ring.” “I don't know how to stop feeling married.” “I don't know how to introduce myself anymore.”
> These are the small, constant ones — the ones that come several times a day, and that nobody warns you about.
> **Two different things being asked**
> What's true: whether you're still married, still a we, still someone's. Those aren't questions with clean answers, and they don't have to be settled.
> What to say: what comes out of your mouth at a party when someone asks. That's a practical problem, and it has practical answers.
> The second one can be settled without settling the first. Having a sentence ready — whichever sentence — takes away a small daily ambush, and it doesn't commit you to a position on anything.
> Nothing here has a view about the ring. Some people wear one for the rest of their lives, some move it, some take it off early and put it back on. None of those is the right way to do it, and none of them is a stage.

**Decision:** 

### 52. `lit-bereave-what-this-is`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-losing-a-partner

> **What this is for**
>
> Almost everything written about relationships ending is about ones that ended by choice. Somebody left, or both of you did.
> That material fits you badly. There's no decision to look at. There's no one to be angry with in the usual way. And none of the questions about what went wrong fit.
> **The thing that runs through most of this**
> Not: how do I get over it. Very few people here are asking that.
> But: how do I keep living without it meaning I've left them behind. That's the question underneath the guilt, the ring, the introductions, and wanting company.
> Nothing here will suggest you move on, and nothing will put a time limit on anything — in either direction. There's no schedule you're meant to keep, and no single right way to do this.

**Decision:** 

### 53. `lit-c12-faq-wasted`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* letting-go-without-losing-what-it-meant

> **Did I waste those years?**
>
> It's a common thought, and the answer is more complicated than either the harsh version or the comforting one.
> **Two things people mean by it**
> Time spent that gave you nothing. Rarely quite true — you lived those years, and things happened in them that weren't the relationship.
> Time spent on something that wasn't going to work, that you could have spent another way. Often true, and it's a real loss worth grieving rather than arguing with.
> The comforting version — everything happens for a reason, you learned so much — is worth being wary of. Some of it really does teach you something, and some of it was just cost. Being told it was all a lesson tends to add a small pressure to be grateful, on top of everything else.

**Decision:** 

### 54. `lit-c20-the-future`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* finding-yourself-after-everything-changed

> **Grieving a future that never happened**
>
> “I'm grieving the future I imagined.” “I miss the life I thought we'd have.” “I never imagined this would be my story.”
> This is one of the least talked-about losses there is, because nothing happened to it. There's no event, no date, nothing anyone can point to.
> But you'd been living toward it. You arranged things around it. You said no to things because of it. You counted on it. That's a big part of a life, built around something that has now stopped being true.
> **Why it's harder to grieve than the relationship**
> Nobody else can see it. Friends never saw it, so there's nothing for them to share the sadness over.
> And it feels like you're not allowed to. You're mourning something that never happened, which sounds like being sentimental, not like loss.
> It isn't being sentimental. Losing a future you'd counted on is a commonly named kind of loss, and it explains a lot of feeling lost. “I don't know what my future looks like anymore” is a fair way to put it, not a failure of imagination.

**Decision:** 

### 55. `lit-c21b-faith`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* asking-better-questions

> **When faith is part of it**
>
> “I don't know if shared faith is important.” We're not going to answer that, either way. It depends entirely on what faith does in your life, and only you know that.
> **One distinction that helps more than the belief question**
> What you each believe. This can be very different and often matters less than people expect.
> How much of your actual week it shapes — what you do on Sundays, what you eat, which holidays, how children would be raised, who you spend time with, what you'd want at a wedding or a funeral.
> The second is what causes friction, and you can check it early. Couples with different beliefs but similar practices often do fine. Couples with similar beliefs but very different practices often don't.
> “My faith has changed how I view relationships” is worth saying out loud early for the same reason — it changes what the week looks like, and that's the part someone needs to know.
> “I don't want to compromise my beliefs” is a fair position and nothing here suggests you should. If shared faith is structural for you, it's structural — that's a fact about your life, not a stubbornness to be worked on.

**Decision:** 

### 56. `lit-c4-average-vs-person`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **The average isn't the person in front of you**
>
> This is the one that does the most work, so we'll take it slowly.
> You've built up a read on dating. Something like: most people aren't serious, or everyone's talking to five other people, or nobody actually wants to meet. That read is probably roughly right. As a description of the pool, it's defensible.
> **Here's the problem**
> A read about a pool and a judgement about a person are two different things, and the first has quietly started standing in for the second.
> When you already know how someone will behave, you stop watching what they actually do. Not consciously — you just aren't looking, because you think you already have the answer.
> That's the cost. Not that you're too negative. That the general read is doing a job it isn't built for.
> One thing worth knowing, since it cuts against the strongest version of the read: when people in their twenties and thirties are actually asked, most say they want a relationship — around two-thirds of women, around half of men.
> So nobody wants anything real isn't holding up as a universal, even though the version you've experienced — a lot of people not being serious — clearly is.
> What we're not saying: that you should give everyone a chance, assume the best, or ignore what you've learned. Keep the read. Just don't let it answer questions it wasn't asked.

**Decision:** 

### 57. `lit-c4-designed-this-way`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **It's designed this way**
>
> You've probably thought at some point that the apps aren't built for you to succeed. That's not paranoid.
> They work on the same principle as a slot machine. The reward is unpredictable — sometimes a match, usually nothing — and unpredictable rewards are the most habit-forming kind there is. Not because anyone is being cruel, but because it keeps people opening the app.
> There's active litigation in the US alleging that some major platforms use these mechanics deliberately to keep people searching rather than finding. The companies deny it. We're not going to tell you how that resolves.
> We're telling you it exists so that the exhaustion makes sense. Feeling like it's engineered to keep you going isn't a distorted read. It's a structural read, and it's a reasonable one.
> What follows is practical, not moral: if a system is built to keep you engaged, then how much you engage is a decision you have to make on purpose. It won't be made for you.

**Decision:** 

### 58. `lit-c4-faq-different-for-others`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **Why does it look so different for other people?**
>
> Because it genuinely is different, depending on where you're standing.
> **Two different kinds of hard**
> Some people are drowning. Too much contact, most of it low-effort, a lot of it needing to be screened before it's even a conversation. The work is filtering, and it's tiring in a specific way.
> Other people are invisible. Very little coming back, sometimes nothing for long stretches. The work is being seen at all, and it's tiring in a completely different way.
> Both are real. Both are common. And they produce opposite-looking complaints — “everyone has too many options” and “I can't get anyone to notice me” — from people who are both, accurately, describing what's happening to them.
> If you've ever read someone else's account of dating and thought that's not my experience at all, this is probably why. It doesn't mean either of you is wrong.

**Decision:** 

### 59. `lit-c4-faq-is-it-me`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **Is it me, or is it this?**
>
> The question underneath most of the others. And the honest answer is: both, and not in equal measure.
> **Both halves**
> It's genuinely this. The environment is harder than it was. The numbers back you up. Anyone telling you it's all down to your profile is selling something.
> And there are things that are yours. Not because you're doing it wrong, but because when you decide nothing works, you stop doing the things that occasionally do. You stop reading individuals. You stop pacing yourself. You keep going at a volume that makes you worse at it.
> Those are the parts we can work on, and they're worth working on precisely because the environment is hard. When conditions are rough, how you spend your effort matters more, not less.
> What we won't do is split it neatly for you. Anyone who tells you it's 70% you or 70% them is guessing.

**Decision:** 

### 60. `lit-c4-faq-standing-out`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **How do I stand out?**
>
> This is a fair question, and an exhausting one — it can feel like everyone's being asked to perform just to be seen at all.
> **What this isn't**
> This isn't a guide to better photos, sharper openers, or being more marketable. If that's the advice you were bracing for, you can let it go — it's what a lot of people in your position have already tried and found hollow, and we're not going to repeat it.
> The more answerable question isn't “how do I get noticed by everyone,” which mostly isn't in anyone's control. It's this: when someone does show up, can you tell whether they're actually engaged — and are you spending your effort where it comes back? That part you can work on, and it's what “Who's Actually Here” is for.
> Standing out to the whole pool and being met by one person are different things. This Playbook is about the second.

**Decision:** 

### 61. `lit-c4-faq-worth-it`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **Are the apps still worth it?**
>
> We won't answer this for you, but we can give you what the answer depends on.
> **Both true at once**
> App use is falling. The biggest platforms have been losing paying users for a while. People are voting with their feet, so if it feels like the shine has come off, you're reading the room correctly.
> And it's still the most common way couples meet.
> So it's a trade-off, not a right answer. The question worth asking isn't are apps good or bad — it's is what I'm putting in coming back in any form. If it isn't, that's information. If it is, even occasionally, that's information too.
> What we'd steer you away from is deciding in the middle of a bad week. That's the depleted version of you making a call the rested version might make differently.

**Decision:** 

### 62. `lit-c4-how-people-meet-now`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **How people actually meet now**
>
> Straight answer, because it's a straight question.
> Meeting online overtook meeting through friends around 2013. Roughly four in ten couples now meet that way, and it's the single most common route.
> Which is an uncomfortable answer, because it's the route that's wearing you out.
> **Two things follow**
> The tiredness isn't a sign you're doing it wrong. You're using the main channel, and the main channel is exhausting.
> It isn't the only channel. The offline ones have got quieter but haven't gone anywhere.
> We're not going to tell you to join a running club. We're telling you that the answer to “how does anyone meet anymore” is: mostly this way, and it's genuinely hard, and some people still do it the old way.

**Decision:** 

### 63. `lit-c4-not-imagining-it`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **You're not imagining it**
>
> We want to be specific about this, because you've probably been told you're being negative.
> **What the numbers actually say**
> Roughly four out of five people using dating apps say they're worn out by it, at least sometimes.
> Around three-quarters of people who've dated in the last five years have either been ghosted or ghosted someone.
> When people are asked what wore them out, the answers are the ones you'd give: couldn't find a real connection, got ghosted, the same conversation over and over.
> So when you say this is exhausting, you're describing the average experience, not a personal failing.
> We're leading with this because everything else depends on it. If we started by suggesting the problem is your attitude, we'd be wrong, and you'd know we were wrong.

**Decision:** 

### 64. `lit-c4-stopping-is-allowed`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **Stopping is a decision, not a failure**
>
> Somewhere in here you may have thought about quitting. Deleting the apps. Taking a few months. Being done for a while.
> We want to be clear: that's the skill working, not failing.
> Weighing whether something is worth continuing is exactly the kind of judgement this whole Playbook is about. Applying it to the process itself isn't giving up — it's the same evaluation, pointed one level out.
> Plenty of people take a break and come back with a clearer sense of what they're after. Plenty take a break and stay stopped for a while, and that's a legitimate outcome too.
> **The one thing worth knowing about yourself**
> “I'm stopping because this isn't paying off right now” is a decision.
> “I'm stopping because nothing will ever work” is a conclusion, and conclusions like that are worth a second look before you act on them.
> If it's the second one — and especially if that feeling has spread beyond dating into how you see yourself generally — that's worth talking to someone about. Not because something's wrong with you. Because that's a heavier thing than a Playbook is built for.

**Decision:** 

### 65. `lit-c4-too-much-volume`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **Why volume makes you harsher**
>
> This is the one most people haven't heard, and it changes how the tiredness reads.
> When researchers watched people go through profiles in a single sitting, something consistent happened. People got more rejecting as they went. By the end of a session they were saying no far more often than at the start — roughly a quarter less likely to accept anyone.
> The people at the end weren't worse. The person judging them was depleted.
> So the pickiness that creeps in, the sense that nobody measures up, the way everyone starts to blur — that's not you becoming jaded as a personality change. That's what evaluating too many people in a row does to anyone.
> **This flips the problem**
> You don't need to learn how to judge people better. You're good enough at it. You've been doing it eighty times a week with no break.
> That's a fuel problem, and fuel problems have different solutions than skill problems.

**Decision:** 

### 66. `lit-c4-what-serious-looks-like`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **What serious actually looks like**
>
> If there's one practical thing to take from this, it's the difference between two kinds of signal.
> **Signals that tend to mean something**
> They reply without you always going first.
> What they said they'd do and what they did match up.
> They move toward actually meeting, within a reasonable stretch of time.
> It holds up over more than one exchange.
> **Signals that tend to mean less than they feel like**
> Warmth. Being nice is cheap and most people manage it.
> Intensity early on. Strong feeling before they know you isn't about you yet.
> Stated intentions with nothing behind them. “I'm looking for something real” is a sentence.
> Attractiveness, in either direction.
> The useful shift is small: stop weighing what people say, start weighing what they do — and give it more than one data point before you decide.
> This won't tell you how things end. Nothing does. It'll tell you whether someone is currently showing up, which is a different and much more answerable question.

**Decision:** 

### 67. `lit-c4-what-this-is`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **What this actually is**
>
> You're not here because you're bad at dating.
> You're here because you've been doing it for a while, and somewhere along the way you stopped expecting much. That's not a character flaw. It's what happens when you put effort somewhere repeatedly and it mostly doesn't come back.
> **There are two halves to this, and we'll be straight about both**
> The first half is real. Dating now is harder than it was — not vaguely, measurably. The conversations really do die. You're not imagining it and you're not being dramatic.
> The second half is the part we can do something about. Somewhere in the middle of all that, a conclusion formed. Something like nobody's serious, or everyone's keeping options open. And once that conclusion is in place, it starts arriving before people do.
> That second piece is what's worth looking at. Not because the conclusion came from nowhere — it came from experience — but because it's now doing your reading for you.
> This isn't going to tell you to stay positive. It's going to help you see what's actually in front of you, and stop spending yourself on the parts that were never going to pay off.

**Decision:** 

### 68. `lit-c4-why-people-vanish`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* dating-without-losing-hope

> **Why people vanish**
>
> You want to know why. Most people do. Here's the honest answer, in three parts.
> It's usually about them. People who disappear rather than say something tend to be avoiding the conversation, not delivering a verdict on you. That's a fact about their conflict tolerance, not about your worth.
> It hurts more than it should, and that's not weakness. Being cut off without explanation lands harder than being told no — you never get the information that would let you close it out.
> You usually won't find out. Most of the time there's no explanation coming, and waiting for one keeps the thing open long after it's over.
> What you can do is stop treating silence as data about you. It's data about them, and mostly it isn't even much of that.

**Decision:** 

### 69. `lit-grievediff-different-now`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-grieving-differently

> **“Our relationship feels different now”**
>
> It probably is. Something happened to both of you, and relationships don't come through that unchanged.
> Some of what's different is grief, which is temporary in shape if not in fact. Some is the built-up effect of months of each of you misreading the other. And some is that the future you'd both been expecting stopped being available. That's its own loss, and it's rarely named as one.
> **Worth keeping apart, because they don't move together**
> The grief changes at its own pace. It can't be forced or scheduled. Still, support and the ways you look after yourself may affect how it's carried.
> The misreading is the part that responds to anything, and it's the part this can work on.
> “I feel alone in this experience” is often true even when both people are there. Being in the same house as someone who's grieving the same thing in a different way is its own kind of alone. It isn't evidence that either of you has pulled away.

**Decision:** 

### 70. `lit-grievediff-supporting`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-grieving-differently

> **“I don't know how to support my partner”**
>
> Often said by both people, about each other, at the same time. That's worth knowing on its own.
> **Why the usual way stalls**
> Most people support someone the way they'd want to be supported. If you need to talk, you ask questions. If you need quiet, you give space.
> When two people need different things, each one offers something the other doesn't want. And both are then hurt that their offer wasn't taken.
> The version that helps is plain: asking instead of guessing. Not “how are you”, which gets you “fine”, but what they'd actually want when it's bad. Most couples have never asked each other that directly.
> It's also worth accepting that you may not be able to support each other well through this. Two people grieving the same loss are both worn down, and sometimes the support has to come from outside. That isn't a failure of the relationship.

**Decision:** 

### 71. `lit-grievediff-the-question`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-grieving-differently

> **“I'm tired of everyone asking when we're having kids”**
>
> A small thing that lands hard, repeatedly, from people who have no idea what they're asking.
> **The two costs of it**
> The moment itself. Being asked, and having to come up with something.
> The bracing. Once it's happened a few times, you weigh whole occasions ahead of time for whether the question will come up. That's more tiring than the question.
> Having a line ready mostly takes care of the second. Not because the answer matters, but because knowing what you'll say removes the need to brace for it.
> It's also worth agreeing with each other what gets said, and to whom. Couples often get caught out when one of them has told someone and the other didn't know. That's a small thing, but it lands as a betrayal when everything is already raw.

**Decision:** 

### 72. `lit-grievediff-two-ways`  ·  P3

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-grieving-differently

> **“We don't grieve the same way”**
>
> This is one of the most common things couples say after a loss like this. It's also one of the most damaging. Not because either way of grieving is wrong, but because each person reads the other's way as a judgment.
> **What each one usually decides about the other**
> The one who talks about it hears the silence as not caring, or as having moved on.
> The one who doesn't hears the talking as not being able to let it rest, and often stays quiet on purpose, to avoid making it worse.
> Each of you may be reading the other without enough to go on, and both of you are acting reasonably, given what you think is happening. That's why it can build. Each response seems to confirm what the other already believes.
> Grieving differently isn't a problem to line up. Nothing here will suggest you grieve the same way, or that one of you should change. What can change is what each of you decides from the other's way.

**Decision:** 

### 73. `rec-c12-bereaved`  ·  P3

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* letting-go-without-losing-what-it-meant

> **My partner died.**
>
> My partner died.
> This one would land badly on you, and we'd rather say so now than let you find out three screens in. The tools here assume someone made a choice. They're about what was yours, what was theirs, and what the checking is for. None of that fits your situation. Losing a partner to death is a different wound, with different questions. Does going on mean leaving them behind? How do you want company without it feeling like a betrayal? There's something written for that, and it's the right thing to read.

**Decision:** 

### 74. `rec-c20-bereaved`  ·  P3

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* finding-yourself-after-everything-changed

> **My partner died.**
>
> My partner died.
> This Playbook is for people whose relationship ended while both are still alive. Some of it would land badly on you, because the tools assume someone made a choice. Losing a partner to death is a different kind of hurt, with different questions. Does going on with your life mean leaving them behind? How do you want company again without it feeling like a betrayal? There's a matching Playbook for that, and it's the right one.

**Decision:** 

## P4 — Other support signposts

### 75. `lit-c15-faq-appreciated`  ·  P4

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* loved-not-just-needed

> **What if they finally appreciate me and it doesn't help?**
>
> This happens, and it's confusing enough that people conclude something is wrong with them.
> There are two reasons for it. The first is timing — being thanked now doesn't go back and cover the years when you weren't, and part of you knows the thanks arrived because you complained.
> The second is the ledger. While an account is running, anything they do gets logged as repayment instead of received as generosity. Which means thanks arrive into a system that has made thanks nearly impossible to feel.
> That isn't a reason to give up on it. It's a reason not to treat their getting better as the test of whether this can be repaired — and not to conclude you're broken when it doesn't land right away.

**Decision:** 

### 76. `lit-c18-without-disappearing`  ·  P4

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* money-work-and-us

> **Supporting them without disappearing**
>
> “I don't know how to support them without losing myself.” “I feel unsupported in my goals.”
> Those two show up together more often than you'd expect, sometimes from the same person about different parts of life.
> **The thing worth knowing about support**
> Support isn't a set amount you split up. Two people can both be supported, and two people can both feel unsupported while each one believes they're doing all the giving.
> What usually causes the second is that support was never spelled out. You each supported them the way you'd want to be supported, which often isn't the way they needed.
> “Losing myself” is worth taking seriously, and worth being specific about. Which part of yourself? Time, ambition, the thing you'd have done instead, the version of your life you'd pictured? Naming it lets you protect one piece rather than resenting the whole arrangement.

**Decision:** 

### 77. `lit-care-asking`  ·  P4

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* addon-caregiving

> **“I don't know how to ask for help”**
>
> Very common among carers, and it usually isn't about pride. It's more often about being specific.
> **Why the general offer never turns into help**
> “Let me know if you need anything” puts the work on you — you have to name a task, decide if it's fair to ask, and then ask. That's three jobs on top of the one you already have.
> “Could you sit with him Thursday afternoon?” is one job for them and none for you afterwards.
> So the thing that turns offers into help is having a specific request ready before anyone offers. Most people who offer mean it, and they're waiting to be told what.
> Some people offer and don't mean it, and finding that out hurts. But it's also information, and it's cheaper to learn early than to find out during a crisis.

**Decision:** 

### 78. `rec-c12-ready-to-date`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* letting-go-without-losing-what-it-meant

> **I'm thinking about dating again and don't know how.**
>
> I'm thinking about dating again and don't know how.
> That's the next part, not this one. There's a matching Playbook about moving forward. It covers what to share, comparing, pacing, and working out what you're ready to try. You don't have to be all the way "over" the earlier relationship before you read it. And you can move back and forth between both Playbooks.

**Decision:** 

### 79. `rec-c12b-differently`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* moving-forward

> **I don't want to repeat my past, and I don't know what healthy looks like.**
>
> I don't want to repeat my past, and I don't know what healthy looks like.
> Those have their own Playbook, and it's a better answer than anything here — it's built to turn “I want to do it differently” into something you can actually catch yourself doing. If trusting your own judgment is the harder part, there's another Playbook for that. This one covers less: what to say about your history, the guilt, and the comparing.

**Decision:** 

### 80. `rec-c12b-still-in-it`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* moving-forward

> **I'm not there yet — I still can't stop thinking about them.**
>
> I'm not there yet — I still can't stop thinking about them.
> Then this is the wrong half. There's a matching Playbook for the part before this — the checking, the replaying, figuring out what was really yours. You don't have to finish that one before reading this one. And going back to it isn't a step backward — plenty of people move between the two.

**Decision:** 

### 81. `rec-c15-still-chasing`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* loved-not-just-needed

> **I'm always the one texting first. I don't want to convince someone to choose me.**
>
> I'm always the one texting first. I don't want to convince someone to choose me.
> This Playbook is for people years into a relationship where the giving stopped being noticed. What you're describing sounds earlier than that. You're chasing someone who isn't giving back, and deciding whether to keep going. That's a different situation with a different answer, and the tools here won't fit it. Look for the Playbook on knowing whether to keep putting in.

**Decision:** 

### 82. `rec-c21-still-dating`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* do-we-want-the-same-future

> **I'm still dating and trying to work out what matters.**
>
> I'm still dating and trying to work out what matters.
> This Playbook is for people already together who've found a gap. What you're describing sounds earlier — figuring out when to bring up the big things, and how much difference really matters before you're committed. That's a different situation with different answers. The tools here assume a shared life that's already being built. Look for the one about asking better questions early.

**Decision:** 

### 83. `rec-c21b-already-together`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* asking-better-questions

> **We're already together and we've found a gap.**
>
> We're already together and we've found a gap.
> This one is for people still working out whether to build something. If you're already together and you've found you want different things, that's a different situation with different tools. The differences aren't just 'what if' anymore, and there's a shared life in the way. Look for the Playbook about building a shared future.

**Decision:** 

### 84. `rec-c23-expectations`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* how-to-make-a-relationship-decision-you-can-trust

> **I thought love would be enough, and it wasn't.**
>
> I thought love would be enough, and it wasn't.
> That's a real, specific thing to notice — that relationships take skills nobody taught you, and that chemistry and commitment don't give you those skills. It has its own Playbook, and the tools there are built around exactly that. This one is about the fear of choosing wrong and the shame of having done. Close, but different. Look for the one about building from the ground up.

**Decision:** 

### 85. `rec-c24-already-committed`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* is-this-going-somewhere

> **I already said yes, and now I'm not sure.**
>
> I already said yes, and now I'm not sure.
> This Playbook is for deciding whether to commit. What you're describing is different — you committed, and the doubt came after. That's real, and it's common. It needs a different approach: the question isn't 'should I' but 'can this hold up, and do I still want it'. This Playbook won't fit it. Look for one about the point where it becomes real.

**Decision:** 

### 86. `rec-care-other-side`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* addon-caregiving

> **I'm the one who's ill, not the one caring.**
>
> I'm the one who's ill, not the one caring.
> Then this is written from the wrong side. There's a paired Playbook for the person living with the illness. It's about feeling like a burden, about not wanting them to feel trapped, and about staying close when everything has changed. That's the one for you. If you both want to, reading the paired piece may help you see the other's side. Share or talk about only what each of you is okay sharing.

**Decision:** 

### 87. `rec-ill-other-side`  ·  P4

- [ ] Final sign-off
- *Type:* recognition card (role=signpost)
- *Location:* addon-living-with-illness

> **I'm the one providing the care.**
>
> I'm the one providing the care.
> Then this is written from the wrong side. There's a paired Playbook for the person caring — about the partnership fading, about the guilt of wanting a break, about being alone while together. That's the one for you. If both of you want to, reading the paired piece may help each of you understand the other's side. Share or discuss only what each of you is comfortable sharing.

**Decision:** 

### 88. `signpost-c20-practical`  ·  P4

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* finding-yourself-after-everything-changed · play `the-shape-of-a-life`

> **The practical side needs different people**
>
> Splitting finances, sorting out housing, working out plans for the children. None of that is what this is for, and getting it wrong early costs a lot. A lawyer, a mediator, or a family service is the right place. Co-parenting especially has a large body of specific guidance behind it, and it's worth going to someone for rather than working it out on your own.

**Decision:** 

### 89. `signpost-c3-heavier-material`  ·  P4

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* how-to-let-someone-in · play `one-true-thing`

> **If the true thing is a heavy one**
>
> If what you're carrying is bigger than a preference or an opinion — something from your history, something you've never told anyone — this particular exercise isn't built to hold it safely. It's not that such things have to be handed to a professional before anything else; it's that this specific step isn't designed for traumatic or highly distressing material. If and when you want to bring it somewhere, a setting made for that can meet it properly. Here, you might start with something smaller.

**Decision:** 

### 90. `signpost-c7-always-repairing`  ·  P4

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* how-to-stop-having-the-same-fight · play `going-back-afterwards`

> **If you're always the one going back**
>
> If repair only ever comes from you, and it's been that way a long time, that's worth taking seriously rather than doing more of it. A pattern where one person does all the reconnecting isn't a communication problem — it's an imbalance. If both people can take part safely and freely, a qualified couples professional may help. If there's fear, control, payback, or pressure, get individual support first instead of going into joint counselling. Read 'Should we see someone?'

**Decision:** 

### 91. `signpost-self-worth`  ·  P4

- [ ] Final sign-off
- *Type:* in-play support signpost
- *Location:* dating-without-losing-hope · play `whos-actually-here`

> **Their silence isn't a verdict on you**
>
> Some of what you've written reads like their silence is telling you something about you. Their silence doesn't establish your worth. It may reflect their interest, their capacity, their circumstances, their communication habits, or something you can't know from silence alone. If that's a familiar feeling and it doesn't shift, it can help to talk it through with someone, separately from any of this.

**Decision:** 

## P5 — Scope redirects (out-of-scope referrals)

### 92. `lit-c18-what-this-is`  ·  P5

- [ ] Final sign-off
- *Type:* safety literature (scope=cluster)
- *Location:* money-work-and-us

> **What this actually is**
>
> On the surface it's two separate problems — money, and the fact that work keeps winning.
> Underneath, they're the same question. And it's bigger than both: are we building the same thing?
> **Why that's the real subject**
> Money arguments are rarely about the amount. They're about what you each think it's for, and what safety looks like to you.
> Career arguments are rarely about the hours. They're about whose life is the one being built.
> So the fixes people reach for — a spreadsheet, a date night — usually don't touch it. They're good ideas aimed at the wrong thing.
> Nothing here tells you how to budget or split bills. That's a different kind of help and worth getting separately. This is about the conversation and the compatibility question.

**Decision:** 
