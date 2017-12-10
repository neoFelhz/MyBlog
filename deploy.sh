#!/bin/bash
set -ev
git clone -b master https://github.com/${GitHubUser}/${GitHubRepo}.git _hexo/.blog_deploy #git clone site file to _hexo/.blog_deploy
cd _hexo/.blog_deploy 
git checkout master
cd ../  #back to _hexo folder
mv .blog_deploy/.git/ ./public/ #sync git commit history
cd ./public
git config --global user.email "${GitHubEMail}"
git config --global user.name "${GitHubUser}"
git add --all .
git commit -m "Auto builder by Travis CI: `date +"%Y-%m-%d %H:%M:%S"`"
git push --quiet --force https://${GitHubKEY}@github.com/${GitHubUser}/${GitHubRepo}.git master:master
