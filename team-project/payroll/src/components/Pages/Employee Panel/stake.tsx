import React, { useState } from "react";
import { Button, Icon, Input, Table } from "semantic-ui-react";
import { ethers } from "ethers";
import { payrollContract } from "../../../assets/PayrollContract";
import { payrollAddress } from "../../../assets/PayrollAddress";
import { payrollTokenContract } from "../../../assets/PayrollTokenContract";

function Stake() {
  const [amount, setAmount] = useState("");

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value);
  };

  async function stake() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", signer.getAddress());

    const accounts = await provider.listAccounts();
    const account = accounts[0];

    const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);
    const payrollTokenAddress = await payroll.paymentToken();

    const payrollToken = new ethers.Contract(payrollTokenAddress, payrollTokenContract.abi, signer);

    const isEmployee = await payroll.isEmployee(account);

    if (isEmployee) {
      const allowanceTx = await payrollToken.allowance(account, payrollAddress);
      console.log(`${allowanceTx}`);
      console.log(`${amount}`);
      if (allowanceTx >= amount) {
        console.log(`stake`);
        const stake = await payroll.stake(amount);
      } else {
        const approve = await payrollToken.approve(payrollAddress, amount);
      }
    } else {
      console.log("You are not an employee");
    }
  }

  return (
    <>
      <div className="section">
        <div className="container-default">
          <div className="inner-container-left">
            <div className="header-container">
              <h1>Stake</h1>
            </div>
            <div className="input-container">
              <h2>Stake Amount</h2>
              <Input type="text" placeholder="Stake Amount" fluid>
                <input type="text" onChange={handleAmountChange} value={amount} />
              </Input>
              <div className="buttons-container-single">
                <Button icon labelPosition="left" color="green" size="big" onClick={stake}>
                  <Icon name="money" /> Stake
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Stake;
