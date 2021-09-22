

#### Installation

Spectrum has four big installation steps:

1. **Install RethinkDB**: See [the RethinkDB documentation](https://rethinkdb.com/docs/install/) for instructions on installing it with your OS.
2. **Install Redis**: See [the Redis documentation](https://redis.io/download) for instructions on installing it with your OS.
3. **Install yarn**: We use [yarn](https://yarnpkg.com) to handle our JavaScript dependencies. (plain `npm` doesn't work due to our monorepo setup) See [the yarn documentation](https://yarnpkg.com/en/docs/install) for instructions on installing it.
4. **Install the dependencies**: Because it's pretty tedious to install the dependencies for each worker individually we've created a script that goes through and runs `yarn install` for every worker for you: (this takes a couple minutes, so dive into the [technical docs](./docs) in the meantime)

```sh
node shared/install-dependencies.js
```

You've now finished installing everything! Let's migrate the database and you'll be ready to go :100:

#### Migrating the database

When you first download the code and want to run it locally you have to migrate the database and seed it with test data. First, start rethinkdb in its own terminal tab:

```sh
rethinkdb
```

Then, in a new tab, run these commands:

```sh
yarn run db:migrate
yarn run db:seed
# ⚠️ To empty the database (e.g. if there's faulty data) run yarn run db:drop
```

There's a shortcut for dropping, migrating and seeding the database too:

```sh
yarn run db:reset
```

The `testing` database used in end to end tests is managed separately. It is built, migrated, and seeded when you run:

```sh
yarn run start:api:test
```

To drop the `testing` database, go to http://localhost:8080/#tables while `rethinkdb` is running, and click Delete Database on the appropriate database.

#### Getting the secrets

While the app will run without any secrets set up, you won't be able to sign in locally. To get that set up, copy the provided example secrets file to the real location:

```
cp now-secrets.example.json now-secrets.json
```

> Note: If you're an employee at Spectrum we've got a more complete list of secrets that also lets you upload images etc. in 1Password, search for "now-secrets.json" to find it.

Now you're ready to run the app locally and sign into your local instance!

### Running the app locally

#### Background services

Whenever you want to run Spectrum locally you have to have RethinkDB and Redis running in the background. First start rethinkdb like we did to migrate the database:

```sh
rethinkdb
```

Then (without closing the rethinkdb tab!) open another tab and start Redis:

```sh
redis-server
```

#### Start the servers

Depending on what you're trying to work on you'll need to start different servers. Generally, all servers run in development mode by doing `yarn run dev:<workername>`, e.g. `yarn run dev:hermes` to start the email worker.

No matter what you're trying to do though, you'll want to have the API running, so start that in a background tab:

```
yarn run dev:api
```

#### Develop the web UI

To develop the frontend and web UI run

```
yarn run dev:web
```

