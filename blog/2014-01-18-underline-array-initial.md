---
title: Underline - Array Initial
---
_Underline is a reimplementation of Underscore using currying and recursion. It's an educational experiment. This is the third post in the series._

I trust you know the back-story of this project; if not, [go check it out](underline-introduction.html).

In my last post I reimplemented <code>first</code> two ways. First using recursion, which I wouldn't recommend. Second, using JavaScript's native <code>Array.prototype.slice</code> method. This time around I'm going to look at <code>initial</code>. I quite liked showing different ways to implement <code>first</code> so I think I'm going to stick with it.

##Initial
From the Underscore docs:

<blockquote>
	<p><b>_.initial(array, [n])</b></p>
	<p>Returns the first element of an array. Passing n will return the first n elements of the array.</p>
</blockquote>

So <code>initial</code> takes an array and, optionally, a number of items to exclude, and returns a copy of the original with n items removed from the end.

Now for some level-setting

{% highlight javascript %}
var arr = [1,2,3,4,5];
_.initial(); //=> exception
_.initial([]); //=> []
_.initial(arr); //=> [1,2,3,4]
_.initial(arr, 3); //=> [1,2]
_.initial(arr, 10); //=> []
{% endhighlight %}

Simple enough. It's essentially the same base cases as <code>first</code> but reversed. As with <code>first</code> I'm not going to support the optional last argument, and I also want to avoid that exception and just return undefined.

##The Solutions
Now to the good stuff.

###The Recursive Way

{% highlight javascript linenos %}
//fn-curry is the curry module from my intro post. 
//I've since published it on npm under the name fn-curry
var curry = require('fn-curry'),
	concat = Array.prototype.concat;

module.exports = curry(function initial(n,arr){
	return _initial(n, arr.slice());

	function _initial(n, arr){
		if(arr.length <= n) return [];
		var head = arr.shift();
		return concat.call([], head, _initial(n,arr));
	}
});
{% endhighlight %}

This works in much the same way that the recursive solution for <code>first</code>. The difference is instead of decrementing <code>n</code> I'm comparing it to the length of the remaining array.

Again, all of the work is delegated to another function and a copy of the original array is passed in to avoid destroying it. After it is determined that the array exists, its length is compared to the exclusion length; this is the base case for the recursion. If the length is <code>n</code> is greather than or equal to the length, exclude everything, an empty array is returned. Otherwise, the head is taken off of the array and concatenated with the result of calling the function again. 

Eventually, the length of the remaining array and <code>n</code> will be equal, returning an empty array. Then the calls will begin bubbling up, adding each element to the new array.

Using the level-setting test from before, you can see the results are the same.

{% highlight javascript %}
var initial
var arr = [1,2,3,4,5];
initial(); //=> exception
initial(1,[]); //=> []
initial(1, arr); //=> [1,2,3,4]
initial(3, arr); //=> [1,2]
initial(10, arr); //=> []
{% endhighlight %}

###The Sane Way
The recursive version works, but it's really only valuable as a learning device. A more sane way to get the same result would be:
{% highlight javascript linenos %}
var curry = require('fn-curry'),

module.exports = curry(function initial(n,arr){
	return arr.slice(0, arr.length-n)
});
{% endhighlight %}

Makes the recursive example look silly, right? Especially when your consider that the recursive version already used <code>slice</code> to copy the array; all I really needed to do was pass a second argument.

##The Underscore Way
Now to look at how it's actually written in Underscore:

{% highlight javascript linenos %}
_.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };
 {% endhighlight %}

 OK, so not too different. Again there is that extra <code>guard</code> argument, which is used with <code>map</code>. The main difference is the extra work being done to set the last argument being passed to <code>slice</code>. My choice to make <code>n</code> required means I avoid that check.

##A Detour

You might have noticed that <code>initial</code> and <code>first</code> do pretty similar things. Sure, <code>first</code> has some extra stuff it has to do because it can return a single value or an array of values, but at the bottom they both slice the source array into a new array of a given length.

You might have also noticed that I do zero guarding in these functions. You could pass <code>null</code> or <code>undefined</code> and it would try to execute. It would fail, of course, so shouldn't we be ensuring the arguments are, at least, something (if you consider that <code>null</code> and <code>undefined</code> are really nothing)? Don't you also think the guarding to be done would be similiar, if not identical, between these to functions?

This is where I take a detour, or will in my next post anyway. I want to look at functions as units of abstraction. Personally, when I think of abstracting a concept I instinctively move toward objects; however, since functions are first-class citizens in JavaScript, you can look at abstracting functionality without the need for contrieved wrapping classes (which is common in most OO projects I've worked on).

Until next time.