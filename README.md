OpenFin Hello World
============
[![Build Status](https://travis-ci.org/openfin/HelloOpenFin.svg?branch=master)](https://travis-ci.org/openfin/HelloOpenFin)

Hello OpenFin is an HTML5/Javascript application that showcases several features available in the [OpenFin](http://openfin.co/) Runtime. The Hello OpenFin application allows users to create desktop notifications and child windows, and simulate general animations.

## System Requirements

- [OpenFin Runtime](https://openfin.co/)
- [NodeJS](http://nodejs.org/) (For static file hosting, can be replaced)

## Documentation

Documentation for the OpenFin Runtime API can be found [here](https://openfin.co/developers/javascript-api/).

## Install

```sh
$ npm install
```

## Demo Installer
On a Windows machine, you can install Hello OpenFin via this installer:
[Hello OpenFin Installer](https://install.openfin.co/download/?config=https%3A%2F%2Fcdn.openfin.co%2Fdemos%2Fhello%2Fapp.json&fileName=HelloOpenFin&supportEmail=support%40openfin.co).

On a Mac or Linux machine, you can install Hello OpenFin via a Terminal command in these 2 steps:
```
$ npm install -g openfin-cli 
$ openfin --launch --config https://cdn.openfin.co/demos/hello/app.json
```

## Localhost Example
* Make sure you have [node](https://nodejs.org/en/) installed.
* Clone this repository.
* Open a command-line terminal and navigate to the **HelloOpenFin** directory.
* In the terminal, run `npm install`.
* After all packages have been installed, run `grunt serve`.
* Download a locally running version with this [Local Hello OpenFin Installer link](https://install.openfin.co/download?fileName=hello-openfin-local&config=http://localhost:5000/app_local.json).
* Unzip and run the installer.

## License
MIT

The code in this repository is covered by the included license.  If you run this code, it may call on the OpenFin RVM or OpenFin Runtime, which are subject to OpenFin’s [Developer License](https://openfin.co/developer-agreement/). If you have questions, please contact support@openfin.co”

## Support
Please enter an issue in the repo for any questions or problems. Alternatively, please contact us at support@openfin.co 
