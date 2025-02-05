/* globals cy */
/* eslint-env browser */
const { MATCH_IMAGE } = require('../tasks/taskNames');
const getTaskData = require('../utils/commands/getTaskData');
const logMessage = require('../utils/commands/logMessage');
const { NO_LOG } = require('../constants');
const { COMMAND_MATCH_IMAGE_SNAPSHOT: commandName } = require('./commandNames');
const getImageData = require('../utils/image/getImageData');
const { getImageConfig, getScreenshotConfig, getCustomName, getCustomSeparator } = require('../config');

function afterScreenshot(taskData) {
  return ($el, props) => {
    // See this url for contents of `props`:
    // https://docs.cypress.io/api/commands/screenshot.html#Get-screenshot-info-from-the-onAfterScreenshot-callback
    const win = $el.get(0).ownerDocument.defaultView;
    taskData.image = getImageData(props, win.devicePixelRatio);
    taskData.isImage = true;
    delete taskData.subject;
  };
}

async function toMatchImageSnapshot(subject, snapshotName, commandOptions) {
  const options = getImageConfig(commandOptions);
  const customName = getCustomName(commandOptions);
  const customSeparator = getCustomSeparator(commandOptions);

  const taskData = await getTaskData({
    commandName,
    snapshotName,
    options,
    customName,
    customSeparator,
    subject,
  });

  const screenShotConfig = getScreenshotConfig(commandOptions);
  const afterScreenshotFn = afterScreenshot(taskData);
  if (screenShotConfig.onAfterScreenshot) {
    const afterScreenshotCallback = screenShotConfig.onAfterScreenshot;
    screenShotConfig.onAfterScreenshot = (...args) => {
      afterScreenshotFn.apply(this, args);
      afterScreenshotCallback.apply(this, args);
    }
  } else {
    screenShotConfig.onAfterScreenshot = afterScreenshotFn;
  }

  return cy.wrap(subject, NO_LOG)
    .screenshot(taskData.snapshotTitle, screenShotConfig)
    .then(() => cy.task(
        MATCH_IMAGE,
        taskData,
        NO_LOG
      ).then(logMessage)
    );
}

module.exports = toMatchImageSnapshot;
