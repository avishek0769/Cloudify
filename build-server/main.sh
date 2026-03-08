#!/bin/bash

export GITHUB_REPO_URL=$GITHUB_REPO_URL

git clone $GITHUB_REPO_URL

exec node script.js