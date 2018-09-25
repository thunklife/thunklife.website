---
title: Lost in the Land of Linux
---
A while back, influenced by my declining opinion of Windows 8, my increased desire to learn new languages, and my inability to afford a Mac, I decided to make the switch to Linux. I started with 30 day trial with Ubuntu 12.10 installed side-by-side with Windows but with the caveat that I would not boot into Windows. I usually like to immerse myself in things when learning something new, and that was my goal here. I could have just gone back to Windows 7, but that wasn't the point. For what I wanted to do, Windows provided just enough friction to be a catalyst. Plus, you should try completely new things every so often; throw away everything you know and try something hard.

If I went a month before backing up my files, paving my SSD and installing Ubuntu as my only OS, I would be surprised.

## I'm Sold

I was sold on Linux. Honestly, I knew very little about the inner workings of Windows, and I know even less about Linux, so being sold on it was not because I knew it to be technically superior. No, it was much simpler than that. Linux opened my eyes to a whole new way of working. No Visual Studio, no .NET, just text editor and a package manager. Run a couple of commands in the terminal and go. Sure, I could have done similar stuff in Windows, but that's not the .NET way. Programming in .NET is largely prescribed to you. There are great projects out there with a larger world view, but, for the most part, if you in .NET you're probably doing it the Microsoft way.

Aside from the development stuff, Linux gave me choice. Don't like this [Unity](http://unity.ubuntu.com/)? Get [KDE](http://kde.org/), or [XFCE](http://www.xfce.org/), or [Gnome](http://www.gnome.org/gnome-3/), or whatever. It was sort of mind blowing, as embarrassing as that is to say.

## Adrift in a Sea of Choice

Once I realized that I had such a glut of choices in front of me, I started to wonder what I was thinking when I signed on for the first one I found. I went with Ubuntu originally because what the hell other distro did I know about? But now I knew there was more out there, and I knew how easy they were to get and try and install. So I did.

I started with [CrunchBang](http://crunchbang.org) for no other reason than I saw it mentioned in a tweet by [Steve Klabnik](https://twitter.com/steveklabnik). That's it. It was serentipidous really. I loved CrunchBang. It's fast, light-weight and uses almost no resources. Most importantly, it wasn't like anything I had ever used before. Ubuntu was very much like I was used to, I didn't have to learn much in order to get things done. CrunchBang was going to be hard, so I ran with it.

After a few months in CrunchBang I learned about KDE and it looked pretty nice. Now, it's possible to get KDE on CrunchBang, and I did for a few days, but it kind of goes against what CrunchBang is all about. CrunchBang is just [Debian](http://www.debian.org/) underneath, so what you want is Debian with KDE...not CrunchBang.

Instead of going straight to Debian, I took the opportunity to look into other distros first. I had heard that [Arch](https://www.archlinux.org/) was amazing, and offered you basically a blank slate. While that sounded daunting, I figured it could be good learning experience.

I never made it past the install process. Seriously.

Arch may be amazing, but I had an insanely difficult time with it, which basically means it lives up to its "not for newbies" reputation. I mean, I gave it the old college try, but after 3 days and getting an infinite reboot loop (twice), I called it a day. _Side Note: Am I the only one that thinks there are some major differences between the official Arch [install guide](https://wiki.archlinux.org/index.php/Official_Arch_Linux_Install_Guide) and the [Beginners Guide](https://wiki.archlinux.org/index.php/Beginners%27_Guide)?_

I was still pretty bent on getting on Arch somehow, so I looked into [Manjaro](http://manjaro.org/) and [Chakra](http://chakra-project.org/). Manjaro is closer to Arch that Chakra, but ultimately they are both Arch underneath. On top of that, Chakra is Arch + KDE. Alas, it was not meant to be. Spending time with KDE kind of soured it for me for whatever reason and I pressed on.

Not content to go back to CrunchBang just yet, I went with Debian next. The install process was simple, and it came running Gnome 3.X which I had never played with before (though I had seen screenshots). I was kind of excited to be running Gnome. Again, a project that decided to do something different and was going for it; I can always appreciate that.

Debian worked great for a couple of weeks but it kept telling me that my hardware couldn't support the "full" Gnome experience, which was nonsense. On top of that, I had to wipe my drive and start from scratch more than once because I screwed something up in an upgrade or attempted fix for the wifi. But the lack of a good Gnome experience was kind of a deal breaker for me, so I set out to find a distro with Gnome.

I found [Fedora](https://fedoraproject.org/) and was sold on it. Gnome 3.8 worked like a charm; actually, everything worked like a charm. I might have had one issue with my crummy wifi adapter but that's par for the course. Right out of the box, things were good.

I had no idea that Fedora was a bit more on the edge than Debian or [OpenSUSE](http://www.opensuse.org) or Ubuntu. Not long after the install there were some OS updates available. Part of the update was a new kernel that completely regressed support for my wifi adapter; Arch users reported the same issues with the same kernel version. Not the worst thing that could happen considering that Grub allowed me to boot into Fedora using the previous kernel, but that can get a little annoying. Still I was enjoying Fedora and I set out to just remove the bogus entries from Grub and be on my way.

## Elementary my dear Watson

When I first found Fedora I tweeted about how cool I thought it was and how much I liked Gnome. In a reply, someone mentioned [elementary OS](http://elementaryos.org/) but I never looked into it. To be honest, they described it as looking a lot like OSX and I was totally turned off. Plus, it was Ubuntu 12.04 based and in case you hadn't noticed, I was avoiding Ubuntu based distros.

A few weeks later [Aral Balkan](https://twitter.com/aral) tweeted about elementary OS and his is an opinion I quite respect (no offense to the person who tweeted me previously). I did some research before getting going with elementary. Watched some reviews (read a few too), and found that team behind the OS had a very specific and experience driven goal for the OS, and they were uncompromising in it. As a bonus, the OS was beautiful and reportedly very fast. My curiousity was piqued, so I loaded up a live CD (USB) and took it for a test drive.

I was quite impressed. elementary was one of the snappiest distros I had used, including CrunchBang; which is pretty impressive when you consider the extreme minimalist nature of the CrunchBang desktop. The default applications had a uniform look and experience and everything was gorgeous.

I've been on elementary ever since (not long I admit, but still).

## Notes for the Curious

If you're curious about elementary, I highly recommend you give it a go; I don't think you'll be disappointed. Still, for as wonderful as it is, there are some warts. Personally, I put up with them because the rest of the experience is exactly what I was looking for when I stopped using CrunchBang.

When I started using elementary, I wanted the full effect of the work the team had done, so I made a decision only run the default programs. Unfortunately, some of them are plagued by random crashes, or worse.

### Midori
The default browser, Midori, is a fine WebKit browser, but there are few available add-ons and I have a few that I like to run in FireFox. You can get AdBlock Plus, which is nice enough. However, I like to run AdBlock Edge which isn't available. I also run HTTPS-Everywhere, Disconnect, and a few others that just aren't available.

Still, I worked with Midori for week straight. All together it was OK, but crashy at times, and with no alerts to report a problem back to the team. However, if you looking for a simple WebKit browser with the elementary experience, Midori will do just fine.

### Scratch
The default text editor, Scratch, makes me cry a little. I want it to be good, and it's so close for my current needs. It's nothing fancy, but it's got a few key features that I love: folder browsing pane, web preview for HTML, terminal access, spell check, auto-complete of common words, bracket completion and a few others. Each is available as an add-on in the preferences and that's where the first problem is: that's seems to be the only way enable/disable each add-on. Web Preview is cool when I'm working in HTML but I'd like to be able to turn it off and on with a simple keystroke.

Scratch too is plagued by random crashes and other bugs (that or I keep hitting a magic "close" key stroke). The crashes are annoying because you can go hours without a crash, or you can get crash after crash after crash with no way of knowing what the hell is going on.

Worse than the crashes is when the key feature of Scratch, auto-save, fails. Scratch watches your file and saves it without you having to worry about it. That's awesome, but it totally sucks if you worked on something for an hour, experienced ZERO CRASHES, and still lost all of you work, which happened while I was writing this post. Auto-save is configurable, so you can just turn it off, which is nice. What is not so nice is that you lose the Save button when it's on, so you are completely reliant on Scratch working. Easy fix though, turn it off or use you editor of choice.

### Beware the Updated Kernel

Probably the biggest pain I've had with elementary stems from the fact that it's running Ubuntu 12.04 LTS. That's old, son. Ubuntu is on 13.10 already and elementary was only officially released in August. You can upgrade to the 13.04 kernel, so of course I did. That was a damn mistake, one that I tried correct and then remade 3 or 4 times. Basically, my machine + elementary + 13.04 = non-working laptop. So I have to stay on the 12.04 version that elementary is based on, which is kind of a bummer, but I like elementary enough to let it slide.

### Not All Bad

It might sound like I'm harping on the bad, but I don't mean to. Aside from being beautiful, there are some very good core concepts at work here. For example, by default, there is no minimize button on a window. That might seem strange to some, and you can turn it back on it you like, but it was done with purpose. The vision for applications in elementary is that they are stateful, so closing is no different than minimzing. If you close the music app, it continues to play, giving you controls in your tray, and opening the application again takes you right where you would expect to be. Now, this falls apart with apps not developed specifically for elementary, but I honestly haven't had any issues with it.

Another wonderful thing is consistency. Now, this is Linux so you can do whatever the hell you want and install any ugly piece of software your heart desires, but the core of elementary is consistent. All the default apps have the same icon/menu placements; the same experience. It's very refreshing.

One of the best things about elementary I found is [Elementary Update](http://elementaryupdates.com). It's not an official elementary site, but it's got some decent resources and suggestions of things to download. The [Top Things to do After Installing...](http://www.elementaryupdate.com/2013/08/top-things-to-do-after-installing-luna.html) is especially helpful.

## Wrap Up

Linux has completely changed my outlook on how I use my computer, and how I develop software. A lot has come to light since I decided to switch that has made me reconsider every service and device I use, and I doubt that I would have put much thought into any of it if Linux hadn't opened my eyes to a different way of computing...but more on that in another post.

If you've never used Linux, I highly recommend you try a distro. Start with Ubuntu if you must, but I implore you to look beyond that. Check out elementary, you won't be sorry. If you're not keen on it, take a look at [Mint](http://linuxmint.com/); I personally never tried it, but it looks wonderful and is highly recommended for those new to Linux and not brave enough to step into the deep end. It is unbelievably easy to download an ISO, make a bootable USB, and play around before you install, and if you do go with Ubuntu you can just side-by-side install it on Windows! So do it, you know you don't like Windows 8 anyway, not _really_.

