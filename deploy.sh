DEPLOY_BRANCH=develop
git checkout ${DEPLOY_BRANCH} 
git fetch origin
git rebase
sudo service supervisor restart 
