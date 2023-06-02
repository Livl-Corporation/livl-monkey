/**
* Problème : le pont du singe.
*/

const fs = require('fs');
const lineStartMonkey = 6;
const numberOfLinesPerMonkey = 2;

// Pont
// {
//   longueur: number;
//   capacite: number;   
// }

// N : nombre de singes

// Monkeys
// [
//      {
//          poids: number;  
//          vitesse: number; 
//      }
//  ]

// returns: { pont, n, monkeys }
function readFile(path) {
    const data = fs.readFileSync(path, 'utf8').split('\n');

    const longueur = parseInt(data[1]);
    const capacite = parseInt(data[3]);
    let n = parseInt(data[5]);

    let pont = { longueur, capacite };

    let monkeys = [];
    for (let i = lineStartMonkey; i < data.length - numberOfLinesPerMonkey; i += numberOfLinesPerMonkey) {
        const monkey = {
            poids: parseInt(data[i]),
            vitesse: parseInt(data[i + 1]),
        };

        monkeys.push(monkey);
    };

    return {
        pont, n, monkeys,
        gameName: path,
    }

}

function weightOnBridge(monkeysOnBridge) {
    return monkeysOnBridge.reduce((acc, monkey) => acc + monkey.poids, 0);
}

function canMonkeyEnterBridge(monkey, monkeysOnBridge, pont) {
    return weightOnBridge(monkeysOnBridge) + monkey.poids <= pont.capacite
}

function calculateMonkeyTravelTime(monkey, longueurPont) {
    return longueurPont / monkey.vitesse;
}

function slowestExitTime(monkeysOnBridge) {
    return monkeysOnBridge.reduce((acc, monkey) => Math.max(acc, monkey.exitTime), 0);
}

// returns time at which the last monkey has crossed the bridge
function computeGame(game) {

    let seconds = 0;
    let monkeysOnBridge = [];
    let monkeysWaiting = game.monkeys;

    while (monkeysWaiting.length > 0) {

        // soit j'entre car c'est dispo
        if (canMonkeyEnterBridge(monkeysWaiting[0], monkeysOnBridge, game.pont)) {
            const monkey = monkeysWaiting.shift();
            const indexOnBridge = monkeysOnBridge.length;

            monkeysOnBridge.push(monkey);

            monkey.exitTime = Math.max(
                (seconds + calculateMonkeyTravelTime(monkey, game.pont.longueur)),
                slowestExitTime(monkeysOnBridge.slice(0, indexOnBridge))
            );

        } else {

            // c'est l'heure de faire sortir le prochaine à sortir.
            const monkey = monkeysOnBridge.shift();
            seconds = monkey.exitTime;

        }

    }

    return monkeysOnBridge.pop().exitTime;

}

// returns: {
//    gameName: string;
//    strategyName: string;
//    traveltime: number;
//    runtime: number;
// }
function runGame(game) {

    const startTime = Date.now();

    const traveltime = computeGame(game);

    const endTime = Date.now();

    return {
        strategyName: game.strategyName,
        gameName: game.gameName,
        traveltime,
        runtime: endTime - startTime,
    };
}

module.exports = {
    readFile, runGame,
}