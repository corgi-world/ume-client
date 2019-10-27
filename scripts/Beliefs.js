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
    this.helpless[0].push("무능한 것 같아");
    this.helpless[0].push("쓸모 없는 것 같아");
    this.helpless[0].push(
      "난 아무 것도 잘 할 수 없어"
    );
    this.helpless[1].push(
      "스스로 어떻게도 할 수 없는 것 같아"
    );
    this.helpless[1].push("힘이 없어");
    this.helpless[1].push("나약한 것 같아");
    this.helpless[2].push("피해자");
    this.helpless[2].push("빈곤한 느낌");
    this.helpless[2].push("갇힌 것 같아");
    this.helpless[2].push("통제가 안돼");
    this.helpless[2].push("실패");
    this.helpless[3].push("불완전한 것 같아");
    this.helpless[3].push("충분하게 좋지 않아");
    this.helpless[3].push("패자");
    this.helpless[3].push(
      "상처받기 쉬운 것 같아"
    );

    this.unlovable[0].push("사랑스럽지 않아");
    this.unlovable[0].push(
      "좋아하지 않는 것 같아"
    );
    this.unlovable[0].push("탐탁지 않은 것 같아");
    this.unlovable[0].push("매력적이지 않아");
    this.unlovable[1].push("원하는 것 같지 않아");
    this.unlovable[1].push(
      "그냥 버려둔 느낌이야"
    );
    this.unlovable[1].push("뭔가 다른 것 같아");
    this.unlovable[2].push(
      "거부 당해야 하는 느낌"
    );
    this.unlovable[2].push(
      "버림받아야 하는 느낌"
    );
    this.unlovable[2].push(
      "혼자 있어야 한다는 느낌"
    );

    this.worthless[0].push("가치 없는 느낌");
    this.worthless[0].push(
      "받아들일 수 없는 느낌"
    );
    this.worthless[0].push("나쁜 것 같아");
    this.worthless[1].push("쓰레기 같아");
    this.worthless[1].push("부도덕한 것 같아");
    this.worthless[1].push("위험한 것 같아");
    this.worthless[2].push("해로운 것 같아");
    this.worthless[2].push("악한 것 같아");
    this.worthless[2].push("난 살 자격이 없어");
  }
};
