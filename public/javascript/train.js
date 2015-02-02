#!/usr/bin/env node

const training = [
	[0,  "test post please ignore"],
	[1,  "I hate my job..."],
	[2,  "This is called humanity."],
	[3,  "Obama wins the Presidency!"],
	[4,  "So long, and thanks for all the postcards"],
	[5,  "President Obama's new campaign poster"],
	[6,  "The health bill has PASSED!"],
	[7,  "Yep, that just about sums it up. [PIC]"],
	[8,  "10 year old girl with cancer too sick to see UP. Pixar flies a DVD to her home. She dies 7 hours later."],
	[9,  "Reddit, I don't give a damn about your aunt, uncle, boyfriend, girlfriend, boss or toothless rabies infested dog who reads Reddit. Less personal crap and more ,articles please."]
	[10, "I've had a vision and I can't shake it: Colbert needs to hold a satirical rally in DC."],
	[11, "It's like opening your window during Irene, but safer!"],
	[12, "Who else disgusted with California this morning over Prop 8?"],
	[13, "Watching someone use a computer"],
	[14, "IAmA 74-time Jeopardy! champion, Ken Jennings.  I will not be answering in the form of a question."],
	[15, "Cafeteria ninja"],
	[16, "Chat Roulette Piano Improv - Hilarious (no dicks)"],
	[17, "I'm the only Caucasian in my part of town. I found this note on my windshield today..."],
	[18, "A personal message from Stephen Colbert to the reddit community"],
	[19, "Your IP, [IP address], has been logged. Your ISP, [Wrong ISP], will be contacted, your contact information subpoenaed, and you may be personally contacted by a ,DEA agent.]"
	[20, "This is why you shouldn't allow your boss to be your Facebook friend. [pic]"],
	[21, "Please design a logo for me. With pie charts. \nFor free."],
	[22, "When you reach max level...You stop leveling."],
	[23, "Say NO to Socialism [PIC]"],
	[34, "Nutjob mistakenly allowed to give TED Talk, he rambles for over four minutes before being carried off the stage."]
]

const matches = [
	[0, ["test", "post", "ignore"]],
	[1, ["hat", "job", "..."]],
	[2, ["huma", "humanity", "iscalled"]],
	[3, ["Presidency"]]
]

const mismatches = [

]

// todo finish.