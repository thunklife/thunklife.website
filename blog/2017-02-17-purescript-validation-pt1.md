---
title: Validating Inputs With PureScript Validation - Part 1
---
There are a number of ways that we can signal that an error occurred using
Algebraic Data Types in PureScript, the most well know are `Maybe` ([purescript-maybe](https://pursuit.purescript.org/packages/purescript-maybe/2.0.1))
and `Either` ([purescript-either](https://pursuit.purescript.org/packages/purescript-either/2.1.0))
With `Maybe` we can use the `Nothing` data constructor to signal failure but
any context about the failure is lost because `Nothing` is nullary - no data
comes along with it. We can improve on that a bit by using `Either`. Like
`Maybe`, `Either` has two data constructors: `Left` and `Right`,
with `Left` typically used to indicate failue and `Right` used to indicated
spurescript-uccess. Both `Left` and `Right` bring extra data along with them so we can
provide some context for the failure.

~~~ haskell
greaterThanTen :: Int -> Maybe Int
greaterThanTen n =
  case n < 11 of
    true -> Nothing
    false -> Maybe n

greaterThanTwenty :: Int -> Either String Int
greaterThanTwenty n =
  case n < 21 of
    true -> Left "Must be greater than 20"
    false -> Right n
~~~

Cool. So we have two ways to validate an input: we can use `Maybe` if we don't
care about why our function failed, and we can use `Either` if we want to give
the caller some more information.

But what if we need to validate more than one argument? Say, for example, we
had a type for a `Person`, but we needed to enforce some invariant like, the
name can't be empty, or they must be over 18?

## Modeling The Scenario

In this scenario we have a `Person`, but we don't expose the data constructor
directly because we want to verify some inputs before hand.

~~~ haskell
newtype FirstName = FirstName String
newtype LastName = LastName String
newtype Age = Age Int

data Person = Person FirstName LastName Age
~~~

We can ensure we only construct `Person` with validate data by providing
smart constructors, functions that perform the validations we want, for each field.
These functions take the input and use a datatype like `Maybe` or `Either` to
account for failure. Here are some smart constructors that use `Maybe`:

~~~ haskell
firstRequired :: String -> Maybe FirstName
firstRequired "" = Nothing
firstRequired s = Just (FirstName s)

lastRequired :: String -> Maybe LastName
lastRequired "" = Nothing
lastRequired s = Just (LastName s)

ageGT18 :: Int -> Maybe Age
ageGTFive n = case n < 18 of
  true -> Nothing
  false -> Just (Age n)
~~~

Ok, we've got functions for each field in our `Person` type, but we still a way
to glue all of those checks together. Luckily, we can use the `Applicative`
([Pursuit](https://pursuit.purescript.org/packages/purescript-prelude/2.4.0/docs/Control.Applicative#t:Applicative))
instance of `Maybe` to do just that:

~~~ haskell
validatePerson :: String -> String -> Int -> Maybe Person
validatePerson f l a = Person
                       <$> firstRequired  f
                       <*> lastRequired l
                       <*> ageGTFive a
~~~

We're using the `Applicative` instance for `Maybe` here to allow us to, essentially,
map a bunch of functions that return `Maybe` values over our `Person` constructor;
a function that takes `String`s and an `Int`.
So what happens when we use this?

~~~ haskell
> validatePerson "John" "Jacob" 19
(Just Person John Jacob 19)

> validatePerson "John" "" 19
Nothing
~~~

That's pretty good, but we'll get the same `Nothing` value each time a try to
construct an invalid `Person`; not providing a first name fails in the same way
as not providing a last name, etc.

With `Either` we can provide more information about a failure, so we create a
`PersonError` datatype to use in our smart constructors. If the input is valid,
we'll use the `Right` data constructor and we'll use `Left` for our errors.

~~~ haskell
data PersonError = FirstNameRequired | LastNameRequired | Under18

firstRequired :: String -> Either PersonError FirstName
firstRequired "" = Left FirstNameRequired
firstRequired s = Right (FirstName s)

lastRequired :: String -> Either PersonError LastName
lastRequired "" = Left LastNameRequired
lastRequired s = Right (LastName s)

ageGTFive :: Int -> Either PersonError Age
ageGTFive n = case n < 19 of
  true -> Left Under18
  false -> Right (Age n)

validatePerson :: String -> String -> Int -> Either PersonError Person
validatePerson f l a = Person
                       <$> firstRequired  f
                       <*> lastRequired l
                       <*> ageGTFive a
~~~

Like `Maybe`, `Either` implements the `Applicative` typeclass, so glueing our
functions together stays the same, but now we return an `Either`. Now if we try
to create a `Person` using invalid inputs:

~~~ bash
> validatePerson "John" "Jacob" 19
(Right Person John Jacob 19)

> validatePerson "" "Jacob" 19
(Left FirstNameRequired)

> validatePerson "John" "Jacob" 12
(Left Under18)
~~~

Much better! Now we know more about why our function failed. But what if we do:

~~~ bash
> validatePerson "" "" 10
(Left FirstNameRequired)
~~~

Hmmmm. Better than `Maybe`, which gives using `Nothing`, but it still doesn't tell
the whole story. Our `Person` couldn't be constructed because all three inputs
we invalid, but `Either` only shows us the first failure; it would be much nicer
if we could accumulate these errors somehow.

## PureScript-Validation

The nature of the `Applicative` instance for `Either` means that we can't
accumulate errors; the first `Left` value we encounter is propagated through
our function without us knowing that anything else was wrong.

Enter the [purescript-validation](https://pursuit.purescript.org/packages/purescript-validation/2.0.0)
library, which provides alternative ways to perform validation.

The library comes with two pieces: `Data.Validation.Semigroup` allows us to perform
validation and accumulate error values by constraining error values to those which
implement the `Semigroup` typeclass, and `Data.Validate.Semiring` which I'll cover in
a separate post.

`purescript-validation` provides the datype called `V` which is basically like
`Either`:

~~~ haskell
data V err result = Invalid err | Valid result
~~~

Here the `Invalid` data constructor is the same as `Left` and `Valid` is `Right`,
the difference is in the `Applicative` instance, which says that any errors
in must implement `Semigroup` so that they can be accumulated with `<>`. Let's
see an example:

~~~ haskell
firstRequired :: String -> V (Array PersonError) FirstName
firstRequired "" = invalid [FirstNameRequired]
firstRequired s = pure (FirstName s)

lastRequired :: String -> V (Array PersonError) LastName
lastRequired "" = invalid [LastNameRequired]
lastRequired s = pure (LastName s)

ageGTFive :: Int -> V (Array PersonError) Age
ageGTFive n = case n < 19 of
  true -> invalid [Under18]
  false -> pure (Age n)

validatePerson :: String -> String -> Int -> V (Array PersonError) Person
validatePerson f l a = Person
                       <$> firstRequired  f
                       <*> lastRequired l
                       <*> ageGTFive a
~~~

A lot more had to change than when we switched from `Maybe` to `Either`, so
let's unpack it a bit.

First, we have `V` which is the type `purescript-validation` exposes to us,
so rather than using `Either` we use `V`. One very important thing to notice
is that `purescript-validation` doesn't expose the data constructors for `V`; instead
we have `invalid` which wraps up errors, and `pure` for success. `pure` isn't actually
part of `purescript-validation`, it's part of the `Applicative` typeclass which
`V` implements. Basically, since `purescript-validation` doesn't provide us with
constructor functions, we use these alternatives, but the result is the same and
we don't really need to know the particulars of the `V` datatype. Lastly, we
wrap our errors in an `Array` so we can accumulate the values. `Array` implements
the `Semigroup` typeclass (simple concatination), so we should get an `Array` of
all the errors at the end.

Alright, so what happens when we try to use this?

~~~ bash
> validatePerson "John" "Jacob" 19
(Valid Person John Jacob 19)

> validatePerson "" "" 10
(Invalid [FirstNameRequired, LastNameRequired, Under18]);

> validatePerson "John" "" 10
(Invalid [LastNameRequired, Under18])
~~~

Nice! Now we know each input that failed.

## Working With Validated Data

`purescript-validation` comes with some extra stuff to make working with validations
a little easier.

First there is `unV` which allows us to unwrap out error or success value while
while applying a function to either. It has 3 arguments: a function to apply if
`Invalid`, a function to apply to `Valid`, and finally the instance of `V` you want
to unwrap.

Next up is `isValid` which takes any `V` and returns a `Bool` to tell us if we're
dealing with an `Invalid` or a `Valid`; remember these constructors are not exposed
so we need an alternative to pattern matching adn `isValid` provides that.

`V` also implements a few interesting typeclasses. First, it implements `Functor`
giving us a way to map a function over a value inside of a `V`. Trying to map a
function over `Invalid` has no effect, in the same way that trying to map over a
`Left` from `Either` has no effect. Along with `Functor`, `V` also implements
`Bifunctor` which provides us with a way to map functions over both `Invalid`
and `Valid` values.

## Next Time
We've seen how we can use `purescript-validation` and `Semigroup`s to validate data
in an applicative way while accumulating any errors. Up next, we'll take a look
at the `Semiring` version that `purescript-validation` provides for validators
that support errors with multiple alternatives.
