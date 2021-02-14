import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  vaultIds: any;

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, public utils: UtilsService)  { 
    this.resetData();
  }

  ngOnInit(): void {
    if (this.wallet.connected) {
      this.loadData();
    }
    this.wallet.connectedEvent.subscribe(() => {
      this.loadData();
    });
    this.wallet.errorEvent.subscribe(() => {
      this.resetData();
    });
  }

  resetData() {
    this.vaultIds = [];
  }

  async loadData() {
    let numVaults = parseInt(await this.contract.XSTORE.methods.vaultsLength().call());
    this.vaultIds = [...Array(numVaults).keys()];
  }
}
