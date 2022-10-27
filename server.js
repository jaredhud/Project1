import express from "express";

let cmd = "";
let isAlive = true;
let isInCombat = false;
let isInShop = false;
let i = 0;
const cmdList = [
  "Open",
  "Look",
  "Go",
  "Inv",
  "Status",
  "Fight",
  "Equip",
  "Get",
  "Loot",
  "Buy",
  "Sell",
];
let availableEnemies = [];
let mainCharacter = {};
let enemy = {};
const weapons = [
  { name: "fist", damage: [0, 3], price: 0 },
  { name: "dagger", damage: [2, 5], price: 10 },
  { name: "club", damage: [4, 7], price: 15 },
  { name: "claymore", damage: [6, 9], price: 50 },
  { name: "bfg", damage: [10, 15], price: 1000 },
];
const armors = [
  { name: "naked", armor: 0, agility: 35, price: 0 },
  { name: "cloth", armor: 1, agility: 30, price: 5 },
  { name: "leather", armor: 2, agility: 20, price: 15 },
  { name: "chainmail", armor: 3, agility: 15, price: 100 },
  { name: "platemail", armor: 4, agility: 5, price: 70 },
];
let inventory = [weapons[0], armors[0]];
let shop = [
  weapons[1],
  weapons[2],
  weapons[3],
  weapons[4],
  armors[1],
  armors[2],
  armors[3],
  armors[4],
];
const ogreLoot = [weapons[3], armors[4]];
const goblinLoot = [weapons[1], armors[2]];
const wolfLoot = [armors[2], armors[1]];
const skeletonLoot = [weapons[2], armors[3]];
const chestLoot = [
  weapons[1],
  weapons[2],
  weapons[3],
  weapons[4],
  armors[1],
  armors[2],
  armors[3],
  armors[4],
];
const RonnyLoot = [];
let availableLoot = [];
let roomLevel = 0;
const availableRooms = ["foyer", "shop", "deeper", "adjacent"];
const characters = [
  {
    name: "player",
    health: 100,
    loot: inventory,
    equipped: [weapons[0].name, armors[0].name],
    damage: weapons[0].damage,
    armor: armors[0].armor,
    agility: armors[0].agility,
    location: "foyer",
    gold: 0,
  },
  {
    name: "shopkeep",
    health: 100,
    equipped: [weapons[2].name, armors[1].name],
    damage: weapons[2].damage,
    loot: shop,
    armor: armors[1].armor,
    agility: armors[1].agility,
    location: "shop",
    hostile: false,
    isAlive: true,
  },
  {
    name: "ogre",
    health: 150,
    damage: [6, 9],
    loot: ogreLoot,
    armor: 5,
    agility: 5,
    location: 3,
    hostile: true,
  },
  {
    name: "goblin",
    health: 30,
    damage: [2, 5],
    loot: goblinLoot,
    armor: 1,
    agility: 40,
    location: 2,
    hostile: true,
  },
  {
    name: "wolf",
    health: 1,
    damage: [0, 3],
    loot: wolfLoot,
    armor: 0,
    agility: 10,
    location: 1,
    hostile: true,
  },
  {
    name: "skeleton",
    health: 60,
    damage: [4, 7],
    loot: skeletonLoot,
    armor: 2,
    agility: 20,
    location: 2,
    hostile: true,
  },
  {
    name: "chest",
    health: 0,
    damage: 0,
    loot: chestLoot,
    armor: 0,
    agility: 180,
    location: 2,
    hostile: false,
  },
  {
    name: "Ronny",
    health: 1000,
    damage: weapons[3].damage,
    loot: RonnyLoot,
    armor: armors[3].armor,
    agility: armors[3].agility,
    location: "foyer",
    hostile: false,
    isAlive: true,
  },
];

function fight(cmd, sendRes) {
  let potHP = 10;
  characters;
  let damageTaken = 0;
  let damageDone = 0;

  if (isAlive) {
    if (cmd === "go" || cmd === "run") {
      if (
        !enemy.hostile ||
        mainCharacter.agility - enemy.agility >= Math.random() * 100
      ) {
        sendRes =
          sendRes +
          `The ${enemy.name} makes leaving difficult, but whether you meant to or not, you manage to escape back to the foyer\n`;
        mainCharacter.location = "foyer";
        enemy = {};
        Object.assign(enemy, characters[7]);
        roomLevel = 0;
        return [false, sendRes];
      } else {
        if (mainCharacter.agility - enemy.agility <= 0) {
          sendRes =
            sendRes +
            "This guy is way quicker than you.\nMight as well fight it out\n";
        } else {
          sendRes =
            sendRes +
            `Didn't escape this time\nYou have a ${
              mainCharacter.agility - enemy.agility
            }% chance of getting away\nDo what you will with that info...\n`;
        }
      }
    } else if (cmd === "attack" || cmd === "fight") {
      if (enemy.agility - mainCharacter.agility >= Math.random() * 100) {
        sendRes = sendRes + `The ${enemy.name} dodges your attack!\n`;
      } else {
        damageDone =
          mainCharacter.damage[0] +
          Math.round(
            Math.random() * (mainCharacter.damage[1] - mainCharacter.damage[0])
          ) -
          enemy.armor;
        if (damageDone < 0) {
          damageDone = 0;
        }
        enemy.health = enemy.health - damageDone;
        sendRes =
          sendRes +
          `You do ${damageDone} damage to the ${enemy.name} with your ${mainCharacter.equipped[0]}, lowering them to ${enemy.health} health\n`;
        if (
          enemy.name === characters[1].name &&
          enemy.health < characters[1].health - 15 &&
          !characters[1].hostile
        ) {
          characters[1].hostile = true;
          sendRes = sendRes + "You've made an enemy of the shopkeep!\n";
        }
        if (
          enemy.name === characters[7].name &&
          enemy.health < 150 &&
          !characters[7].hostile
        ) {
          characters[7].hostile = true;
          sendRes =
            sendRes +
            "Congrats! You've made an enemy of the Ronny!\nThat takes some doing, and he's pretty inescapable.\n";
        }
      }
    } else if (cmd === "heal") {
      mainCharacter.health = mainCharacter.health + potHP;
      if (mainCharacter.health > 100) {
        mainCharacter.health = 100;
      }
      sendRes =
        sendRes +
        `Through shear force of will, you heal to ${mainCharacter.health} HP.\nThe programmer was lazy and you can do that in combat to heal ${potHP} an infinite number of times\n`;
    } else if (cmd === "open" && enemy.name === "chest") {
      sendRes = sendRes + "You open the chest.\n";
    } else {
      sendRes =
        sendRes +
        `You're in combat, you don't have time to ${cmd}.\nNext time, try "attack", "run", or "heal".\nYou lose a turn!\n`;
    }
    if (enemy.health > 0) {
      sendRes = sendRes + `The ${enemy.name} attacks!\n`;
      if (mainCharacter.agility - enemy.agility >= Math.random() * 100) {
        sendRes =
          sendRes +
          `Ooh so agile!\nYou manage to dodge the ${enemy.name}'s attack!\n`;
      } else {
        damageTaken =
          enemy.damage[0] +
          Math.round(Math.random() * (enemy.damage[1] - enemy.damage[0])) -
          mainCharacter.armor;
        if (damageTaken < 0) {
          damageTaken = 0;
        }
        mainCharacter.health = mainCharacter.health - damageTaken;
        sendRes =
          sendRes +
          `The ${enemy.name} does ${damageTaken} damage to ${mainCharacter.name}, lowering them to ${mainCharacter.health} health\n`;
        if (mainCharacter.health <= 0) {
          sendRes =
            sendRes +
            `Game Over!\n${mainCharacter.name} is dead...\nType "close" and restart server to try again\n`;
          return [false, sendRes];
        }
      }
    } else {
      isAlive = false;
      if (enemy.name === characters[1].name) {
        characters[1].isAlive = false;
      }
      if (enemy.name === characters[7].name) {
        characters[7].isAlive = false;
      }
      if (enemy.name !== "chest") {
        sendRes = sendRes + `You've defeated the ${enemy.name}!\n\nIt drops:\n`;
      }
      sendRes = loot("Generate New", sendRes);
      return [false, sendRes];
    }
    if (enemy.name === characters[7].name) {
      characters[7].health = enemy.health;
    }
  } else {
    sendRes =
      sendRes + `${enemy.name} is already dead! Maybe try to "loot" the body\n`;
    return [false, sendRes];
  }
  return [true, sendRes];
}
function look(target, sendRes) {
  if (target === "look" || target === mainCharacter.location) {
    if (isAlive) {
      sendRes =
        sendRes +
        `You are in the ${mainCharacter.location}, you see a ${enemy.name}\n`;
    } else {
      sendRes =
        sendRes +
        `You're still in ${mainCharacter.location}, but now there's a dead ${enemy.name}.\nThey dropped some stuff that you may or may not have picked up.\nType "loot" to see what's available.\n`;
    }
  } else if (target === enemy.name) {
    for (const mainProperty in enemy) {
      if (mainProperty !== "loot") {
        sendRes = sendRes + `${mainProperty}: ${enemy[mainProperty]}\n`;
      }
    }
  } else {
    sendRes =
      sendRes +
      `Not sure what you're trying to look at. Type "status" to see weapon stats etc\n`;
  }
  return sendRes;
}
function get(target, sendRes) {
  let lootNames = [];
  for (i in availableLoot) {
    lootNames[i] = availableLoot[i].name;
  }
  if (!isAlive) {
    if (lootNames.includes(target)) {
      mainCharacter.loot.push(availableLoot[lootNames.indexOf(target)]);
      availableLoot.splice(lootNames.indexOf(target), 1);
      sendRes =
        sendRes +
        `${lootNames[lootNames.indexOf(target)]} added to your inventory!\n`;
    } else {
      sendRes = sendRes + "Can't Get that\n";
    }
  } else {
    if (isInShop) {
      if (lootNames.includes(target)) {
        if (
          mainCharacter.gold > availableLoot[lootNames.indexOf(target)].price
        ) {
          mainCharacter.gold =
            mainCharacter.gold - availableLoot[lootNames.indexOf(target)].price;
          mainCharacter.loot.push(availableLoot[lootNames.indexOf(target)]);
          sendRes =
            sendRes +
            `You've bought a ${
              lootNames[lootNames.indexOf(target)]
            } and it's been added to your inventory.\nYou have ${
              mainCharacter.gold
            } gold left.\n`;
        } else {
          sendRes =
            sendRes +
            `You can't afford the ${
              lootNames[lootNames.indexOf(target)]
            }! It costs ${
              availableLoot[lootNames.indexOf(target)].price
            }.\nYou have ${mainCharacter.gold}.\n`;
        }
      } else {
        sendRes = sendRes + `${target} doesn't seem to be available.\n`;
      }
    } else {
      sendRes =
        sendRes +
        `There's nothing to get, and now ${enemy.name} is probably going to attack!\n`;
    }
  }
  return sendRes;
}
function drop(target, sendRes) {
  if (target === "naked") {
    if (isInShop && isAlive) {
      sendRes =
        sendRes +
        "Not the type of game where you can sell you're naked body...\n";
    } else {
      sendRes =
        sendRes +
        "Dropping your nakedness requires clothes. Maybe try Equip instead?\n";
    }
    return sendRes;
  }
  if (target === "fist") {
    if (isInShop && isAlive) {
      sendRes =
        sendRes + "To sell your fists, try the excellent game, Rimworld.\n";
    } else {
      sendRes = sendRes + "You can't drop your fists\n";
    }
    return sendRes;
  }
  let invNames = [];
  for (i in mainCharacter.loot) {
    invNames[i] = mainCharacter.loot[i].name;
  }
  if (invNames.includes(target)) {
    if (isInShop && isAlive) {
      mainCharacter.gold =
        mainCharacter.gold + mainCharacter.loot[invNames.indexOf(target)].price;
      sendRes =
        sendRes +
        `You sell ${invNames[invNames.indexOf(target)]} to the shopkeep for ${
          mainCharacter.loot[invNames.indexOf(target)].price
        }\nYou're current balance is ${mainCharacter.gold}`;
    } else {
      sendRes =
        sendRes +
        `${invNames[invNames.indexOf(target)]} dropped from your inventory!\n`;
    }
    mainCharacter.loot.splice(invNames.indexOf(target), 1);
  } else {
    sendRes = sendRes + "You don't have that to Drop";
    return sendRes;
  }

  invNames = [];
  for (i in mainCharacter.loot) {
    invNames[i] = mainCharacter.loot[i].name;
  }
  if (!invNames.includes(target) && mainCharacter.equipped.includes(target)) {
    let weaponNames = [];
    let armorNames = [];
    for (i in weapons) {
      weaponNames[i] = weapons[i].name;
    }
    for (i in armors) {
      armorNames[i] = armors[i].name;
    }
    if (weaponNames.includes(target)) {
      sendRes = sendRes + "You just got rid of your equipped weapon.\n";
      sendRes = equip("fist", sendRes);
      return sendRes;
    }
    if (armorNames.includes(target)) {
      sendRes = sendRes + "You just got rid of your equipped armor.\n";
      sendRes = equip("naked", sendRes);
      return sendRes;
    }
  }
  return sendRes;
}
function equip(target, sendRes) {
  let invNames = [];
  for (i in mainCharacter.loot) {
    invNames[i] = mainCharacter.loot[i].name;
  }
  if (invNames.includes(target)) {
    let weaponNames = [];
    let armorNames = [];
    for (i in weapons) {
      weaponNames[i] = weapons[i].name;
    }
    for (i in armors) {
      armorNames[i] = armors[i].name;
    }
    if (weaponNames.includes(target)) {
      sendRes = sendRes + `You wield your ${target}\n`;
      mainCharacter.damage = weapons[weaponNames.indexOf(target)].damage;
      mainCharacter.equipped[0] = target;
      return sendRes;
    }
    if (armorNames.includes(target)) {
      sendRes = sendRes + `You put on your ${target} armor. \n`;
      mainCharacter.armor = armors[armorNames.indexOf(target)].armor;
      mainCharacter.agility = armors[armorNames.indexOf(target)].agility;
      mainCharacter.equipped[1] = target;
      return sendRes;
    }
  } else {
    sendRes = sendRes + `${target} is not in your inventory to equip.\n`;
    return sendRes;
  }
}
function loot(target, sendRes) {
  if (target === "Generate New" && !isInShop) {
    for (i in enemy.loot) {
      availableLoot[i] = {};
    }
    for (i in enemy.loot) {
      Object.assign(availableLoot[i], enemy.loot[i]);
    }
    //availableLoot = enemy.loot;
    enemy.loot = availableLoot;
  } else if (isInShop) {
    availableLoot = shop;
  } else if (isAlive) {
    sendRes =
      sendRes +
      `You kinda have to kill the ${enemy.name} before you can loot them...\n`;
    return sendRes;
  } else if (availableLoot.length <= 0) {
    sendRes = sendRes + "There's nothing to loot\n";
    return sendRes;
  }
  for (i in availableLoot) {
    let item = "";
    for (const property in availableLoot[i]) {
      item = item + `${property}: ${availableLoot[i][property]}\t`;
    }
    sendRes = sendRes + `${item}\n`;
  }
  return sendRes;
}

const xps = express();
const port = 4000;
xps.use(express.json());

xps.post("/", (req, res) => {
  cmd = req.body.cmd;
  let sendRes = ``;
  //entire program
  if (cmd === "new game") {
    Object.assign(mainCharacter, characters[0]);
    Object.assign(enemy, characters[7]);
    sendRes = look("look", sendRes);

    // mainCharacter.name = rl.question("What is your name?\n");
    res.send(sendRes);
    return;
  }
  //   console.log(cmd);

  //   decision tree
  cmd = cmd.toLowerCase().trim();
  let target = cmd.split(" ").pop();
  cmd = cmd.split(" ").shift();
  if (cmd === "open" || cmd === "fight" || cmd === "attack" || isInCombat) {
    [isInCombat, sendRes] = fight(cmd, sendRes);
  } else if (cmd === "look") {
    sendRes = look(target, sendRes);
  } else if (cmd === "go") {
    if (target === "go") {
      sendRes = sendRes + `Go where?\n${availableRooms} are your options.\n`;
    } else if (target === mainCharacter.location) {
      sendRes = sendRes + "You're already there\n";
    } else if (isAlive && enemy.hostile) {
      sendRes =
        sendRes +
        `The ${enemy.name} sees you trying to leave and isn't a fan.\n`;
      [isInCombat, sendRes] = fight(cmd, sendRes);
    } else if (
      availableRooms.includes(target) &&
      (!isAlive || !enemy.hostile)
    ) {
      sendRes = sendRes + `You go ${target}\n`;
      mainCharacter.location = target;
      enemy = {};
      if (mainCharacter.location === "shop") {
        isInShop = true;
      } else {
        isInShop = false;
      }
      availableLoot = [];
      if (mainCharacter.location === "shop") {
        Object.assign(enemy, characters[1]);
        isAlive = enemy.isAlive;
        roomLevel = 0;
        sendRes = look(target, sendRes);
        sendRes = loot(target, sendRes);
      } else if (mainCharacter.location === "foyer") {
        Object.assign(enemy, characters[7]);
        isAlive = enemy.isAlive;
        roomLevel = 0;
        sendRes = look(target, sendRes);
      } else if (mainCharacter.location === "deeper") {
        if (roomLevel >= 3) {
          sendRes =
            sendRes +
            "This dungeon doesn't go any deeper.\nIt's a small game\n";
          Object.assign(enemy, characters[2]);
        } else {
          isAlive = true;
          availableEnemies = [];
          roomLevel = roomLevel + 1;
          mainCharacter.location = `Dungeon Lvl:${roomLevel}`;
          for (i in characters) {
            if (characters[i].location === roomLevel) {
              availableEnemies.push(characters[i]);
            }
          }
          Object.assign(
            enemy,
            availableEnemies[
              Math.floor(Math.random() * availableEnemies.length)
            ]
          );
          sendRes = look("look", sendRes);
        }
      } else if (mainCharacter.location === "adjacent") {
        availableEnemies = [];
        isAlive = true;
        if (roomLevel !== 0) {
          mainCharacter.location = `Dungeon Lvl:${roomLevel}`;
          for (i in characters) {
            if (characters[i].location === roomLevel) {
              availableEnemies.push(characters[i]);
            }
          }

          Object.assign(
            enemy,
            availableEnemies[
              Math.floor(Math.random() * availableEnemies.length)
            ]
          );
          sendRes = look("look", sendRes);
        } else {
          mainCharacter.location = "foyer";
          Object.assign(enemy, characters[7]);
          isAlive = enemy.isAlive;
          sendRes =
            sendRes +
            "You wander around and end up in the foyer.  You're pretty sure that you were just here, but maybe you came from the shop.\n";
        }
      }
    } else {
      sendRes =
        sendRes + `Unrecognized room.\n${availableRooms} are your options.\n`;
    }
  } else if (cmd === "equip") {
    sendRes = equip(target, sendRes);
  } else if (cmd === "get" || cmd === "buy" || cmd === "take") {
    sendRes = get(target, sendRes);
  } else if (cmd === "drop" || cmd === "sell") {
    sendRes = drop(target, sendRes);
  } else if (cmd === "loot") {
    if (enemy.name === "chest" && isAlive) {
      sendRes = sendRes + 'You have to "open" it first\n';
    } else {
      sendRes = loot(target, sendRes);
    }
  } else if (cmd === "heal") {
    sendRes = sendRes + `Healing is only available when in combat\n`;
  } else if (cmd === "inv") {
    for (i in mainCharacter.loot) {
      let item = "";
      for (const property in mainCharacter.loot[i]) {
        item = item + `${property}: ${mainCharacter.loot[i][property]}\t`;
      }
      sendRes = sendRes + `${item}\n`;
    }
    sendRes = sendRes + `gold: ${mainCharacter.gold}\n`;
  } else if (cmd === "status") {
    for (const mainProperty in mainCharacter) {
      if (mainProperty === "loot") {
        sendRes = sendRes + `loot:\n`;
        for (i in mainCharacter.loot) {
          let item = "\t";
          for (const property in mainCharacter.loot[i]) {
            item = item + `${property}: ${mainCharacter.loot[i][property]}\t`;
          }
          sendRes = sendRes + `${item}\n`;
        }
      } else {
        sendRes = sendRes + `${mainProperty}: ${mainCharacter[mainProperty]}\n`;
      }
    }
  } else if (cmd === "help") {
    sendRes = sendRes + `Available commands:\n`;
    for (i in cmdList) {
      sendRes = sendRes + `${cmdList[i]}\n`;
    }
  } else {
    sendRes = sendRes + "Unrecognized command. Type HELP\n";
  }
  res.send(`${sendRes}`);
});

// xps.use("/handle", cmdRouter);
xps.listen(port, () => {
  console.log(`Listening on ${port}.`);
});
