/**
 * @class
 * Class for working with rewards.
 */
class Rewards {
  og;
  earn;

  constructor(options = {}) {
    this.og = options?.og;
    this.earn = options?.earn;
  }
}

export default Rewards;
