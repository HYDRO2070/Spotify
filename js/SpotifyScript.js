console.log("Hello My Script Is Working Or Not....");
let audio = new Audio();
let currFolder;
let SongUL
let song;
function SectoMin(sec){
    if(isNaN(sec) || sec<0){
        return "00:00";
    }
    const min = Math.floor(sec/60);
    const remsec = Math.floor(sec%60);
    const formatemin = String(min).padStart(2,'0');
    const formatesec = String(remsec).padStart(2,'0');
    return `${formatemin}:${formatesec}`;
}
async function getSongs(folder){
    let songs = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
    let a = await songs.text();
    let div = document.createElement("div");
    div.innerHTML = a;
    let as = div.getElementsByTagName("a")
    let oooo = [];
    let jpg;
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".jpg")){
            jpg = element.href.split(`/${currFolder}/`)[1];
        }
        if(element.href.endsWith(".mp3")){ 
            oooo.push(element.href.split(`/${currFolder}/`)[1]);   
        }
    }
    song = oooo;
    console.log(song[0])
    playMusic(song[0],true);
    
    SongUL = document.querySelector(".songsname").getElementsByTagName("ul")[0];
    SongUL.innerHTML=""

    for (const so of song) {
        SongUL.innerHTML =  ` ${SongUL.innerHTML} 
        <li class="border flex rounded m-1 p-1 l">
    <img class="invert" src="img/verified-badge-line.svg" alt="">
    <div class="name">
        <div>${so.replaceAll("%20"," ").split(".mp3")[0]}</div>
    </div>  
    <img class="invert playcircle" src="img/bx-play-circle.svg" alt="">
</li>`;    
    } 


    Array.from(document.querySelector(".songsname").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".name").firstElementChild.innerHTML);
            playMusic(e.querySelector(".name").firstElementChild.innerHTML);
        })
    });
    return oooo;
}

async function getcarddetail(){
    let request = await fetch("http://127.0.0.1:5500/Songs/");
    let response = await request.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardscontainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/Songs/")){
            let folder = e.href.split("/").slice(-1)[0];
            let a = await fetch(`Songs/${folder}/info.json`);
            let response = await a.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML +`<div data-folder="${folder}" class="card m-1 p-1">
                        <div class="play flex align-item justify-content">
                            <img src="img/bx-play.svg" alt="">
                        </div>
                        <img src="Songs/${folder}/cover.jpg" alt="Image">
                        <h2>${response.title}</h2>
                        <p>${response.Description}</p>
                    </div>` 

        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item =>{
            w = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            playMusic(w[0].replaceAll("%20"," ").split(".mp3")[0])
        })
    })
}
const playMusic = (track,pause=false)=>{
    console.log(track)
    if(track.includes(".mp3")){
        audio.src = (`${currFolder}/` + track);
    }
    else{
        audio.src = (`${currFolder}/` + track+ ".mp3");
    }
    if(!pause){
        audio.play();
        play.src = "img/bx-pause-circle.svg";
    }

    document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00/00:00";
}
async function main(){
    await getSongs("Songs/1");
    await getcarddetail();


   

    play.addEventListener("click",()=>{
        if(audio.paused){
            play.src = "img/bx-pause-circle.svg";
            audio.play();
        }
        else{
            audio.pause();
            play.src ="img/bx-play-circle.svg";
        }
    });


    audio.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${SectoMin(audio.currentTime)}/${SectoMin(audio.duration)}`;
        document.querySelector(".circle").style.left = (audio.currentTime/audio.duration)*100 +"%";
    });

    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let per = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = per + "%";
        audio.currentTime = ((audio.duration)*per)/100;
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-140%";
    })

    previous.addEventListener("click",()=>{
        let index = song.indexOf(audio.src.split(`${currFolder}/`)[1]);
        if(index - 1 >= 0){
            playMusic(song[index-1].replaceAll("%20"," ").split(".mp3")[0])            
        }
    })

    next.addEventListener("click",()=>{
        let index = song.indexOf(audio.src.split(`${currFolder}/`)[1]);
        if(index +1 < song.length){
            playMusic(song[index+1].replaceAll("%20"," ").split(".mp3")[0])            
        }
    })

    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        audio.volume = parseInt(e.target.value)/100;
    })

    bxvol.addEventListener("click",(e)=>{
        if(e.target.src.includes("img/bx-volume-full.svg")){
            e.target.src = e.target.src.replace("img/bx-volume-full.svg","img/bx-volume-mute.svg");
            audio.volume = 0;
            document.querySelector(".vol").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src = e.target.src.replace("img/bx-volume-mute.svg","img/bx-volume-full.svg");
            audio.volume = .5;
            document.querySelector(".vol").getElementsByTagName("input")[0].value=50;
        }
    })
}                 
main()     