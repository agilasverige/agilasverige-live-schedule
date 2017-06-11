# Agila Sverige live app [![Build Status](https://travis-ci.org/agilasverige/live-schedule.svg?branch=master)](https://travis-ci.org/agilasverige/live-schedule)

Basic web application to display live schedule, as imported from csv file.

## Usage

### Updating-scheule
1. Export CSV file for the program. Save it under `data/<year>/program.csv`.
2. Export CSV file for the long descriptions. Save it under `data/<year>/beskrivningar.csv`
3. Run `npm run-script update` or `node update.js` to update.

### Production
1. Get tarball of repo
2. Make sure below is started on reboot, may differ depending on OS.
3. `npm install --production`
4. `npm build`
5. Serve everything under the `public/` folder.
6. Reverse proxy port 3000 for http and/or https.

### Development
```
npm install
npm start
```

Poke browser to http://localhost:3000/

## Authors ##
Pia Fåk Sunnanbo <@frusunnanbo> and Samuel Carlsson <samuel.carlsson@gmail.com>

See [contributors](https://github.com/vidstige/jadb/graphs/contributors) for a full list.

## License ##
This project is released under the Apache License Version 2.0, see [LICENSE.md](LICENSE.md) for more information.
