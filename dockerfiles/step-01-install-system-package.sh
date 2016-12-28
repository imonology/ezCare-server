#!/bin/bash

echo -n ""
echo "##########"
echo "# For Docker Image"
echo "#"
echo "# Installing NodeJS, System Packages, Creating User and Setup Environment."
echo "##########"


echo -n ""
echo "##########"
echo "Installing system package"
apt-get -qq update
apt-get -qq -y install curl wget git unzip build-essential

apt-get -qq -y install screen

echo -n ""
echo "##########"
echo "Install NodeJS 4.x"
curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
apt-get -qq -y install nodejs


# Clean-up
apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.npm/

exit 0;
