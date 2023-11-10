class LoansFixedCollectionV2_3 {
  #config;
  #contractFactory;
  #contract;

  constructor(options) {
    this.#config = options?.config;
    this.#contractFactory = options?.contractFactory;
  }

  get _contract() {
    if (!this.#contract) {
      this.#contract = this.#contractFactory.create({
        address: this.#config.loan.fixed.collection.v2_3.address,
        abi: this.#config.loan.fixed.collection.v2_3.abi
      });
    }
    return this.#contract;
  }

  async acceptOffer(options) {
    let success;
    try {
      const offer = {
        loanERC20Denomination: options.offer.terms.loan.currency,
        loanPrincipalAmount: String(options.offer.terms.loan.principal),
        maximumRepaymentAmount: String(options.offer.terms.loan.repayment),
        nftCollateralContract: options.offer.nft.address,
        nftCollateralId: options.offer.nft.id,
        referrer: '0x0000000000000000000000000000000000000000',
        loanDuration: options.offer.terms.loan.duration,
        loanAdminFeeInBasisPoints: options.offer.nftfi.fee.bps
      };
      const signature = {
        signer: options.offer.lender.address,
        nonce: options.offer.lender.nonce,
        expiry: options.offer.terms.loan.expiry,
        signature: options.offer.signature
      };
      const borrowerSettings = {
        revenueSharePartner: '0x0000000000000000000000000000000000000000',
        referralFeeInBasisPoints: 0
      };
      const result = await this._contract.call({
        function: 'acceptCollectionOffer',
        args: [offer, signature, borrowerSettings]
      });
      return {
        receipt: result,
        status: result?.status === 1,
      }
    } catch (e) {
      return {
        receipt: null,
        status: false,
      }
    }
  }

  async liquidateOverdueLoan(options) {
    let success;
    try {
      const result = await this._contract.call({
        function: 'liquidateOverdueLoan',
        args: [options.loan.id]
      });
      success = result?.status === 1;
    } catch (e) {
      success = false;
    }
    return success;
  }

  async payBackLoan(options) {
    let success;
    try {
      const result = await this._contract.call({
        function: 'payBackLoan',
        args: [options.loan.id]
      });
      return {
        receipt: result,
        status: result?.status === 1,
      }
    } catch (e) {
      return {
        receipt: null,
        status: false,
      };
    }
    return success;
  }

  async cancelLoanCommitmentBeforeLoanHasBegun(options) {
    let success;
    try {
      const result = await this._contract.call({
        function: 'cancelLoanCommitmentBeforeLoanHasBegun',
        args: [options.offer.nonce]
      });
      success = result?.status === 1;
    } catch (e) {
      success = false;
    }
    return success;
  }
}

export default LoansFixedCollectionV2_3;
