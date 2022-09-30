# Parinfer Code

> __TODO__: document that `cursorDx` was replaced by `changes`

> __TODO__: document that Paren Mode indentation constraint is now stronger than in Indent Mode for stability (see [Extending Indentation Constraints])

> __TODO__: document that Smart Mode will correct indentation whenever a cursor leaves a paren-trail holding area

[Extending Indentation Constraints]:../test/cases/paren-mode.md#extending-indentation-constraints

This document describes the code inside [`parinfer.js`].

Links to function/var code are created by [`sync.sh`].

[`parinfer.js`]:../parinfer.js
[`sync.sh`]:../sync.sh

## Overview

In its simplest form, Parinfer is a formatter that processes a static file. It
produces new text by correcting either parens or indentation.

But to work smoothly while typing, Parinfer must relax its static rules by
looking at the position of your cursor and other things. This temporarily allows
you to enter an invalid state in order to get to a valid one.

Thus, we cover the design and implementation of Parinfer in two parts:

[Parinfer's home page]:http://shaunlebron.github.io/parinfer/

[__PART 1 - Parinfer on a static file__](#part-1---parinfer-on-a-static-file)

- [Processing the Text](#processing-the-text)
- [Finding Parens](#finding-parens)
- [Errors](#errors)
- [Cleaning](#cleaning)
  - [Tab Characters](#tab-characters)
  - [Unmatched Close Parens](#unmatched-close-parens)
- [Analyzing a Line](#analyzing-a-line)
  - [Indentation](#indentation)
  - [Paren Trail](#paren-trail)
- [Transformations](#transformations)
  - [Indent Mode](#indent-mode)
  - [Paren Mode](#paren-mode)
- [Subtleties](#subtleties)
  - [Absorbing Paren Trails](#absorbing-paren-trails)
  - [Preserving Relative Indentation](#preserving-relative-indentation)

[__PART 2 - Parinfer while typing__](#part-2---parinfer-while-typing)

- [The Cursor in Indent Mode](#the-cursor-in-indent-mode)
- [The Cursor in Paren Mode](#the-cursor-in-paren-mode)
- [Leading close-parens in Indent Mode](#leading-close-parens-in-indent-mode)
- [Correcting the Cursor Position](#correcting-the-cursor-position)
- [Preserving Relative Indentation while typing](#preserving-relative-indentation-while-typing)
- [Dangerous Quotes](#dangerous-quotes)
  - [String Corruption](#string-corruption)
  - [Comment Corruption](#comment-corruption)
  - [Risk Management](#risk-management)
- [Incremental Processing](#incremental-processing)
  - [Speed](#speed)
  - [Slower Languages](#slower-languages)

# Part 1 - Parinfer on a static file

Parinfer was built to work while typing, but it helps to first remove the
parameters required by human interaction.  Thus, we say "static file" to mean
some Lisp file that has been committed, shared, and ready for processing.

Parinfer performs a well-defined, full file text transformation in one pass.
Depending on the transformation mode, Parinfer will correct either indentation
or close-parens, according to standard Lisp formatting conventions.  The
following functions are available.  (See [API](README.md#api) for full details.)

- [`indentMode`] - uses indentation to correct parens
- [`parenMode`] - uses parens to correct indentation

## Processing the Text

Parinfer starts its processing with the following functions, each iteratively
calling the one below it:

- [`processText`]
- [`processLine`]
- [`processChar`]

We explicitly track the state of our system in a `result` object, initialized by
[`getInitialResult`].  Though it can be considered a global variable, it is
passed as the first argument to any function that accesses it—for clarity.

The processing functions above behave differently depending on the mode set
at [`result.mode`].

We store the original input lines separately and build the output as modified
copies of those lines.  We also track our current position in both the input and
output lines. We return errors in input coordinates since errors cause the
input text to be returned without changes.

|                  | input                                     | output                          |
|:-----------------|:------------------------------------------|:--------------------------------|
| text             | [`result.inputLines`]                     | [`result.lines`]                |
| current position | [`result.inputLineNo`], [`result.inputX`] | [`result.lineNo`], [`result.x`] |

## Finding Parens

Parinfer needs to know where the parens are, but it must ignore those found
inside certain forms:

```clj
"("  ; <-- ignore parens in strings
\(   ; <-- ignore parens inside characters (escaped literals)

; ( <--- ignore parens in comments
```

To make sure we ignore these parens, we toggle certain boolean flags when
crossing the boundaries of these token types:

- [`result.isInComment`]
- [`result.isInStr`]
- [`result.isEscaping`]
- [`result.isInCode`]

Once we have this, we can keep a stack of parentheses, [`result.parenStack`],
as we scan a file:

- _Push_ open-parens onto the stack when encountered
- _Peek_ the stack to verify that the parent open-paren matches the next close-paren
- _Pop_ the stack when matching close-parens are encountered

The [`onChar`] function determines what to do for each character that is
encountered.  That is, it dispatches to operations which modify our boolean
flags and paren stack.  It is also a convenient place to do some of the
transformations we will discuss next.

## Errors

When errors are encountered that prevent us from completing our processing, we
`throw` an error object created by our [`error`] function, passing one of the
following enumerated error types.

- [`ERROR_UNCLOSED_QUOTE`] - a string was not closed
- [`ERROR_UNMATCHED_CLOSE_PAREN`]
  - [`ERROR_UNMATCHED_OPEN_PAREN`], what the close-paren was expected to match, if any
- [`ERROR_UNCLOSED_PAREN`] - open-paren not closed (if mismatched, the above error would be thrown instead)
- [`ERROR_QUOTE_DANGER`] - see section on [Dangerous Quotes](#dangerous-quotes)
- [`ERROR_EOL_BACKSLASH`] - ending a line with a `\` is not likely valid in lisp
- [`ERROR_UNHANDLED`] - any unhandled exception is given this error type

Errors are caught at [`processText`], normalized by [`processError`], and returned
to the user in [`publicResult`].

Returning the error position is straightforward when it's at the processor's
current input position.  But sometimes we may not know that a token is invalid
until encountering the end of a line or end of the file, for example. Thus, we
use the [`cacheErrorPos`] function if a token is _potentially_ invalid. It
stores the current input position for the given error type, which is eventually
used by the [`error`] function if called at a later time with the same error
type.

## Cleaning

Parinfer will remove or replace some characters as a necessary step toward the
main transformations.

#### Tab Characters

We replace tabs outside strings with two spaces, removing the possibility of
ambiguous character alignment.

_This operation happens at [`onTab`], committed by [`commitChar`]._

#### Unmatched Close Parens

Unmatched close-parens inside nested expressions cannot be resolved safely.

In v1, we erased them when encountered in order to keep things balanced but this
forced the user to manually fix the close-parens moved to the end of the line.

In v2, to keep this from happening under the user's nose, we now suspend Indent
Mode until fixed. We expect editor plugins to highlight the offending paren and
wait for resolution before resuming inference.

See [#131] for context summary.  If you wish to solve this problem, you can adjust
the expected outcomes for these [test cases] to test your implementation.

[#131]:https://github.com/shaunlebron/parinfer/issues/131
[test cases]:https://github.com/shaunlebron/parinfer/blob/master/lib/test/cases/indent-mode.md#unmatched-close-parens

_This detection happens at [`onUnmatchedCloseParen`] and [`onLeadingCloseParen`]._

## Analyzing a Line

Parinfer needs to analyze each line in order to locate two main areas of interest:

#### Indentation

Indentation is the number of space characters at the start of a line, shown
with underscores below.  Indentation is ignored for lines starting inside a
string and any empty lines (i.e. truly empty or only whitespace+comment).
Notice that we indent every line with one space below just to show
_zero-length_ indentation with a single underscore.

```clj
_(defn foo [x]
___(+ x 1))

_(let [x 1
                   ;; Whitespace before a comment doesn't count.
_______y 2
_______z "hello
          there"]  ;; Whitespace inside a string doesn't count.
___(+ x y))
```

_Indentation length is the value at [`result.x`] when [`onIndent`] is called._

#### Paren Trail

The Paren Trail is the trail of close-parens at the end of a line, shown with
carets below.  Notice that comments are allowed after these parens.  Also
notice that any whitespace before a close-paren is considered part of the Paren
Trail.

```clj
(foo)
    ^

(foo (+ 2 3) [(bar)] )    ;; comment
                  ^^^^

(foo   )))
    ^^^^^^
```

If a line does not have a Paren Trail, but _can_ have one inserted, we
represent this location with an empty Paren Trail.  We show this with an
underscore below, similar to the way we show zero-length indentation.

```clj
(foo_

(foo (+ 2 3) [(bar_       ;; comment
```

If a line starts with a close-paren, it does NOT constitute a Paren Trail.
Rather, these "leading close-parens" are absorbed into their previous Paren
Trail.  We will cover this in a later section.

```clj
;; BEFORE
(foo
  (bar_
  )      ;; <--- leading close-paren is not a paren-trail
  ^
)        ;; <--- leading close-paren is not a paren-trail
^

;; AFTER
(foo
  (bar)) ;; <--- absorbed the leading close-parens
      ^^
```

_The Paren Trail is stored in [`result.parenTrail`], updated at the end of
[`onChar`] and by [`onMatchedCloseParen`]._

## Transformations

The type of transformation performed is determined by the Mode.  These modes
can be described using definitions from the previous sections:

- __Indent Mode__
  - When we identify a _Paren Trail_, we pop it from the stack.  See [`popParenTrail`].
  - When we identify a line's _Indentation_, we identify all open-parens on the
    _Paren Stack_ to the right of the indentation.  Then we correct the last
    _Paren Trail_ such that it closes the aforementioned open-parens.  See [`correctParenTrail`].
- __Paren Mode__
  - When we identify a line's _Indentation_, we clamp the indentation to the following boundaries.  See [`correctIndent`].
    - leftmost: inside the open-paren at the top of the _Paren Stack_
    - rightmost: the open-paren matching the last close-paren in the last _Paren Trail_

For example, let's assume we are processing the following code:

```clj
(foo [a b
  (+ a b)])
```

Let's use our underscore and caret annotations to see the Indentation and Paren
Trail regions:

```clj
_(foo [a b_
___(+ a b)])
         ^^^
```

__The main idea__ here is that we are only looking at _two_ things a time: the
indentation that we just processed, and the previous paren trail.

Thus, in our example, we skip the first indentation since there is no previous
paren trail.  Let's highlight the next pair then:

```clj
 (foo [a b_
___(+ a b)])
```

In Indent Mode, we correct the Paren Trail to be the following:

```clj
 (foo [a b]
          ^
___(+ a b)])
```

In Paren Mode, we instead correct the Indentation to the following:

```clj
 (foo [a b_
_______(+ a b)])
```

The processing continues by making corrections for each subsequent pair of
indentation and paren trail regions.  The final paren trail is processed by
pairing it with a virtual indentation length of zero.

Now let's look at exactly how these corrections are performed.

### Indent Mode

In Indent Mode, we correct the Paren Trail by first deleting it.  Then, to
construct a new Paren Trail, we _close all unclosed open-parens to the right of
the indentation point_.  For example, given the following code:

```clj
(foo [a b]
  (+ a b)])
```

We identify the paren trail on line 1:

```clj
(foo [a b]
         ^
  (+ a b)])
```

Then we remove it with [`popParenTrail`].

```clj
(foo [a b_
  (+ a b)])
```

Next, we process the indentation on line 2:

```clj
(foo [a b_
__(+ a b)])
```

We find all unclosed open-parens to the right of the indentation point:

```clj
(foo [a b_
     ^
__(+ a b)])
```

Then we close the open-parens by inserting matching close-parens in the Paren Trail.
This happens at [`correctParenTrail`]:

```clj
(foo [a b]
         ^
__(+ a b)])
```

The process is repeated for the next line.  We always use a final indentation
point of zero to correct the last Paren Trail.

Processing is canceled if there is an unclosed quote.  See [`finalizeResult`].

### Paren Mode

In Paren Mode, we correct the indentation by clamping it to a valid range.  The
leftmost point is to the right of the most recent _unclosed_ open-paren, and the
rightmost point is to the left of the most recently _closed_ open-paren.

For example, given the following code:

```clj
(foo [a b
  (+ a b)])
```

We identify the indentation on line 2:

```clj
(foo [a b
__(+ a b)])
```

Then, we identify the most recent _unclosed_ open-paren:

```clj
(foo [a b
     ^
__(+ a b)])
```

There is no most recently _closed_ open-paren, so we ignore that bound.
Clamping to the leftmost boundary gives us a new indentation length:

```clj
(foo [a b
     ^
______(+ a b)])
```

This indentation correction process happens at [`correctIndent`].

Also, in order to have consistent formatting of Paren Trails between modes, we
remove any spaces inside a Paren Trail with [`cleanParenTrail`]:

```clj
(foo (bar [1 2 3 ] ) )  ;; BEFORE
                ^^^^^^
(foo (bar [1 2 3]))     ;; AFTER
                ^^^
```

And finally, processing is canceled if there is an unclosed quote or
open-paren.  See [`finalizeResult`].

## Subtleties

Here we explore extra subtle transformations that are added to the modes that
we require.

### Absorbing Paren Trails

As stated earlier, if a line starts with a close-paren, it is simply absorbed
into the previous Paren Trail.  Some examples:

```clj
;; BEFORE
(foo
  (bar)
  )
  ^

;; AFTER
(foo
  (bar))
       ^
```

```clj
;; BEFORE
(foo
  (bar
  ) z)
  ^

;; AFTER
(foo
  (bar)
   z) ^
```

_Indent Mode_ accomplishes this simply by removing these leading close-parens,
since moving it to the end of the previous line would result in it being
removed anyway by [`popParenTrail`].

_Paren Mode_ will move any leading close-parens to the end of the previous Paren
Trail.

_See the [`onLeadingCloseParen`] function for details._

### Preserving Relative Indentation

As we have seen, Paren Mode will correct the indentation of lines one-by-one.
This can result in the loss of relative indentation.  Let's walk through an
example:

```clj
     [a
      b
 (foo
   bar)]
```

Paren Mode first corrects the line containing `foo`:

```clj
     [a
      b
______(foo
   bar)]
```

Then it continues by correcting the line containing `bar`:

```clj
     [a
      b
      (foo
_______bar)]
```

Even though this is "correct" according to our previous rules, we wish to
preserve `bar`'s original two space indentation inside `foo`. Thus, we add an
extra space:

```clj
     [a
      b
      (foo
       _bar)]
```

Paren Mode acts further to preserve your custom indentation whenever possible.
It does this by trying to respect relative indentations of nested expressions.
In other words, when shifting a line containing an open-paren, we equally shift
all lines until the matching close-paren is met.

We accomplish this by tracking how much a line's indentation has changed and
store the value at [`result.indentDelta`].  Any subsequent line captured by an
open-paren on this line simply adds this value to its indentation length before
correction.  To allow for this to work for deeper expressions,
[`result.indentDelta`] is accumulated and copied to the [`result.parenStack`].
That way, a line must only check the `indentDelta` on top of the paren stack.

Comments are also shifted based on their indentation. Note that both comments
below will be indented if the first line is shifted.  The second comment is
outside the function, but will be shifted regardless.

```clj
(defn foo []
  ; comment 1
  bar)
  ; comment 2
```

_These operations happen at [`correctIndent`] and [`onOpenParen`]._

---

## Part 2 - Parinfer while typing

For the most part, using the rules we've described for a static file will work
when typing (i.e. auto-processing the content of an editor window or REPL as it
changes).  But Parinfer's behavior can sometimes be in conflict with a user's
expectations for normal editing behavior.  Thus, Parinfer will relax some rules
around the cursor to accomodate.

The `options` parameter is used for specifying cursor position.  This is then
stored to:

- [`result.cursorLine`] - zero-based line number
- [`result.cursorX`] - zero-based x position
- [`result.cursorDx`] - how much the cursor moved since last edit

When used for Live-Editing, the mode functions may be debounced on keypress for
performance.

### The Cursor in Indent Mode

Sometimes, Indent Mode has to relax its rules at the cursor so that it doesn't
get in the way of typing.

For example, suppose you just typed a space character below.  The
`|` is your cursor:

```clj
(def foo |)
```

Indent Mode would immediately delete the space, preventing you from adding some
space-separated element after `foo`:

```clj
(def foo|)
```

A similar example also applies to typing a `]` below:

```clj
(foo [1 2 3]|
      4 5 6
      7 8 9])
```

It would also get deleted immediately, preventing you from adding some element
after it:

```clj
(foo [1 2 3|
      4 5 6
      7 8 9])
```

To prevent both of these problems, we add a rule to clamp the Paren Trail's
left boundary to the cursor.  Let's revisit the first example to illustrate:

```clj
(def foo |)
```

Let's remove the cursor character and show the Paren Trail:

```clj
(def foo )
        ^^
```

When we clamp this Paren Trail's left boundary to the cursor, we have:

```clj
(def foo )
         ^
```

Thus, the space is not removed since it is no longer included in the Paren
Trail for removal.

Let's show the same thing for the second example:

```clj
(foo [1 2 3]|
      4 5 6
      7 8 9])
```

Again, we remove the cursor character and show the Paren Trail:

```clj
(foo [1 2 3]
           ^
      4 5 6
      7 8 9])
```

When we clamp this Paren Trail's left boundary to the cursor, we are left with
a zero-length Paren Trail:

```clj
(foo [1 2 3]_
      4 5 6
      7 8 9])
```

Thus, the `]` is not removed since it is no longer included in the Paren
Trail for removal.  After processing the rest, we are left with:

```clj
(foo [1 2 3]
      4 5 6
      7 8 9)
```

It's important to note that simply moving the cursor to another line will
reformat the line that was "suspended" by this cursor rule, restoring the full
rules of Indent Mode.

_This operation happens at [`clampParenTrailToCursor`]._

### The Cursor in Paren Mode

Paren Mode must also relax its rules so that it doesn't get in the way of
typing.

For some of the same reasons mentioned in the previous section, Paren Mode
allows you to insert spaces inside the Paren Trail if the cursor is on that
line:

```clj
(foo (bar [1 2 3]) |)
```

Paren Mode does this by not calling [`cleanParenTrail`] on the cursor's line.

Also, suppose you press enter when your cursor is at `|` below:

```clj
(foo
  bar|)
```

After pressing enter, a new line will be inserted (with some indentation if
your editor has auto-indent).

```clj
(foo
  bar
 |)
```

But according to Paren Mode's rules, the close-paren will be moved back to the
previous line:

```clj
(foo
  bar)
 |
```

This does not matter in Indent Mode because the close-paren will be moved to
the current line after we type something, but in Paren Mode, we must add a new
rule to allow close-parens at the start of a line if there is a cursor before
it.

```clj
(foo
  bar
 |)
```

This allows us to type something into this new line without the close-paren
being immediately displaced.  See [`onLeadingCloseParen`] for details.

And again, it's important to note that simply moving the cursor to another line
will reformat the line that was "suspended" by this cursor rule, restoring the
full rules of Paren Mode.

### Leading close-parens in Indent Mode

Leading close-parens can cause many problems that can be fixed by paren mode,
so we exit to paren mode when they are detected.

For example, it is convenient to keep trailing parens in front of the cursor
after pressing enter or after deleting everything behind them:

```clj
(let [a 1
      |])
```

But return it after cursor moves away:

```clj
(let [a 1])
```

But we also need safety from inadvertent AST breakage.  For example,
Indent Mode should allow this intermediate state:

```clj
(let [a 1
      |] (+ a 2))
```

Moving the cursor away will cause Indent Mode to still detect the leading
close-paren, exit to Paren Mode, then fix the spacing to prevent inadvertent
breakage.

```clj
;; before
(let [a 1
      |] (+ a 2))

;; after
(let [a 1]
     (+ a 2))
```

To prevent weird things, indentation needs to be locked to respect
the leading close-paren.  Exiting to Paren Mode allows this and prevents further
AST breakage.

```clj
;; before
(let [a 1
  |] (+ a 2))

;; after
(let [a 1
      |] (+ a 2))
```

### Correcting the Cursor Position

When Parinfer adds, removes, or replaces parts of a line, the user will expect
the cursor to shift appropriately.  For example, suppose we just pressed enter
below (where `|` is the cursor):

```clj
(let [x 1
|])
```

Paren Mode will correct the text, but the cursor will be left behind:

```clj
(let [x 1
|     ])
```

As another example, suppose we type an unmatched `}`:

```clj
(foo}|)
```

Parinfer will delete the `}`, but if the cursor isn't corrected, it'll look
like it jumped over the next character:

```clj
(foo)|
```

To fix this, we must monitor when Parinfer edits a line because these changes
are the source of motion for the cursor.  [`replaceWithinLine`] is called
anytime such a change occurs, so it in turn calls [`shiftCursorOnEdit`] to perform
the necessary cursor changes.

Generally, a line edit replaces of a region with new text.  An insertion and
removal can be described as special case replacements:

- an _insertion_ replaces a zero-width region with text
- a _removal_ replaces a region with nothing

Given this, we assume a simplified heuristic that if a region of a line shrinks
or grows, the cursor will keep the same relative distance to the right side of
the region.  But we only apply this if the cursor is to the right of the
region.  We do not consider the case of the cursor being inside the region
since it doesn't seem to come up in practice.

Unfortunately, this gets tricky when _inserting_ text directly at the cursor
because we have conflicting expectations for different cases.

For example, if indentation is inserted at the cursor, we want the cursor to be
pushed forward:

```clj
|foo      ;; BEFORE
  |foo    ;; AFTER
```

For another example, typing an open-paren in Indent Mode may result in a
close-paren being inserted at the cursor.  In this case, we want the cursor
to stay put instead of being pushed forward:

```clj
(|        ;; BEFORE
(|)       ;; AFTER
```

As a hack, we distinguish between these two cases by only pushing the cursor
forward if the cursor is at the front of the line. This works because
close-paren insertions will never happen at the front of a line.  See
[`isCursorAffected`].


### Preserving Relative Indentation while typing

> __NOTE__: Indent Mode currently has experimental support for this as well.

Unfortunately, Paren Mode needs extra help to preserve relative indentation
when the user inserts or deletes text behind an open-paren.  For example:

```clj
|(foo
   bar)
```

If the user inserts a space before `(foo`, we get:

```
_|(foo
   bar)
```


We expect the following line to be indented to preserve the relative indentation:

```
 |(foo
   _bar)
```

But as discussed previously, Paren Mode uses [`result.indentDelta`] to preserve
relative indentation.  So unless we influence this value at the cursor
whenever the user inserts or removes text, the relative indentation will not be
preserved.

Thus, we require the user's editor to send a `cursorDx` option as API input.
This is simply calculated by subtracting the previous cursor X position from
the current cursor X position, _but only when an edit takes place_.  Some
examples:

_Inserting_ a character results in a `cursorDx` of 1:

```diff
- |(foo
+  |(foo
```

_Pasting_ multiple lines of text below results in a `cursorDx` of 5:

```diff
- |(foo
+  pasted
+  text|(foo
```

_Pressing enter_ below results in a `cursorDx` of -4:

```diff
- (bar |(foo
+ (bar
+  |(foo
```

To make use of this information, the [`handleCursorDelta`] function adds
[`result.cursorDx`] to [`result.indentDelta`] when it reaches the cursor, thereby
preserving relative indentation of subsequent lines as expected.

Comments are also shifted based on their indentation. Note that both comments
below will be indented if the first line is shifted.  The second comment is
outside the function, but will be shifted regardless.

```clj
(defn foo []
  ; comment 1
  bar)
  ; comment 2
```

_This operation happens at [`checkIndent`], which  uses [`getParentOpenerIndex`]
to find the open-paren that it should shift with._

### Dangerous Quotes

Inserting a quote can sometimes cause a problem that is hard to track down.
This is caused by syntax comments interfering with the detection of unbalanced
strings.

#### String Corruption

Suppose we have the following:

```clj
(foo
  "bar;")
```

Now suppose I want to insert the string `"pez"` after `foo`, like so:

```clj
(foo "pez"
  "bar;")
```

The problem happens as soon as I type the first quote, before I can finish
the rest of the string:

```clj
(foo "|
  "bar;")
```

Take a moment to look at the expression again.  Even though we haven't closed
our current string yet, there are no unclosed quotes.  This is because the
semicolon is now commenting out the last quote, which we did not intend
to create a temporarily balanced set of quotes.

Thus, Indent Mode will result in the following:

```clj
(foo "
  "bar);")
```

Thus, through this seemingly innocuous string insertion, we have managed to
corrupt the string `"bar;"` to `"bar);"`:

```diff
 (foo "pez"
-  "bar;")
+  "bar);")
```

#### Comment Corruption

The same problem can be seen from a different perspective in the following
example.  Suppose we have a comment that lists some special characters:

```clj
(foo
  ; " and ( and [
  bar)
```

This time, inserting a quote before the comment results in the contents of the _comment_
to be corrupted like so:

```clj
(foo "|
  ; " and ( and [])
  bar)
```

What was previously a comment is now being treated as code, and thus parens
have been added/altered.  Thus, after completing another seemingly innocuous
string insertion, we have corrupted a comment:

```diff
 (foo "pez"
-  ; " and ( and [
+  ; " and ( and [])
   bar)
```

#### Risk Management

##### The Root Cause

The astute observer may have also realized that the problems occurred either
before or after _an unbalanced quote was found inside a comment_.  This is in
fact what interferes with how Parinfer detects unclosed quotes, and thus
prevents Parinfer from canceling its processing.  Thus, we look for these kinds
of dangerous quotes inside comments.

```clj
(foo "|
  "bar);")          ;; <-- dangerous quote from String Corruption example
        ^
```

```clj
(foo
  ; " and ( and [   ;; <-- dangerous quote from Comment Corruption example
    ^
  bar)
```

> Interestingly, none of this would be a problem if programmers used
> directional quotes `“` `”` in their code.  Instead, the non-directional quote
> `"` must infer its direction from the number of quotes behind it. (Imagine
> the difficulty of working with non-directional parens!)  Thus, the root cause
> of this problem is enabled by a perfect storm of unbalanced, non-directional
> quotes and their ability to be temporarily balanced when accidentally thrust
> into or out of comments.

##### Prevention

It turns out that canceling the processing when "dangerous quotes" are detected
either prevents the problems or can provide a warning to the user early enough
to fix it.

As long as no dangerous quotes were detected beforehand, it seems that no
corruption can happen while typing out a comment or a string.  Rather,
corruption seems to only happen when starting a new string before a comment
housing a dangerous quote, so it stands to reason that we can provide a warning
before the catalyst quote is inserted.

The warning will not prevent the catalyst quote from being inserted and causing
a problem.  It will simply suspend processing until the code contains no
dangerous quotes.  Parinfer cannot deduce what the user intends or doesn't
intend to constitute balanced quotes.  Thus, the user must react to these
emitted warnings with care.

It should be noted that contiguous comments are considered part of the same comment
when deducing unbalanced strings.  This allows multiline strings
to be commented without triggering a warning:

```clj
(defn foo
  ; "multiline   ;; <-- dangerous unbalanced quote!
  ; string"      ;; <-- but this contiguous comment rebalances it.
  bar)
```

Detection of dangerous quotes inside comments is done simply by toggling
[`result.quoteDanger`] everytime an unescaped quote is encountered inside a
comment.  This happens in [`onQuote`], and we check if an error should be
reported at [`onIndent`] since that moment signifies that no contiguous
comments follow.

### Incremental Processing

You may be wondering why we have to process the whole file again after only a
small portion of the file has changed.  The short answer is that I haven't
figured out the best way to do this yet.  But the implementation seems fast
enough for full-file processing every time.

#### Speed

The current JS and JVM implementations can process a ~2800 line file at 60-100
times a second, which is close to the smallest visual delay we can perceive.

Fast typists can type around 8 characters per second (~120wpm), so Parinfer can
process a file 8-10 times in between these fast keystrokes.

#### Slower Languages

If Parinfer must be ported to a slower language, we may not be able to process
the full file everytime.  Rather, we can just process the top-level expressions
affected by the edit.

There is a pending feature here: [#91](https://github.com/shaunlebron/parinfer/issues/91)

## Questions?

I appreciate feedback! If I left something out, got something wrong, or you just
have questions or feedback, you can [email me].  I'll answer questions as soon
as I can.

[email me]:shaunewilliams@gmail.com

<!-- END OF DOC: All content below is overwritten by `sync.sh` -->
[`UINT_NULL`]:../parinfer.js#L43
[`INDENT_MODE`]:../parinfer.js#L45
[`PAREN_MODE`]:../parinfer.js#L46
[`BACKSLASH`]:../parinfer.js#L48
[`BLANK_SPACE`]:../parinfer.js#L49
[`DOUBLE_SPACE`]:../parinfer.js#L50
[`DOUBLE_QUOTE`]:../parinfer.js#L51
[`NEWLINE`]:../parinfer.js#L52
[`TAB`]:../parinfer.js#L53
[`LINE_ENDING_REGEX`]:../parinfer.js#L55
[`MATCH_PAREN`]:../parinfer.js#L57
[`RUN_ASSERTS`]:../parinfer.js#L67
[`ERROR_QUOTE_DANGER`]:../parinfer.js#L540
[`ERROR_EOL_BACKSLASH`]:../parinfer.js#L541
[`ERROR_UNCLOSED_QUOTE`]:../parinfer.js#L542
[`ERROR_UNCLOSED_PAREN`]:../parinfer.js#L543
[`ERROR_UNMATCHED_CLOSE_PAREN`]:../parinfer.js#L544
[`ERROR_UNMATCHED_OPEN_PAREN`]:../parinfer.js#L545
[`ERROR_LEADING_CLOSE_PAREN`]:../parinfer.js#L546
[`ERROR_UNHANDLED`]:../parinfer.js#L547
[`errorMessages`]:../parinfer.js#L549
[`API`]:../parinfer.js#L1797
[`isBoolean`]:../parinfer.js#L77
[`isArray`]:../parinfer.js#L81
[`isInteger`]:../parinfer.js#L85
[`isPositiveInt`]:../parinfer.js#L91
[`isString`]:../parinfer.js#L95
[`isChar`]:../parinfer.js#L99
[`isArrayOfChars`]:../parinfer.js#L103
[`arraySize`]:../parinfer.js#L110
[`strLen`]:../parinfer.js#L117
[`strConcat`]:../parinfer.js#L124
[`getCharFromString`]:../parinfer.js#L132
[`replaceWithinString`]:../parinfer.js#L148
[`repeatString`]:../parinfer.js#L162
[`getLineEnding`]:../parinfer.js#L180
[`isStackEmpty`]:../parinfer.js#L193
[`peek`]:../parinfer.js#L200
[`stackPop`]:../parinfer.js#L218
[`stackPush`]:../parinfer.js#L238
[`arraySlice`]:../parinfer.js#L255
[`transformChange`]:../parinfer.js#L288
[`transformChanges`]:../parinfer.js#L344
[`parseOptions`]:../parinfer.js#L366
[`initialParenTrail`]:../parinfer.js#L391
[`getInitialResult`]:../parinfer.js#L405
[`cacheErrorPos`]:../parinfer.js#L559
[`createError`]:../parinfer.js#L570
[`isCursorAffected`]:../parinfer.js#L630
[`shiftCursorOnEdit`]:../parinfer.js#L638
[`replaceWithinLine`]:../parinfer.js#L651
[`insertWithinLine`]:../parinfer.js#L660
[`initLine`]:../parinfer.js#L664
[`commitChar`]:../parinfer.js#L681
[`clamp`]:../parinfer.js#L696
[`isOpenParen`]:../parinfer.js#L719
[`isCloseParen`]:../parinfer.js#L723
[`isValidCloseParen`]:../parinfer.js#L727
[`isWhitespace`]:../parinfer.js#L734
[`isClosable`]:../parinfer.js#L740
[`isCommentChar`]:../parinfer.js#L746
[`checkCursorHolding`]:../parinfer.js#L766
[`trackArgTabStop`]:../parinfer.js#L792
[`onOpenParen`]:../parinfer.js#L809
[`setCloser`]:../parinfer.js#L842
[`onMatchedCloseParen`]:../parinfer.js#L848
[`onUnmatchedCloseParen`]:../parinfer.js#L870
[`onCloseParen`]:../parinfer.js#L890
[`onTab`]:../parinfer.js#L900
[`onCommentChar`]:../parinfer.js#L906
[`onNewline`]:../parinfer.js#L914
[`onQuote`]:../parinfer.js#L919
[`onBackslash`]:../parinfer.js#L933
[`afterBackslash`]:../parinfer.js#L937
[`onChar`]:../parinfer.js#L952
[`isCursorLeftOf`]:../parinfer.js#L982
[`isCursorRightOf`]:../parinfer.js#L991
[`isCursorInComment`]:../parinfer.js#L1000
[`handleChangeDelta`]:../parinfer.js#L1004
[`resetParenTrail`]:../parinfer.js#L1019
[`isCursorClampingParenTrail`]:../parinfer.js#L1029
[`clampParenTrailToCursor`]:../parinfer.js#L1037
[`popParenTrail`]:../parinfer.js#L1073
[`getParentOpenerIndex`]:../parinfer.js#L1093
[`correctParenTrail`]:../parinfer.js#L1272
[`cleanParenTrail`]:../parinfer.js#L1297
[`setMaxIndent`]:../parinfer.js#L1327
[`appendParenTrail`]:../parinfer.js#L1339
[`invalidateParenTrail`]:../parinfer.js#L1354
[`checkUnmatchedOutsideParenTrail`]:../parinfer.js#L1358
[`rememberParenTrail`]:../parinfer.js#L1365
[`updateRememberedParenTrail`]:../parinfer.js#L1404
[`finishNewParenTrail`]:../parinfer.js#L1420
[`addIndent`]:../parinfer.js#L1438
[`shouldAddOpenerIndent`]:../parinfer.js#L1448
[`correctIndent`]:../parinfer.js#L1454
[`onIndent`]:../parinfer.js#L1476
[`checkLeadingCloseParen`]:../parinfer.js#L1496
[`onLeadingCloseParen`]:../parinfer.js#L1503
[`onCommentLine`]:../parinfer.js#L1532
[`checkIndent`]:../parinfer.js#L1565
[`makeTabStop`]:../parinfer.js#L1577
[`getTabStopLine`]:../parinfer.js#L1589
[`setTabStops`]:../parinfer.js#L1597
[`processChar`]:../parinfer.js#L1639
[`processLine`]:../parinfer.js#L1660
[`finalizeResult`]:../parinfer.js#L1689
[`processError`]:../parinfer.js#L1705
[`processText`]:../parinfer.js#L1717
[`publicResult`]:../parinfer.js#L1742
[`indentMode`]:../parinfer.js#L1781
[`parenMode`]:../parinfer.js#L1786
[`smartMode`]:../parinfer.js#L1791
[`result.mode`]:../parinfer.js#L408
[`result.smart`]:../parinfer.js#L409
[`result.origText`]:../parinfer.js#L411
[`result.origCursorX`]:../parinfer.js#L412
[`result.origCursorLine`]:../parinfer.js#L413
[`result.inputLines`]:../parinfer.js#L415
[`result.inputLineNo`]:../parinfer.js#L418
[`result.inputX`]:../parinfer.js#L419
[`result.lines`]:../parinfer.js#L421
[`result.lineNo`]:../parinfer.js#L422
[`result.ch`]:../parinfer.js#L423
[`result.x`]:../parinfer.js#L424
[`result.indentX`]:../parinfer.js#L425
[`result.parenStack`]:../parinfer.js#L427
[`result.parenTrail`]:../parinfer.js#L437
[`result.parenTrails`]:../parinfer.js#L440
[`result.returnParens`]:../parinfer.js#L442
[`result.parens`]:../parinfer.js#L443
[`result.cursorX`]:../parinfer.js#L445
[`result.cursorLine`]:../parinfer.js#L446
[`result.prevCursorX`]:../parinfer.js#L447
[`result.prevCursorLine`]:../parinfer.js#L448
[`result.commentChars`]:../parinfer.js#L450
[`result.openParenChars`]:../parinfer.js#L451
[`result.closeParenChars`]:../parinfer.js#L452
[`result.selectionStartLine`]:../parinfer.js#L454
[`result.changes`]:../parinfer.js#L456
[`result.isInCode`]:../parinfer.js#L458
[`result.isEscaping`]:../parinfer.js#L459
[`result.isEscaped`]:../parinfer.js#L460
[`result.isInStr`]:../parinfer.js#L461
[`result.isInComment`]:../parinfer.js#L462
[`result.commentX`]:../parinfer.js#L463
[`result.quoteDanger`]:../parinfer.js#L465
[`result.trackingIndent`]:../parinfer.js#L466
[`result.skipChar`]:../parinfer.js#L467
[`result.success`]:../parinfer.js#L468
[`result.partialResult`]:../parinfer.js#L469
[`result.forceBalance`]:../parinfer.js#L470
[`result.maxIndent`]:../parinfer.js#L472
[`result.indentDelta`]:../parinfer.js#L473
[`result.trackingArgTabStop`]:../parinfer.js#L476
