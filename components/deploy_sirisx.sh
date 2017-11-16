#!/bin/bash -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COMPONENT_DIR="sirisx"
MODULE_NAME="node-red-sirisx"
NODE_RED_HOME="$HOME/.node-red/"

if ! [[ -d $DIR/$COMPONENT_DIR ]]; then
 	echo "error: could not find directory $DIR/$COMPONENT_DIR "
 	exit 1
fi

echo "Executing npm link in $DIR/$COMPONENT_DIR"

cd $DIR/$COMPONENT_DIR && npm link

if ! [[ -d $NODE_RED_HOME ]]; then
	echo "error: could not find $NODE_RED_HOME"
	exit 1
fi

cd $NODE_RED_HOME && npm link $MODULE_NAME

echo "Done!"

