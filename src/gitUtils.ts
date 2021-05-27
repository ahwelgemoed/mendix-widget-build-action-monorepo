import * as fs from "fs";

import { findBuildFiles } from "./filesystemUtils";
import { assetData } from "./utils";
const core = require("@actions/core");

export async function setGITCred(git) {
  const COMMIT_AUTHOR_NAME = core.getInput("bot_author_name") || "BOTTY";
  const COMMIT_AUTHOR_EMAIL =
    core.getInput("bot_author_email") || "BOT@BOTTY.inc";
  try {
    await git.addConfig("user.name", COMMIT_AUTHOR_NAME);
    await git.addConfig("user.email", COMMIT_AUTHOR_EMAIL);
    return;
  } catch (error) {
    console.log(`error`, error);
  }
}

export async function createRelease(github, context, tag: string) {
  try {
    const { owner, repo } = context.repo;
    const { data } = await github.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
    });

    return data;
  } catch (error) {
    core.error(`Error @ createRelease ${error}`);
  }
}

export async function commitGitChanges(git) {
  const BOT_MESSAGE = core.getInput("bot_commit_message") || "BOT COMMIT";
  const COMMIT_AUTHOR_NAME = core.getInput("bot_author_name") || "BOTTY";
  const COMMIT_AUTHOR_EMAIL =
    core.getInput("bot_author_email") || "BOT@BOTTY.inc";
  try {
    await git.add("./*", (err) => {
      if (err) {
        core.error(`Error @ add ${err}`);
      }
    });
    await git.commit(
      BOT_MESSAGE,
      undefined,
      {
        "--author": `"${COMMIT_AUTHOR_NAME} <${COMMIT_AUTHOR_EMAIL}>"`,
      },
      (err) => {
        if (err) {
          core.error(`Error @ commit ${err}`);
        }
      }
    );
    await git.push("origin", "main", ["--force"], (err) => {
      if (err) {
        core.error(`Error @ push ${err}`);
      }
    });
    return;
  } catch (error) {
    core.error(`Error @ commitGitChanges ${error}`);
  }
}

export async function getAllTags(github, repo) {
  let createdTags;
  try {
    const { data } = await github.repos.listTags({ ...repo });
    if (data.length) {
      createdTags = await data.reduce((a, c) => {
        return [...a, c.name];
      }, []);
    }

    return createdTags;
  } catch (error) {
    core.error(`Error @ getAllTags ${error}`);
  }
}
export async function uploadBuildFolderToRelease(
  github,
  widgetStructure,
  jsonVersion,
  release
) {
  try {
    const FOLDER_WHERE_RELEASE_IS = `${widgetStructure.build}/${jsonVersion}`;
    // All File names in build folder
    const filesArray = await findBuildFiles(FOLDER_WHERE_RELEASE_IS);
    // Loop over all files in Widget Build
    for (const file of filesArray) {
      // Built widget path
      const filePath = `${FOLDER_WHERE_RELEASE_IS}/${file}`;
      const { name, fileStream, contentType } = assetData(filePath);
      // Set Headers for Upload
      const headers = {
        "content-type": contentType,
        "content-length": fs.statSync(filePath).size,
      };
      // Uploads Built to Release
      const uploadAssetResponse = await github.repos.uploadReleaseAsset(
        // @ts-ignore
        {
          url: release.upload_url,
          headers,
          name,
          file: fileStream,
        }
      );
      core.info(`🥊 Uploaded ${file}`);
      return uploadAssetResponse;
    }
  } catch (error) {
    core.error(`Error @ getAllTags ${error}`);
  }
}
