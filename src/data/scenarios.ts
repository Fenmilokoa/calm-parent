export interface Scenario {
  scenario_id: string;
  title: string;
  child_age_range: string;
  keywords: string[];
  trigger: string;
  brain_state: string;
  developmental_why: string;
  parent_state: string;
  connect_first: string[];
  then_redirect: string[];
  what_not_to_do: string;
  why_it_backfires: string;
  repair_script: string[];
  why_repair_matters: string;
  long_term_signal: string;
}

export const SCENARIOS: Scenario[] = [
  {
    scenario_id: "tantrum_toddler_denied",
    title: "Toddler meltdown when told no",
    child_age_range: "18m-4y",
    keywords: ["tantrum","meltdown","screaming","floor","kicking","won't stop","losing it","no","denied","can't have"],
    trigger: "denied request or unexpected limit",
    brain_state: "Full amygdala activation — the upstairs brain (prefrontal cortex) is completely offline. This child cannot hear logic, reason, or consequences right now.",
    developmental_why: "Under 4, the prefrontal cortex is barely developed. When emotion floods in, there is no 'upstairs brain' available to regulate it. This is not defiance — it is a brain that literally cannot do what you're asking yet.",
    parent_state: "embarrassed, frustrated, overwhelmed",
    connect_first: [
      "Get low — physically get to their level",
      "Soft voice, slow words: 'I can see you're really upset.'",
      "Don't touch unless they want it — some children need space first",
      "Stay close and calm. Your nervous system is regulating theirs.",
    ],
    then_redirect: [
      "Once the storm passes even slightly: 'You really wanted that. That was so hard.'",
      "Name the feeling: 'That felt so unfair, didn't it.'",
      "Offer a small bridge: 'Shall we find something to help us feel better?'",
      "Hold the boundary warmly: 'We're still not getting it — and I love you.'",
    ],
    what_not_to_do: "Reasoning, explaining, threatening, or counting to three during the meltdown",
    why_it_backfires: "The upstairs brain is offline. Language-based interventions require the prefrontal cortex — which isn't available. Every word you say adds stimulation to an already flooded nervous system and extends the meltdown.",
    repair_script: [
      "When things are calm, later: 'Earlier when you were really upset — I stayed with you.'",
      "If you lost your temper: 'I got loud earlier and that wasn't okay. I'm sorry.'",
      "'When I get it wrong, I come back and we sort it out. That's what we do.'",
    ],
    why_repair_matters: "Siegel calls this rupture and repair — it is not a failure, it is an attachment lesson. A child who sees a parent acknowledge a mistake and repair it learns that relationships survive difficulty. That is a profound gift.",
    long_term_signal: "Frequent meltdowns in toddlers are developmentally normal. If they're increasing after age 4, look at sleep, hunger, transitions, and whether the child has enough autonomy in their day.",
  },
  {
    scenario_id: "hitting_biting_toddler",
    title: "Toddler hits, bites or scratches",
    child_age_range: "12m-4y",
    keywords: ["hitting","biting","scratching","hit","bit","scratch","hurt","aggressive","violent","lashing out"],
    trigger: "frustration, overstimulation, or communication limitation",
    brain_state: "Impulse plus no language equals physical output. The toddler brain routes emotion through the body because the verbal pathways aren't built yet.",
    developmental_why: "Biting and hitting peak between 18 months and 3 years because children have BIG feelings and almost no words for them. The mouth and hands are how they express what they cannot say. This is not a character flaw — it is a developmental stage.",
    parent_state: "shocked, embarrassed, sometimes hurt",
    connect_first: [
      "Calm, firm, immediate: 'Stop. That hurt.'",
      "No lecture — two words maximum in the moment",
      "Attend to the hurt person first, calmly, in full view",
      "Then return to the child: 'I can see you were feeling something big. Hitting isn't okay.'",
    ],
    then_redirect: [
      "Name what you think they felt: 'Were you frustrated? Scared? Too full of feeling?'",
      "Give them the word: 'When you feel like that, you can say STOP or come find me.'",
      "Practice the alternative in a calm moment, not in the heat of it",
    ],
    what_not_to_do: "Biting them back 'so they know how it feels', long explanations, shame-based responses",
    why_it_backfires: "Biting back confirms that bodies hurt bodies when frustrated — the exact lesson you don't want. Long explanations are processed by the upstairs brain, which is offline. Shame ('bad boy/girl') attacks identity rather than teaching behaviour.",
    repair_script: [
      "'Earlier when you bit — I was really shocked and I got a bit cross. I understand you had big feelings.'",
      "'I'm not cross at you. I'm teaching you what to do with those feelings instead.'",
      "'Let's practice. Show me what you can do when you feel really angry.'",
    ],
    why_repair_matters: "Children who feel shame about hitting are more likely to hide it, not less likely to do it. Repair keeps the relationship open so the learning can actually happen.",
    long_term_signal: "If hitting or biting continues past 4 or intensifies, look at whether the child has enough language to express emotion. Speech and language support or emotional vocabulary practice may help more than any consequence.",
  },
  {
    scenario_id: "separation_anxiety_daycare",
    title: "Crying and clinging at drop-off",
    child_age_range: "6m-4y",
    keywords: ["drop off","nursery","daycare","crying","won't let go","clinging","won't go","screaming at gate","separation"],
    trigger: "separation from primary attachment figure",
    brain_state: "The attachment system is activated. For a young child, separation from their safe person is neurologically registered as a threat — not drama, actual threat signal.",
    developmental_why: "Separation anxiety peaks twice: 8-12 months and again around 18 months-3 years. It reflects a healthy, secure attachment — your child cries because you matter enormously to them. An insecurely attached child often doesn't protest.",
    parent_state: "guilty, late, heartbroken",
    connect_first: [
      "Before you arrive: name what's coming — 'We're going to nursery. I'll pick you up after lunch.'",
      "At drop-off: get low, one long hug, eye contact",
      "'I'm going to work. You're safe here. I'll be back after lunch.'",
      "Name the feeling: 'I can see you don't want me to go. I know.'",
    ],
    then_redirect: [
      "One goodbye. Confident, warm, brief.",
      "Hand to the keyworker — don't look back at the door",
      "Create a goodbye ritual: a special handshake, three kisses, whatever yours becomes",
    ],
    what_not_to_do: "Lingering, repeated reassurance at the door, sneaking away, or minimising ('you're fine!')",
    why_it_backfires: "Lingering teaches the child the goodbye isn't final and escalates distress. Repeated reassurance confirms there is something to be worried about. Sneaking away destroys trust — they learn goodbyes happen without warning, which increases anxiety. 'You're fine' when they're clearly not fine teaches them their feelings are wrong.",
    repair_script: [
      "At pick-up: 'I thought about you today. I knew you'd be okay.'",
      "If you got frustrated at drop-off: 'This morning was hard. I'm sorry I rushed you. Saying goodbye is hard.'",
      "'We did it. And I came back. I always come back.'",
    ],
    why_repair_matters: "The consistent return is the cure for separation anxiety — not avoiding the separation. Every time you leave and come back, you build the internal model: my parent comes back. Repair after a hard morning reinforces that.",
    long_term_signal: "Most separation anxiety resolves as object permanence strengthens. If it's extreme past 4 or affecting the child's ability to settle at all, look at the broader attachment picture and consider whether home feels safe and predictable enough.",
  },
  {
    scenario_id: "bedtime_resistance_toddler",
    title: "Toddler fights bedtime every night",
    child_age_range: "18m-5y",
    keywords: ["bedtime","won't sleep","keeping coming out","sleep","night","bed","won't go to bed","fighting sleep","overtired"],
    trigger: "end of day transition, separation, overtiredness",
    brain_state: "Cortisol and adrenaline from the day haven't metabolised. An overtired brain is paradoxically hyperactivated — the stress response kicks in to keep the body going, making sleep harder.",
    developmental_why: "Between 2-4, children develop enough awareness to understand that bedtime means separation from parents — but not enough emotional regulation to manage that. The resistance is almost always either overtiredness (overtired children fight sleep harder) or separation anxiety in disguise.",
    parent_state: "exhausted, resentful, defeated",
    connect_first: [
      "Start wind-down 30-45 minutes earlier than you think you need to",
      "Lower lights, lower voice, lower stimulation — your body is the signal",
      "'We're moving into bedtime now. Let's do bath/pyjamas/story together.'",
    ],
    then_redirect: [
      "Consistent, predictable routine — same order, every night",
      "One meaningful connection moment in bed: one song, one question ('best bit of your day?')",
      "Then clear: 'Sleep time now. I'll check on you in two minutes.'",
      "Follow through on the check-in — once. Then done.",
    ],
    what_not_to_do: "Engaging with requests for 'one more thing', threatening, anger at the door, or inconsistent follow-through",
    why_it_backfires: "Each time 'one more thing' works, the child learns the system has flexibility — and will test for that flexibility every night. Inconsistency is the single biggest driver of prolonged bedtime battles. The brain learns what's real by testing repeatedly.",
    repair_script: [
      "'Last night I got cross at bedtime and I'm sorry. Bedtime is still bedtime — but I don't want to be cross.'",
      "'Let's try again tonight. I'll do the check-in like I said.'",
      "In a calm daytime moment: 'What would make bedtime feel nicer for you?'",
    ],
    why_repair_matters: "A child who goes to bed feeling the relationship is okay sleeps better. Repair after a hard bedtime literally improves the next one.",
    long_term_signal: "Consistent bedtime resistance that doesn't improve often points to the routine being too late, too stimulating, or the child needing more connection during the day. Sleep debt accumulates in children and masks itself as behaviour problems.",
  },
  {
    scenario_id: "public_meltdown",
    title: "Full meltdown in a public place",
    child_age_range: "18m-5y",
    keywords: ["supermarket","shop","public","outside","floor","screaming","embarrassing","people watching","cafe","restaurant","park","out"],
    trigger: "overstimulation, hunger, tiredness, denied request",
    brain_state: "Complete emotional flood. The prefrontal cortex is offline. The child is operating from pure survival brain — they cannot see you, hear you, or process language.",
    developmental_why: "Public spaces are neurologically overwhelming for small children — noise, light, people, novelty, and usually a disrupted routine. Add hunger or tiredness and you have a perfect storm. The child's brain tips into flood because it genuinely cannot cope with the load.",
    parent_state: "mortified, furious, desperate",
    connect_first: [
      "Your job right now is not to stop it — it's to be the calm next to the storm",
      "Get low or pick up (if safe): 'I'm here. I've got you.'",
      "Move to a lower-stimulus spot if possible: outside, a quieter aisle, the car",
      "Say very little. Your calm presence is the intervention.",
    ],
    then_redirect: [
      "Don't try to talk through it while it's happening",
      "When the wave passes: 'That was really big, wasn't it. You're okay now.'",
      "Name it: 'You were so hungry/tired/overwhelmed. That was a lot.'",
      "Hold any boundary warmly: 'We're still not getting the thing — and you're loved.'",
    ],
    what_not_to_do: "Reasoning during the meltdown, threatening consequences, saying 'everyone is watching', physical force to move them, or pretending it isn't happening",
    why_it_backfires: "A flooded brain adds every word you say to the overwhelm. 'Everyone is watching' adds shame to an already maxed nervous system. Threats require the prefrontal cortex to process — which is offline. You are talking to an empty room.",
    repair_script: [
      "In the car, or later at home: 'That was hard for both of us today, wasn't it.'",
      "If you lost it in public: 'I got frustrated and said things I shouldn't. That wasn't your fault.'",
      "'Big feelings are allowed. We'll figure out what to do with them together.'",
    ],
    why_repair_matters: "Public meltdowns often leave children with implicit shame — they sense the parent's embarrassment even if nothing is said. Repair names what happened and removes the shame.",
    long_term_signal: "Frequent public meltdowns usually mean the child's baseline is too full — not enough sleep, food, downtime, or 1:1 connection. Address the roots and the incidents reduce.",
  },
  {
    scenario_id: "food_refusal_toddler",
    title: "Won't eat — refuses meals",
    child_age_range: "12m-5y",
    keywords: ["won't eat","food","dinner","lunch","fussy","picky","not eating","refuses food","meal","plate","eating"],
    trigger: "control, sensory sensitivity, or genuine dislike",
    brain_state: "For toddlers, food refusal is often about autonomy — one of the few areas of genuine control they have. The resistance escalates in direct proportion to parental pressure.",
    developmental_why: "Between 12 months and 5 years, most children go through a neophobic phase — biologically wired to be suspicious of new foods. This was protective in evolutionary terms. It is not stubbornness. It is also the developmental stage where autonomy is the central drive — 'I do it myself' extends to 'I choose what goes in my body'.",
    parent_state: "worried, failing, in a battle of wills",
    connect_first: [
      "Remove the emotional charge from mealtimes — this is the whole intervention",
      "Serve it without comment. Their job is to decide how much. Your job ends at what you serve.",
      "If they don't eat: 'That's okay. Your body will tell you when it's hungry.'",
    ],
    then_redirect: [
      "Division of responsibility: you decide what, when, where. They decide whether and how much.",
      "Keep rejected foods appearing — without pressure — it takes 15-20 exposures to accept a new food",
      "Eat together and eat the same food — modelling is more powerful than any incentive",
    ],
    what_not_to_do: "Forcing, bribing ('one more bite for Grandma'), making alternatives, commenting on intake, or having visible anxiety about it",
    why_it_backfires: "Pressure around food activates the stress response — eating becomes associated with anxiety. Forced eating overrides interoception (the child's ability to feel their own hunger/fullness), which has long-term consequences. Children who are bribed to eat learn that food is a transaction.",
    repair_script: [
      "If mealtimes have become a battle: 'I've been putting too much pressure on food. That stops now.'",
      "To your child: 'You decide what goes in your body. I'll keep cooking good things.'",
      "'I'm sorry I made eating stressful. Let's make mealtimes nice again.'",
    ],
    why_repair_matters: "Repairing the emotional environment around food can shift the whole dynamic quickly. Children eat more freely when the table doesn't feel like a test.",
    long_term_signal: "A child who eats fewer than 20 foods, gags at textures, or has extreme distress around food may have sensory processing differences. This is worth a conversation with your GP or a paediatric occupational therapist.",
  },
  {
    scenario_id: "new_sibling_regression",
    title: "Regression after new baby arrives",
    child_age_range: "18m-5y",
    keywords: ["new baby","regression","baby talk","nappy","bottle","acting like baby","jealous","sibling","newborn","new brother","new sister"],
    trigger: "attachment disruption from new sibling",
    brain_state: "The attachment system is sending an alarm signal: my safe person's attention has divided. Regression is the child returning to behaviours that reliably got attachment needs met before.",
    developmental_why: "A new sibling is one of the biggest attachment events of a young child's life. Regression — bedwetting, thumb-sucking, baby talk, clinginess — is not manipulation. It is the child's nervous system reaching for the most reliable strategy it knows: become small, become needy, get held.",
    parent_state: "stretched, exhausted, guilty",
    connect_first: [
      "Meet the regression with warmth rather than correction",
      "'You want to be my baby sometimes too, don't you.'",
      "Let them — within reason. A few days of baby talk won't set anything back.",
      "'You will always be mine. That never changes. The baby didn't take that.'",
    ],
    then_redirect: [
      "Protect 1:1 time even in 10-minute pockets — just them, no baby",
      "Give them a role with the baby that generates pride, not resentment",
      "Name the hard thing directly: 'It's strange having to share me. That's real.'",
    ],
    what_not_to_do: "Shaming regression ('you're too old for this'), constantly referencing the baby's needs, or expecting the older child to be grateful",
    why_it_backfires: "Shaming regression drives it underground — the need doesn't go away, just the expression of it. A child who learns their attachment bids are met with rejection becomes more desperate, not less.",
    repair_script: [
      "'I've been so busy with the baby and I've not had enough time with just you. I'm sorry about that.'",
      "'You are not less important. You came first and you'll always be mine.'",
      "Book something small: a coffee shop trip, a film, their choice — just them.",
    ],
    why_repair_matters: "The older child needs to see that the relationship with you survived the baby's arrival. Regular repair and repair conversations rebuild that certainty.",
    long_term_signal: "Regression that lasts more than a few weeks, or that includes aggressive behaviour toward the baby, signals that the older child's attachment needs aren't being met enough. Connection is the medicine.",
  },
  {
    scenario_id: "transition_resistance",
    title: "Meltdown when switching activities",
    child_age_range: "18m-5y",
    keywords: ["won't stop","transition","switching","moving on","finishing","ending activity","come on","time to go","leaving"],
    trigger: "unexpected or unwanted transition",
    brain_state: "The toddler brain is in deep focus — a state of flow. Interruption triggers a cortisol spike. The transition feels like a loss, and loss activates the stress response.",
    developmental_why: "Under 5, children live in the present tense. They cannot mentally simulate the future ('it'll be fun when we get there'). They only experience what's ending. Transitions are therefore always experienced as loss first, and the ability to shift flexibly between activities is a prefrontal cortex skill that's years from being fully developed.",
    parent_state: "impatient, running late",
    connect_first: [
      "Warnings: '5 more minutes, then we're finishing.'",
      "Then: '2 more minutes.'",
      "Acknowledge the loss: 'I know you were right in the middle of that.'",
      "'It's really hard to stop when something is fun.'",
    ],
    then_redirect: [
      "Build a bridge to what comes next: 'After we leave, we'll have lunch/bath/park.'",
      "Create a transition ritual: a goodbye wave to the activity, a closing sentence",
      "Follow through calmly and without drama: 'Okay. Time to go. I'll carry you.'",
    ],
    what_not_to_do: "No warnings then immediate demand, threatening to leave without them, taking over the activity to force it to end",
    why_it_backfires: "No warning means the stress spike is sudden and maximum. Threats require future-thinking — which isn't available. Physically forcing transition without emotional acknowledgement stores the transition as a traumatic interruption, not a normal event.",
    repair_script: [
      "'I rushed you today and didn't give you a warning. That was hard.'",
      "'Next time I'll tell you when it's nearly time. That's my job.'",
      "'You're allowed to be sad that something ended. That makes sense.'",
    ],
    why_repair_matters: "Children who feel understood in their distress are more flexible next time. Repair teaches: my feelings are valid, and my parent comes back to acknowledge them.",
    long_term_signal: "Children who struggle intensely with all transitions may have higher sensory sensitivity or rigidity that warrants gentle further exploration — but for most, it's entirely developmental and improves steadily between 3 and 6.",
  },
];
