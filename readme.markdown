[![Build Status](https://travis-ci.org/wazery/ng-cable.svg)](https://travis-ci.org/wazery/ng-cable)

![ng-cable logo](http://i.imgur.com/hicMwNW.png?1)

# Angular Cable
Action Cable JS customized for Angular

## Usage

```
Usage: ng-cable [entry files] {OPTIONS}

Standard Options:

    --require, -r  A module name or file to bundle.require()
                   Optionally use a colon separator to set the target.

      --entry, -e  An entry point of your app

     --ignore, -i  Replace a file with an empty stub. Files can be globs.

    --exclude, -u  Omit a file from the output bundle. Files can be globs.

   --external, -x  Reference a file from another bundle. Files can be globs.

  --transform, -t  Use a transform module on top-level files.

    --command, -c  Use a transform command on top-level files.

  --standalone -s  Generate a UMD bundle for the supplied export name.
                   This bundle works with other module systems and sets the name
                   given as a window global if no module system is found.

       --debug -d  Enable source maps that allow you to debug your files
                   separately.

       --help, -h  Show this message

For advanced options, type `ng-cable --help advanced`.

Specify a parameter.
```

## Example Applications

I have created example applications for both Rails, and Angular sides. You can check them here by cloning this [repository](https://github.com/wazery/ng-cable-example-apps) and following the instructions of each submodule (application).

Here is a screenshot from the Angular example application:

![Angular app screenshot](http://i.imgur.com/m8WJWfL.png?1)


