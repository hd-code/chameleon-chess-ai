# chameleon-chess-ai

This project implements a computer player for the board game chameleon chess. The player should become part of the game logic package, which can be found here: https://github.com/hd-code/chameleon-chess-logic/

An explanation of the game and its rules can be found in the logic repository as well.

**This is also my bachelor thesis!**

## Installation

```sh
# clone git repo
git clone https://github.com/hd-code/chameleon-chess-ai

# go to project directory
cd chameleon-chess-ai

# install all additional dependencies
npm install
```

## Project Overview

...

### Node Scripts

to execute any of the node scripts just do: `npx ts-node <path-to-script>`

### Jupyter Notebooks

Jupyter as a Docker-Container.

Just make sure Docker is running, then open this project folder in your terminal and type:

`docker-compose up`

You can now access the Jupyter notebook under: http://localhost:5010

Password: `secret`

## Project Structure

- `data` – raw csv and json files that contain different kinds of data, which are used in the rest of the project
- `docs` – final results and findings in pdf files (output of jupyter notebooks)
- `notebooks` – Many tasks were solved with jupyter notebooks. The notebook files are located here
- `src` – source code for the algorithms and helper task, some scripts for generating the data in `data` are also located here
- `test` – automatic tests for the algorithm implementations
- `thesis` – all files concerning my bachelor thesis, mainly markdown and latex files, plus some graphics