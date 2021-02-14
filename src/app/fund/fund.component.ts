import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css']
})
export class FundComponent implements OnInit {

  fundId: any;
  xTokenBalance: BigNumber;
  xToken: any;
  xTokenName: any;
  xTokenSymbol: any;
  nft: any;
  nftIdList: any;
  checkedList: any;
  xTokenAmount: any;

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, public utils: UtilsService, private activatedRoute: ActivatedRoute)  { 
    this.resetData();
  }

  ngOnInit(): void {
    this.fundId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.wallet.connected) {
      this.loadData();
    }
    this.wallet.connectedEvent.subscribe(() => {
      this.loadData();
    });
    this.wallet.errorEvent.subscribe(() => {
      this.resetData();
    });

    this.activatedRoute.params.subscribe(routeParams => {
      this.fundId = routeParams.id;
      if (this.wallet.connected) {
        this.loadData();
      }
    });
  }

  resetData() {
    this.xTokenBalance = new BigNumber(0);
    this.xTokenName = "";
    this.xTokenSymbol = "";
    this.nftIdList = [];
    this.checkedList = [];
  }

  async loadData() {
    let multicallFns = {
      "nftAddress": {
        target: this.constants.XSTORE_ADDRESS,
        callData: this.contract.XSTORE.methods.nftAddress(this.fundId).encodeABI()
      },
      "xTokenAddress": {
        target: this.constants.XSTORE_ADDRESS,
        callData: this.contract.XSTORE.methods.xTokenAddress(this.fundId).encodeABI()
      }
    };
    let results = await this.utils.makeMulticall(multicallFns);
    let nftAddress = this.utils.decode("address", results["nftAddress"]);
    let xTokenAddress = this.utils.decode("address", results["xTokenAddress"]);

    this.nft = this.contract.ERC721(nftAddress); 
    this.xToken = this.contract.ERC20(xTokenAddress);
    this.xTokenBalance = new BigNumber(await this.contract.ERC20(xTokenAddress).methods.balanceOf(this.wallet.userAddress).call());
    this.xTokenSymbol = await this.contract.ERC20(xTokenAddress).methods.symbol().call();
    this.xTokenName = await this.contract.ERC20(xTokenAddress).methods.name().call();

    let multicallFns2 = {
      "nftIds": {
        target: this.constants.NFT_AGGREGATOR_ADDRESS,
        callData: this.contract.NFT_AGG.methods.getIds(nftAddress, this.wallet.userAddress).encodeABI()
      },
    }
    let results2 = await this.utils.makeMulticall(multicallFns2);
    this.nftIdList = this.utils.decode("uint256[]", results2["nftIds"]);
  }

  // NOTE: I am pushing the raw value right now because it is the id itself
  onCheckboxChange(option, event) {
    if(event.target.checked) {
      this.checkedList.push(option);
    } 
    else {
      for(var i=0 ; i < this.nftIdList.length; i++) {
        if(this.checkedList[i] == option) {
          this.checkedList.splice(i,1);
        }
      }
    }
  }

  async wrapNFTs() {
    const func = this.contract.NFTX.methods.mint(
      this.fundId,
      this.checkedList,
      0
    );
    let gasLimit = (this.checkedList.length * 150000)+400000
    await this.wallet.sendTxWithNFT(func, this.nft, this.constants.NFTX_MASTER_ADDRESS, gasLimit, () => {}, () => {}, (e) => {alert(e)});
  }

  async redeem() {
    let amt = parseInt(this.xTokenAmount);
    let func = this.contract.NFTX.methods.redeem(this.fundId, amt);
    let gasLimit = (this.checkedList.length * 150000)+400000
    await this.wallet.sendTxWithToken(func, this.xToken, this.constants.NFTX_MASTER_ADDRESS, amt, gasLimit, ()=>{}, ()=>{}, (e)=>{alert(e)});
  }
}
