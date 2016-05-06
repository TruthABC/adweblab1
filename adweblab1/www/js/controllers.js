angular.module('starter.controllers', [])

.controller('CalculatorCtrl', function($scope) {

  var num=new Array(0,0);
  var pnum=0;
  var startednum=new Array(false,false);
  var ope=0;
  var started=false;

  $scope.clr=function(){
    started=false;
    pnum=0;
    num[0]=0;
    startednum[0]=false;
    $scope.read="";
    $scope.write="";
  };

  $scope.newread=function(n){
    num[pnum]=num[pnum]*10+n;
    if (pnum==0&&startednum[0]==false)
      $scope.read="";
    $scope.read+=""+n;
    started=true;
    startednum[pnum]=true;
  };

  $scope.newope=function(n){
    if (started===false)
      return;
    var oldope=ope;
    ope=n;
    //1 +
    //2 -
    //3 *
    //4 /
    //0 =

    if (pnum==0){
      if (startednum[0]===false){//刚完成一次“纯等于”运算状态
        if (ope==0){//刚完成一次“纯等于”运算，再执行“纯等于”运算，为无效运算；保持状态
          //$scope.read+="=";
        }
        else{//刚完成一次“纯等于”运算，再执行“等于且其他”运算，则提取“纯等于”运算结果作为“0号运算数”；转化为等待“1号运算数”输入状态
          var output=ntoch(ope);
          num[0]=parseFloat($scope.write);//parseFloat
          $scope.read=num[0]+output;
          pnum=1;
          num[1]=0;
          startednum[1]=false;
        }
      }
      else{//(startednum[0]===true)//“0号运算数”就绪状态
        if (ope==0){//“0号运算数”就绪状态，再执行“纯等于”运算，转移到刚完成一次“纯等于”运算状态
          $scope.read+="=";
          $scope.write=num[0];
          pnum=0;
          num[0]=0;
          startednum[0]=false;
          //local storage
          makeStorage($scope.write);
        }
        else{//“0号运算数”就绪状态，再执行“等于且其他”运算，转移到等待“1号运算数”输入状态
          var output=ntoch(ope);
          $scope.read+=output;
          pnum=1;
          num[1]=0;
          startednum[1]=false;
        }
      }
    }
    else{//(pnum==1)
      if (startednum[1]===false){//等待“1号运算数”输入状态
        if (ope==0){//等待“1号运算数”输入状态，再执行“纯等于”运算，则覆盖并执行“运算符”，转移到刚完成一次“纯等于”运算状态
          var str=$scope.read;
          str=str.substring(0,str.length-1);
          $scope.read=str+"=";
          //去掉末尾运算符，添加新运算符
          $scope.write=num[0];
          pnum=0;
          num[0]=0;
          startednum[0]=false;
        }
        else{//等待“1号运算数”输入状态，再执行“等于且其他”运算，则覆盖“运算符”，保持等待“1号运算数”输入状态
          var output=ntoch(ope);
          var str=$scope.read;
          str=str.substring(0,str.length-1);
          $scope.read=str+output;
          //去掉末尾运算符，添加新运算符
        }
      }
      else{//(startednum[1]===true)//“1号运算数”就绪状态
        if (ope==0){//“1号运算数”就绪状态，再执行“纯等于”运算，则正常根据“0号\1号运算数”与“运算符”运算，转移到刚完成一次“纯等于”运算状态
          var output=calcu(oldope);
          $scope.read+="=";
          $scope.write=output;
          pnum=0;
          num[0]=0;
          startednum[0]=false;
          //local storage
          makeStorage(output);
        }
        else{//“1号运算数”就绪状态，再执行“等于且其他”运算，则正常根据“0号\1号运算数”与“运算符”运算，转移到等待“1号运算数”输入状态
          var output=calcu(oldope);
          $scope.write=output;
          var output2=ntoch(ope);
          $scope.read=output+output2;
          num[0]=parseFloat(output);//parseFloat
          pnum=1;
          num[1]=0;
          startednum[1]=false;
          //local storage
          makeStorage(output);
        }
      }
    }
  }

  $scope.last=function(){//强制转移到刚完成一次“纯等于”运算状态
    if (localStorage.lastAns) {
      started=true;
      $scope.read="lastAns=";
      $scope.write=localStorage.lastAns;
      pnum=0;
      num[0]=0;
      startednum[0]=false;
    }else{
      alert("Cannot load last answer, there is no last answer.");
    }
  }

  function calcu(someope){
    if (someope==1)
      return(num[0]+num[1]);
    if (someope==2)
      return(num[0]-num[1]);
    if (someope==3)
      return(num[0]*num[1]);
    //if (someope==4)
    return(num[0]/num[1]);
  }

  function ntoch(someope){
    if (someope==1)
      return('+');
    if (someope==2)
      return('-');
    if (someope==3)
      return('*');
    if (someope==4)
      return('/');
    return('=');
  }

  function makeStorage(ans){
    localStorage.lastAns=parseFloat(ans);
  }

})

.controller('LocationCtrl', function($scope) {

  navigator.geolocation.getCurrentPosition(setPosition);

  function setPosition(position) {
    $scope.lat=position.coords.latitude;
    $scope.long=position.coords.longitude;
  }

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
