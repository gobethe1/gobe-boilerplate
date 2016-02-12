git config --global user.email "grock006@gmailcom"
git config --global user.name "grock006"
echo "Host heroku.com" >> ~/.ssh/config
echo "   StrictHostKeyChecking no" >> ~/.ssh/config
echo "   CheckHostIP no" >> ~/.ssh/config;
echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config;
if [[ $TRAVIS_PULL_REQUEST == "false" && $TRAVIS_BRANCH == "staging" ]]
  then
    gem install heroku
    heroku keys:clear
    echo yes | heroku keys:add
    # ssh -vT git@heroku.com
    grunt build
    echo yes | grunt buildcontrol:heroku
    heroku keys:clear
fi
if [[ $TRAVIS_PULL_REQUEST == "false" && $TRAVIS_BRANCH == "production" ]]
  then
    gem install heroku
    heroku keys:clear
    echo yes | heroku keys:add
    # ssh -vT git@heroku.com
    grunt build
    echo yes | grunt buildcontrol:herokuProd
    heroku keys:clear
fi
if [[ $TRAVIS_PULL_REQUEST == "false" ]]
  then
    echo $TRAVIS_BRANCH
fi
echo
echo "...done."
