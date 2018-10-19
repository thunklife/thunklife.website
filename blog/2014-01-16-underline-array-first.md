---
title: Underline - Array First
---
_Underline is a reimplementation of Underscore using currying and recursion. It's an educational experiment. This is the second post in the series._

I trust you know the back-story of this project; if not, [go check it out](underline-introduction.html).

It seems fitting that the first function I'm going to look at re-implementing is ```first```, also known as ```head``` and ```take```.

##First
From the Underscore docs:

>  _.first(array, [n]) Alias: head, take
>
>  Returns the first element of an array. Passing n will return the first n elements of the array.

So ```first``` takes an array, and optionally a number of elements to take from the front. If no number is provided, it takes a single element.

For good measure, here are a few examples:

~~~ javascript
var arr = [1,2,3,4,5];
_.first([]); //=> undefined
_.first(arr); //=> 1
_.first(arr, 3); //=> [1,2,3]
_.first(arr, 10); //=> [1,2,3,4,5]
~~~

That should be enough to figure out the base cases.

If you call ```first``` with an empty array, you get ```undefined``` back. The next case is one I'm not going to support because flipping the arguments means you have to supply the number of elements to take. The last base case is an array with a single item. In that case, you get that item.

##The Solution(s)
So here is what I came up with:

~~~ javascript
var curry = require('curry'),
	concat = Array.prototype.concat;

module.exports = curry(function first(n,arr){
	if(!arr.length) return void 0;
	if(arr.length === 1) return arr[0];

	return take(n, arr.slice(0));
});

function take(n,arr){
	var head;
	if(n <= 0 || !arr.length) return [];
	head = arr.shift();

	return concat.call([],head, take(--n, arr));
}
~~~

The code above checks the base cases defined above and then returns the appropriate value. The interesting part comes when neither case is matched. The ```take``` function is where all the recursion happens. It's been removed into a separate function because the base cases no longer have to be evaluated. ```take``` is called with a copy of the original array, using ```slice```, to ensure the original array remains intact.

Inside ```take``` there is a new base case. This case returns an empty array; this is how the array to return is built. If the case isn't met, the first element from the array is removed, and concatenated with the result of recursively calling ```take```. Eventually, the base case will get hit, and the calls will start bubbling up, adding each element to the array in turn.

If you run the same cases as before, the results are the same (with the exception of the optional argument).

This is, of course, the wrong solution.

See the problem with constraints is that sometimes they're all you see. If you say, 'no loops,' suddenly everything looks like it needs recursion. This is the better solution:

~~~ javascript
var curry = require('curry');

module.exports = curry(function first(n,arr){
	if(!arr.length) return void 0;
	if(arr.length === 1) return arr[0];

	return arr.slice(0, n);
});
~~~

Much cleaner, and easier to understand. Sure there are going to be instances where recursion is needed, but not when you have things like ```splice``` available to you. Still, it's an interesting detour to take; to implement as if native functions didn't exist, but we needn't throw the baby out with the bath water because we can't do loops.

In both solutions, currying the function gives you the benefit of being able to partially apply the function, so you can do stuff like this:

~~~ javascript
var first = require('first'),
	first5 = first(5);

first5([1,2,3,4,5,6,7,8]); //=> [1,2,3,4,5]
~~~

I admit that doesn't look like much here, but it comes in very handy when you want to compose functions later on.

##The Underscore Version
Now to compare the code above with what Underscore _actuall_ does.

~~~ javascript
_.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };
~~~

Interesting. The implementation adds an argument that the documentation doesn't list. According to the [annotated source](http://underscorejs.org/docs/underscore.html#section-41):

> The guard check allows it to work with ```_.map```.

Now, I haven't looked into ```map``` yet, but it seems clear that ```guard``` is roughly equivilant to my check for arrays with a length of 1...and least for my immediate purposes.

The first difference I notice in the implementation is that I neglected to guard against ```n``` not being a value; which seems a silly mistake on my part, but easy enough to fix. Of course, I could just let uses suffer the exceptions they rightfully deserve if they don't use the function correctly, but that's probably a bad idea.

Another difference is the use of ```Array#slice``` in my code, rather than a the ```slice``` function used in the Underscore code. My guess is that the library stores ```Array#slice``` in a variable to keep things terse and to ensure browser compatability; something I purposely left out for these exercises, though a later challenge would be to get the same level of compatability as Underscore.

Lastly, there is the use of the ternary operator. Honestly, I don't know why I didn't do that. Just silly.


##Next Time
In my text post I'll be taking on ```initial```. It's similar to ```first``` in that it takes items from the front of the array, but differs in that it allows you to specify the number of elements from the end to exclude.
