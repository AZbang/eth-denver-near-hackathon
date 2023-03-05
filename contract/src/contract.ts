// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, LookupSet, UnorderedMap, assert, Vector } from 'near-sdk-js';

class Script {
  code: string;
  conditions: string;
  name: string;
  creator: string;
  balance: bigint;
  calls_count: number;

  constructor(code: string, conditions: string, creator: string, name: string, balance: bigint) {
    this.code = code;
    this.name = name;
    this.calls_count = 0;
    this.creator = creator;
    this.conditions = conditions;
    this.balance = balance;
  }
}

@NearBindgen({})
class Contract {
  scripts: UnorderedMap<Script>;

  constructor() {
    this.scripts = new UnorderedMap("s");
  }

  @call({}) // This method changes the state, for which it cost gas
  trigger_bot({ sid, message = "", followes = 0, signer_balance = 0 }: { message: string, sid: string, followes: number, signer_balance: number }): void {
    let function_call_data = {};
    let transfer_call_data = {};
    let logs = [];

    let script = this.scripts.get(sid);
    eval(
      `
      function get_Input() {
        return message;
      }

      function add_Log(text) {
        logs.push(text);
      }

      function get_SignerFollowers() {
        return followes
      }

      function get_SignerBalance() {
        return signer_balance
      }

      function call_Transfer(account_id, deposit='0') {
        transfer_call_data["account_id"] = account_id
        transfer_call_data["deposit"] = deposit
      }


      function function_Call(account_id, method, args = '', deposit='0', gas = '2500000000000') {
        function_call_data["account_id"] = account_id;
        function_call_data["method"] = method;
        function_call_data["args"] = args;
        function_call_data["deposit"] = deposit;
        function_call_data["gas"] = gas;
      }

      ${script.code}
    `);
    script.calls_count += 1;

    near.log(`Promise call ${JSON.stringify(function_call_data)}`);

    if (function_call_data["account_id"]) {
      let deposit = BigInt(function_call_data["deposit"]);
      if (deposit > 0) {
        script.balance -= deposit;
        assert(script.balance > 0, "Deposit balance to call this function");
        this.scripts.set(sid, script);

      }

      const promise = near.promiseBatchCreate(function_call_data["account_id"]);
      near.promiseBatchActionFunctionCall(
        promise,
        function_call_data["method"],
        function_call_data["args"],
        deposit,
        BigInt(function_call_data["gas"])
      );
    }
    else if (transfer_call_data["account_id"]) {
      let deposit = BigInt(transfer_call_data["deposit"]);
      if (deposit > 0) {
        script.balance -= deposit;
        assert(script.balance > 0, "Deposit balance to call this function");
        this.scripts.set(sid, script);

      }

      const promise = near.promiseBatchCreate(transfer_call_data["account_id"]);
      near.promiseBatchActionTransfer(
        promise,
        deposit,
      );

    }
    else {
      this.scripts.set(sid, script);
    }
  }

  @call({ payableFunction: true })
  add_script({ sid, code, conditions, name }: { sid: string, code: string, conditions: string, name: string }): void {
    assert(sid !== undefined, "U need provide correct sid")
    this.scripts.set(
      sid, new Script(code, conditions, near.predecessorAccountId(), name, near.attachedDeposit())
    )
  }

  @call({})
  edit_script({ sid, conditions, code }: { sid: string, conditions: string, code: string }): void {
    let s = this.scripts.get(sid);
    assert(s.creator == near.predecessorAccountId(), "No access to this script");
    s.conditions = conditions;
    s.code = code;
    this.scripts.set(sid, s);
  }

  @call({})
  remove_script({ sid }: { sid: string }): void {
    let s = this.scripts.get(sid);
    assert(s.creator == near.predecessorAccountId(), "No access to this script");
    this.scripts.remove(sid);
  }


  @call({ payableFunction: true })
  deposit({ sid }: { sid: string }): void {
    let s = this.scripts.get(sid);
    s.balance += near.attachedDeposit();
    this.scripts.set(sid, s);
  }

  @view({})
  get_script({ sid }: { sid: string }): Script {
    return this.scripts.get(sid)
  }

  @view({})
  get_scripts({ keys }: { keys: string[] }): Script[] {
    let res = [];
    for (let i = 0; i < keys.length; i++) {
      res.push(this.scripts.get(keys[i]))
    }
    return res
  }

  @view({})
  get_keys({ }: {}): string[] {
    return this.scripts.keys.toArray();
  }

}