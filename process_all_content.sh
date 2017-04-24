#!/usr/bin/env bash

set -e

for f in *-png; do node video_portfolio_content.js "$f"; done
