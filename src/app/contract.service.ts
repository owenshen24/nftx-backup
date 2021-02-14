import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(public wallet: WalletService, public constants: ConstantsService) { 
  }

  public get MULTICALL() {
    const abi = require('../assets/abi/Multicall.json');
    const address = this.constants.MULTICALL_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get NFT_AGG() {
    const abi = require('../assets/abi/NFTAggregator.json');
    const address = this.constants.NFT_AGGREGATOR_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get NFTX() {
    const abi = require('../assets/abi/NFTX.json');
    const address = this.constants.NFTX_MASTER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get XSTORE() {
    const abi = require('../assets/abi/XStore.json');
    const address = this.constants.XSTORE_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }
  
  public ERC20(address) {
    const abi = require('../assets/abi/ERC20Detailed.json');
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public ERC721(address) {
    const abi = require('../assets/abi/ERC721.json');
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  async loadData() {
  }
}
