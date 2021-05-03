const getTestTitle = require('./getTestTitle');

const SNAPSHOT_TITLES_TEXT = new Set();
const SNAPSHOT_TITLES_IMAGE = new Set();

function snapshotTitleIsUsed(snapshotTitle, isImage = false) {
  return (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).has(snapshotTitle);
}

function getSnapshotTitle(test, snapshotName, customName, customSeparator, isImage = false) {
  const name = customName || getTestTitle(test);
  const separator = customSeparator || '|';

  const snapshotTitle = `${name} ${separator} ${snapshotName}`;

  if (snapshotTitleIsUsed(snapshotTitle, isImage)) {
    throw new Error(`duplicate snapshot name '${snapshotName}' in ${name}`);
  }

  (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).add(snapshotTitle);

  return snapshotTitle;
}

module.exports = {
  getSnapshotTitle,
  snapshotTitleIsUsed
}
