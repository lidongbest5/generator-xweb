# generator-xweb [![Build Status](https://secure.travis-ci.org/zzswang/generator-xweb.png?branch=master)](https://travis-ci.org/zzswang/generator-xweb)

"学骑自行车最快的方式就是先骑上去"

> This project is a yeoman generator, please read more about [Yeoman](http://yeoman.io) generator

## Features
- pure browser side project.
- restful api to connect to backend services.
- use npm as primary dependencies source.
- use bower as dependencies source.
- allow static files as dependencies.
- use browserify to unify all sources above.
- a fake server to allow work offline.
- automatically redirect http request and web socket to online server with ```gulp --online```
- common js; coding in human way.
- mocha test framework
- auto reload when files are changed. supported by gulp.
- open browser automatically, and sync user behavior between different devices. supported by browserSync.


## Getting Started

Install yeoman, run:

```bash
npm install -g yo
```

To install generator-xweb from npm, run:

```bash
npm install -g generator-xweb
```

Finally, initiate the generator:

```bash
yo xweb
```

## Start your project

Install gulp first, run:d

```bash
npm install -g gulp
```

Then start your project:

```bash
gulp
```

Find the readme in your project for more detail guide.


## License

MIT
