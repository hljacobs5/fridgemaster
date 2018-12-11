# Getting Started
* A macOS guide

### Dependencies

* Node.js - 6.1.0 or greater
* Knex - 0.15.2 or greater
* PostgreSQL database - 7.7.1

### Get it

If you're planning on contributing code to the project (which we [LOVE](CONTRIBUTING.md)), it is a good idea to begin by forking this repo using the `Fork` button in the top-right corner of this screen. You should then be able to use `git clone` to copy your fork onto your local machine.

    `git clone https://github.com/bottd/fridgemaster.git`

Jump into your new local copy of the Open Food Network:

    `cd fridgemaster`

And then add an `upstream` remote that points to the main repo:

    `git remote add upstream https://github.com/bottd/fridgemaster.git`

Fetch the latest version of `master` from `upstream` (ie. the main repo):

git fetch upstream master

Install your node dependencies by running

`$ npm i`


### Get it running

First, you need to create the database user the app will use by manually typing the following in your terminal:

```sh
$ sudo -u postgres psql -c "CREATE DATABASE fridgemaster"
```

To setup and seed database run these knex commands
```
$ knex migrate:latest
$ knex seed:run
```
### Testing

To setup your testing database

```
$ psql -c "CREATE DATABASE testmaster"
```
run `npm test` to see results

You can reference the knexfile.js to confirm.
