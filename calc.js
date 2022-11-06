let p;
let P_s5;
let P_pick;
let P_npick;

let dp;
let dP_s5;
let dP_pick;

let sum_P;


function reset(){
  p = new Array(91);
  P_s5 = new Array(181);
  P_pick = new Array(181);
  P_npick = new Array(8);

  dp = new Array(91);
  dP_s5 = new Array(181);
  dP_pick = new Array(181);

  sum_P=0;
}



function input_arr(){
  for(let i=0;i<8;i++){
    P_npick[i] = new Array(180*7+1);
  }
  //p[91];
  for(let i=1;i<=90;i++){
    if(i<74) p[i]=0.006;
    else if(i<90) p[i]=p[i-1]+0.06;
    else p[i]=1;
  }

  //P_s5[181]
  for(let n=1;n<=90;n++){
    let p1=1;
    for(let i=1;i<=n;i++){
      if(i<n) p1*=1-p[i];
      else p1*=p[i];
    }
    P_s5[n]=p1;
  }
  for(let n=91;n<=180;n++) P_s5[n]=0;

  //P_pick[181]
  for(let n=1;n<=180;n++){
    P_pick[n]=P_s5[n]*0.5;
    for(let m=1;m<=n-1&&m<=90;m++){
      if(n-m<=90) P_pick[n]+=P_s5[m]*0.5*P_s5[n-m];
    }
  }

  //P_npick[8][180*7+1]
  for(let k=1;k<=7;k++){
    for(let n=1;n<=180*7;n++) P_npick[k][n]=0;
  }
  for(let n=1;n<=180*7;n++){
    if(n<=180) P_npick[1][n]=P_pick[n];
    else P_npick[1][n]=0;
  }
  for(let k=2;k<=7;k++){
    for(let n=1;n<=180*7;n++){
      for(let m=Math.max(1,n-180);m<=n-1;m++){
        P_npick[k][n]+=P_npick[k-1][m]*P_pick[n-m];
      }
    }
  }
}


function input_Tarr(NT,sur){
  //dp[91];
  for(let i=1;i<=90;i++){
    if(i+NT<=90) dp[i]=p[i+NT];
    else dp[i]=0;
  }

  //dP_s5[181];
  for(let n=1;n<=90;n++){
    let dp1=1;
    for(let i=1;i<=n;i++){
      if(i<n) dp1*=1-dp[i];
      else dp1*=dp[i];
    }
    dP_s5[n]=dp1;
  }
  for(let n=91;n<=180;n++) dP_s5[n]=0;

  //dP_pick[181]
  if(sur){
    for(let n=1;n<=180;n++) dP_pick[n]=dP_s5[n];
  }else{
    for(let n=1;n<=180;n++){
      dP_pick[n]=dP_s5[n]*0.5;
      for(let m=1;m<=n-1&&m<=90;m++){
        if(n-m<=90) dP_pick[n]+=dP_s5[m]*0.5*P_s5[n-m];
      }
    }
  }
}


function calc() {
  reset();

  var num1 = document.getElementById('num1').value;
  var num2 = document.getElementById('num2').value;
  var num3 = document.getElementById('num3').value;
  var element = document.getElementById('num4');
  var radioNodeList = element.hoge;
  var num4 = radioNodeList.value;

  s = parseInt(num1);
  N = parseInt(num2);
  NT = parseInt(num3);
  sur = parseInt(num4);

  if(s<1||s>7||N<=0||NT<0){
    document.getElementById('answer').innerHTML = -1;
    return;
  }
  if((!sur&&N+NT>=180*s)||(sur&&N+NT>=180*(s-1)+90)){
    document.getElementById('answer').innerHTML = 100;
    return;
  }

  input_arr();
  input_Tarr(NT,sur);

  let P_out = new Array(N+1); for(let n=1;n<=N;n++) P_out[n]=0;
  if(s==1){
    for(let n=1;n<=N;n++) P_out[n]=dP_pick[n];
  }else{
    for(let n=1;n<=N;n++){
      for(let m=1;m<=n-1&&m<=180;m++){
        P_out[n]+=dP_pick[m]*P_npick[s-1][n-m];
      }
    }
  }

  for(let i=1;i<=N;i++) sum_P+=P_out[i];

  document.getElementById('answer').innerHTML = sum_P*100;
}