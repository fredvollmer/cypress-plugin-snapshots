/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { MATCH_TEXT } = require('../tasks/taskNames');
const getTaskData = require('../utils/commands/getTaskData');
const logMessage = require('../utils/commands/logMessage');
const { NO_LOG } = require('../constants');
const { COMMAND_MATCH_SNAPSHOT: commandName } = require('./commandNames');

function toMatchSnapshot(subject, snapshotName, options) {
  return getTaskData({
      commandName,
      snapshotName,
      options,
      subject,
    }).then(taskData => cy.task(
        MATCH_TEXT,
        taskData,
        NO_LOG
      ).then(logMessage)
    );
}

module.exports = toMatchSnapshot;
