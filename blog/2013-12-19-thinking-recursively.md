---
title: Thinking Recursively
---
I thought I would take a break from my series on node, npm and browserify to talk about an a-ha moment I had this week regarding recursion.

I've been slowly going through [Learn You a Haskell for Great Good](http://learnyouahaskell.com/). I thought learning Haskell would be a mind expanding experience, even if I never do anything "real" with the language itself. So far I haven't been disappointed; I highly recommend it. The point is, this week I read through the chapter on recursion and it made a concept that I thought I understood so much more clear that I could scarcely believe it.

##A Programmer Had a Problem...

>A programmer had a problem; he decided to solve it with recursion. Now he ha <pre style="color: #bf616a">[maximum stack size exceeded]</pre>

My friend and I have a bit of an inside joke at work. I tell him I just wrote a recursive function, and ask what the odds are that it'll overflow the stack. He asks if it's my first time running it. If the answer is yes, the odds are 100%. 

He's almost always right.

Up until now, what I understood about recursion was this: a function calls itself until it returns a result. To be honest that really is all it is, but if you only think of it that way, a function calling itself over and over, you may be missing some important points in the problem solving process.

For me, the thing that did it was this bit from "Learn You a Haskell..."

>[Break] down the problem into smaller problems of the same kind&#8230; Eventually we reach the _base case_ (or base cases) of the problem, which can't be broken down any more or whose solutions need to be explicity (non-recursively) defined&#8230;

See, the reason I frequently exceeded the stack size was that I wasn't approaching the problem correctly. I kind of knew when a function should recurse, but wasn't starting at the base case and working up. Since starting to do so, my stack overflows have decreased quite a bit.

I think the process is best illustrated with an example. The canonical example of recursion is calculating Fibonacci numbers, but the exercise that really drove it home was implementing a ```maximum``` function.

##maximum
Reading about recursion in Haskell is one thing, implementing it is quite another. The book provides Haskell solutions, so I thought it would be a lark to implement them in JavaScript. What better way to show understanding of the concept?

The first function I wrote was ```maximum```. This function takes an array and returns the maximum value in the list. For simplicity sake, we'll assume we're always getting numbers.

We start by establishing out base case. Obviously, if we are passed an empty array, there is nothing to return; and if we get an array with only a single item, we get that value back. That's easy enough to define

~~~ javascript
function maximum(arr){
	if(!arr.length) throw 'No Dice!';
	if(arr.length === 1) return arr[0];
}
~~~

So what if we have an array with more numbers? Well, we can pull the head off of the array, and compare it to the largest value in the tail; we can use ```Math.max``` for that comparison.

~~~ javascript
function maximum(arr){
	var head;
	if(!arr.length) throw 'No Dice!';
	if(arr.length === 1) return arr[0];
	head = arr.pop();
	return Math.max(head, maximum(arr));
}
~~~

Now to actually use it.
~~~ javascript
maximum([2,5,1]); //=>5
~~~

Still unclear? I was a little too. However, things become very clear if we expand this function and see what it is really doing.

~~~ javascript
maximum([2,5,1]) = 
	Math.max(2,(maximum([5,1]) = 
		Math.max(5, (maximum([1]) =1 ))
	));
~~~

When we call ```maximum([2,5,1])``` we compare 2 with the result of calling ```maximum([5,1])```. Calling ```maximum([5,1])``` means we compare 5 with the result of ```maximum([1])```. That, ```maximum([1])```, meets one of our base cases and returns 1. Then we work our way back up the stack. We compare 5 to 1, the result is 5 and we move up the stack again. Lastly, we compare 2 to 5, and return 5.

##Wrap Up
```maximum``` is pretty simple example, but the idea is the same: break your problem down to smaller similar problems, determine your base cases, and work back up from there. When in doubt, map it out. I can't overstate how useful expanding out a recursive function is.

##Post Script
You might have noticed that ```maximum``` is a destructive function. The fact that we call ```arr.pop``` to get the head means we mutating the array. In Functional Programming, that's a big no-no; our function shouldn't have side effects, and destroying the original array is a pretty big one in my book. 

~~~ javascript
var nums = [2,5,1];
maximum(nums); //=> 5
nums; //=> [2] O NOES!!!
~~~

There are a couple of things we could do to avoid this. Below is the first path I took.

~~~ javascript
function maximum(arr){
	var head;
	arr = arr.slice(); //shallow copy the source.
	if(!arr.length) throw 'No Dice!';
	if(arr.length === 1) return arr[0];
	head = arr.pop();
	return Math.max(head, maximum(arr));
}
~~~

That works, but you might have noticed that we're allocating a new array with each iteration. I have a lot to learn about JavaScript perf and GC, so I don't know how big of deal that really is, but my gut doesn't like it. 

To get around that, we can just introduce another function that takes the place of our original function; I'm just going to nest it here.

~~~ javascript
function maximum(arr){
	return _maximum(arr.slice());
	function _maximum (arr){
		var head;
		if(!arr.length) throw 'No Dice!';
		if(arr.length === 1) return arr[0];
		head = arr.pop();
		return Math.max(head, _maximum(arr));
    }
}
~~~

~~~ javascript
var nums = [2,5,1];
maximum(nums); //=> 5
nums; //=> [2,5,1] HUZZAH!!!
~~~
