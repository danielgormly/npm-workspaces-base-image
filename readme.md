# npm-workspaces-base-image

This repo creates a skeleton dependency definition structure of an NPM workspaces enabled monorepo and creates a base image with required dependencies installed. It's designed to be run every so often depending on the frequency of package changes, so that base dependencies are cached for frequent builds.

It looks up workspaces in the root package.json and creates a directory structure with nothing more than package.json and package-lock.json files it finds.

The repo is designed to be cloned into a folder adjacent to your root package.json e.g.
```
package.json
base-image/
--create_base_image.sh
```
