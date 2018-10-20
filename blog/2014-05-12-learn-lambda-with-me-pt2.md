---
title: Learn λ Calculus With Me - Booleans & Conditions
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

##Intro
In my [last post](/blog/learn-lambda-with-me-pt1.html) I covered the basic
concepts of λ Calculus and showed some foundational functions. Now things are
going to get a little more interesting as we exameine how to model Boolean values
and conditional expressions. Specifically, this post is going to cover:

  - True
  - False
  - Conditional expression (if/else)
  - Not
  - And
  - Or

These items are covered in chapter 3 of [the book](http://www.amazon.com/gp/product/0486478831).

##Conditional Expression, True & False
Let's consider a simple conditional expression in JavaScript:

~~~ javascript
if (someCondition) {
  return doTrueAction();
} else {
  return doFalseAction();
}
~~~

In JavaScript, the ```else``` block isn't required, but in other languages, such as
Haskell, the ```else``` block must be explicit; the same is true in λ Calculus.

Of course, JavaScript offers an alternative syntax for if/else conditions:

~~~ javascript
return someCondition ? doTrueAction() : doFalseAction();
~~~

With a conditional expression expressed in this fashion, the translation to λ
Calculus becomes simpler. If you think about it abstractly, what we have here is
a pair of functions; one that applies if a condition is true and the other if the
condition is false. So then, a conditional expression can be modeled using the
**pair** function.

If you recall, the **pair** function looks like this: ```λx.λy.λf((f x) y)```.
In JavaScript it is written like so:

~~~ javascript
var pair = function (x){
  return function (y){
    return function (f){
      return f(x)(y);
    };
  };
};
~~~

Of course, we're good developers and we wouldn't duplicate that code, but we
would want to name it such that we know we're talking about, so we'll just give
it an alias.

~~~ javascript
var cond = pair;
~~~

If a conditional expression is a pair, then we should be able to use **first**
and **second** to represent true and false, respectively, since they are used
to pick an item from a pair. Here's a quick refresher on those two:

**first** looks like this:  ```λx.λy.x```, and **second** looks like this: ```λx.λy.y```.
In JavaScript we wrote those functions like this:

~~~ javascript
var first = function (x){
  return function (y){
    return x;
  };
};

var second = function (x){
  return function (y){
    return y;
  };
};
~~~

Again, we can repurpose these functions:

~~~ javascript
var truth = first;
var untruth = second;
~~~

Since we can't use ```true``` and ```false``` as names, I've gone with ```truth```
and ```untruth``` instead.

I'm not going to go into the reduction of these functions since we've already covered it.
If you'd like a refresher on how these reduce,check out the previous post.

##Not
The **not** operator, or ```!``` in JavaScript, takes a Boolean and returns its opposite.
This can be easily represented in a truth table:

<table>
  <thead>
    <tr>
      <th>x</th>
      <th>Not x</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>True</td>
      <td>False</td>
    </tr>
    <tr>
      <td>False</td>
      <td>True</td>
    </tr>
  </tbody>
</table>

Simple, no?

The **not** function looks like this: ```λx.(((cond untruth) truth) x)```.

If we expand that a we get: ```λx.(((λy.λz.λf((f y) z) untruth) truth) x)```

If we start reducing, we replace ```y``` with ```untruth```, ```z``` with ```truth```
and ```f``` with ```x```. The result is: ```λx.((x untruth) truth)```.

This reduced version of **not** is the same as the previous one, so we can use
it instead.

Now we can apply **not** to **truth**: ```(λx((x untruth) truth) truth)```.

This reduces to ```((truth untruth) truth)```. We know that ```truth``` is the same
as ```first``` so it will take two arguments are return the first, but for fun
let's complete the reduction.

```((λx.λy.x untruth) truth)``` is the expansion of the previous expression. Which
in turn reduces to ```(λy.untruth truth)```. At this point, there is no need to reduce
any further. The body, or return value, has already been substituted, we know
```untruth``` is the returned value.

So how is this expressed in JavaScript?

~~~ javascript
var not = function (x){
  return x(untruth)(truth);
};
~~~

Keep in mind that ```x``` is a function that represents either true or false, aka **truth**
or **false**, aka **first** or **second**.

##And
The **and** operator, or ```&&``` in JavaScript, takes to operands and returns true if
both values are true. We can represent this using the following truth table:

<table>
  <thead>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>x and y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>False</td>
      <td>False</td>
      <td>False</td>
    </tr>
    <tr>
      <td>False</td>
      <td>True</td>
      <td>False</td>
    </tr>
    <tr>
      <td>True</td>
      <td>False</td>
      <td>False</td>
    </tr>
    <tr>
      <td>True</td>
      <td>True</td>
      <td>True</td>
    </tr>
  </tbody>
</table>

Using this table, we see that we only need to evaluate the right operand if the left
is true; if the left is false, the expression evaluates to false. Using the ternary
operator we could describe **and** like this: ```x ? y : false```.

As a λ function, it looks like this: ```λx.λy(((cond y) untruth) x)```. Just like with
**not** we can substitute ```cond``` with ```x``` giving us:

```λx.λy((x y) untruth)```

Let's apply this function to our representations of true and false.

```((λx.λy((x y) untruth) truth) untruth)```

Now to reduce things. We can substitute ```x``` for ```truth```, and ```y``` for
```untruth```.

```((truth untruth) untruth)``` then exands to ```((λx.λy.x untruth) untruth)```. Reducing
further gives us ```(λy.false false)```


##Or
The **or** operator, or ```||``` in JavaScript, takes to operands and returns true if
either value is true, otherwise it returns false. A truth table for not looks like this:

<table>
  <thead>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>x or y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>False</td>
      <td>False</td>
      <td>False</td>
    </tr>
    <tr>
      <td>False</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <td>True</td>
      <td>False</td>
      <td>True</td>
    </tr>
    <tr>
      <td>True</td>
      <td>True</td>
      <td>True</td>
    </tr>
  </tbody>
</table>

With **and** we only needed to evaluate the right operand if the left was true,
**or** is similar in that we only evaluate the right operand if the left if false.
Using the ternary operator we can express or in this way: ```x ? true : y```

In λ Calculus it is represented like this ```λx.λy(((cond truth) x) y)```. Again,
as with **not** and **or**, we can simplify this notation by substituting ```cond```
for ```x``` giving us:

```λx.λy((x truth) y)```

Now to apply this function using ```truth``` and ```untruth```.

```((λx.λy((x truth) y) untruth) truth)```

To reduce this we substitute ```x``` for ```untruth``` and ```y``` for ```truth```
and we get:```((untruth truth) truth)```.

Of course ```untruth``` is just a synonym for ```second``` which takes two arguments
and returns the second one, so it should be clear what the result of this expression
will be. I leave it to the reader complete the reduction.

##Conclusion
By considering a conditional expression to be a pair of possible outcomes, one for truth
and one for untruth, we can model boolean operators as pairs, and true/false
values as a "selector" function for choosing one of the two outcomes.

Next up we'll look at how pairs can be used to model natural numbers.
