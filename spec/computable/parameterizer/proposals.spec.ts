import * as ganache from 'ganache-cli'
import Web3 from 'web3'
// symlink? copy types to @types? TODO
import { deployToken, deployParameterizer } from '../../helpers'
import { Contract } from '../../../node_modules/web3/types.d'
import { Addresses } from '../../../src/constants'

// TODO use the web3 IProvider?
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  parameterizer:Contract

describe('Parameterizer: Reparamaterize', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await deployToken(web3, accounts[0])
    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    parameterizer = await deployParameterizer(web3, accounts[0], tokenAddress, Addresses.THREE) // THREE placeholding plcr TODO
    parameterizer.setProvider(provider)

    // approve the parameterizer with the token, account[0] has all the balance atm
    await eip20.methods.approve(parameterizer.options.address, 1000000).send({ from: accounts[0] })

  })

  // describe('Expected failures', () => {
    // it('throws if called by non-owner', async () => {
      // try {
        // await validator.methods.addVote('foo').send({
          // from: accounts[1],
        // })

        // // this should never be run as we should throw above
        // expect(false).toBe(true)

      // } catch(e) {
        // expect(e).toBeTruthy()
      // }
    // })
  // })

  it('parameterizer has an allowance of a million', async () => {
    const allowance = await eip20.methods.allowance(accounts[0], parameterizer.options.address).call()
    expect(parseInt(allowance)).toBe(1000000)
  })

  it('returns falsy for non-existant proposal', async () => {
    // const pid = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0], gasPrice: 100, gas: 4500000 })
    const res = await parameterizer.methods.propExists(web3.utils.asciiToHex('foo')).call()
    expect(res).toBe(false)
  })

  describe('Add a new proposal', () => {
    it('adds a new proposal', async () => {
      const applicantStartingBalance = await eip20.methods.balanceOf(accounts[0]).call()
      expect(applicantStartingBalance).toBe('5000000')

      const tx = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0] })
      expect(tx).toBeTruthy()
      // propId is nested in the event TODO change to using the event listener when they work
      const propID = tx.events._ReparameterizationProposal.returnValues.propID,
        proposed = await parameterizer.methods.proposals(propID).call()
      expect(proposed.name).toBe('voteQuorum')
      expect(proposed.value).toBe('51')

      // proposer should have been charged PMinDeposit
      const deposit = await parameterizer.methods.get('pMinDeposit').call()
      expect(deposit).toBe('100')
      const applicantFinalBalance = await eip20.methods.balanceOf(accounts[0]).call()
      expect(parseInt(applicantFinalBalance)).toBe((parseInt(applicantStartingBalance)) - (parseInt(deposit)))
    })
  })
})
