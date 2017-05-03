#!/usr/bin/env bash

set -e
inputPath=${1:-"../video_portfolio_content"}
for f in $inputPath/*-png; do
	node video_portfolio_content.js "$f";
done
