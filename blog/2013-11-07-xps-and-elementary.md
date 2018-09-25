---
title: Dell XPS 13 & ElementaryOS
---
I take a long time to make purchases; I hate spending money on myself. There is this cliche, that men hate going shopping with their wives because it takes forever. In that cliche, I'm the woman. The last time I bought a pair of pants, I knew _exactly_ which brand and style I wanted. As extra incentive, I had my daughters (6 & 3) with me. It still took me over 30 minutes to find a pair, and I know my size so I don't try things on. So that's 30 minutes, in the mens area of H&M, with two extremely lovely, but increasingly bored little girls, just to _find_ the pants. Dear reader, when I tell you I don't take my purchases lightly, you will know I am telling the truth.

I've been "in the market" for a new laptop since the beginning of the year. I've been putting off making the purchase for financial reasons, which has only made my obsession with ensuring I pick the right one worse. However, last week my hand was forced when my current laptop became too unreliable for me to use for any serious work. At the time I was fixated on the Thinkpad X230. It was a good compromise: small, powerful, upgradeable, quality screen (though low-ish resolution), great Linux support. Before that I had been looking at the Dell XPS 13, particularly because of Project Sputnik. Unfortunately, the price, even of a refurb model, was too high. Sure, you can get the first, non-IPS, low-def version for pretty cheap, but what's the point? Still, I thought I would give Dell one last look before pulling the trigger on the X230.

To my surprise, I found a FHD, i7, 8GB version of the XPS 13 for $800. There was no choice as far as I was concerned; it arrived yesterday.

##Installing ElementaryOS

In my [last post](/land-of-linux.html) I talked about my affection for ElementaryOS, so when the laptop arrived, I was ready to go with Luna on a bootable USB. I had heard that the XPS 13 has issues with Linux out of the box (trackpad, wifi, fn buttons). What I didn't expect was the UEFI boot mode that the thing comes with. Luckily, you can change to "Legacy" and boot from the USB with no extra trickery. Just F2 to get into the BIOS and you can literally stumble through it (because that's what I did).

Once you can boot to the USB is all pretty easy. I spent a small amount of time running the Live CD and making sure critical pieces were working (wifi, trackpad, function keys, backlight, etc). Honestly, I didn't have to spend much time before I decided to do the install. 

There isn't anything I can say about the install process. You just step through it as you would expect and you're good to go. Now, I chose to completely wipe the SSD because the various partitions that Windows 8 had set up left me with a paltry 70GB. Obviously, how you set it up is your decision; I have not personal use for Windows so it was out. Overall everything went as smooth as I could hope and I was pleasantly surprised to find that even the webcam worked with no messing about (something that I hadn't gotten working on my old laptop).

##Accoutrement

Next up I ran through a list of suggested updates/installs from [Elementary Update](http://www.elementaryupdate.com/2013/08/top-things-to-do-after-installing-luna.html/). Honestly, nothing special here either. I didn't install everything, but so far I haven't had any issues with what I did:
-	Community PPA
-	Elementary Tweaks
-	Indicator Synapse
-	Birdie
-	Cable
-	Third-party Icons

If you're running Ubuntu 12.04 LTS (which Elementary is based on) on an XPS 13, rumor has it that things work better if you add the Sputnik PPA. Now, I had everything working pretty well, but I had heard that fixes in the PPA would make the trackpad more reliable and the fan less prone to spinning up. However, you can bypass adding the PPA by upgrading to the Raring kernel (something that Elementary Update also suggests); it includes all of those patches. I had some trouble with that kernel on my last laptop, but this time everything worked wonderfully.

Since I've already spent some time with Elementary, I know which applications I like and which I don't. To be honest, despite the amazing effort put out by the Elementary team, I find some of the default applications to be lacking. In particular, I have a helluva time with Scratch and Midori. Both suffer from random crashes, though Scratch is _far_ worse. On top of that, I have never been able to get Flash to work with Midori. To that end, I also installed Firefox and Sublime Text 2. My personal preference for Firefox is to run Aurora, which you can get by adding the [Ubuntu Mozilla Daily PPA](https://launchpad.net/~ubuntu-mozilla-daily/+archive/firefox-aurora) and then installing. Sublime can be added using [this script](https://gist.github.com/sayak-sarkar/5810101). I should also mention that after installing Firefox, the steps from install Flash listed on Elementary Update work like a charm...for Firefox; Midori still won't run Flash.

Lastly, I have a bunch of dev stuff that I like to install. Realistically, I should set up an environment using Docker, but this will do for the time being. As final step, I installed:
-	NodeJS
-	Haskell
-	Ruby
-	Jekyll
-	SASS
-	Yeoman

With that, the machine was up and running and in a state that I'm quite happy with.

##Final Thoughts
After a whopping 1 day of use, I can say I'm quite please with the Dell XPS 13. Obviously, the big selling point on this machine is the screen and it really is quite good. It's the first IPS display I've used, and I don't see how I could buy anything with a TN panel again. It reminds me of how I felt after I switched to an SSD in my old machine. Speaking of SSDs, the combination of i7, 8GB of RAM and an SSD make this machine insanely fast. Boot is a matter of seconds and resume is immediate.

ElementaryOS works great on the XPS 13. In my opinion, Elementary has the best looking, most polished, most uniform desktop environment in the Linux landscape, and at 160ish DPI, I can say that it looks absolutely beautiful. The only downside of having a screen of this resolution at 13" is that text is a bit small, but I'm still young and my eyes are still good so whatevs.

Really, the only downside of the setup is the fan. It runs when you might expect (went insane when I compiled Ruby), but nothing terrible and not any louder than my previous machine. It does, however, sound a little wobbly (which might be why it was returned). Perhaps the best way to describe it is akin to when you put playing cards in the spokes of your bike because you thought it sounded like a Harley or something. It's not that extreme, and the volume is actually quite faint. It's also not constant. I never really know when to expect it. For example, when the fan went full speed compiling Ruby, it was just normal fan whirling. Any way, I bought a refurb for a budgetary reasons, so I know that some sacrifices have to be made. If heat or noise start going up, or performance tanks, I'm sending it back. I gots work to do afterall.

All in all I'm happy with the XPS 13 and thrilled that Elementary works so well with so little effort. I highly recommend both. 

Oh, yeah, and here are some [screenshots](http://imgur.com/a/9LuRZ) as requested on Twitter
