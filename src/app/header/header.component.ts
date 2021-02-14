import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, public utils: UtilsService)  { }

  ngOnInit(): void {
    this.resetData();
  }

  connectWallet() {
    this.wallet.connect(() => {
      this.loadData();
    }, () => {}, false);
  }

  resetData() {
  }

  async loadData() {
  }
}
