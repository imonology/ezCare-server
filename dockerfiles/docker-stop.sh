#!/bin/bash
# This script stops rethinkdb and meety instance, then rm their container

docker stop meety meety-dev rethinkdb mongodb
docker rm meety meety-dev rethinkdb mongodb
