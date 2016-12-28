#!/bin/bash
docker build -f ./Dockerfile --pull -t meety ./

# 在網路環境差的環境，若想使用目前 cache 過的 ubuntu 不要重拉，則把 --pull 刪掉
