---
title: Learn λ Calculus With Me - Numbers
---
_For 2014 I decided to dedicate my free time to learning Functional Programming.
One of the key things I wanted to grasp was λ Calculus, so I'm currently working
through [An Introduction to Functional Programming through Lambda Calculus](http://www.amazon.com/gp/product/0486478831).
As an exercise I'm taking concepts from each chapter and implementing them in
JavaScript. You can check out the project on
[GitHub](https://github.com/wilhelmson/lambdajs); I'll be updating it as I
complete each chapter._

_Caveat The First: I don't have the best track record with series posts. I get
a couple in and fizzle. That could very well happen here._

_Caveat The Second: I'm still learning this, and certain aspects are still a
little foggy for me, especially beta, alpha and eta reductions. My goal with
these posts is to share what I've learned, and I may have some stuff wrong. One
of my hopes is to grow in my understanding by putting this out_

##Intro
In my [last post](/blog/learn-lambda-with-me-pt2.html) I showed how pairs and
selector functions like ```first``` and ```second``` can be used to model
Boolean values, and conditional expressions. In this post, I'll look at how
pairs can be used to model natural numbers.

##What Even Is A Number
First, it's important to note that we're going to model _natural_ numbers;
non-negative integers. Natural numbers are quite simple to think of abstractly:
a number *n* represents *n* successions from zero.

So, assuming we have a way to model zero, we could represent numbers like so.

{% highlight javascript linenos %}
var one = succ(zero);
var two = succ(one); //=> Or succ(succ(zero));
{% endhighlight %}

Now that we have an abstract notion of natural numbers, how do we define ```zero```?
As it turns out, we can use the **identity** function to represent zero. As a
quick refresher, **identity** looks like this: ```λx.x```.

In JavaScript we could do this:

{% highlight javascript linenos %}
var zero = function(x){
   return x;
};
{% endhighlight %}

But, the **identity** function is already defined. Still, it would be helpful
to actually use **zero** in our number functions. I won't bother showing the
aliasing code here, just know that when you see **zero** in a function, it's
the same as the **identity** function.

If you're curious why **identity** is used to represent **zero**, be patient.
All will be revealed in time.

###Succ
Now that the concept of **zero** is set, we'll need to define a function that
represents succession.

To arrive at an arbitrary number _n_ we need _n_ successions from **zero**.
In order to model that, we can pair a successor with it's predecessor. Creating
such a pair allows you to create nested pairs. As a we'll see later, it also
allows for a simple way to create a predecessor function.

Luckily, we already have a pair function, and it looks like this: ```λx.λy.λf.((f x) y)```.

As a quick refresher, this function takes two values (```x``` and ```y```) and
then a function to select one. Now, our **succ** function isn't _exactly_ the
same as **pair**; it's actually a partially applied version of **pair**.
Specifically, the ```x``` argument is set as ```untruth``` (aka ```second```).
We'll see why in just a moment. So after all that, we define **succ** as:
```λy.λf.((f untruth) y)```.

We can apply **succ** to **zero** to arrive at a representation of the number one:
```(λy.λf.((f untruth) y) zero)```. We can reduce that to: ```λf((f untruth) zero)```.
You can follow that as far down the rabbit hole as you like, nesting pairs all the way down.

So what does this look like in JavaScript? Well, this is one implementation:

{% highlight javascript linenos %}
var succ = function (n){
    return pair(untruth)(n);
};
{% endhighlight %}

Now, I'm fairly certain that this could be simplified to ```var succ = pair(untruth);```
because λ functions are curried functions. So even though **pair** needs three
arguments in total, it accepts them one at a time, returning a new function each
time. So ```var succ = pair(untruth)``` returns a function awaiting its second
argument which could be ```n```. The longer version is clearer for this example.
Plus I haven't tested the shorter version; so there's that.

###IsZero
I mentioned earlier that the reason for using **untruth** as the first item
in our pair would make sense later. Well, it's later. Using **untruth** allows
us to create a simple function to test if an arbitrary number is zero. Given that
a number is a pair awaiting a selector function, and we want to know if a number
is zero, can you guess which function is used to model **isZero**?

If you guessed **first**, you're correct! You'll recall that **first** takes
two arguments and returns the first one. So given this representation of the
number one: ```λf.((f untruth) zero)```, we can apply **first** to it like so:
```(λf.((f untruth) zero) first)```. If we substitute the arguments we get:

```(first untruth) zero)```. So the result of **isZero** for the number one
is, as you would expect, false.

What about when we get to zero? Interesting question. You'll recall that **zero**
is actually just the **identity** function, and that **identity** just
returns whatever value you pass it. You may also recall that **first** was
used to represent **truth** just as **second** was used to represent **untruth**
when we covered Booleans. Passing **first**, aka **truth** to **zero**,
aka **identity**, means you get **truth** back.

Suddenly the use of **untruth** for the first item in the list, and
**identity** to represent **zero** makes total sense, right? Right.

The **isZero** function looks like this: ```λn.(n first)```.

The JavaScript version isn't too different, as it turns out:

{% highlight javascript linenos %}
var isZero = function(n){
    return n(first);
};
{% endhighlight %}

###Pred
Now that we've got a way to build up successions of numbers, and a mechanism for
telling if an arbitrary number is zero, we have a way to determine the predecessor
of an arbitrary number.

Given how numbers are represented, it seems logical that we would simply use
**second** to select a predecessor; like so: ```λn.(n second)```. This is, after all
the same thing as **isZero** except using **second**. If you subsitute ```n```
for ```λf.((f untruth) zero)``` (the representation of one), you will get zero
back. Zero is the predecessor of one, so clearly this works. But what happens if we try
to get the predecessor of zero? We'll get **second**, aka **untruth** back.
Unfortunately, **untruth** isn't a representation of a number.

Ideally, given a number _n_, if _n_ is zero we should get zero back; otherwise,
we should get the predecessor of _n_. Luckily, we already have a function for
conditions such as this: **cond**. Using **cond**, and the naive predecessor
funciton above (which I'll call **pred1**), we can define **pred** as: ```λn.(((cond zero) (pred1 n)) (isZero n))```.

This function takes an argument ```n```, checks if it is zero, and returns either
zero or the predecessor of ```n```.

Let's expand and simplify a bit, shall we?

By expanding **cond**, we get an expression body that looks like this: ```(((λx.λy.λz((z x) y) zero) (pred1 n)) (isZero n))```

```x``` is replaced with ```zero```, ```y``` is replaced with ```(pred1 n)```
and ```z``` is replaced with ```(isZero n)```. The result of this is: ```(((isZero n) zero) (pred1 n))```.

But wait, there's more.

If I expand ```pred1``` the result is ```(((isZero n) zero) λn.(n second) n)```.
That expression can be simplified to ```(((isZero n) zero) (n second))```. With
this simplified body, the final version of **pred** looks like this:
```λn.(((is Zero n) zero) (n second))```.

Personally, the simplification from the initial version of **pred** to the final version was a bit confusing. I had to read it a few times to truly see what was going on.

Luckily, the JavaScript version is straightforward:

{% highlight javascript linenos %}
var pred = function(n){
    return isZero(n)(zero)(n(second));
};
{% endhighlight %}

**isZero** is going to return a function that represents true or false. A
true value is represented with the **truth** function, which is just an alias
for the **first** function. A false value is represented by the **untruth**
function, which is just an alias for the **second** function. Both **first**
and **second** are binary functions that return the first or second argument,
respectively; the first argument will be ```zero``` and the second is the result
of ```n(second)``` or the predecessor of ```n```.

##Conclusion
In λ Calculus, natural numbers can be  modeled as a number of successions from
some representation for zero. Successions are represented as pairs, where the
first item is false, and the second item is either zero or the previous succession.
The **identity** function is used to represent zero, which provides a simple way
to test if an arbitrary number is zero. If the number represents a pair, and we
select the first item using **first** we get false; if the number is zero,
we get **first** returned to use which is the same as true.

Defining a predecessor function is a bit more tricky because we can't simply attempt
to take the second item in a pair; applying **second** to zero results in false
which doesn't represent any number. However, using conditional expressions, we
can test if an arbitrary number is zero, and return either zero or the predecessor
of the number.

Next up: Recursion. If I'm honest, this is where the complexity levels up...at least
for me. The Y Combinator is introduced as a generic recursion solution and I'm
still trying to grasp everything about  it.
