# Testing

ngCable is in use by many people. In order to ensure quality and prevent regressions, all contributions require unit tests proving that the contribution:

1. Fixes a bug
2. Performs new functionality as expected
3. Behaves in a predictable manner when misused (bad input given as an option for example)

In addition, where a contribution is aimed at resolving a bug or implementing a feature that can only be measured in a real browser, an e2e test proving the expected behaviour should be included.

# README

If your PR adds new behaviour or modifies existing behaviour, the README should be updated.

# Changelog

Changelog must reflect the change you did introduce, under the relevant version.

# Git History

Please follow the convention of Git commit messages, which you can read more about from [here](tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

In a nutshell use imparative style like:

1. Add spec file for the channels module
2. Update changelog
3. Bump up Bower component version

These messages should not exceed 50 chars. It would be great if you added some more info in the line bellow the commit messages. That will help you when you open a PR, in which the description you entered will be added to the PR.

# Coding style

> All code in any code-base should look like a single person typed it, no matter how many people contributed.

This section describes coding style guide of the repo. You might not agree with it and that's fine but if you're going to send PRs treat this guide as a law.

##### There are not too much of rules to follow:

- indent style is 4 spaces
- always use single quotes 
- one space after `if`, `for`, `while`, etc.
- no spaces between `(`,`)` and statement content
- use one `var` per variable unless you don't assign any values to it (and it's short enough)
- always `'use strict'` mode
- always use strict comparisons: `===` and `!==`
- use semicolons
- don't use comma-first notation

##### These tools will help your IDE to remind you with some of the rules listed above:

- [EditorConfig](http://editorconfig.org)
- [JSHint](http://jshint.com)
- [ESLint](http://eslint.org)
