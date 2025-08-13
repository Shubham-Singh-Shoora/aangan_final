# Aangan

Aangan is a decentralized web application built on the Internet Computer (IC) platform using the DFINITY SDK. It integrates secure backend canisters written in Motoko or Rust with a modern frontend framework to provide a scalable, fast, and secure decentralized app experience.

---

## Overview

This project supports multiple branches, each potentially representing different features, fixes, or versions of the application in development. Branches allow development work to proceed in isolation without affecting the main or production version until changes are ready to be merged.

---

## Branches in this Repository

Branches in this repository serve to organize development and collaborative efforts. Here is an overview of typical branch types you may encounter or create:

### How to View Branches

You can see all branches of this repository on GitHub by:

1. Navigating to the repository main page.
2. Clicking the branch dropdown near the top-left file navigation bar.
3. Selecting **View all branches** to see a full list of branches including active and stale ones.

This helps contributors choose the correct branch to work on or review.

---

## Features

- Fully decentralized backend on Internet Computer using canisters
- Responsive frontend with seamless integration
- Secure identity and authentication with Internet Identity
- Scalable design supporting multiple concurrent users
- Modular branch-based development workflow

---

## Getting Started
### Clone the Repository

git clone https://github.com/Shubham-Singh-Shoora/aangan_final.git
cd aangan_final

### List All Branches Available

git branch -a

This command lists both local and remote branches so you can switch to the desired branch for development or review.

### Switch to a Branch

git checkout <branch_name>


Replace `<branch_name>` with the name of the branch you want to work on.

---

## Installation

- Install [DFX SDK](https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent)
- Install [Node.js](https://nodejs.org/) LTS and npm or yarn
- Install Rust (if using Rust canisters)

---

## Running Locally

1. Start local replica:

dfx start --background

2. Deploy canisters:

dfx deploy

3. Install frontend deps and run frontend server:

cd frontend
npm install
npm start

The app will be available locally at `http://localhost:5173`.

---

## Project Structure

aangan_final/
├── src/ # Backend canister source code
│ ├── aangan_backend/ # Main backend logic (Motoko/Rust)
│ └── ...
├── frontend/ # Frontend React/Vite app
├── dfx.json # IC project config
├── package.json # NPM package dependencies
└── README.md # This documentation


---

## Deploying to the Internet Computer Mainnet

Make sure your cycles wallet is funded and `dfx.json` is configured correctly. Then deploy:

dfx deploy --network ic


---

## Useful Git Commands for Branch Management

| Command                    | Description                              |
|----------------------------|----------------------------------------|
| `git branch -a`            | List all local and remote branches     |
| `git checkout <branch>`    | Switch to specified branch              |
| `git pull`                 | Update current branch with remote changes |
| `git merge <branch>`       | Merge specified branch into current branch |
| `git push origin <branch>` | Push local branch changes to remote    |

---

## Environment Variables

| Variable Name            | Description                              |
|--------------------------|------------------------------------------|
| `DFX_NETWORK`            | Target network, eg. `local` or `ic`      |
| `REACT_APP_CANISTER_ID`  | Frontend canister ID for backend calls   |
| `REACT_APP_II_URL`       | Internet Identity server URL              |

---

## Resources

- [Internet Computer Docs](https://internetcomputer.org/docs/)
- [Motoko Language Reference](https://internetcomputer.org/docs/current/references/motoko-ref)
- [Rust Canister Development](https://internetcomputer.org/docs/current/references/rust-ref)
- [GitHub Branch Management](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/viewing-branches-in-your-repository)

---

## License

This project is licensed under the MIT License.

---

## Author

**Shubham Singh Shoora**  
GitHub: [Shubham-Singh-Shoora](https://github.com/Shubham-Singh-Shoora)





