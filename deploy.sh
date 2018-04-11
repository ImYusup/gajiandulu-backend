DEPLOY_BRANCH=develop
git checkout ${DEPLOY_BRANCH}
git fetch origin
git rebase
echo "restarting supervisor"
sudo supervisorctl restart gajiandulu
