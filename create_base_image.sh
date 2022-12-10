#!/bin/bash

WORK_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Generate skeleton dir of package.json / lockfiles
node generate-skeleton.js
docker build \
    --progress plain \
    -t base-image .
docker push base-image

# cleanup
rm -rf $WORK_DIR/skeleton
