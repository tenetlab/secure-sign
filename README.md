# SecureSign by Tenet Crypto Lab

## Introduction

A Multisig (multiple signature) wallet requires multiple signers to approve transactions, offering enhanced security and collective management over funds. This is useful for organizations or groups looking to share control of a wallet among multiple parties.

This project (SecureSign) allows users to securely create and manage wallets with multiple signers on substrate-based chains like Bittensor and CommuneAI. Designed with enhanced security and collaboration in mind, users can easily set up wallets that require the approval of multiple parties for transactions and wallet management, ensuring transparency and protection for all stakeholders.

In addition to standard multisig functionality, users can:

- Stake/Unstake tokens: Seamlessly stake or unstake their assets to/from a hotkey (validator).
- Subnet Management: Register new subnets and set weights.

SecureSign is built to streamline asset management, staking, and network participation, offering a user-friendly experience within the Polkadot ecosystem.

## Overview

The repo is split into a number of packages, each representing an application.  
It provides a view and interaction layer from a browser.

## Development

Contributions are welcome!

To start off, this repo uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via `git clone https://github.com/tenetlab/secure-sign.git`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >= 16](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >= 1.22](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`
5. Ready! Now you can launch the UI (assuming you have a local Polkadot Node running), via `yarn run start`
6. Access the UI via [http://localhost:3000](http://localhost:3000)

## Docker

You can run a docker container via -

```docker
docker run --rm -it --name tcl-secure-sign -e WS_URL=ws://someip:9944 -p 80:80 tcl/secure-sign:latest
```

or if you want to load your `.env` file

```docker
docker run --rm -it --name tcl-secure-sign --env-file .env -p 80:80 tcl/secure-sign:latest
```

To build a docker container containing local changes -

```dockers
docker build -t tcl/secure-sign -f docker/Dockerfile .
```

When using these Docker commands, you can access the UI via <http://localhost:80> (or just <http://localhost>)

### Docker Image Management

#### Pushing an Image to Docker Hub

1. **Log in to Docker Hub**:

   ```bash
   docker login
   ```

2. **Tag Your Image**:

   ```bash
   docker tag tcl/secure-sign <yourusername>/tcl-secure-sign:latest
   ```

3. **Push the Image**:

   ```bash
   docker push <yourusername>/tcl-secure-sign:latest
   ```

#### Pulling an Image from Docker Hub

1. **Pull the Image**:

   ```bash
   docker pull <yourusername>/tcl-secure-sign:latest
   ```

Replace `yourusername` with your Docker Hub username. Ensure you are logged in to Docker Hub before pushing or pulling images, especially if your repository is private.

## Contributions

### Adding a new network (endpoint)

To add a new network to be supported, follow these steps -

1. **Copy the Logo**: Place the logo of the new network in the `packages/apps-config/src/ui/logos/chains/generated` directory. Ensure the logo is appropriately named to match the network.
2. **Export the Logo**: Update the `packages/apps-config/src/ui/logos/chains/index.ts` file to export the newly added logo. This makes the logo available for use within the application.
3. **Add the Endpoint**: Add the network's endpoint to the appropriate files within the `packages/apps-config/src/endpoints` directory. This involves specifying the network's connection details so that the application can interact with it.
4. **Modify the `index.ts` File**: Update the `index.ts` file in the `packages/apps-config/src/endpoints` directory to include the new network. This ensures that the network is recognized and can be selected within the application.
