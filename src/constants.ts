const core = require("@actions/core");

const COMMIT_MESSAGE_TO_TRIGGER_WIDGET_BUILD =
  core.getInput("commit_message_trigger") || "publish new Package";

const FOLDER_OF_PACKAGES = core.getInput("packages_folder") || "packages";
const IDENTIFY_WIDGETS_FOLDERS =
  core.getInput("identify_widgets_folders") || "-widgets";
export interface WidgetFolderStructureInterface {
  base: string;
  build: string;
  src: string;
  packageJSON: string;
  packageXML: string;
}
export interface TriggerCommitsInterface {
  WIDGET: string;
}

export const TRIGGER_COMMITS: TriggerCommitsInterface = {
  WIDGET: COMMIT_MESSAGE_TO_TRIGGER_WIDGET_BUILD,
};
export const FOLDERS_WHERE_MENDIX_WIDGETS_ARE = IDENTIFY_WIDGETS_FOLDERS;
export const PACKAGES_PATH = `${process.env.GITHUB_WORKSPACE}/${FOLDER_OF_PACKAGES}`;
export const baseDir = process.env.GITHUB_WORKSPACE;
