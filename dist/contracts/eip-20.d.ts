import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types.d';
import { ContractOptions, Eip20DeployParams } from '../interfaces';
import Deployable from '../abstracts/deployable';
import { Nos } from '../types';
export default class  extends Deployable {
    /**
     * An amount of funds an owner has given a spender permission to use
     */
    allowance(owner: string, spender: string): Promise<string>;
    /**
     * Grant permission to a spender located at the given address to use up to the given amount of funds
     */
    approve(address: string, amount: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Return the current balance of the given address
     */
    balanceOf(address: string): Promise<Nos>;
    /**
     * Retrun the number of decimals that should be shown by this token
     */
    decimals(): Promise<Nos>;
    /**
     * Pepare the deploy options, passing them along with the instantiated web3 and optional
     * contract options to the super class' deployContract method.
     * @see abstracts/deployable#deployContract
     */
    deploy(web3: Web3, params?: Eip20DeployParams, opts?: ContractOptions): Promise<string>;
    /**
     * Retrun the vanity name of this token
     */
    name(): Promise<string>;
    /**
     * Retrun the vanity symbol of this token
     */
    symbol(): Promise<string>;
    /**
     * Move the given number of funds from the msg.sender to a given address
     */
    transfer(address: string, amount: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Move the given number of funds from one given address to another given address
     */
    transferFrom(from: string, to: string, amount: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
}
