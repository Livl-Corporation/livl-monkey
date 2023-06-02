/**
 * @author :Franck GUTMANN et Julien Von Der Mark.
 * @description : Problème du pont du singe.
**/

const { readFile, runGame, generatePermutations } = require("./monkeys");

// Strategies :
function initialOrderStrategy(game) {
    return {
        ...game,
        strategyName: "initialOrderStrategy",
    };
}

function increasingWeightStrategy(game) {
    game.monkeys.sort((a, b) => a.poids - b.poids);

    return {
        ...game,
        strategyName: "increasingWeightStrategy",
    };
}

function decreasingWeightStrategy(game) {
    game.monkeys.sort((a, b) => b.poids - a.poids);

    return {
        ...game,
        strategyName: "decreasingWeightStrategy",
    };
}

function increasingSpeedStrategy(game) {
    game.monkeys.sort((a, b) => a.vitesse - b.vitesse);
    return {
        ...game,
        strategyName: "increasingSpeedStrategy",
    };
}

function decreasingSpeedStrategy(game) {
    game.monkeys.sort((a, b) => b.vitesse - a.vitesse);
    return {
        ...game,
        strategyName: "decreasingSpeedStrategy",
    };
}

// Fonction de tri par rapport au rapport poids/vitesse
function ratioWeightWithSpeed(game) {
    game.monkeys.sort((a, b) => (a.poids / a.vitesse) - (b.poids / b.vitesse));
    return {
        ...game,
        strategyName: "ratioWeightWithSpeed",
    };
}

// Jeux
const games = [
    "./jeu1.txt",
    "./jeu2.txt",
    "./jeu3.txt",
    "./jeu4.txt",
    "./jeu5.txt",
    "./jeu6.txt",
]

// fonctions f(game): game
const strategies = [
    initialOrderStrategy,
    decreasingSpeedStrategy,
    increasingWeightStrategy,
    decreasingWeightStrategy,
    increasingSpeedStrategy,
    ratioWeightWithSpeed
]

const bruteForce = () => {

    const path = "./jeu2.txt";
    const game = readFile(path);

    const startTime = Date.now();

    let bestTime = Infinity;

    const runPermuteTest = (permute) => {
        const monkeys = permute.map((index) => game.monkeys[index]);
        return runGame({
            ...game,
            monkeys,
            strategyName: "bruteForce",
        });
    }

    const permute = (arr, m = []) => {
        if (arr.length === 0) {

            const result = runPermuteTest(m);

            if (result.traveltime < bestTime) {
                bestTime = result.traveltime;
            }

        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(Array.from(Array(game.n).keys()));

    const endTime = Date.now();

    console.log({
        gameName: path,
        strategyName: "bruteForce",
        travelTime: bestTime,
        time: endTime - startTime,
    });
}

// Programme principal
games.forEach(path => {

    const game = readFile(path);

    // Classic strategies

    strategies.forEach(strategy => {
        const gameWithStrategy = strategy(JSON.parse(JSON.stringify(game)));

        const result = runGame(gameWithStrategy);

        console.log(result);
    });

});

bruteForce();
