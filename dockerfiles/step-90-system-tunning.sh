#!/bin/bash

echo -n ""
echo "##########"
echo "# For Docker Image"
echo "#"
echo "# System Tunning"
echo "##########"

echo -n ""
echo "##########"
echo "Tune system in /etc/sysctl.d/ /etc/security/limits.conf and pam"

echo \* soft nofile  99999 | tee -a /etc/security/limits.conf
echo \* hard nofile 111111 | tee -a /etc/security/limits.conf
echo session required pam_limits.so | tee -a /etc/pam.d/common-session
echo $remoteAdminPassword

# tunning
echo vm.swappiness = 10 | tee -a /etc/sysctl.d/99-bluet.conf
echo vm.vfs_cache_pressure = 50 | tee -a /etc/sysctl.d/99-bluet.conf

exit 0;
