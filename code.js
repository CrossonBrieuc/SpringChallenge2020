let lim=75;
let lim2=40;
let lim3=5;
let rdmList=[[0,1,2,3],[0,2,3,1],[1,3,2,0],[3,1,0,2],[2,0,1,3],[1,2,3,0],[2,3,0,1],[3,0,1,2],[1,0,3,2]]
let banX=[];
let banY=[];

let nt1=150; //note + a chaque piont/cmpt
let nt2=5;  //note + a chaque piont
let nt3=500; //note + en proche avec aventage/cmpt
let nt4=5;  //note / en proche sans avantage/cmpt
let qtPoint=2.5; //quotien pt vue

var inputs = readline().split(' ');
const width = parseInt(inputs[0]); 
const height = parseInt(inputs[1]); 
let spaces=new Array(height);
for (let i = 0; i < height; i++) {
    const row = readline().split(''); 
    spaces[i]=row;
}

let ptMap=new Array(height);
for(let i =0;i<height;i++){
    ptMap[i]=new Array(width);
    for(let e=0;e<width;e++){
        if(spaces[i][e]===' '){
            ptMap[i][e]=1;
        }else{
            ptMap[i][e]=-1;
        }
    }
}


let trueMov=new Array(height);
for (let y = 0; y < height; y++) {
    trueMov[y]=new Array(width);
    for(let x=0;x<width;x++){
        let nbmov=0;
        trueMov[y][x]=[];
        if(spaces[y][x]===' '){
            if(spaces[y+1][x]===' '){
                trueMov[y][x].push(1);
                nbmov++;
            }else{
                trueMov[y][x].push(0);
            }
            if(x<width && spaces[y][x+1]===' '){
                trueMov[y][x].push(1);
                nbmov++;
            }else if(x===width){
                trueMov[y][x].push(1);
                nbmov++;
            }else{
                trueMov[y][x].push(0);
            }
            if(spaces[y-1][x]===' '){
                trueMov[y][x].push(1);
                nbmov++;
            }else{
                trueMov[y][x].push(0);
            }
            if(x>0 && spaces[y][x-1]===' '){
                trueMov[y][x].push(1);
                nbmov++;
            }else if(x===0){
                trueMov[y][x].push(1);
                nbmov++;
            }else{
                trueMov[y][x].push(0);
            }
        }else{
            trueMov[y][x]=[0,0,0,0];
        }
        trueMov[y][x].push(nbmov);
    }
}
//console.error(trueMov)

// |---------------------------------|
// | pre-calcul vision a chaque case |
// |---------------------------------|
let caseVision=new Array(height);
for(let y=0;y<height;y++){
    caseVision[y]=new Array(width);
    for(let x=0;x<width;x++){
        caseVision[y][x]=[0,0,0,0]
        if(spaces[y][x]===' '){
            for(let i=0;i<4;i++){
                if(trueMov[y][x][i]===1){
                    caseVision[y][x][i]++;
                    if(i===0){
                        let y1=y+1;
                        while(trueMov[y1][x][i]===1){
                            caseVision[y][x][i]++;
                            y1++;
                        }
                    }else if(i===1){
                        let x1=x+1;
                        while(x<width && trueMov[y][x1][i]===1){
                            caseVision[y][x][i]++;
                            x1++;
                        }
                    }else if(i===2){
                        let y1=y-1;
                        while(trueMov[y1][x][i]===1){
                            caseVision[y][x][i]++;
                            y1--;
                        }
                    }else if(i===3){
                        let x1=x-1;
                        while(x1>=0 && trueMov[y][x1][i]===1){
                            caseVision[y][x][i]++;
                            x1--;
                        }
                    }
                }
            }
        }else{
            caseVision[y][x]=[-1]
        }
    }
}
//console.error(caseVision)


function rdmInt(max){
    return Math.floor(Math.random()*Math.floor(max))
}

let movsX;
let movsY;
let note=0;
let cmpt=0;
function boucle(x,y,ptlist,speed,enx,eny,mytype,entype,ax,ay,id,exclu,lx,ly){
    cmpt++;
    if(cmpt<lim2){
    let test2=false;
    let list=rdmList[rdmInt(rdmList.length)];
    let fin=true;

    for(let i=0;i<4;i++){
        let ntx=x;
        let nty=y;
        let e = list[i];
        if(e===0 && trueMov[y][x][1]===1){
            test2=true;
            if(x===width-1){
                ntx=0;
            }else{
                ntx++;
            }
        }else if(e===1 && trueMov[y][x][3]===1){
            test2=true;
            if(x===0){
                ntx=width-1;
            }else{
                ntx--;
            }
        }else if(e===2 && trueMov[y][x][0]===1){
            test2=true;
            nty++;
        }else if(e===3 && trueMov[y][x][2]===1){
            test2=true;
            nty--;
        }
        if(test2===true){
            if(ntx!==lx || nty!==ly){
            if(speed===true){
                if(trueMov[nty][ntx][4]<=1){
                    fin=false;
                }
            }
            if(movsX===-1 && exclu[0][0]!==-1 && exclu.length>1){
                for(let z=1;z<exclu.length;z++){
                    if(exclu[z][0]===ntx&&exclu[z][1]===nty){
                        fin=false;
                        break;
                    }
                }
            }

            if(fin===true){
                if(ptlist[nty][ntx]>-1){
                    note+=nt2*ptlist[nty][ntx]+ptlist[nty][ntx]*Math.round(nt1/cmpt);
                    ptlist[nty][ntx]=-1;
                }
                note++;
                if(movsX===-1){
                    movsX=ntx;
                    movsY=nty;
                }
                if(entype[0]===1 && cmpt<lim3){
                    enNote(ntx,nty,enx,eny,mytype,entype,id);
                }
                if(note>=0){
                    boucle(ntx,nty,ptlist,speed,enx,eny,mytype,entype,ax,ay,id,exclu,x,y);
                }
                break;
            }
            }
        }
    }
    if(test2===true){
        boucle(x,y,ptlist,speed,enx,eny,mytype,entype,ax,ay,id,exclu,-1,-1);
    }
    }
}
//banX.push(enx[i]);banY.push(eny[i])
let warning=['NA','NA','NA','NA','NA'];
function enNote(x,y,enx,eny,mytype,entype,id){
    a=Math.abs;
    for(let i=0;i<enx.length;i++){
        /*if(a(x-enx[i])>=-1 && a(x-enx[i])<=1 && a(y-eny[i])>=-1 && a(y-eny[i])<=1){
            
        }*/
        if(x===enx[i] && y===eny[i]){
            if(mytype==='ROCK' && entype[i+1]==='PAPER'){note=-1;warning[id]='SCISSORS';}
            else if(mytype==='PAPER' && entype[i+1]==='SCISSORS'){note=-1;warning[id]='ROCK';}
            else if(mytype==='SCISSORS' && entype[i+1]==='ROCK'){note=-1;warning[id]='PAPER';}
            else if(mytype==='SCISSORS' && entype[i+1]==='SCISSORS'){note/=Math.round(nt4/cmpt);warning[id]='ROCK'}
            else if(mytype==='ROCK' && entype[i+1]==='ROCK'){note/=Math.round(nt4/cmpt);warning[id]='PAPER'}
            else if(mytype==='PAPER' && entype[i+1]==='PAPER'){note/=Math.round(nt4/cmpt);warning[id]='SCISSORS'}
            else if(mytype==='SCISSORS' && entype[i+1]==='PAPER'){note+=Math.round(nt3/cmpt)}
            else if(mytype==='ROCK' && entype[i+1]==='SCISSORS'){note+=Math.round(nt3/cmpt)}
            else if(mytype==='PAPER' && entype[i+1]==='ROCK'){note+=Math.round(nt3/cmpt)}
        }
    }
}



let tour=0;

while (true) {
    let t1= new Date().getTime();
    tour++;
    let inputs = readline().split(' ');
    const myScore = ~~(inputs[0]);
    const opponentScore = ~~(inputs[1]);
    const visiblePacCount = ~~(readline()); 
    let x=[];
    let y=[];
    let enx=[];
    let eny=[];
    let id=[];
    let cd;
    let spleft=0;
    let entype=[0];
    let mytype=[];

    for (let i = 0; i < visiblePacCount; i++) {
        let inputs = readline().split(' ');
        const pacId = ~~(inputs[0]); 
        const mine = inputs[1] !== '0'; 
        const x1 = ~~(inputs[2]); 
        const y1 = ~~(inputs[3]); 
        const typeId = inputs[4]; 
        const speedTurnsLeft = ~~(inputs[5]);
        const abilityCooldown = ~~(inputs[6]);
        if(typeId!=='DEAD'){
        if(mine===true){
            id.push(pacId)
            x.push(x1);
            y.push(y1);
            mytype.push(typeId)
            cd=abilityCooldown;
            spleft=speedTurnsLeft;
        }else{
            entype[0]=1;
            enx.push(x1);
            eny.push(y1);
            entype.push(typeId)
        }
        ptMap[y1][x1]=-1;
        }
    }
    const visiblePelletCount = ~~(readline());
    for (let i = 0; i < visiblePelletCount; i++) {
        let inputs = readline().split(' ');
        const x2 = ~~inputs[0];
        const y2 = ~~(inputs[1]);
        const value = ~~(inputs[2]);
        ptMap[y2][x2]=value*qtPoint;
    }

    for(let i=0;i<id.length;i++){
        for(let m=0;m<4;m++){
            if(caseVision[y[i]][x[i]][m]>0){
                if(m===0){
                    for(let d=1;d<=caseVision[y[i]][x[i]][m];d++){
                        if(ptMap[y[i]+d][x[i]]===1){
                            ptMap[y[i]+d][x[i]]=-1;
                        }
                    }
                }else if(m===1){
                    for(let d=1;d<=caseVision[y[i]][x[i]][m];d++){
                        if(ptMap[y[i]][x[i]+d]===1){
                            ptMap[y[i]][x[i]+d]=-1;
                        }
                    }
                }else if(m===2){
                    for(let d=1;d<=caseVision[y[i]][x[i]][m];d++){
                        if(ptMap[y[i]-d][x[i]]===1){
                            ptMap[y[i]-d][x[i]]=-1;
                        } 
                    }
                }else if(m===3){
                    for(let d=1;d<=caseVision[y[i]][x[i]][m];d++){
                        if(ptMap[y[i]][x[i]-d]===1){
                            ptMap[y[i]][x[i]-d]=-1;
                        }
                    }
                }
            }
        }
    }

    //console.error(ptMap)

    let speed=false;
    if(spleft!==0){
        speed=true;
    }
    let result='';

    if(tour===1){
        let exclu=[[0,0]];
        for(let i=0;i<id.length;i++){
            if(i===0){
                exclu[0]=[-1,-1]
            }else{
                exclu[0]=[0,0]
            }
            lim2=lim3;
            for(let e=0;e<25;e++){
                note=0;
                cmpt=0;
                movsX=-1;
                movsY=-1;
                let hptlist=new Array(height);
                for(let i2 =0;i2<height;i2++){
                    hptlist[i2]=[...ptMap[i2]];
                }
                boucle(x[i],y[i],hptlist,speed,enx,eny,mytype[i],entype,x,y,id[i],exclu,-1,-1)
            }
            lim2=80;
        }
    }

    if(cd===0){
        for(let i=0;i<id.length;i++){
            if(i!==0){
                result+='|';
            }
            if(warning[id[i]]!=='NA'){
                result+='SWITCH '+id[i]+' '+warning[id[i]];
            }else{result+='SPEED '+id[i];}
        }
        warning=['NA','NA','NA','NA','NA'];
    }else{
    //warning=['NA','NA','NA','NA','NA'];
    let mov=[];
    let exclu=[[0,0]];
    for(let i=0;i<id.length;i++){
        if(i===0){
            exclu[0]=[-1,-1]
        }else{
            exclu[0]=[0,0]
        }
        let fnote=-10;
        let resX=0;
        let resY=0;
        for(let e=0;e<lim;e++){
            note=0;
            cmpt=0;
            movsX=-1;
            movsY=-1;
            let hptlist=new Array(height);
            for(let i2 =0;i2<height;i2++){
                hptlist[i2]=[...ptMap[i2]];
            }
            boucle(x[i],y[i],hptlist,speed,enx,eny,mytype[i],entype,x,y,id[i],exclu,-1,-1);
            //console.error(note+'  |  '+cmpt)
            if(note>fnote){
                fnote=note;
                resX=movsX;
                resY=movsY;
            }
        }
        exclu.push([resX,resY]);
        if(speed===true && resX!==-1){
            fnote=-Infinity;
            let cx=resX;
            let cy=resY;
            //console.error('c : '+cx+' '+cy)
            ptMap[cy][cx]=-1;
            for(let e=0;e<lim;e++){
                note=0;
                cmpt=0;
                movsX=-1;
                movsY=-1;
                let hptlist=new Array(ptMap.length)
                for(let i2 =0;i2<ptMap.length;i2++){
                    hptlist[i2]=[...ptMap[i2]];
                }
                boucle(cx,cy,hptlist,false,enx,eny,mytype,entype,x,y,id[i],[[-1,-1]],-1,-1);
                if(note>fnote){
                    fnote=note;
                    resX=movsX;
                    resY=movsY;
                }
            }
            if(x[i]===resX && y[i]===resY){
                resX=cx;
                resY=cy;
            }
        }
        if(resX===-1){
            resX=x[i]
            resY=y[i]
        }
        res=resX+' '+resY;
        mov.push(res)
        ptMap[resY][resX]=-1;
        if(i!==0){
            result+='|';
        }
        result+='MOVE '+id[i]+' '+mov[i];
        console.error(id.length+' '+i+'  --  '+result)
    }
    }

    let t2= new Date().getTime()
    console.error('time : '+(t2-t1))

    console.log(result);
    console.error('DONE')
}
