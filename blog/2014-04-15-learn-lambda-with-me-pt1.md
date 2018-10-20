---
title: Learn λ Calculus With Me - Foundations
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
these posts is to share what I've learned, and I may have some stuff wrong.
One of my hopes is to grow in my understanding by putting this out_


##λ What?
λ calculus was developed in the 1930s by Alonzo Church as a model for computability,
 and is a central concept in computer sciene. It was developed during the same time
 that Turing was developing his Turing machines, and was actually proven, by Turing,
 to be equivalant to a Turing machine in terms of modeling computability. That is
 to say, it can be used to describe all aspects of programming.

 λ calculus is an extremely simple system based on pure abstraction. Since it can
 be used to describe all aspects of a programming language, it can be used as a
 'machine code', of sorts, for functional programs; which I'll get into in later
 posts.

One last thing to note, before continuing. λ calculus is only functions. You will
see, later, how it can be used to express numbers, collections, boolean logic and
much, much more, but it is important to remember that we're talking in the abstract.
It's just functions all the way down.

##The Anatomy of a λ Expression
 λ expressions can be one of three things:
  - A name
  - A function
  - A function application

A name is any number of non-blank characters, though you'll usually see them in
single character form.

Functions have the form: ```λ<name>.<body>```

Function application takes the following form: ```(<function expression> <argument>)```

A function expression provides an abstraction, and the application specializes
that abstraction by providing a value to the name defined by the function expression.
For example: ```(λx.x λs.(s s))```

That's it, that's all there is to know. Now go forth and do good maths.

Notice the lack of numbers, strings, assignment and virtually everything else that
you think of when you think of programming. With λ calculus you have to think
more abstractly, what exactly is a number anyway? Now, the lack of assignment becomes
a problem; expressions get really, really long and hard to follow. For this exercise
I'm going to allow assignment of expressions to variables.

##JavaScript?
Sure why not? It's the language I use the most, but more importantly it has first-class
functions. Which means we can create arbitrary functions, pass them as arguments
and return them from functions; perfect to study λ calculus. Here is what a λ
function looks like in JavaScript:

~~~ javascript
var id = function(x){
  return x;
}
~~~

##A Fistful of Functions
There is much more to discuss about λ functions, but without some context, it won't
do much good. So let's look at some simple functions to get our feet wet.

###Identity
If you've done any functional programming, the concept of the **identity** function won't be
new to you, if not, it'll look pretty pointless...at first. The **identity** function has
this form: ```λx.x```

Based on what we know, about the anatomy of a λ function, we can say that this function
has a single variable with the name ```x```. We then have a ```.```, which separates
the name from the body, and then ```x``` again.

So this does what exactly? Oh, well, it takes a value and then returns it.

Lame, right? Don't worry, it'll make sense later.

In JavaScript, **idenitity** looks like this:

~~~ javascript
var identity = function (x){
  return x;
};
~~~

Lame again, I know.

###Self Application
The **self-application** (**selfApply**) function is another one that seems to be of little value,
but when you get into recursion, it really shows its power. The **self-application**
function has this form: ```λs.(s s)```

This function takes a single argument ```s```. The body of the function is a function
application: ```(s s)```. Remembering that everything is a function, this application
takes ```s``` and applies it to itself.

Consider the following: ```(λs.(s s) λx.x)```

The function application above applies the **self-application** function to **identity**.
The result is that ```s``` is replaced by the argument ```λx.x``` in the function body.
So **identity** is applied to **identity**, the result of which is **identity**.

And now you're thinking, "What a waste of freaking time."

Stick with me though, it gets really cool.

For fun, consider what this does: ```(λs.(s s) λs.(s s))```

Now for the JavaScript.

~~~ javascript
var selfApply = function(s){
  return s(s);
};
~~~

###Function Application
The **function-application** or just **apply** function will probably be more familiar to most JavaScript
developers because we're so used to passing around functions for callbacks..

The **function-application** function has this form: ```λf.λa.(f a)```

The **function-application** function does exactly what its name implies, it takes a function
and an argument, and applies the function to that argument.

In JavaScript, we write:

~~~ javascript
var apply = function(f){
  return function (a){
    return f(a);
  };
};
~~~

##All About Variables
With a couple of basic functions under our belts, we can look at variables a bit
more in depth.

Variable scope in λ calculus will be familiar to JavaScript developers because they
are function scoped. In this function ```λf.λs.(f (s s))``` the variable ```f```
is in the scope of ```(f (s s))``` while the variable ```s``` is in the scope of
```(s s)```.

###Bound Variables
There are two rules that you can use to determine if a variable is considered _bound_.

If the expression is a function ```λ<name>.<body>```, then the variable is bound
if ```<name>``` appears in ```<body>``` or if it is bound in ```body```. For example, in
```λx.(x λy.y)``` both ```x``` and ```y``` are bound. However, in ```λx.(x y)```
only ```x``` is bound.

 If the expression is an application ```(<function> <argument>)```, the variable
 is bound if it is bound in either ```<function>``` or ```<argument>```. For example
 in the application ```(λx.x y)``` only ```x``` is bound. However, in ```(λx.x λy.y)```
 both ```x``` and ```y``` are bound.

###Free Variables
 There are three rules you can use to determine if a variable is _free_. As you
 may have guessed, they are the opposite of the rules for bound variables.

 If the expression is a function ```λ<name>.<body>```, and the variable name is
 not ```<name>``` and the variable is not bound in ```<body>``` then it is free.
 In the example above ```λx.(x y)``` the variable ```y``` is free.

 If the expression is an application ```(<function> <argument>)``` and the variable
 is bound in neither ```<function>``` nor ```<argument>```, then it is considered
 free. For example, in the application ```(λx.x y)``` the variable ```y``` is free.

 Lastly, if the expresion is only a name ```<name>``` then the variable is free.

###Variables in JavaScript
As it turns out, scoping, free and bound variables work in the same way in JavaScript;
take this code for example:

~~~ javascript
var weirdAdd = function operandA(a){
  return function operandB(b){
    return a + b;
  };
};

weirdAdd(2)(3); //=> 5;
~~~

In the example above ```a``` is scoped to the function ```operandA``` and can be
accessed by any nested functions, like ```operandB```. Additionally, the variable
```b``` is scoped to ```operandB```.

What about free and bound variables? Well, we can follow the same rules. If we look
at the entire expression above, both ```a``` and ```b``` are bound. However what if
we do this:

~~~ javascript
var add5 = weirdAdd(5); //=> [Function operandB]
~~~

The function returned by calling ```weirdAdd``` with a single argument would look
like this:

~~~ javascript
function operandB(b){
  return a + b;
}
~~~

Here we can see that ```operandB``` has access ```a``` because of the scope of
original function ```operandA```, however, ```a``` is free in this situation.

##Reduction
Now that we know the difference between a free and bound variables, we can look
at the process of substituting names for their arguments.

If an application ```(λ<name>.<body> <arguments>)``` we reduce the expression by
replacing all free instances of ```<name>``` in ```<body>``` with ```<argument>```.

###Reduction With Unique Names
Let's look at an example of the function application function from before:

```((λf.λa(f a) λs.(s s)) λx.x)```

To reduce this function we start with the variable ```f``` and we replace it with
the argument ```λs.(s s)```, resulting in ```(λa.(λs.(s s) a) λx.x)```.

We continue this process with the variable ```a``` and replace it with ```λx.x```
giving ```(λs.(s s) λ.x.x)``` which is the same as the example of the **self-applicationi**
function. Just for fun, let's finish the reduction.

```(λs.(s s) λx.x)``` becomes ```(λx.x λx.x)``` which ends at ```λx.x```

###Reduction With Non-Unique Names
Let's look at one more example, where a variable name is reused.

```(λf(f λf.f) λs.(s s))```

The first ```f``` is free in ```(f λf.f)``` so it is replaced with ```λs.(s s)```
giving us:

```(λs. (s s) λf.f)```

Both instances of ```s``` are free, so we can replace them with ```λf.f``` and we
end up with ```(λf.f λf.f)```, which is ```λf.f```.

And that's reduction in a nutshell. Of course, we could have used names in the place
of the identity or selfApply functions, in which case we would have expanded them
to their λ representations and continued on with the reduction.


##For a Few Functions More
Things are about to get a little more abstract, a little more mind expanding,
and a lot more fun as we consider how to select arguments in nested functions
and how to use functions to model a pair. These functions are the foundation for
modelling boolean logic, and integer arithmetic.

###First
Let's say we have a pair of things, and we want to get the first one, how would
you got about that using only functions? Well it would look something like this:
```λx.λy.x```.

The **first** function, takes two arguments and returns the first. I'm not
going to bother with an example reduction because it's pretty self-explanatory.

In JavaScript it looks like this

~~~ javascript
var first = function(x){
  return function(y){
    return x;
  };
};
~~~

###Second
I'm going to move on to the next function quickly because they make more sense
once you see how to create pairs. The **second** function is almost identical to
**first**, except it returns the second argument.

The **second** function has this form: ```λx.λy.y```

I'm sure you've already figured out what it looks like in JavaScript, but just for
fun:

~~~ javascript
var second = function(x){
  return function(y){
    return y;
  };
};
~~~

###Pair
Now for the good stuff. So how would you create a pair of things using only functions?
Well, you could do this: ```λx.λy.λf((f x) y)```

WAT?

The **pair** function takes two things, ```x``` and ```y```, and a function ```f```.
It then applies that function to those two arguments. And you're saying, "How is that a pair?".
Well, it's not, but what if you didn't supply that third argument, what would you have?

You'd have a function that has access two the free variables ```x``` and ```y```;
and there's your pair. Sure you can't print it out and see the values, but it's no less
a pair.

So now you've got this function, waiting for its third argument. What if you passed it
the **first** or **second** function from earlier? Well you'd get an item
out of the pair.

Here's how it works. We're going to supply two arbitrary functions as the first
and second arguments, then apply the **first** function.

```(((λx.λy.λf.((f x) y) identity) selfApply) first)```

If we substitute the variables for their arguments we get

```((first identity) selfApply)```

If we expand ```first``` we get:

```((λx.λy.x identity) selfApply)```

Now we replace ```x``` with ```identity``` and ```y``` with ```selfApply```
and we get our **identity** function as the result.

In JavaScript, this looks like:

~~~ javascript
var pair = function(x){
  return function(y){
    return function(f){
      return f(x)(y);
    };
  };
};
~~~

##Summary
So there you have it, a high-level overview of the λ calculus. I've hand-waived
a couple of things here and there but what is presented above is the core of λ
calculus as I currently understand it.

I would like to say something about name clashes, which I didn't cover at all.
Because of how variables are scoped, it is entirely legal to reuse variable names;
this is true of JavaScript as well. I didn't touch on the implications because you
just plain shouldn't do it. Things are simpler when you don't have to consider which
version of variable ```h``` is in scope at what point during a reduction.

The next post in this series will cover conditions and Booleans (roughly half of
chapter 3 in [An Introduction to Functional Programming
through Lambda Calculus](http://www.amazon.com/gp/product/0486478831)).
