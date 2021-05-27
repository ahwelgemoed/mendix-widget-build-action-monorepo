import * as fs from "fs";
import * as convertXML from "xml-js";
import mime from "mime-types";
import { basename } from "path";

import { PACKAGES_PATH, WidgetFolderStructureInterface } from "./constants";

const core = require("@actions/core");

//  Currently Working for MX8 and MX9 widget Structures
export function _widgetFolderStructure(
  folderName: string,
  packageName: string
): WidgetFolderStructureInterface {
  const widgetFolderStructure = {
    base: `${PACKAGES_PATH}/${folderName}/${packageName}/`,
    src: `${PACKAGES_PATH}/${folderName}/${packageName}/src`,
    build: `${PACKAGES_PATH}/${folderName}/${packageName}/dist`,
    packageJSON: `${PACKAGES_PATH}/${folderName}/${packageName}/package.json`,
    packageXML: `${PACKAGES_PATH}/${folderName}/${packageName}/src/package.xml`,
  };
  return widgetFolderStructure;
}

/**
 * TODO - Make this less... Uhm... 💩
 */
export function _xmlVersion(
  rawXML: convertXML.Element | convertXML.ElementCompact
) {
  return rawXML.elements[0].elements[0].attributes.version;
}
/**
 * TODO - Make this less... Uhm... 💩
 */
export function _changeXMLVersion(
  rawXML: convertXML.Element | convertXML.ElementCompact,
  version: string
) {
  let y = rawXML;
  y.elements[0].elements[0].attributes.version = version;
  return y;
}

export async function findTagName(tagsArray: [], tagName: string) {
  try {
    return tagsArray.find((tag) => tag === tagName);
  } catch (error) {
    core.error(`Error @ findTagName ${error}`);
  }
}

export const assetData = (path: string) => {
  return {
    fileStream: fs.readFileSync(path),
    name: basename(path),
    contentType: mime.lookup(path) || "application/zip",
  };
};
