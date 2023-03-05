#!/bin/sh

./build.sh

if [ $? -ne 0 ]; then
  echo ">> Error building contract"
  exit 1
fi

echo ">> Deploying contract"

# https://docs.near.org/tools/near-cli#near-dev-deploy
# near dev-deploy -f --wasmFile build/ns_bot.wasm
# NEAR_ENV=mainnet near deploy nsbot.near --wasmFile build/ns_bot.wasm
near dev-deploy --wasmFile build/ns_bot.wasm