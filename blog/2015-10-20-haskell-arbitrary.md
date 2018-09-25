---
title: On Types, Kinds and The Arbitrary Nature of Haskell 
---
There has been a lot of debate recently about how the `Either a` and `(,) a`
instances of `Foldable` and `Functor` work. Plenty of people much smarter than
me have weighed in and given their opinion on the subject.

I'm not really here to do that.

My purpose is to explain _why_ `Foldable` and `Functor` do what they do when
implemented for types like`(,)` or `Either a b`. I personally found it confusing
a few months ago when I first came across. Luckily, I had a very
[patient teacher](https://twitter.com/bitemyapp), and now I'd like do what I can
to help anybody that is in the same place that I was.

##Kinds - The types of types

In order to understand what is going on, we first need to have an understanding
of kinds. Just as every expression in Haskell has a type, every type in Haskell
has a kind. The simplest way I've found to think of kinds is as the type of
types, and we can query the kind of a type using GHCi.

{% highlight bash %}
Prelude> :k Char
Char :: *

Prelude> :k []
[] :: * -> *

Prelude> :k (,)
(,) :: * -> * -> *
{% endhighlight %}

The kind of a type is denoted using a `*`. Concrete types like `Char` have kind
`*`. The `List` type, however, has the kind `* -> *` which looks a lot like the
type signature for a function. That's because type constructors _are_ functions,
so we can read `* -> *` as "this type takes some concrete type `*` and returns a
concrete type." This makes sense because a list is polymorphic (`[a]`); it needs
some type for its elements in order to be a concrete type. These types are
referred to as higher-kinded types.

Tuples have the kind `* -> * -> *`, and you might have guessed already that
means it needs two concrete types before it can itself be concrete.

Since type constructors are functions, we can partially apply them:

{% highlight bash %}
Prelude> :k (,) Int
(,) Int :: * -> *

Prelude> :k (,) Int String
(,) Int String :: *
{% endhighlight %}

In the first example we provide one of the required type variables for a tuple,
and the result has kind `* -> *`. In the second, we provide both type variables
and get back a concrete type.

Here is an example of another type that sometimes causes confusion:

{% highlight bash %}
Prelude> :k Either
Either :: * -> * -> *

Prelude> :k Either Int
Either Int :: * -> *
{% endhighlight %}

The strange thing here is that `Either a b` is a sum type. Unlike a tuple (which
is a product), a value of `Either a b` can only be one of two things `Left a` or
`Right b`. However, the kind of the `Either a b` type is still `* -> * -> *`;
the type is not concrete until both type variables are provided.

##Kinds and Typeclasses

There is a special relationship between typeclasses and kinds, and it is
important to understanding what is going on with `(,)` and `Either a b`.

Typeclass definitions can constrain the kind of the type variable they require.

{% highlight bash %}
Prelude> :i Foldable
class Foldable (t :: * -> *) where
    foldr :: (a -> b -> b) -> t a -> b -> b

Prelude> :i Functor
class Functor (f :: * -> *) where
    fmap :: (a -> b) -> f a -> f b
{% endhighlight %}

Both classes require that any instances be of kind `* -> *`. This means we can't
have a `Functor` instance of `Char` or `Int`, nor can we have one for `(,)` or
`Either a b`; none of those types have the right kind. But we can make
`Either a b` or `(,)` the right kind by partially applying it. We don't need to
provide a concrete type though, we can simply provide a type variable.

{% highlight haskell linenos %}
instance Functor (Either a) where
-- omitted

instance Functor ((,) a) where
-- omitted
{% endhighlight %}

Now we have instances of `Functor` for our types, but what does that mean for
the actual function implementations?

Take a look at the types for `fmap` and `foldr` again.

{% highlight bash %}
Prelude> :i Foldable
class Foldable (t :: * -> *) where
    foldr :: (a -> b -> b) -> t a -> b -> b

Prelude> :i Functor
class Functor (f :: * -> *) where
    fmap :: (a -> b) -> f a -> f b
{% endhighlight %}

`foldr` requires a `t a` where `t` is kind `* -> *`. The `a` in `t a`, in the
case of `Either a b` and `(,)` necessarily points to the second type variable;
that is all it could be. Neither typeclass knows about that the type you are
using has previously applied type variables; it only knows about "final" one.

In the case of a tuple, that means the second element. In the case of
`Either a b`, that means `Right b` since that is where the second type variable
is used. As you can see from the actual implementations, that is exactly what
we get.

{% highlight haskell linenos %}
instance Functor (Either a) where
    fmap _ (Left x)  = Left x
    fmap f (Right y) = Right (f y)

instance Functor ((,) a) where
    fmap f (x, y) = (x, f y)
{% endhighlight %}

##"Arbitrary"

One of the words that keep floating around in these arguments is "arbitrary",
and I personally can see how one might perceive it as such. From the
implementations, it appears that we've just conventionally decided that we'll be
mapping over the second element. I promise you, this behavior is not arbitrary.
It is _the only way_ these functions can be implemented. Don't believe me? Let's
see what happens if we try to write a `Functor` instance for `Either a b` that
maps both the sides.


{% highlight haskell linenos %}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE KindSignatures #-}

module Test where
import Data.Either

class Functor (f :: * -> *) where
  fmap :: (a -> b) -> f a -> f b

instance Functor (Either a) where
  fmap f (Left a)  = Left (f a)
  fmap f (Right b) = Right (f b)
{% endhighlight %}

I've had to jump through a few hoops since `Either a` is already an instance of
`Functor`, but everything lines up.

If we attempt to load that into GHCi

{% highlight bash %}
Prelude> :l Test.hs
[1 of 1] Compiling Test             ( Test.hs, interpreted )

Test.hs:11:28:
    Couldn't match expected type ‘a’ with actual type ‘b’
      ‘b’ is a rigid type variable bound by
          the type signature for
            fmap :: (a1 -> b) -> Either a a1 -> Either a b
          at Test.hs:11:3
      ‘a’ is a rigid type variable bound by
          the instance declaration at Test.hs:10:10
    Relevant bindings include
      a :: a (bound at Test.hs:11:16)
      f :: a1 -> b (bound at Test.hs:11:8)
      fmap :: (a1 -> b) -> Either a a1 -> Either a b
        (bound at Test.hs:11:3)
    In the first argument of ‘Left’, namely ‘(f a)’
    In the expression: Left (f a)

Test.hs:11:30:
    Couldn't match expected type ‘a1’ with actual type ‘a’
      ‘a’ is a rigid type variable bound by
          the instance declaration at Test.hs:10:10
      ‘a1’ is a rigid type variable bound by
           the type signature for
             fmap :: (a1 -> b) -> Either a a1 -> Either a b
           at Test.hs:11:3
    Relevant bindings include
      a :: a (bound at Test.hs:11:16)
      f :: a1 -> b (bound at Test.hs:11:8)
      fmap :: (a1 -> b) -> Either a a1 -> Either a b
        (bound at Test.hs:11:3)
    In the first argument of ‘f’, namely ‘a’
    In the first argument of ‘Left’, namely ‘(f a)’
Failed, modules loaded: none.
{% endhighlight %}

Quite the mess. What the compiler is telling us is that it found type `b` where
it expected to see type `a`. Speficially, it expected to see type `a` as the
first argument of `Left` but found `(f a)` instead. Another interesting thing to
note is the type of `fmap`.

```
fmap :: (a1 -> b) -> Either a a1 -> Either a b
```

This is a specialized type for `fmap` for Either and from this type it is clear
that the only valid implmentation for `fmap` is to map over the right side only;
we simply cannot map the left. The same holds true for tuples, the only valid
implementation is to map over the second element.

##What About `length`

Right I almost forgot, this whole thing started because

{% highlight bash %}
Prelude> length (1, 2)
1
{% endhighlight %}

Clearly this is madness! I mean, we have a 2 tuple! I can see both elements!
Seriously, this is JavaScript-level fuckery.

Nah.

First the implementation of `length`

{% highlight haskell linenos %}
length :: t a -> Int
length = foldl' (\c _ -> c+1) 0
{% endhighlight %}

The definition of `foldl'` is the same for all instances of `Foldable` as it
relies on the definition of `foldr` so let's look at that:

{% highlight haskell linenos %}
instance Foldable ((,) a) where
    foldr f z (_, y) = f y z
{% endhighlight %}

We know from before that we simply cannot do anything with the first element;
it won't compile. So we take our function and apply to the second element and
the accumulator to get the result. We'll run the `(\c _ -> c+1)` part of
`length` once giving us 1.

Now, we can argue about how much sense that makes or if it's intuitive

LOL J/K!

I ain't about all that. If you feel some type of way about this, take it
[elsewhere](https://www.reddit.com/r/haskell/comments/3pfg7x/either_and_in_haskell_are_not_arbitrary/).
