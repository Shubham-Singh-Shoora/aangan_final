# Aangan

Aangan is a decentralized rental platform for tenants and landlords, built on the Internet Computer (ICP) blockchain.  
It combines the frontend and backend in one ICP deployment, uses Internet Identity for secure authentication,  
NFTs for active rental contracts, and (soon) an escrow system to prevent security deposit fraud.

---

## Branch Overview

- **master**  
  Base branch with core setup. Not fully active—more like the project’s skeleton.

- **Property Listing**  
  Implements property listing functionality as the name suggests.

- **MarketPlace** *(most complete)*  
  - Plug wallet integration  
  - NFT minting for active rentals  
  - Property listing system  
  - Rental agreements  
  This is the most functional branch to date.

- **Escrow Contract** *(planned)*  
  Will be integrated into MarketPlace to handle deposits through an escrow mechanism.  
  Currently not functional.

---

## Core Features

- **ICP Blockchain Hosting**  
  Frontend and backend deployed together on ICP using DFINITY SDK.

- **Internet Identity Authentication**  
  Decentralized, secure user verification.

- **NFT-backed Rental Agreements**  
  Every active rental is represented by a minted NFT for transparency and proof of contract.

- **Escrow Mechanism (Upcoming)**  
  Will safeguard deposits until contractual terms are met.

---

## Getting Started (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/Shubham-Singh-Shoora/Aangan_Platform
Check available branches
bash
Copy
Edit
git branch -a
3. Switch to your desired branch
bash
Copy
Edit
git checkout <branch-name>
4. Install prerequisites
DFX SDK

Node.js (LTS) with npm or yarn

Rust (if any canisters use Rust alongside Motoko)

5. Run locally
bash
Copy
Edit
dfx start --background
dfx deploy
cd frontend
npm install
npm start
Then open http://localhost:5173 in your browser.

Deploying to ICP Mainnet
Prerequisites
Funded cycles wallet

Correct dfx.json configuration for --network ic

Command
bash
Copy
Edit
dfx deploy --network ic
Roadmap
 Complete and integrate Escrow Contract into MarketPlace

 Enhance security and user experience

 Merge all stable features into master

 Improve deployment scripts for smoother mainnet launches

Project Structure
bash
Copy
Edit
/
├── src/                 # Backend canisters (Motoko/Rust)
├── frontend/            # Frontend application (React/Vite or similar)
├── dfx.json             # DFINITY project configuration
├── deploy-mainnet.sh    # Helper script for deployment
└── README.md            # Project documentation
License
MIT License



