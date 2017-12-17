cd ./public
git init
git config --global push.default matching
git config --global user.email "${GitHubEMail}"
git config --global user.name "${GitHubUser}"
git add --all .
DATE="$(echo $(date --rfc-2822))"
git commit -m "Auto builder by Travis CI: $DATE"
git push --quiet --force https://${GitHubKEY}@github.com/${GitHubUser}/${GitHubRepo}.git
