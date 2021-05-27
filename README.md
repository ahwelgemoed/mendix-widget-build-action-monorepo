<img  align="center" alt="headerIMG" src="./assets/logo.png" target="_blank" />

<br/>
This Action was written to keep package.json and package.xml in sync with each other, The action will also build the Widget and upload it upload it as a release.

See the Action in Action [here](https://github.com/mendixlabs/app-services-components)

See the Non Monorepo Action see [here](https://github.com/ahwelgemoed/mendix-widget-build-action)

## Setup

Here is an example

```yml
name: Build-The-Package
on:
  push:
    branches:
      - main
jobs:
  widget-build-action:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: "12.x"
      - name: Install dependencies
        run: |
          npm install
        ##   Here is this Action
      - uses: ahwelgemoed/widget-build-monorepo-action@main
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          author_name: build-bot
          bot_commit_message: bot-version-match
          bot_author_name: build-bot
          bot_author_email: build-bot@mendix.com
          commit_message_trigger: publish new Package
          packages_folder: packages
          identify_widgets_folders: -widgets
```

## How it works

You build or patch your widget, locally you lint and test it. If you are happy that there are no errors, commit our changes.

Run `npx lerna version` and follow the prompts. See more [here](https://github.com/lerna/lerna/tree/main/commands/version)

This will do multiple things:

- Update the version in your `package.xml`
- Push a Tag to the repo `widgetname@version`
- It will also push that code

### The acton steps are as follow (Internal Workings of the Action)

---

- Checks the commit and sees if the commit message matches the one in the config `commit_message_trigger`

- List out all Folders in your mono repos "packages" folder as set by `packages_folder` in the config

- Loop over all folders in `packages_folder` and find folder names that identifies that folder as having Mendix Widgets init. It finds it according to the folder name contains `identify_widgets_folders`

- Builds a helper object with all paths it will need

- Reads the package's `package.json`

  - Saves package name and version

- Parses `package.xml` and makes it into a js object

  - Saves the version

- Sees if the `package.json` and `package.xml` matches, if it does not match the code continues.

- Initialize Git and set Credentials

- Change `package.xml` version to what ever the `package.json` was.

- Runs `npm install`

- Runs `npm build` and builds the package

- Gets all Tags on the Repo in Github

- Matches the Tag name Lerna created.

- Commits Changes to Github

- Converts Tag to Release

- Uploads Build to Release

- Done

## Some things to Note

As the action will change the package.xlm and upload the build, you will always have changes in your git working tree and running lerna version will always see changes and want to version bump on all packages. So to keep this from happening we just need to tell Lerna to ignore changes in the `package.xlm`.

To do this we update our `lerna.json` and add this

```json
 "ignoreChanges": ["**/*/package.xml"]
```

We also like to customize our lerna version commit message to follow conventional commits so we add this to the `lerna.json`

```json
"command": {
   "version": {
     "message": "chore(release): publish new Package"
   }
 }
```

## 🛑 Issues && Known Limits

- If the Widget does not build successfully through either a lint or ts error it the action will fall over.
- With Yarn Workspaces running Npm install in every package should not be necessary
