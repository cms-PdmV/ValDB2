#!/bin/bash
# Make sure 'python' alias makes reference to Python 3.9 or highest version
# Also make sure to register the application inside CERN Application Portal
# and configure all the environment variables required

CMD=$1

if [[ $CMD != "dev" && $CMD != "prod" && $CMD != "test" && $CMD != "lint" ]]; then
    echo "Please set a valid option - Options available: dev | prod | test | lint"
    echo "Option provided: $CMD"
    exit 1
fi

echo "Running '$CMD' command"

# Check if the virtual environment exists
echo "Checking if the virtual environment has been created"
VENV="$(pwd)/venv"

if [ ! -d "$VENV" ]; then
    echo "Virtual environment does not exist, creating it"
    python -m venv $VENV
    source "$VENV/bin/activate"
    pip install -r requirements.txt
    echo "Virtual environment created successfully"
fi

echo "Activating the virtual environment"
source "$VENV/bin/activate"

if [ "$CMD" = "dev" ]; then
    trap "exit" INT TERM ERR
    trap "kill 0" EXIT
    echo "Starting DEV python server"
    python3 main.py &
    python_pid=$!
    echo "Starting DEV node server"
    cd react_frontend/
    yarn install
    yarn start &
    npm_pid=$!
    cd ..
    echo "python pid $python_pid"
    echo "npm pid $npm_pid"
    wait
fi

if [ "$CMD" = "prod" ]; then
    BUNDLE="$(pwd)/build"
    if [ ! -d "$BUNDLE" ]; then
        echo "Web page bundle not found, creating it ..."
        CURRENT_DIR=$(pwd)
        cd react_frontend/
        yarn install
        yarn build
        mv build/ ../
        cd $CURRENT_DIR
    fi

    echo "Starting web page"
    gunicorn main:app
fi

if [ "$CMD" = "test" ]; then
    DATABASE_NAME=test_valdb python -m unittest
fi

if [ "$CMD" = "lint" ]; then
    pylint `find . -type f | grep .py$ | grep -v env |  grep -v tests/ | xargs` --disable=E0401,R0201,R0903,W0622 &&
    cd react_frontend &&
    yarn eslint &&
    yarn tslint
fi