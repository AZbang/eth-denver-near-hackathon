near view dev-1677966234754-39130815101986 get_script '{"sid": "ddd"}'
near call dev-1677966234754-39130815101986 add_script '{"sid":"ddd", "code":"", "conditions":"[\"data\",\"mydev.near\",\"index\",\"like\"]", "name": "demo"}' --accountId dev-1677966234754-39130815101986

near call dev-1677966234754-39130815101986 add_script'{"sid":"ddd","code":"function_Call(\"bob.testnet\", \"hi\", gas="2500000000000")", "conditions":"new_post:mydev.near", "name": "demo"}' --accountId dev-1677966234754-39130815101986
near call dev-1677966234754-39130815101986 trigger_bot '{"sid":2}' --accountId dev-1677966234754-39130815101986
near call dev-1677966234754-39130815101986 edit_script '{"sid":"ddd", "conditions":"hui", "code":""}' --accountId dev-1677966234754-39130815101986
near call dev-1677966234754-39130815101986 deposit '{"sid":0}' --accountId dev-1677966234754-39130815101986 --deposit 1
near view dev-1677966234754-39130815101986 get_scripts '{"keys":["ddd"]}'
near view dev-1677966234754-39130815101986 get_keys ''
near call dev-1677966234754-39130815101986 get_keys '' --accountId dev-1677966234754-39130815101986 --deposit 0

