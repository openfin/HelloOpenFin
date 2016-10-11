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
[Hello OpenFin Installer](https://dl.openfin.co/services/download?fileName=hello-openfin-installer&config=https://cdn.openfin.co/demos/hello/app.json).

On a Mac or Linux machine, you can install Hello OpenFin via a Terminal command in these 2 steps:
```
$ npm install -g openfin-cli 
$ openfin --launch --config https://demoappdirectory.openf.in/desktop/config/apps/OpenFin/HelloOpenFin/app.json
```

## Localhost Example
* Make sure you have [node](https://nodejs.org/en/) installed.
* Clone this repository.
* Open a command-line terminal and navigate to the **HelloOpenFin** directory.
* In the terminal, run `npm install`.
* After all packages have been installed, run `grunt serve`.
* Download a locally running version with this [Local Hello OpenFin Installer link](https://dl.openfin.co/services/download?fileName=hello-openfin-local&config=http://localhost:5000/app_local.json).
* Unzip and run the installer.
