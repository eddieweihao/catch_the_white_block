/**
 * Created by Administrator on 2016/8/10.
 */

//首先定义一些程序里的常量
//地图内方块个数10X10
var mapX=10,mapY=10;

//地图长和宽
var mapW=400,mapH=400;

//地图table
var tableMap;

//记录地图信息的二维数组
var mapValue=new Array();
for(var k=0;k<mapY;k++){
    mapValue[k]=new Array();
    for(var j=0;j<mapX;j++){
        mapValue[k][j]=0;
    }
}

//创建初始地图，表格自定义属性有三个
//分别是cX-横坐标、cY-纵坐标、value-方块属性（-1为障碍物、0为空地图、1为小白块，初始值为0）
function createMap(){
    tableMap=document.createElement("table");
    tableMap.height=mapH+mapY+1;
    tableMap.width=mapW+mapX+1;
    tableMap.style.borderLeft="1px solid #000000";
    tableMap.style.borderTop="1px solid #000000";
    //table设置上左边框、td设置下优边框
    tableMap.style.borderCollapse="collapse";
    for(k=0;k<mapY;k++){
        var trMap=document.createElement("tr");
        trMap.height=mapH/mapY;
        trMap.width=mapW;
        for(j=0;j<mapX;j++){
            var tdMap=document.createElement("td");
            tdMap.setAttribute("cY",k);
            tdMap.setAttribute("cX",j);
            tdMap.width=mapW/mapX;
            tdMap.height=mapH/mapY;
            tdMap.style.borderRight="1px solid #000000";
            tdMap.style.borderBottom="1px solid #000000";

            //添加点击事件
            tdMap.onclick=tdClick;
            trMap.appendChild(tdMap);
        }
        tableMap.appendChild(trMap);
    }
    document.getElementById("map_div").appendChild(tableMap);

    //生成初始障碍物
    var x1,y1,x2,y2,x3,y3;
    function createBlackBox(){
        x1=Math.ceil(Math.random()*9);
        y1=Math.ceil(Math.random()*9);
        x2=Math.ceil(Math.random()*9);
        y2=Math.ceil(Math.random()*9);
        x3=Math.ceil(Math.random()*9);
        y3=Math.ceil(Math.random()*9);
    }

    do{
        createBlackBox();
    }while((x1==x2&&y1==y2)||(x1==x3&&y1==y3)||(x2==x3&&y2==y3))
    //障碍物不重复

    mapValue[y1][x1]=-1;
    mapValue[y2][x2]=-1;
    mapValue[y3][x3]=-1;

    tableMap.childNodes[y1].childNodes[x1].style.backgroundColor="black";
    tableMap.childNodes[y2].childNodes[x2].style.backgroundColor="black";
    tableMap.childNodes[y3].childNodes[x3].style.backgroundColor="black";
}

createMap();

function createWhiteBox(wY,wX){
    var o=new Object();
    o.wX=wX;
    o.wY=wY;

    //白块的移动方法
    o.move=function(way){
        switch (way){
            case "up":{
                tableMap.childNodes[whiteBox.wY].childNodes[whiteBox.wX].style.backgroundColor="";
                mapValue[whiteBox.wY][whiteBox.wX]=0;
                tableMap.childNodes[whiteBox.wY-1].childNodes[whiteBox.wX].style.backgroundColor="white";
                mapValue[whiteBox.wY-1][whiteBox.wX]=1;
                whiteBox.wY=whiteBox.wY-1;
            }break;
            case "right":{
                tableMap.childNodes[whiteBox.wY].childNodes[whiteBox.wX].style.backgroundColor="";
                mapValue[whiteBox.wY][whiteBox.wX]=0;
                tableMap.childNodes[whiteBox.wY].childNodes[whiteBox.wX+1].style.backgroundColor="white";
                mapValue[whiteBox.wY][whiteBox.wX+1]=1;
                whiteBox.wX=whiteBox.wX+1;
            }break;
            case "down":{
                tableMap.childNodes[whiteBox.wY].childNodes[whiteBox.wX].style.backgroundColor="";
                mapValue[whiteBox.wY][whiteBox.wX]=0;
                tableMap.childNodes[whiteBox.wY+1].childNodes[whiteBox.wX].style.backgroundColor="white";
                mapValue[whiteBox.wY+1][whiteBox.wX]=1;
                whiteBox.wY=whiteBox.wY+1;
            }break;
            case "left":{
                tableMap.childNodes[whiteBox.wY].childNodes[whiteBox.wX].style.backgroundColor="";
                mapValue[whiteBox.wY][whiteBox.wX]=0;
                tableMap.childNodes[whiteBox.wY].childNodes[whiteBox.wX-1].style.backgroundColor="white";
                mapValue[whiteBox.wY][whiteBox.wX-1]=1;
                whiteBox.wX=whiteBox.wX-1;
            }break;
            default:break;
        }
        if(whiteBox.wX==0||whiteBox.wX==9||whiteBox.wY==0||whiteBox.wY==9){
            alert("你输了");
            window.location.href=window.location.href;
        }
        return 0;
    }
    return o;
}

//随机生成白块位置
do{
    ran_wX=Math.ceil(Math.random()*5+2);
    ran_wY=Math.ceil(Math.random()*5+2);
}while(tableMap.childNodes[ran_wY].childNodes[ran_wX].style.backgroundColor=="black")
mapValue[ran_wY][ran_wX]=1;

//实例化白块对象
var whiteBox=new createWhiteBox(ran_wY,ran_wX);

tableMap.childNodes[ran_wY].childNodes[ran_wX].style.backgroundColor="white";

//记录边缘距离、方向、以及下一步是否可以行
function whiteToBorderObj(len,way,wbool){
    this.len=len;
    this.way=way;
    this.wbool=wbool;
}

//测试点击事件参数
function tdClick(){
    var t=event.target;
    var tx= t.getAttribute("cX");
    var ty= t.getAttribute("cY");
    if(mapValue[ty][tx]==0){
        mapValue[ty][tx]=-1;
        tableMap.childNodes[ty].childNodes[tx].style.backgroundColor="black";
    }else return 0;

    //判断边缘距离及方向
    var whiteToBorder=new Array();

    //上方向
    whiteToBorder.push(new whiteToBorderObj(whiteBox.wY,"up",mapValue[whiteBox.wY-1][whiteBox.wX]));
    //右方向
    whiteToBorder.push(new whiteToBorderObj(mapX-1-whiteBox.wX,"right",mapValue[whiteBox.wY][whiteBox.wX+1]));
    //下方向
    whiteToBorder.push(new whiteToBorderObj(mapY-1-whiteBox.wY,"down",mapValue[whiteBox.wY+1][whiteBox.wX]));
    //左方向
    whiteToBorder.push(new whiteToBorderObj(whiteBox.wX,"left",mapValue[whiteBox.wY][whiteBox.wX-1]));

    //从小到大排序
    whiteToBorder.sort(function(a,b){
        return a.len-b.len}
    );

    //测试
    //console.log(whiteToBorder[0].way);
    //console.log(whiteToBorder[1].way);
    //console.log(whiteToBorder[2].way);
    //console.log(whiteToBorder[3].way);
    //console.log("---");
    //console.log(whiteToBorder[0].len);
    //console.log(whiteToBorder[1].len);
    //console.log(whiteToBorder[2].len);
    //console.log(whiteToBorder[3].len);
    //console.log("---");

    //按路径长短依次判断方向是否可行
    if(whiteToBorder[0].wbool==0){
        whiteBox.move(whiteToBorder[0].way);
    }else if(whiteToBorder[1].wbool==0){
        whiteBox.move(whiteToBorder[1].way);
    }else if(whiteToBorder[2].wbool==0){
        whiteBox.move(whiteToBorder[2].way);
    }else if(whiteToBorder[3].wbool==0){
        whiteBox.move(whiteToBorder[3].way);
    }else{
        alert("你赢了");
        window.location.href=window.location.href;
    }
}




























