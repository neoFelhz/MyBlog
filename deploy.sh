cd ./public
git init
git config --global push.default matching
git config --global user.email "${GitHubEMail}"
git config --global user.name "${GitHubUser}"
git add --all .
git commit -m "Auto builder by Travis CI: %Y-%m-%d %H:%M:%S"
git push --quiet --force https://${GitHubKEY}@github.com/${GitHubUser}/${GitHubRepo}.git
