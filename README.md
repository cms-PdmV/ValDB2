# ValDB2
Validation report database tool of PdmV

## Prerequisites
- Python 3.9
- Node 12+
- Yarn

## Installation
1. Create virtual env for python (optional)
    ```
    virtualenv env
    ```
1. Install Python dependencies
    ```
    pip install -r requirements.txt
    ```
1. Install react dependencies
    ```
    cd react_frontend
    yarn install
    cd ..
    ```
1. Config database connection, default connection value will be set.
    ```
    cp template.env .env
    nano .env
    ```
1. Done!

## Run Development
This command will start backend and frontend in development mode. No build required for frontend. Hot-reload is enabled for both.
```
./run dev
```

## Run Test
This command will run test for backend. The test file located in `tests/` will be executed.
```
./run test
```
