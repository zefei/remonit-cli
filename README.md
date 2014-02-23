remonit-cli
===========

This is a set of command line tools to be used with [Remonit dashboards](http://zef.io/remonit/), a remote monitoring tool. Mainly, remonit-cli allows user to pipe console output to other devices, like this

```
node server.js | remonit-push 'node server output'
```

Installation
------------

Install the cli commands with [npm](https://www.npmjs.org/):

```
npm install -g remonit-cli
```

During npm install, it will tell you that you need to edit ~/.remonit.json. It is the configuration file fore remonit-cli, and you must at least have your Remonit login info inside it. It will look like this:

```
{
  "email": "my_remonit_account@gmail.com",
  "password": "my_password"
}
```

Now you are done.

Usage
-----

Currently, remonit-cli contains two commands: remonit-push and remonit-pull. Both are very straightforward.

### remonit-push

Usage: `remonit-push <stats_name>`

This pushes all input from stdin to your Remonit stats 'stats_name'.

Example: `ls -l | remonit-push 'my files'`

### remonit-pull

Usage: `remonit-pull`

This pulls all of your current stats and print them as a json.

License
-------
MIT
