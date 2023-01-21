let H = 720,
    W = 720,
    grid = H / 12;

let app1 = new PIXI.Application({
    height: H,
    width: W,
    backgroundColor: "black",
});

let app2 = new PIXI.Application({
    height: H,
    width: W,
    backgroundColor: "black",
});

document.getElementById("game1").appendChild(app1.view);
document.getElementById("game2").appendChild(app2.view);

let BG1 = new PIXI.Sprite(PIXI.Texture.from("assets/map.png"));
(BG1.height = H), (BG1.width = W);
app1.stage.addChild(BG1);

let BG2 = new PIXI.Sprite(PIXI.Texture.from("assets/map.png"));
(BG2.height = H), (BG2.width = W);
app2.stage.addChild(BG2);

let planeInit = ["up", "right", "down", "left"];
let sprites = [];

class Plane {
    sprite;

    constructor(type, x, y, app) {
        this.sprite = new PIXI.Sprite(
            PIXI.Texture.from(`assets/plane-${planeInit[type]}.png`)
        );
        this.sprite.x = x;
        this.sprite.y = y;

        if (type % 2 == 0) {
            this.sprite.height = 4 * grid;
            this.sprite.width = 5 * grid;
        } else {
            this.sprite.height = 5 * grid;
            this.sprite.width = 4 * grid;
        }

        if (app == 1) app1.stage.addChild(this.sprite);
        else app2.stage.addChild(this.sprite);

        sprites.push(this.sprite);
    }
}

class Shoot {
    sprite;

    constructor(x, y, app) {
        this.sprite = new PIXI.Sprite(PIXI.Texture.from(`assets/shoot.png`));
        this.sprite.x = x * grid;
        this.sprite.y = y * grid;

        this.sprite.height = grid;
        this.sprite.width = grid;

        if (app == 1) app1.stage.addChild(this.sprite);
        else app2.stage.addChild(this.sprite);

        sprites.push(this.sprite);
    }
}

let leaderboard;

async function LoadData() {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    await fetch("http://192.168.1.55:3000/leaderboard", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            leaderboard = JSON.parse(result).data;
        })
        .catch((error) => console.log("error", error));

    for (let a of leaderboard) {
        const H1 = document.createElement("h1");
        H1.innerHTML = a.username + " " + a.score;
        document.getElementById("ranking").appendChild(H1);
        const opt1 = document.createElement("option");
        opt1.innerHTML = a.username;
        const opt2 = document.createElement("option");
        opt2.innerHTML = a.username;
        document.getElementById("p1").appendChild(opt1);
        document.getElementById("p2").appendChild(opt2);
    }
}

LoadData();

document.getElementById("play").onclick = async () => {
    let opt1 = document.getElementById("p1").value;
    let opt2 = document.getElementById("p2").value;

    if (!opt1 || !opt2 || opt1 == opt2) return;
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    let matchData;
    await fetch(
        `http://192.168.1.55:3000/match/${opt1}_VS_${opt2}`,
        requestOptions
    )
        .then((response) => response.text())
        .then((result) => {
            matchData = JSON.parse(result).data;
        })
        .catch((error) => console.log("error", error));

    document.getElementById("player1").innerHTML = matchData.firstPlayer;
    document.getElementById("player2").innerHTML = matchData.secondPlayer;

    console.log(matchData);
    for (let plane of matchData.firstPlayerPlane)
        new Plane(plane.type, plane.x, plane.y, 1);

    for (let plane of matchData.secondPlayerPlane)
        new Plane(plane.type, plane.x, plane.y, 2);

    let indx = 0;
    let interval = setInterval(() => {
        if (indx == matchData.turns.length) {
            clearInterval(interval);
            interval = null;
            return;
        }
        let turn = matchData.turns[indx];
        if (turn.player == matchData.firstPlayer) {
            new Shoot(turn.y + 1, turn.x + 1, 2);
        } else {
            new Shoot(turn.y + 1, turn.x + 1, 1);
        }
        indx++;
    }, 500);
};

function clearGame() {
    for (let i = 0; i < sprites.length; i++) {
        sprites[i].parent.removeChild(sprites[i]);
        sprites[i].destroy();
    }

    sprites = [];
    if (!interval) clearInterval(interval);
}
