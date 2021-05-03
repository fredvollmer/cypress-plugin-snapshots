/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { MATCH_TEXT } = require('../tasks/taskNames');
const getTaskData = require('../utils/commands/getTaskData');
const { NO_LOG } = require('../constants');
const { COMMAND_MATCH_SNAPSHOT: commandName } = require('../commands/commandNames');

function matchesSnapshot(subject, snapshotName, allowDuplicateNames = false, options = {}) {
  const taskData =  getTaskData({
    commandName,
    snapshotName,
    options,
    subject,
    allowDuplicateNames,
  });
  return cy.task(
    MATCH_TEXT,
    taskData,
    NO_LOG
  );
}

module.exports = {
  matchesSnapshot
};
