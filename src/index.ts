import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

const hostPort = core.getInput('hostPort');
const containerPort = core.getInput('containerPort');
const characterSetServer = core.getInput('characterSetServer');
const collationServer = core.getInput('collationServer');
const mysqlVersion = core.getInput('mysqlVersion');
const mysqlRootPassword = core.getInput('mysqlRootPassword');
const mysqlDatabase = core.getInput('mysqlDatabase');
const mysqlUser = core.getInput('mysqlUser');
const mysqlPassword = core.getInput('mysqlPassword');
const volumes = core.getInput('volumes');

function run() {
  const echos: string[] = [];
  const commands: string[] = ['docker run'];

  if (volumes) {
    let volumeList: string[] = [];
    try {
      volumeList = JSON.parse(volumes);
    } catch (e) {
      core.setFailed(`invalid volumes: ${volumes}`);
    }
    if (!Array.isArray(volumeList)) {
      core.setFailed(`invalid volumes: ${volumes}`);
    }
    volumeList.forEach((volume: string) => {
      commands.push(`-v ${volume}`);
    });
  }

  if (mysqlRootPassword) {
    echos.push('use root superuser');
    commands.push(`-e MYSQL_ROOT_PASSWORD=${mysqlRootPassword}`);
  } else if (mysqlUser) {
    if (!mysqlPassword) {
      core.setFailed(`mysql password must not be empty when mysql user specify`);
    }
    echos.push('use specified user and password');
    commands.push(`-e MYSQL_RANDOM_ROOT_PASSWORD=true -e MYSQL_USER=${mysqlUser} -e MYSQL_PASSWORD=${mysqlPassword}`);
  } else {
    core.setFailed(`both root password and mysql user are empty, must contains one superuser`);
  }

  if (mysqlDatabase) {
    echos.push(`use database: ${mysqlDatabase}`);
    commands.push(`-e MYSQL_DATABASE=${mysqlDatabase}`);
  }

  commands.push(`-d -p ${hostPort}:${containerPort} mysql:${mysqlVersion} --port=${containerPort}`);
  commands.push(`--character-set-server=${characterSetServer} --collation-server=${collationServer}`);

  generateEntrypoint(commands.join(' '));
}

function generateEntrypoint(commands: string): void {
  const content = ['#!/bin/sh'];
  content.push(`sh -c "${commands}"`);
  content.push(`time=$(date)`);
  content.push(`MySQL set up on $time`);
  content.push(`::set-output name=results::$results`);
  fs.writeFileSync(path.join(__dirname, 'entrypoint.sh'), content.join('\n'));
}

run();
