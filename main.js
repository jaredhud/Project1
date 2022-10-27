import rl from "readline-sync";

let cmd = "";
let isAlive = true;
let isInShop = false;
let i = 0;
const cmdList = [
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
  "Talk",
  "Save",
  "Close",
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

function fight(cmd) {
  let potHP = 10;
  characters;
  let damageTaken = 0;
  let damageDone = 0;
  if (
    (cmd === "go" || cmd === "run") &&
    mainCharacter.agility - enemy.agility >= Math.random() * 100
  ) {
    console.log(
      `The ${enemy.name} makes that difficult, but whether you meant to or not, you manage to escape back to the foyer.\n`
    );
    mainCharacter.location = "foyer";
    enemy = {};
    Object.assign(enemy, characters[7]);
    roomLevel = 0;
    return;
  }
  while (isAlive) {
    if (cmd !== "fight" && cmd !== "attack") {
      console.log(`The ${enemy.name} attacks!\n`);
      if (mainCharacter.agility - enemy.agility >= Math.random() * 100) {
        console.log(
          `Ooh so agile!\nYou manage to dodge the ${enemy.name}'s attack!\n`
        );
      } else {
        damageTaken =
          enemy.damage[0] +
          Math.round(Math.random() * (enemy.damage[1] - enemy.damage[0])) -
          mainCharacter.armor;
        if (damageTaken < 0) {
          damageTaken = 0;
        }
        mainCharacter.health = mainCharacter.health - damageTaken;
        console.log(
          `The ${enemy.name} does ${damageTaken} damage to ${mainCharacter.name}, lowering them to ${mainCharacter.health} health\n`
        );
      }
    }
    if (mainCharacter.health <= 0) {
      console.log(`Game Over!\n${mainCharacter.name} is dead...`);
      return;
    }
    cmd = rl.question(
      "You're in combat, what will you do?\tAttack, Run, or Heal?\n"
    );
    cmd = cmd.toLowerCase().trim();
    if (cmd === "go" || cmd === "run") {
      if (
        !enemy.hostile ||
        mainCharacter.agility - enemy.agility >= Math.random() * 100
      ) {
        console.log("You manage to escape back to the foyer");
        mainCharacter.location = "foyer";
        enemy = {};
        Object.assign(enemy, characters[7]);
        roomLevel = 0;
        return;
      } else {
        if (mainCharacter.agility - enemy.agility <= 0) {
          console.log(
            "This guy is way quicker than you.\nMight as well fight it out\n"
          );
        } else {
          console.log(
            `Didn't escape this time\nYou have a ${
              mainCharacter.agility - enemy.agility
            }% chance of getting away\nDo what you will with that info...\n`
          );
        }
      }
    } else if (cmd === "attack" || cmd === "fight") {
      if (enemy.agility - mainCharacter.agility >= Math.random() * 100) {
        console.log(`The ${enemy.name} dodges your attack`);
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
        console.log(
          `You do ${damageDone} damage to the ${enemy.name} with your ${mainCharacter.equipped[0]}, lowering them to ${enemy.health} health\n`
        );
        if (
          enemy.name === characters[1].name &&
          enemy.health < characters[1].health - 15 &&
          !characters[1].hostile
        ) {
          characters[1].hostile = true;
          console.log("You've made an enemy of the shopkeep!\n");
        }
        if (
          enemy.name === characters[7].name &&
          enemy.health < 150 &&
          !characters[7].hostile
        ) {
          characters[7].hostile = true;
          console.log(
            "Congrats! You've made an enemy of the Ronny!\nThat takes some doing, and he's pretty inescapable.\n"
          );
        }
      }
      if (enemy.health > 0) {
        console.log(`The ${enemy.name} attacks back`);
        if (mainCharacter.agility - enemy.agility >= Math.random() * 100) {
          console.log(
            `Ooh so agile!\nYou manage to dodge the ${enemy.name}'s attack!\n`
          );
        } else {
          damageTaken =
            enemy.damage[0] +
            Math.round(Math.random() * (enemy.damage[1] - enemy.damage[0])) -
            mainCharacter.armor;
          if (damageTaken < 0) {
            damageTaken = 0;
          }
          mainCharacter.health = mainCharacter.health - damageTaken;
          console.log(
            `The ${enemy.name} does ${damageTaken} damage to ${mainCharacter.name}, lowering them to ${mainCharacter.health} health\n`
          );
        }
      }
    } else if (cmd === "heal") {
      mainCharacter.health = mainCharacter.health + potHP;
      if (mainCharacter.health > 100) {
        mainCharacter.health = 100;
      }
      console.log(
        `Through shear force of will, you heal to ${mainCharacter.health} HP.\nThe programmer was lazy and you can do that in combat to heal ${potHP} an infinite number of times\n`
      );
    } else if (cmd === "close") {
      return;
    } else {
      console.log("Spelling Tax!!!\t You lose a turn!\n");
    }
    if (enemy.health <= 0) {
      isAlive = false;
      if (enemy.name === characters[1].name) {
        characters[1].isAlive = false;
      }
      if (enemy.name === characters[7].name) {
        characters[7].isAlive = false;
      }
      loot("Generate New");
    }
    if (enemy.name === characters[7].name) {
      characters[7].health = enemy.health;
    }
  }
  console.log(`You've defeated the ${enemy.name}!\n`);
  return;
}
function save() {}
function talk(target) {}
function look(target) {
  if (target === "look" || target === mainCharacter.location) {
    console.log(
      `You are in the ${mainCharacter.location}, you see a ${enemy.name}`
    );
  } else if (target === enemy.name) {
    console.log(enemy);
  }
  return;
}
function get(target) {
  let lootNames = [];
  for (i in availableLoot) {
    lootNames[i] = availableLoot[i].name;
  }
  if (!isAlive) {
    if (lootNames.includes(target)) {
      mainCharacter.loot.push(availableLoot[lootNames.indexOf(target)]);
      availableLoot.splice(lootNames.indexOf(target), 1);
      console.log(
        `${lootNames[lootNames.indexOf(target)]} added to your inventory!\n`
      );
    } else {
      console.log("Can't Get that");
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
          console.log(
            `You've bought a ${
              lootNames[lootNames.indexOf(target)]
            } and it's been added to your inventory.\nYou have ${
              mainCharacter.gold
            } gold left.\n`
          );
        } else {
          console.log(
            `You can't afford the ${
              lootNames[lootNames.indexOf(target)]
            }! It costs ${
              availableLoot[lootNames.indexOf(target)].price
            }.\nYou have ${mainCharacter.gold}.\n`
          );
        }
      } else {
        console.log(`${target} doesn't seem to be available`);
      }
    } else {
      console.log(
        `There's nothing to get, and now ${enemy.name} is probably going to attack\n`
      );
    }
  }
  return;
}
function drop(target) {
  if (target === "naked") {
    if (isInShop && isAlive) {
      console.log(
        "Not the type of game where you can sell you're naked body...\n"
      );
    } else {
      console.log(
        "Dropping your nakedness requires clothes. Maybe try Equip instead?\n"
      );
    }
    return;
  }
  if (target === "fist") {
    if (isInShop && isAlive) {
      console.log("To sell your fists, try the excellent game, Rimworld.\n");
    } else {
      console.log("You can't drop your fists\n");
    }
    return;
  }
  let invNames = [];
  for (i in mainCharacter.loot) {
    invNames[i] = mainCharacter.loot[i].name;
  }
  if (invNames.includes(target)) {
    if (isInShop && isAlive) {
      mainCharacter.gold =
        mainCharacter.gold + mainCharacter.loot[invNames.indexOf(target)].price;
      console.log(
        `You sell ${invNames[invNames.indexOf(target)]} to the shopkeep\n`
      );
    } else {
      console.log(
        `${invNames[invNames.indexOf(target)]} dropped from your inventory!\n`
      );
    }
    mainCharacter.loot.splice(invNames.indexOf(target), 1);
  } else {
    console.log("You don't have that to Drop");
    return;
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
      console.log("You just got rid of your equipped weapon.\n");
      equip("fist");
      return;
    }
    if (armorNames.includes(target)) {
      console.log("You just got rid of your equipped armor.\n");
      equip("naked");
      return;
    }
  }
  return;
}
function equip(target) {
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
      console.log(`You wield your ${target}\n`);
      mainCharacter.damage = weapons[weaponNames.indexOf(target)].damage;
      mainCharacter.equipped[0] = target;
      return;
    }
    if (armorNames.includes(target)) {
      console.log(`You put on your ${target} armor. \n`);
      mainCharacter.armor = armors[armorNames.indexOf(target)].armor;
      mainCharacter.agility = armors[armorNames.indexOf(target)].agility;
      mainCharacter.equipped[1] = target;
      return;
    }
  } else {
    console.log(`${target} is not in your inventory to equip.\n`);
    return;
  }
}
function loot(target) {
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
    console.log(
      `You kinda have to kill the ${enemy.name} before you can loot them...\n`
    );
    return;
  } else if (availableLoot.length <= 0) {
    console.log("There's nothing to loot");
    return;
  }
  for (i in availableLoot) {
    console.log(availableLoot[i]);
  }
  return;
}

while (cmd !== "new game" && cmd !== "continue" && cmd !== "close") {
  cmd = rl.question("\nNew Game, Continue, or Close?\n");
  cmd = cmd.toLowerCase().trim();
  if (cmd !== "new game" && cmd !== "continue" && cmd !== "close") {
    console.log("check spelling");
  }
}

if (cmd === "new game") {
  Object.assign(mainCharacter, characters[0]);
  mainCharacter.name = rl.question("What is your name?\n");
} else if (cmd === "continue") {
  //load Character
  console.log("\nWelcome Back!\n");
}

if (cmd !== "close") {
  console.log(`You find yourself in the ${mainCharacter.location}\n`);
  Object.assign(enemy, characters[7]);
  //console.log(mainCharacter);
}
while (cmd !== "close" && mainCharacter.health >= 0) {
  cmd = rl.question("What would you like to do?\n>");
  cmd = cmd.toLowerCase().trim();
  let target = cmd.split(" ").pop();
  cmd = cmd.split(" ").shift();
  if (cmd === "look") {
    look(target);
  } else if (cmd === "go") {
    if (target === "go") {
      target = rl.question("Go where?\n");
    }
    if (target === mainCharacter.location) {
      console.log("You're already there\n");
    } else if (isAlive && enemy.hostile) {
      console.log(
        `The ${enemy.name} sees you trying to leave and isn't a fan.`
      );
      fight(cmd);
    } else if (
      availableRooms.includes(target) &&
      (!isAlive || !enemy.hostile)
    ) {
      console.log(`You go ${target}`);
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
        look(target);
        loot();
      } else if (mainCharacter.location === "foyer") {
        Object.assign(enemy, characters[7]);
        isAlive = enemy.isAlive;
        roomLevel = 0;
        look(target);
      } else if (mainCharacter.location === "deeper") {
        if (roomLevel >= 3) {
          console.log("This dungeon doesn't go any deeper.\nIt's a small game");
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
          look("look");
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
          look("look");
        } else {
          mainCharacter.location = "foyer";
          Object.assign(enemy, characters[7]);
          isAlive = enemy.isAlive;
          console.log(
            "You wander around and end up in the foyer.  You're pretty sure that you were just here, but maybe you came from the shop.\n"
          );
        }
      }
    } else {
      console.log("Unrecognized room\nThese are the options:");
      for (i in availableRooms) {
        console.log(availableRooms[i]);
      }
    }
  } else if (cmd === "fight" || cmd === "attack") {
    fight(cmd);
  } else if (cmd === "equip") {
    equip(target);
  } else if (cmd === "get" || cmd === "buy" || cmd === "take") {
    get(target);
  } else if (cmd === "drop" || cmd === "sell") {
    drop(target);
  } else if (cmd === "loot") {
    loot(target);
  } else if (cmd === "talk") {
    talk(target);
  } else if (cmd === "inv") {
    for (i in mainCharacter.loot) {
      console.log(mainCharacter.loot[i]);
    }
    console.log(`gold: ${mainCharacter.gold}`);
  } else if (cmd === "status") {
    console.log(mainCharacter);
  } else if (cmd === "save") {
    save();
  } else if (cmd === "close") {
    console.log("Goodbye");
  } else if (cmd === "help") {
    ("Available commands:");
    for (i in cmdList) {
      console.log(cmdList[i]);
    }
  } else {
    console.log("Unrecognized command. Type HELP");
  }
}
