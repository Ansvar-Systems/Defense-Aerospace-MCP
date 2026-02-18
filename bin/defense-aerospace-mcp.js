#!/usr/bin/env node
"use strict";

const { start } = require("../src/index");

start({ disableHttp: true });
