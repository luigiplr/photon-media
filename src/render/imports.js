/* Electron */
import { shell, remote } from 'electron'

/* General */
import { EventEmitter } from 'events'
import { v4 as uuid } from 'node-uuid'
import _ from 'lodash'
import fs from 'fs'
import localforage from 'localforage'
import moment from 'moment'


/* React */
import reactPolymer from 'react-polymer'
import React, { Component } from 'react'
import { render } from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


/* Workers */
import getPort from 'get-port'
import express from 'express'
import { createServer } from 'http'
import socketIO from 'socket.io'
import path from 'path'
import Worker from 'workerjs'
