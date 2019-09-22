export default beliefs = {
  helpless: {
    0: [],
    1: [],
    2: [],
    3: [],
    length: 4
  },
  unlovable: {
    0: [],
    1: [],
    2: [],
    length: 3
  },
  worthless: {
    0: [],
    1: [],
    2: [],
    length: 3
  },

  init: function() {
    this.helpless[0].push("Incompetent");
    this.helpless[0].push("Ineffective");
    this.helpless[0].push(
      "I can’t do anything right"
    );
    this.helpless[1].push("Helpless");
    this.helpless[1].push("Powerless");
    this.helpless[1].push("Weak");
    this.helpless[1].push("Victim");
    this.helpless[2].push("Needy");
    this.helpless[2].push("Trapped");
    this.helpless[2].push("Out of control");
    this.helpless[2].push("Failure");
    this.helpless[3].push("Defective");
    this.helpless[3].push("Not good enough");
    this.helpless[3].push("Loser");

    this.unlovable[0].push("Unlovable");
    this.unlovable[0].push("Unlikeable");
    this.unlovable[0].push("Undesirable");
    this.unlovable[0].push("Unattractive");
    this.unlovable[1].push("Unwanted");
    this.unlovable[1].push("Uncared for");
    this.unlovable[1].push("Different");
    this.unlovable[1].push(
      "Bound to be rejected"
    );
    this.unlovable[2].push(
      "Bound to be abandoned"
    );
    this.unlovable[2].push("Bound to be alone");

    this.worthless[0].push("Worthless");
    this.worthless[0].push("Unacceptable");
    this.worthless[0].push("Bad");
    this.worthless[1].push("Waste");
    this.worthless[1].push("Immoral");
    this.worthless[1].push("Toxic");
    this.worthless[1].push("Evil");
    this.worthless[2].push(
      "i don’t deserve to live"
    );
  }
};
