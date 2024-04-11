// ################################## PROJET RPG ###############################################


// Step 1: Create character class with the 5 subclasses of character ############################

// 1.a Create Character class
class Character {
  constructor(name, hp, dmg, mana) {
    this.name = name;
    this.hp = hp;
    this.dmg = dmg;
    this.mana = mana;
    this.status = 'playing'; // playing, winner, loser
  }


// 1.b Create methods for takeDamage and dealDamage
  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.status = 'loser';
      console.log(`${this.name} est éliminé(e) et ne peut plus jouer.`);
    }
  }

  dealDamage(victim) {
    console.log(`${this.name} attaque ${victim.name}. Il lui inflige ${this.dmg} dégâts.`);
    victim.takeDamage(this.dmg);
    if (victim.status === 'loser') {
      this.mana += 20;
      console.log(`${this.name} regagne 20 points de mana pour avoir éliminé ${victim.name}.`);
    }
  }
}




// Step 2: Create subclasses of Character ########################################################

// Fighter subclass //
class Fighter extends Character {
  constructor(name) {
    super(name, 12, 4, 40);
    this.specialAttackManaCost = 20; // Cout de l'attaque spéciale
  }

  // Special attack method for the Fighter
  darkVision(victim) {
    if (this.mana >= 20) {
      console.log(`${this.name} utilise Dark Vision sur ${victim.name} et inflige 5 dégâts.`);
      this.mana -= 20;
      victim.takeDamage(5);
      this.damageReduction = 2; // Prépare la réduction de dégâts pour le prochain tour
    } else {
      console.log(`${this.name} n'a pas assez de mana pour utiliser Dark Vision.`);
    }
  }

  // Surcharge de la méthode takeDamage pour inclure la réduction de dégâts
  takeDamage(damage) {
    const effectiveDamage = damage - this.damageReduction;
    super.takeDamage(effectiveDamage); // Appel de la méthode parent avec le dégât effectif
    this.damageReduction = 0; // Réinitialise la réduction de dégâts après l'avoir appliquée
  }
}

// Paladin subclass //
class Paladin extends Character {
  constructor(name) {
    super(name, 16, 3, 160);
    this.specialAttackManaCost = 40; // Cout de l'attaque spéciale
  }

  // Special attack method for the Paladin
  healingLighting(victim) {
    if (this.mana >= 40) {
      console.log(`${this.name} utilise Healing Lighting sur ${victim.name}, infligeant 4 dégâts et se soignant de 5 points de vie.`);
      this.mana -= 40;
      victim.takeDamage(4);
      this.hp += 5;
      console.log(`${this.name} a maintenant ${this.hp} points de vie.`);
    } else {
      console.log(`${this.name} n'a pas assez de mana pour utiliser Healing Lighting.`);
    }
  }
}

// Monk subclass //
class Monk extends Character {
  constructor(name) {
    super(name, 8, 3, 200);
    this.specialAttackManaCost = 25; // Cout de l'attaque spéciale
  }

  // Special attack method for the Monk
  heal() {
    if (this.mana >= 25) {
      console.log(`${this.name} utilise son pouvoir de guérison Heal et récupère 8 points de vie.`);
      this.mana -= 25;
      this.hp += 8;
      console.log(`${this.name} a maintenant ${this.hp} points de vie et ${this.mana} points de mana.`);
    } else {
      console.log(`${this.name} n'a pas assez de mana pour utiliser son pouvoir de guérison Heal.`);
    }
  }
}

// Berzerker subclass //
class Berzerker extends Character {
  constructor(name) {
    super(name, 8, 4, 0);
    this.specialAttackManaCost = 0; // Cout de l'attaque spéciale
  }

  // Special attack method for the Berzerker
  rage() {
    console.log(`${this.name} entre dans une Rage, augmentant son attaque de +1 mais perdant 1 point de vie.`);
    this.dmg += 1; // Augmente l'attaque de +1
    this.takeDamage(1); // Le Berzerker perd 1 point de vie
    console.log(`${this.name} a maintenant ${this.dmg} attaque et ${this.hp} points de vie.`);
  }
}

// Assassin subclass //
class Assassin extends Character {
  constructor(name) {
    super(name, 6, 6, 20);
    this.specialAttackManaCost = 20; // Cout de l'attaque spéciale
    this.shadowHitUsed = false; // Pour vérifier si Shadow Hit a été utilisé
  }

  // Special attack method for the Assassin
  shadowHit(victim) {
    if (this.mana >= 20 && !this.shadowHitUsed) {
      console.log(`${this.name} utilise Shadow Hit sur ${victim.name}, infligeant 7 dégâts.`);
      this.mana -= 20;
      victim.takeDamage(7);
      this.shadowHitUsed = true; // Marque Shadow Hit comme utilisé
      // Applique l'effet de ne pas prendre de dégâts au prochain tour dans la méthode takeDamage
    } else {
      console.log(`${this.name} n'a pas assez de mana pour utiliser Shadow Hit ou l'a déjà utilisé.`);
    }
  }

  // Surcharge de la méthode takeDamage pour inclure l'effet de Shadow Hit
  takeDamage(damage) {
    if (this.shadowHitUsed) {
      console.log(`${this.name} esquive l'attaque grâce à Shadow Hit.`);
      this.shadowHitUsed = false; // Réinitialise l'effet de Shadow Hit
      // L'Assassin perd 7 hp si l'adversaire n'est pas mort après Shadow Hit
      this.hp -= 7;
      if (this.hp <= 0) {
        this.hp = 0;
        this.status = 'loser';
        console.log(`${this.name} est éliminé(e) et ne peut plus jouer.`);
      }
    } else {
      super.takeDamage(damage);
    }
  }
}






// Step 3: Create Game classes ################################################################
class Game {
  constructor() {
    this.turnLeft = 10;
    // Initialisez ici vos personnages
    this.characters = [
      new Fighter("Grace"),
      new Paladin("Ulder"),
      new Monk("Cyril"),
      new Berzerker("Cerberus"),
      new Assassin("Carl"),
    ];
    this.playerCharacter = null; // Ajout pour stocker le personnage du joueur
  }


// Méthode pour choisir un combattant
chooseCharacter() {
  console.log("Choisissez votre combattant :");
  this.characters.forEach((character, index) => {
    console.log(`${index + 1}. ${character.name} (${character.constructor.name})`);
  });

  let choice;
  do {
    choice = prompt("Entrez le numéro de votre combattant :");
    choice = parseInt(choice, 10) - 1;
  } while (isNaN(choice) || choice < 0 || choice >= this.characters.length);

  this.playerCharacter = this.characters[choice];
  console.log(`Vous avez choisi ${this.playerCharacter.name}.`);
}


  // Skip turn method
  skipTurn() {
    this.turnLeft -= 1;
    if (this.turnLeft === 0) {
      this.endGame();
    }
  }

  // Start turn method
  startTurn() {
    console.log(`C'est le tour numéro ${11 - this.turnLeft}`);
  
    this.characters.forEach(character => {
      if (character.status === 'playing') {
        console.log(`C'est le tour de ${character.name}.`);
        // Afficher les stats du personnage pour aider à la décision
        console.log(`${character.name} a ${character.hp} points de vie, ${character.dmg} points de dégât, et ${character.mana} points de mana.`);
        
        let actionChoice;
        let target;
        do {
          actionChoice = prompt(`${character.name}, choisissez votre action : \n 1. Attaque classique \n 2. Attaque spéciale (coûte ${character.specialAttackManaCost} mana)`);
          // Sélectionner un adversaire
          const opponents = this.characters.filter(opponent => opponent !== character && opponent.status === 'playing');
          let targetIndex = prompt(`Qui voulez-vous attaquer ?\n` + opponents.map((opponent, index) => `${index + 1}. ${opponent.name}`).join('\n'));
          target = opponents[targetIndex - 1];
  
          // Vérifier si le choix et la cible sont valides
          if (!target || !(actionChoice === '1' || (actionChoice === '2' && character.mana >= character.specialAttackManaCost))) {
            console.log("Action non valide ou cible non valide, veuillez réessayer.");
          }
        } while (!target || !(actionChoice === '1' || (actionChoice === '2' && character.mana >= character.specialAttackManaCost)));
  
        // Exécuter l'action choisie
        if (actionChoice === '1') {
          character.dealDamage(target);
        } else if (actionChoice === '2') {
          // Adapter selon la classe du personnage et l'attaque spéciale
          if (character instanceof Fighter) {
            character.darkVision(target);
          } else if (character instanceof Paladin) {
            character.healingLighting(target);
          } else if (character instanceof Monk) {
            character.heal();
          } else if (character instanceof Berzerker) {
            character.rage();
          } else if (character instanceof Assassin) {
            character.shadowHit(target);
          }
        }
      }
    });
  
    this.skipTurn();
  }
  

  // End game method
  endGame() {
    // Implémentez ici la logique de fin de jeu
    const winners = this.characters.filter(character => character.status === 'playing');
    if (winners.length === 1) {
      console.log(`Le gagnant est ${winners[0].name} !`);
    }
    else {
      console.log("Aucun gagnant.");
    }
    console.log("La partie est terminée.");
  }


  // Start game method
  startGame() {
    this.chooseCharacter(); // Permet au joueur de choisir son personnage
    while (this.turnLeft > 0) {
      this.startTurn();
    }
  }

}





// Step 4: Start the game ################################################################
const gameInstance = new Game();

document.addEventListener('DOMContentLoaded', function() {
  const startGameBtn = document.getElementById('start-game-btn');
  startGameBtn.addEventListener('click', function() {
      // Utilisez l'instance de Game pour démarrer le jeu
      gameInstance.startGame();
  });
});
