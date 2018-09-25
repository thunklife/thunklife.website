---
title: Underline - An Introduction
---
For the uninitiated, [Underscore](http://underscorejs.org) is a utility library for JavaScript. It's full of useful functions for working with Arrays, Objects, Collections, etc. It's the number one depended upon package on [npm](https://npmjs.org/browse/depended); by a lot. Chances are, your favorit framework depends on it at some level. I personally use it every single day and I find it to be an invaluable resource.

My point is this: there is a ton of good stuff in there and, much like diving into the [jQuery](http://www.paulirish.com/2010/10-things-i-learned-from-the-jquery-source/) [source](http://www.paulirish.com/2011/11-more-things-i-learned-from-the-jquery-source/), you're bound to learn a lot from it. But you know how you might learn even more? Implementing it, which [Eno Compton](https://twitter.com/username_eno) [suggested](https://twitter.com/username_eno/status/413764143175331840) on twitter awhile back. 

A lot of the Haskell exercises I'd been doing in JavaScript had started me on this path, so I've decided to go full force and implement one function every other day, and blog about it; maybe more if time permits.

##The Rules
Now, if you read my response to Eno, you saw that I suggested re-implementing with inverted arguments, currying, and no loops. Why? Because challenges, that's why. Will this be the best re-implementation of Underscore? Doubtful. Will it be super performant? Unlikely. Will I learn from it? Hell yes, and that's the point. Creativity is born from constraints. Having to fit into a perscribed box forces you to think creatively, to explore weird solutions, and in programming, to really learn the language; think about the crazy stuff that comes out of the 1K competitions.

I didn't just give myself 3 constraints though. Oh no. I have more!

###No Peeking
I'd be cheating myself if I just went and looked at how it's already done. Oh sure, I'd pick something up, but it's all conceptual. I need to do in order to really learn. Of course, I have to give myself requirements, right? So looking at the docs is fine; running tests to see what the function does with various inputs is also fine.

###Flip Arguments
I said I use Underscore every day, so I have so beef with it. My biggest beef with Underscore is that it puts the data first. You can't compose functions when you have to deal with data first. Flip the arguments, and you're on your way to real composable functions, but you need a little more (see my next rule).

_A note: A number of Underscore's methods provide for optional arguments at the end, something I'm willing to sacrifice for this experiment._

###Curry All The Things
Every function should be curried. When you curry a function, you allow for it's arguments to be supplied one-by-one or all at once too. If a function takes 3 arguments, and you supply only 1, the result is another function; which can take one or more arguments. That first argument is hanging around waiting for the rest; the resulting function is partially applied (it only has part of it's arguments).

By allowing functions to be partially applied, sitting there waiting for their data, you can compose them; creating newer more powerful functions.

###No Loops
Loops are fast. Faster than native iterative methods like <code>Array.prototype.forEach</code>. Certainly faster than recursion, and recursion in JavaScript has that pesky stack to deal with. But remember this is an educational experiment, so I'm not going to worry about performance optimizations. Plus, loops are frowned on in FP.

###Each Function is a Module
Another beef I have with Underscore is it's lack of modularity. I can't just require <code>map</code>, for example; I have to take the whole thing. [Other alternative](http://lodash.com/) libraries have custom builds, which is great. My preference is small modules that I can <code>require</code> and compose as I see fit. So I'm going to do each function as a node module. 

Having each function be a module means I can require bits and pieces as I see fit, without having to bring in an entire library. Of course, sometimes you want a whole library, so I'll have a module for that too.

Another benefit of this is each module has it's own repo. That means it's own README.md and it's own tests. I find it far easier to reason about something when it is self contained and as minimal as possile.

In order to achieve this I'm going organize my modules by 'category', similarly to how the Underscore docs are outlined. It looks like this:
{% highlight bash %}
Projects/under-line/
├── array
│   └── first
│       ├── index.js
│       ├── node_modules
│       ├── package.json
│       └── test
│           └── index.js
├── lib
│   └── curry
│       ├── index.js
│       └── package.json
└── npm-debug.log
{% endhighlight %}

##One Last Thing
The currying requirement adds a bit of a wrench into things. Languages like Haskell curry by default; JavaScript does not. One  option would be to write each function in a style that checks the arguments passed and either returns a function to get the remainder, or returns the result; like so:

{% highlight javascript linenos %}
function add(a,b){
	if(a && b) return a + b;
	return function (b){
		return a + b;
	}
}
{% endhighlight %}

Ignoring the obvious issues with the code above, would you really want to write all of that over and over again? I don't; so I wrote this <code>curry</code> module instead:

{% highlight javascript linenos%}
module.exports = function(fn, fnLength) {
	var slice = Array.prototype.slice;
	
	fnLength = fnLength || fn.length;

	return function makeCurry (){
		var args = slice.call(arguments);
		if(args.length === fnLength) return fn.apply(this, args);
		return function(){
			var newArgs = slice.call(arguments);
			return makeCurry.apply(this, args.concat(newArgs));
		}
	}
}
{% endhighlight %}

That <code>curry</code> function is the result of stuff I gleened from reading [JavaScript Allonge](http://leanpub.com/javascript-allonge) and from working through the Functional Programming exercises from [node school](http://nodeschool.io). It doesn't look strange to me any more, but it certainly would have a few months ago.

<code>curry</code> takes a function, finds the number of arguments, and recursively returns functions until all arguments are accounted for. Once all arguments are present and accounted for, we call the original function and supply the arguments. Optionally, you can pass in the number of arguments to curry; which is handy if you want to curry variadic functions (those which take a varying number of arguments). With this in the toolbelt, I can write functions like I normally would and wrap them in a call to <code>curry</code>.

{% highlight javascript linenos%}
var curry = require('curry');

module.exports = curry(add);

function add (a,b){
	return a + b;
}
{% endhighlight %}

Sure, I could have installed some module off of npm, but I wanted to learn!

##Until Next Time
I've decided to start with the Array category of functions. I'm most comfortable there so I think it's a good way to test the waters. I actually already wrote the <code>first</code> [module](underline-array-first.html); hop on over and see what I came up with.


 
