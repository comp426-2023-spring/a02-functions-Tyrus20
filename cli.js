#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));

if(args.h) {
    try {
        console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE')
        console.log('   -h            Show this help message and exit.')
        console.log('   -n, -s        Latitude: N positive; S negative.')
        console.log('   -e, -w        Longitude: E positive; W negative.')
        console.log('   -z            Time zone: uses tz.guess() from moment-timezone by default.')
        console.log('   -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.')
        console.log('   -j            Echo pretty JSON from open-meteo API and exit.')
        process.exit(0);
    } catch(error) {
        process.exit(1);
    }
}

const timezone = moment.tz.guess();
const latitude = args.n || -1 * args.s;
const longitude = args.e || -1 * args.w;
const days = args.d || 1;

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&timezone=' + timezone + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true');
const data = await response.json();
var galoshes;

if(args.j) {
    try {
        console.log(data);
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

if(data.daily.precipitation_hours[days] == 0) {
    galoshes = "You will not need your galoshes ";
} else {
    galoshes = "You might need your galoshes";
}

if (days == 0) {
    console.log(galoshes + "today.");
} else if (days > 1) {
    console.log(galoshes + "in " + days + " days.");
} else {
    console.log(galoshes + "tomorrow.");
}
