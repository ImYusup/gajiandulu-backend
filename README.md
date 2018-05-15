# gajiandulu-api

---

## About

This project uses [Node](https://nodejs.org/). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1.  Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
    Required version:
    ```
    "node": "^9.0.0",
    "yarn": ">= 0.18.0"
    ```
2.  Install your dependencies

    ```
    cd path/to/gajiandulu-api; npm install
    ```

    or

    ```
    cd path/to/gajiandulu-api; yarn
    ```

3.  Configure your database connection

    ### Create .env file in root directory of the project

    Write this in `.env` file

    > .env

    ```
    DEV_USER=your_mysql_username
    DEV_PASS=your_mysql_password
    DEV_DATABASE=bibitnomic_dev
    ```

4.  Migrate database using sequelize
    Run these commands in order

    ```
    node_modules/.bin/sequelize db:create
    ```

    ```
    node_modules/.bin/sequelize db:migrate
    ```

5.  Start your app

    ```
    npm start
    ```

## Specification

Read specification in this link

* [GajianDulu Specifications](https://gitlab.com/refactory-bibitnomic/gajian-dulu/wikis/)

## Testing

Simply run `npm run test` and all your tests in the `test/` directory will be run.

## Changelog

**0.1.0**

* Initial release

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
