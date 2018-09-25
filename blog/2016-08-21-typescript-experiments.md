---
title: Experiments In TypeScript
---
Recently my team had a chance to look at a bunch of new technologies for a new
frontend project we will be starting. I was really pushing for a
[PureScript](http://www.purescript.org/) solution, but at the end of the day it
just wasn't in the cards. When the dust had settled we agreed on solution using
[React](https://facebook.github.io/react/) and
[TypeScript](http://www.typescriptlang.org/).

It's a good compromise, to be honest. React with [Redux](http://redux.js.org/)
is a far more functional approach than the other solutions we considered
([Angular 2](https://angular.io/), [Aurelia](http://aurelia.io/),
[Ember](http://emberjs.com/)), and TypeScript provides the type safety that I
desperately wanted. After being deep into a few big JavaScript projects, and
seeing what could be done with PureScript or [Elm](http://elm-lang.org/),
I was really pushing for something that would give us more safety than what we
have currently with JavaScript.

## Kicking The Tires

I cut my teeth on C#, so TypeScript was seemingly familiar territory. These days
there are a few things I expect from a type system and I wanted to see what
TypeScript had to offer.

### Algebraic Data Types

One of my favorite things in Haskell is Algebraic Data Types, in particular sum
or union types. You can think of a sum type sort of like an enum, but they can
come with data which is something that enums don't have. Here is a quick example
in [Haskell](https://haskell-lang.org/):

{% highlight haskell %}
data Jibberish = Foo | Bar | Baz | Qux

data Maybe a = Nothing | Just a
{% endhighlight %}

Here we've got two data types: `Jibberish` and `Maybe a`. A value of type
`Jibberish` is either `Foo`, `Bar`, `Baz` or `Qux`. The "or" is key here. The
second example is a little more interesting. The `a` is a type variable, in C#
or TypeScript you would write ```Maybe<T>```. A value of `Maybe a` can be
`Nothing` or `Just a`. The fist option carries no data, while the second holds
a value of type `a`. Maybe is used in place of `null`; it's used to indicate
that a function may not complete successfully.

TypeScript has support for sum types, and when you combine them with your own
interfaces/classes you can get pretty close to something like what you get in
Haskell:

{% highlight typescript %}
class Just<T> {
  value;
  constructor(a :T) { this.value = a; }
}

class Nothing {}

type Maybe<T> = Nothing | Just<T>
{% endhighlight %}

Unfortunately TypeScript doesn't have anything like Haskell data constructors,
so I had to create classes instead. If you're new to TypeScript, like me, that
last bit is a type alias; rather than having to say `Nothing | Just<T>` in all
of our type signatures, we can just say `Maybe<T>`.

### Type Classes / Interfaces

Type classes in Haskell are basically the same as interfaces in other languages,
sort of. More specifically, they're like interfaces that only describe behavior.
TypeScript has interfaces, that support properties and methods. My personal
preference is not to mix the two; I prefer the idea of composing behavioral
interfaces. Interfaces with only properties *seem* to be
the same as a type alias for an object literal, so I'm not sure I see the
benefit.

I decided to see if I could define one of the most basic Haskell type classes:
[Functor](https://wiki.haskell.org/Typeclassopedia#Functor); basically a
"container" and a way to apply a function to every value inside that container.
The definition in Haskell is:

{% highlight haskell %}
class Functor f where
  fmap :: (a -> b) -> f a -> f b
{% endhighlight %}

This says we've got some Functor `f` and its interface is a function called
`fmap`. `fmap` takes two arguments. The first is a function that takes values
of some type (called `a`) and returns values of some potentially different type
(called `b`). The second is a Functor that holds `a` values ('f a'). The return
type is a Functor that holds `b` values (`f b`). One important note `a` & `b`
don't have to be different types, but they can be.

That should be pretty simple to define in TypeScript:

{% highlight typescript %}
interface Functor<F> {
  fmap<A, B>(f: (arg: A) => B): Functor<F>
}
{% endhighlight %}

Ok, that's a little different so let's step through it. We still have a
`Functor<F>`, and a function from `A` values to `B` values, TypeScript just
requires us to give names to those variables a little differently. I had to
tweak the signature of `fmap` a little bit and drop the second argument since
this interface would be implemented by some class which implies the Functor
(`f a`) we're operating on is the class implementing this interface.

It is important to note that the `f` / `F` here isn't just any old type like
`string` or `int` it's a type constructor that must take a single value. It also
remains unchanged; Haskell Functors preserve structure so once you have a one
kind of Functor it doesn't become another. For example, List is a Functor in
Haskell. You might have a list of integers, and use `fmap` to turn it into a
list of strings but the Functor, that `f` / `F`, is still a list. So the return
type of `fmap` in TypeScript is still `Functor<F>` even though the things inside
it will be of type `B`.

As far as I can tell, TypeScript doesn't have a way of saying, "This interface
is generic and that generic thing needs to have a constructor that takes one
argument," which is essentially what kind `* -> *` means. However, we can get
close by creating another interface:

{% highlight typescript %}
interface StarToStar<T> {
  value: T
}

// I couldn't come up with a better way to say * -> *
{% endhighlight %}

Now we have an interface for something that has a single value. It doesn't
specify a constructor function so how that value gets set is implied.

With that interface defined we can redefine the Functor interface:

{% highlight typescript %}
interface StarToStar<T> {
  value: T
}

interface Functor<F extends StarToStar<any>> {
  fmap<A, B>(f: (arg: A) => B): Functor<F>
}
{% endhighlight %}

So now to be a valid functor the type `F` must be an instance of
`StarToStar<any>`; the Functor doesn't care what the values are, but it does
care about what the `F` you supply it is.

### A Simple Functor instance

Next I wanted to see if I could take what I learned about sum types and see
how I could implement the Functor interface I just defined. In Haskell you say
that Maybe is an instance of Functor; unfortunately,
`Maybe<T> = Nothing | Just<T>` is just an alias so I can't have it implement the
Functor interface. However, I could have each of the class that `Maybe<T>` is
composed of implement it and get basically the same thing.

{% highlight typescript %}
interface StarToStar<T> {
  value: T
}

interface Functor<F extends StarToStar<any>> {
  fmap<A, B>(f: (arg: A) => B): Functor<F>
}

class Just<T> implements Functor<Just<T>>{
  value;
  constructor(a :T) { this.value = a; }
  fmap(f) {
    return new Just(f(this.value));
  }
}

class Nothing implements Functor<Nothing>{
  value;
  fmap(f) {
    return new Nothing();
  }
}

{% endhighlight %}

Now `Just<T>` and `Nothing` implement `Functor<T>`. When we `fmap` a function
over `Just<T>` we take the value, apply the function provided and wrap it back
up in a `Just`. For `Nothing` we have no value (the class only has the property
to satisfy the `StarToStar` interface), so we just give back a `Nothing`.

We now have a way to generalize applying a function to values inside of
"containers" which include the Maybe type, lists/arrays, binary trees and lots
of others. We can then write a standalone function for `fmap` that works on any
Functor rather than having to use the dot notation above.

{% highlight typescript %}
function fmap<F extends StarToStar<any>, A, B>(f: (a: A) => B, fa: Functor<F>): Functor<F> {
  return fa.fmap(f);
}

const justOne = new Just(1); // => Just { value: 1 }
const justOneString = fmap((x) => x.toString(), justOne); // => Just { value: '1' }

const nothing = new Nothing(); // => Nothing
const stillNothing = fmap((x) => x.toString(), nothing); // => Nothing
{% endhighlight %}

## Summary

If you're coming from JavaScript, with no experience with Haskell, PureScript
or Elm, TypeScript will seem magical. There is some extra boilerplate to deal
with but the payoff is huge; I don't imagine you'll notice it after some time
with it. However, if you've used Haskell, PureScript or Elm, then you've seen
the same, or better, features with a lot less cruft. If you're like me, you'll
miss minimal syntax but eventually get over it because TypeScript is a nice
language, gets you a lot of what you want, and is familiar enough that your team
won't feel like they've got to put the brakes on building a product in order to
learn the language.

You can do pretty well trying to approximate things from those languages in
TypeScript but I for one felt the design of the language pushing back a bit.
The big question for me is whether or not the advantages of these techniques
will be as obvious to other developers who see TypeScript as a way to write C#
(and therefore very OO code) in the browser. Of course that is coming from
someone wishing they could write very functional code in the browser
using a language that, to my eyes, wasn't designed for it.
