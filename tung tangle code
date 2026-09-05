from game.app import TungTangleApp

if __name__ == "__main__":
    TungTangleApp().run()
pygame>=2.6.0
# Tung Tangle game package.
from dataclasses import dataclass, field
import random


@dataclass
class Tung:
    name: str = "Chomper"
    species: str = "Common Tung"
    day: int = 1
    energy: int = 100
    max_energy: int = 100
    might: int = 20
    agility: int = 20
    power: int = 40
    wins: int = 0
    losses: int = 0
    evolution_level: int = 0
    inventory: list = field(
        default_factory=lambda: ["Berry", "Berry"]
    )
    allies: list = field(default_factory=list)
    rivals: list = field(default_factory=list)
    location: str = "Mossy Grove"
    xp: int = 0
    hp: int = 100
    max_hp: int = 100

    def clamp(self):
        self.energy = max(
            0,
            min(self.energy, self.max_energy)
        )
        self.hp = max(
            0,
            min(self.hp, self.max_hp)
        )
        self.might = max(1, self.might)
        self.agility = max(1, self.agility)
        self.power = self.might + self.agility
        self.xp = max(0, self.xp)

    def add_item(self, item):
        self.inventory.append(item)

    def use_item(self, item):
        if item in self.inventory:
            self.inventory.remove(item)
            return True
        return False

    def gain_xp(self, amount):
        self.xp += max(0, amount)

    def check_evolution(self):
        thresholds = [0, 80, 150, 250]
        names = [
            "Common Tung",
            "Swift Tung",
            "Mighty Tung",
            "Alpha Tung",
        ]

        changed = False

        while (
            self.evolution_level < len(thresholds) - 1
            and self.power >= thresholds[
                self.evolution_level + 1
            ]
        ):
            self.evolution_level += 1
            self.species = names[
                self.evolution_level
            ]

            self.max_energy += 15
            self.energy = self.max_energy

            self.max_hp += 15
            self.hp = self.max_hp

            self.might += 5
            self.agility += 5

            changed = True

        self.clamp()
        return changed


@dataclass
class Rival:
    name: str
    species: str
    might: int
    agility: int
    personality: str
    relationship: int = 0

    @property
    def power(self):
        return self.might + self.agility


@dataclass
class GameState:
    player: Tung
    rivals: list
    world_seed: int = field(
        default_factory=lambda:
        random.randint(1, 999999)
    )
    won: bool = False
    log: list = field(default_factory=list)
    leaderboard: dict = field(
        default_factory=dict
    )

    def add_log(self, message):
        self.log.insert(0, message)
        self.log = self.log[:8]
import random

from game.models import Rival


def create_rivals(seed=12345):
    rng = random.Random(seed)

    names = [
        "Grumble",
        "Bongo",
        "Wobble",
        "Mango",
        "Brutus",
        "Zippy",
        "Noodle",
        "Crusher",
    ]

    personalities = [
        "Aggressive",
        "Clever",
        "Calm",
        "Chaotic",
    ]

    rivals = []

    for name in names:
        might = rng.randint(18, 42)
        agility = rng.randint(18, 42)

        rivals.append(
            Rival(
                name=name,
                species="Common Tung",
                might=might,
                agility=agility,
                personality=rng.choice(
                    personalities
                ),
            )
        )

    return rivals


def encounter_reaction(rival, player):
    difference = (
        player.power -
        rival.power
    )

    if difference >= 30:
        return (
            f"{rival.name} looks nervous "
            "around your Tung."
        )

    if difference <= -30:
        return (
            f"{rival.name} seems very "
            "confident."
        )

    return (
        f"{rival.name} sizes you up carefully."
    )


def choose_action(enemy, player, rng=None):
    rng = rng or random.Random()

    health_ratio = (
        enemy["hp"] /
        max(1, enemy["max_hp"])
    )

    if health_ratio <= 0.30:
        if rng.random() < 0.45:
            return "recover"

    enemy_power = (
        enemy["might"] +
        enemy["agility"]
    )

    player_power = (
        player.might +
        player.agility
    )

    if enemy_power >= player_power + 20:
        return "attack"

    roll = rng.random()

    if roll < 0.70:
        return "attack"

    if roll < 0.90:
        return "defend"

    return "recover"
import random

from game.models import Rival


def fight(player, rival, rng=None):
    rng = rng or random.Random()

    player.energy -= 10

    player_power = (
        player.might +
        player.agility
    )

    rival_power = rival.might + rival.agility

    player_roll = (
        player_power +
        rng.randint(0, 25)
    )

    rival_roll = (
        rival_power +
        rng.randint(0, 25)
    )

    if player_roll >= rival_roll:
        damage = max(
            5,
            player_power // 4 +
            rng.randint(3, 12)
        )

        player.hp = min(
            player.max_hp,
            player.hp + 8
        )

        player.wins += 1
        player.gain_xp(
            20 + rival_power // 5
        )

        return (
            True,
            f"You defeated {rival.name}! "
            f"Your Tung dealt {damage} effective damage."
        )

    damage = max(
        5,
        rival_power // 5 +
        rng.randint(3, 10)
    )

    player.hp = max(
        1,
        player.hp - damage
    )

    player.losses += 1

    return (
        False,
        f"{rival.name} defeated you this time. "
        f"You took {damage} damage."
    )


def attack(player, enemy, rng=None):
    rng = rng or random.Random()

    damage = max(
        1,
        player.might +
        rng.randint(2, 8)
    )

    if rng.random() < 0.10:
        damage = int(damage * 1.5)

    enemy["hp"] = max(
        0,
        enemy["hp"] - damage
    )

    return damage


def enemy_attack(enemy, player, rng=None):
    rng = rng or random.Random()

    damage = max(
        1,
        enemy["might"] +
        rng.randint(1, 6)
    )

    player.take_damage(damage)

    return damage
ITEMS = {
    "Berry": {
        "type": "heal",
        "value": 20,
        "description": "Restores 20 HP."
    },
    "Glow Fruit": {
        "type": "energy",
        "value": 25,
        "description": "Restores 25 energy."
    },
    "Might Seed": {
        "type": "might",
        "value": 3,
        "description": "Increases Might by 3."
    },
    "Swift Leaf": {
        "type": "agility",
        "value": 3,
        "description": "Increases Agility by 3."
    },
}


def consume(player, item):
    if item not in player.inventory:
        return False, "You don't have that item."

    data = ITEMS.get(item)

    if not data:
        return False, "That item doesn't exist."

    item_type = data["type"]
    value = data["value"]

    if item_type == "heal":
        old = player.hp
        player.hp = min(
            player.max_hp,
            player.hp + value
        )

        amount = player.hp - old

        if amount <= 0:
            return False, "Your HP is already full."

        player.inventory.remove(item)

        return (
            True,
            f"You used {item} and restored "
            f"{amount} HP."
        )

    if item_type == "energy":
        old = player.energy
        player.energy = min(
            player.max_energy,
            player.energy + value
        )

        amount = player.energy - old

        if amount <= 0:
            return False, "Your energy is already full."

        player.inventory.remove(item)

        return (
            True,
            f"You used {item} and restored "
            f"{amount} energy."
        )

    if item_type == "might":
        player.might += value
        player.inventory.remove(item)
        player.clamp()

        return (
            True,
            f"You used {item}. "
            f"Might +{value}."
        )

    if item_type == "agility":
        player.agility += value
        player.inventory.remove(item)
        player.clamp()

        return (
            True,
            f"You used {item}. "
            f"Agility +{value}."
        )

    return False, "Nothing happened."
import random


LOCATIONS = {
    "Mossy Grove": {
        "energy": 0,
        "description":
            "A safe forest clearing full of berries."
    },
    "Crystal Caves": {
        "energy": -12,
        "description":
            "Glowing caves containing rare items."
    },
    "Storm Ridge": {
        "energy": -18,
        "description":
            "A dangerous ridge where strong Tungs roam."
    },
    "Sunlit Marsh": {
        "energy": -8,
        "description":
            "Warm wetlands where Swift Tungs gather."
    },
}


def explore(state, rng=None):
    rng = rng or random.Random()

    player = state.player

    cost = 12 + max(
        0,
        -LOCATIONS[
            player.location
        ]["energy"]
    )

    if player.energy < cost:
        return (
            "You're too tired to explore."
        )

    player.energy -= cost

    roll = rng.random()

    if roll < 0.30:
        item = rng.choice([
            "Berry",
            "Berry",
            "Glow Fruit",
            "Might Seed",
            "Swift Leaf",
        ])

        player.add_item(item)
        player.gain_xp(10)

        message = (
            f"You explored {player.location} "
            f"and found {item}! XP +10."
        )

    elif roll < 0.52:
        rival = rng.choice(state.rivals)

        message = (
            f"You encountered {rival.name}, "
            f"a {rival.personality} Tung."
        )

    else:
        xp = rng.randint(6, 16)

        player.gain_xp(xp)

        message = (
            f"You explored {player.location}. "
            f"XP +{xp}."
        )

    player.clamp()
    state.add_log(message)

    return message


def train(state, stat, rng=None):
    rng = rng or random.Random()

    player = state.player
    cost = 15

    if player.energy < cost:
        return "You're too tired to train."

    player.energy -= cost

    gain = rng.randint(2, 5)

    if stat == "might":
        player.might += gain
        label = "Might"
    else:
        player.agility += gain
        label = "Agility"

    player.gain_xp(12)
    player.clamp()

    message = (
        f"Training complete: {label} +{gain}, "
        "XP +12."
    )

    state.add_log(message)

    return message


def rest(state):
    player = state.player

    gain = min(
        player.max_energy -
        player.energy,
        35
    )

    player.energy += gain

    heal = min(
        player.max_hp -
        player.hp,
        20
    )

    player.hp += heal

    message = (
        f"You rested. Energy +{gain}, "
        f"HP +{heal}."
    )

    state.add_log(message)

    return message


def next_day(state):
    player = state.player

    player.day += 1

    drain = 4 + player.day // 8

    player.energy -= drain
    player.clamp()

    state.add_log(
        f"Day {player.day} begins. "
        f"Energy -{drain}."
    )
import json
from pathlib import Path

from game.models import (
    GameState,
    Tung,
    Rival,
)


SAVE_DIR = Path("saves")
SAVE_FILE = SAVE_DIR / "save.json"


def save_game(state, path=SAVE_FILE):
    SAVE_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    data = {
        "player": {
            "name": state.player.name,
            "species": state.player.species,
            "day": state.player.day,
            "energy": state.player.energy,
            "max_energy":
                state.player.max_energy,
            "might": state.player.might,
            "agility": state.player.agility,
            "power": state.player.power,
            "wins": state.player.wins,
            "losses": state.player.losses,
            "evolution_level":
                state.player.evolution_level,
            "inventory":
                state.player.inventory,
            "allies":
                state.player.allies,
            "rivals":
                state.player.rivals,
            "location":
                state.player.location,
            "xp": state.player.xp,
            "hp": state.player.hp,
            "max_hp": state.player.max_hp,
        },
        "rivals": [
            {
                "name": rival.name,
                "species": rival.species,
                "might": rival.might,
                "agility": rival.agility,
                "personality":
                    rival.personality,
                "relationship":
                    rival.relationship,
            }
            for rival in state.rivals
        ],
        "world_seed":
            state.world_seed,
        "won":
            state.won,
        "log":
            state.log,
        "leaderboard":
            state.leaderboard,
    }

    with open(
        path,
        "w",
        encoding="utf-8"
    ) as file:
        json.dump(
            data,
            file,
            indent=4
        )


def load_game(path=SAVE_FILE):
    if not Path(path).exists():
        return None

    try:
        with open(
            path,
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

    except (
        OSError,
        json.JSONDecodeError
    ):
        return None

    pdata = data.get(
        "player",
        {}
    )

    player = Tung(
        name=pdata.get(
            "name",
            "Chomper"
        ),
        species=pdata.get(
            "species",
            "Common Tung"
        ),
        day=pdata.get(
            "day",
            1
        ),
        energy=pdata.get(
            "energy",
            100
        ),
        max_energy=pdata.get(
            "max_energy",
            100
        ),
        might=pdata.get(
            "might",
            20
        ),
        agility=pdata.get(
            "agility",
            20
        ),
        power=pdata.get(
            "power",
            40
        ),
        wins=pdata.get(
            "wins",
            0
        ),
        losses=pdata.get(
            "losses",
            0
        ),
        evolution_level=pdata.get(
            "evolution_level",
            0
        ),
        inventory=pdata.get(
            "inventory",
            []
        ),
        allies=pdata.get(
            "allies",
            []
        ),
        rivals=pdata.get(
            "rivals",
            []
        ),
        location=pdata.get(
            "location",
            "Mossy Grove"
        ),
        xp=pdata.get(
            "xp",
            0
        ),
        hp=pdata.get(
            "hp",
            100
        ),
        max_hp=pdata.get(
            "max_hp",
            100
        ),
    )

    rivals = []

    for data_rival in data.get(
        "rivals",
        []
    ):
        rivals.append(
            Rival(
                name=data_rival.get(
                    "name",
                    "Unknown"
                ),
                species=data_rival.get(
                    "species",
                    "Common Tung"
                ),
                might=data_rival.get(
                    "might",
                    20
                ),
                agility=data_rival.get(
                    "agility",
                    20
                ),
                personality=data_rival.get(
                    "personality",
                    "Neutral"
                ),
                relationship=data_rival.get(
                    "relationship",
                    0
                ),
            )
        )

    return GameState(
        player=player,
        rivals=rivals,
        world_seed=data.get(
            "world_seed",
            1
        ),
        won=data.get(
            "won",
            False
        ),
        log=data.get(
            "log",
            []
        ),
        leaderboard=data.get(
            "leaderboard",
            {}
        ),
    )
import random
import pygame

from .models import Tung, GameState
from .ai import create_rivals
from .world import (
    LOCATIONS,
    explore,
    train,
    rest,
    next_day,
)
from .combat import fight as do_fight
from .items import consume
from .save import save_game, load_game

from ui.screens import (
    MainScreen,
    InventoryScreen,
    TungsScreen,
    FightScreen,
    StatusScreen,
    TravelScreen,
    LeaderboardScreen,
    MessageScreen,
)

from ui.theme import BG


class TungTangleApp:
    WIDTH, HEIGHT = 960, 640

    def __init__(self):
        pygame.init()

        pygame.display.set_caption(
            "Tung Tangle"
        )

        self.screen = pygame.display.set_mode(
            (self.WIDTH, self.HEIGHT)
        )

        self.clock = pygame.time.Clock()

        self.fonts = {
            "title":
                pygame.font.SysFont(
                    "arial",
                    34,
                    bold=True
                ),
            "h1":
                pygame.font.SysFont(
                    "arial",
                    30,
                    bold=True
                ),
            "h2":
                pygame.font.SysFont(
                    "arial",
                    22,
                    bold=True
                ),
            "h3":
                pygame.font.SysFont(
                    "arial",
                    18,
                    bold=True
                ),
            "body":
                pygame.font.SysFont(
                    "arial",
                    17
                ),
            "small":
                pygame.font.SysFont(
                    "arial",
                    14
                ),
            "emoji":
                pygame.font.SysFont(
                    "segoeuisymbol",
                    58
                ),
        }

        self.rng = random.Random()
        self.locations = LOCATIONS

        self.state = self.new_game()
        self.screen_obj = MainScreen(self)

    def new_game(self):
        player = Tung(
            name="Chomper"
        )

        state = GameState(
            player=player,
            rivals=create_rivals(12345)
        )

        state.add_log(
            "Welcome to Tung Tangle. "
            "Your journey begins."
        )

        return state

    def set_screen(self, name):
        mapping = {
            "main": MainScreen,
            "inventory": InventoryScreen,
            "tungs": TungsScreen,
            "fight": FightScreen,
            "status": StatusScreen,
            "travel": TravelScreen,
            "leaderboard":
                LeaderboardScreen,
        }

        self.screen_obj = mapping[name](self)

    def do_explore(self):
        if self.state.player.energy < 10:
            self.set_message(
                "Too Tired",
                "You need at least 10 energy to explore."
            )
            return

        message = explore(
            self.state,
            self.rng
        )

        self.after_action(message)

    def do_train(self, stat):
        message = train(
            self.state,
            stat,
            self.rng
        )

        self.after_action(message)

    def do_rest(self):
        message = rest(
            self.state
        )

        self.after_action(message)

    def use_item(self, item):
        ok, message = consume(
            self.state.player,
            item
        )

        if ok:
            self.state.add_log(message)
            self.after_action(message)
        else:
            self.set_message(
                "Inventory",
                message
            )

    def fight(self, rival):
        if self.state.player.energy < 10:
            self.set_message(
                "Too Tired",
                "Rest before fighting."
            )
            return

        won, message = do_fight(
            self.state.player,
            rival,
            self.rng
        )

        self.state.add_log(message)

        if (
            won
            and self.state.player.wins >= 5
            and self.state.player.evolution_level >= 3
        ):
            self.state.won = True

            score = (
                self.state.player.power
                + self.state.player.wins * 25
                + self.state.player.day * 5
            )

            self.state.leaderboard[
                self.state.player.name
            ] = max(
                score,
                self.state.leaderboard.get(
                    self.state.player.name,
                    0
                )
            )

            self.set_message(
                "ALPHA TUNG!",
                "You defeated enough rivals "
                "and became the Alpha!\n"
                f"Score: {score}"
            )
        else:
            self.after_action(message)

    def travel(self, location):
        self.state.player.location = location

        self.state.player.energy = max(
            0,
            self.state.player.energy - 5
        )

        message = (
            f"You travelled to {location}. "
            "Energy -5."
        )

        self.state.add_log(message)

        self.after_action(message)

    def next_day(self):
        next_day(self.state)

        self.after_action(
            f"Day {self.state.player.day} "
            "has begun."
        )

    def after_action(self, message):
        evolved = (
            self.state.player.check_evolution()
        )

        if evolved:
            self.state.add_log(
                "Evolution! Your Tung is now "
                f"a {self.state.player.species}."
            )

            self.set_message(
                "EVOLUTION!",
                f"{self.state.player.name} "
                f"evolved into "
                f"{self.state.player.species}!"
            )

        elif self.state.player.energy <= 0:
            self.state.player.energy = 10

            self.set_message(
                "Exhausted",
                "Your Tung is exhausted. "
                "Emergency recovery restored "
                "10 energy."
            )

        else:
            self.set_screen("main")

    def set_message(self, title, message):
        self.screen_obj = MessageScreen(
            self,
            title,
            message
        )

    def save(self):
        save_game(self.state)

        self.set_message(
            "Saved",
            "Your game has been saved to "
            "saves/save.json."
        )

    def load(self):
        loaded = load_game()

        if loaded:
            self.state = loaded
            self.set_screen("main")
        else:
            self.set_message(
                "Load",
                "No save file exists yet."
            )

    def run(self):
        running = True

        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.set_screen("main")

                    elif event.key == pygame.K_F5:
                        self.save()

                    elif event.key == pygame.K_F9:
                        self.load()

                    elif event.key == pygame.K_q:
                        running = False

                self.screen_obj.handle(event)

            self.screen.fill(BG)

            self.screen_obj.draw(
                self.screen
            )

            pygame.display.flip()

            self.clock.tick(60)

        pygame.quit()
# Tung Tangle UI package.
import pygame


BG = (14, 18, 24)
PANEL = (25, 31, 42)
PANEL_LIGHT = (38, 46, 61)

WHITE = (245, 245, 245)
GREY = (160, 168, 180)

GREEN = (70, 210, 120)
RED = (225, 80, 80)
BLUE = (75, 145, 235)
YELLOW = (240, 200, 70)
PURPLE = (170, 100, 230)
ORANGE = (240, 145, 60)


def font(size, bold=False):
    return pygame.font.SysFont(
        "arial",
        size,
        bold=bold
    )


def text(
    surface,
    value,
    position,
    size=17,
    colour=WHITE,
    bold=False,
):
    rendered = font(
        size,
        bold
    ).render(
        str(value),
        True,
        colour
    )

    surface.blit(
        rendered,
        position
    )


def centered(
    surface,
    value,
    y,
    size=17,
    colour=WHITE,
    bold=False,
):
    rendered = font(
        size,
        bold
    ).render(
        str(value),
        True,
        colour
    )

    x = (
        surface.get_width()
        - rendered.get_width()
    ) // 2

    surface.blit(
        rendered,
        (x, y)
    )


def panel(surface, rect):
    pygame.draw.rect(
        surface,
        PANEL,
        rect,
        border_radius=12
    )


def bar(
    surface,
    rect,
    value,
    maximum,
    colour,
):
    pygame.draw.rect(
        surface,
        (55, 62, 75),
        rect,
        border_radius=6
    )

    if maximum <= 0:
        return

    ratio = max(
        0,
        min(
            1,
            value / maximum
        )
    )

    width = int(
        rect.width * ratio
    )

    if width > 0:
        pygame.draw.rect(
            surface,
            colour,
            pygame.Rect(
                rect.x,
                rect.y,
                width,
                rect.height
            ),
            border_radius=6
        )
import pygame

from ui.theme import (
    WHITE,
    PANEL_LIGHT,
    font,
)


class Button:
    def __init__(
        self,
        rect,
        label,
        callback,
    ):
        self.rect = pygame.Rect(rect)
        self.label = label
        self.callback = callback
        self.hover = False

    def handle(self, event):
        if event.type == pygame.MOUSEMOTION:
            self.hover = self.rect.collidepoint(
                event.pos
            )

        elif (
            event.type == pygame.MOUSEBUTTONDOWN
            and event.button == 1
            and self.rect.collidepoint(event.pos)
        ):
            self.callback()
            return True

        return False

    def draw(self, surface):
        colour = (
            (65, 110, 190)
            if self.hover
            else PANEL_LIGHT
        )

        pygame.draw.rect(
            surface,
            colour,
            self.rect,
            border_radius=9
        )

        rendered = font(
            16,
            True
        ).render(
            self.label,
            True,
            WHITE
        )

        surface.blit(
            rendered,
            rendered.get_rect(
                center=self.rect.center
            )
        )
import pygame

from ui.theme import (
    BG,
    PANEL,
    PANEL_LIGHT,
    WHITE,
    GREY,
    GREEN,
    RED,
    BLUE,
    YELLOW,
    PURPLE,
    ORANGE,
    font,
    text,
    centered,
    panel,
    bar,
)
from ui.components import Button


class BaseScreen:
    def __init__(self, app):
        self.app = app
        self.buttons = []

    def handle(self, event):
        for button in self.buttons:
            if button.handle(event):
                return

        if event.type == pygame.KEYDOWN:
            self.key(event.key)

    def key(self, key):
        pass

    def draw_buttons(self, surface):
        for button in self.buttons:
            button.draw(surface)


class MainScreen(BaseScreen):
    def __init__(self, app):
        super().__init__(app)

        self.buttons = [
            Button(
                (35, 560, 120, 45),
                "Explore",
                app.do_explore,
            ),
            Button(
                (165, 560, 120, 45),
                "Train",
                lambda:
                    app.do_train("might"),
            ),
            Button(
                (295, 560, 120, 45),
                "Rest",
                app.do_rest,
            ),
            Button(
                (425, 560, 120, 45),
                "Inventory",
                lambda:
                    app.set_screen("inventory"),
            ),
            Button(
                (555, 560, 120, 45),
                "Tungs",
                lambda:
                    app.set_screen("tungs"),
            ),
            Button(
                (685, 560, 120, 45),
                "Travel",
                lambda:
                    app.set_screen("travel"),
            ),
            Button(
                (815, 560, 120, 45),
                "Status",
                lambda:
                    app.set_screen("status"),
            ),
        ]

    def key(self, key):
        if key == pygame.K_e:
            self.app.do_explore()
        elif key == pygame.K_t:
            self.app.do_train("might")
        elif key == pygame.K_r:
            self.app.do_rest()
        elif key == pygame.K_i:
            self.app.set_screen("inventory")
        elif key == pygame.K_f:
            self.app.set_screen("fight")
        elif key == pygame.K_s:
            self.app.save()

    def draw(self, surface):
        surface.fill(BG)

        centered(
            surface,
            "TUNG TANGLE",
            25,
            36,
            WHITE,
            True,
        )

        centered(
            surface,
            "Train • Explore • Evolve",
            70,
            16,
            GREY,
        )

        player = self.app.state.player

        panel(
            surface,
            pygame.Rect(
                30,
                120,
                900,
                400
            )
        )

        text(
            surface,
            player.name,
            (60, 145),
            28,
            WHITE,
            True,
        )

        text(
            surface,
            player.species,
            (60, 180),
            18,
            PURPLE,
            True,
        )

        text(
            surface,
            f"Day {player.day}",
            (760, 150),
            17,
            GREY,
        )

        text(
            surface,
            "HP",
            (60, 225),
            15,
            GREY,
        )

        bar(
            surface,
            pygame.Rect(
                110,
                225,
                300,
                18
            ),
            player.hp,
            player.max_hp,
            RED,
        )

        text(
            surface,
            f"{player.hp}/{player.max_hp}",
            (420, 223),
            15,
            WHITE,
        )

        text(
            surface,
            "Energy",
            (60, 270),
            15,
            GREY,
        )

        bar(
            surface,
            pygame.Rect(
                110,
                270,
                300,
                18
            ),
            player.energy,
            player.max_energy,
            BLUE,
        )

        text(
            surface,
            f"{player.energy}/{player.max_energy}",
            (420, 268),
            15,
            WHITE,
        )

        text(
            surface,
            f"Might: {player.might}",
            (60, 325),
            20,
            WHITE,
        )

        text(
            surface,
            f"Agility: {player.agility}",
            (260, 325),
            20,
            WHITE,
        )

        text(
            surface,
            f"Power: {player.power}",
            (460, 325),
            20,
            YELLOW,
            True,
        )

        text(
            surface,
            f"Wins: {player.wins}",
            (60, 375),
            18,
            GREEN,
        )

        text(
            surface,
            f"Losses: {player.losses}",
            (200, 375),
            18,
            RED,
        )

        text(
            surface,
            f"XP: {player.xp}",
            (340, 375),
            18,
            BLUE,
        )

        text(
            surface,
            f"Location: {player.location}",
            (60, 425),
            18,
            ORANGE,
        )

        text(
            surface,
            "Recent activity",
            (560, 225),
            19,
            WHITE,
            True,
        )

        y = 260

        for message in self.app.state.log[:6]:
            text(
                surface,
                message[:42],
                (560, y),
                13,
                GREY,
            )
            y += 34

        self.draw_buttons(surface)


class InventoryScreen(BaseScreen):
    def __init__(self, app):
        super().__init__(app)

        self.buttons = [
            Button(
                (30, 560, 140, 45),
                "Back",
                lambda:
                    app.set_screen("main"),
            )
        ]

        self.items = list(
            dict.fromkeys(
                app.state.player.inventory
            )
        )

        for index, item in enumerate(
            self.items
        ):
            y = 150 + index * 55

            self.buttons.append(
                Button(
                    (500, y, 250, 42),
                    f"Use {item}",
                    lambda item=item:
                        app.use_item(item),
                )
            )

    def draw(self, surface):
        surface.fill(BG)

        centered(
            surface,
            "INVENTORY",
            30,
            34,
            WHITE,
            True,
        )

        player = self.app.state.player

        panel(
            surface,
            pygame.Rect(
                80,
                120,
                800,
                390
            )
        )

        if not player.inventory:
            centered(
                surface,
                "Your inventory is empty.",
                250,
                20,
                GREY,
            )
        else:
            counts = {}

            for item in player.inventory:
                counts[item] = (
                    counts.get(item, 0) + 1
                )

            y = 155

            for item, amount in counts.items():
                text(
                    surface,
                    f"{item} x{amount}",
                    (130, y),
                    21,
                    WHITE,
                    True,
                )

                y += 55

        self.draw_buttons(surface)


class TungsScreen(BaseScreen):
    def __init__(self, app):
        super().__init__(app)

        self.buttons = [
            Button(
                (30, 560, 140, 45),
                "Back",
                lambda:
                    app.set_screen("main"),
            ),
            Button(
                (180, 560, 160, 45),
                "Fight",
                lambda:
                    app.set_screen("fight"),
            )
        ]

    def draw(self, surface):
        surface.fill(BG)

        centered(
            surface,
            "TUNG RIVALS",
            30,
            34,
            WHITE,
            True,
        )

        y = 110

        for rival in self.app.state.rivals:
            panel(
                surface,
                pygame.Rect(
                    80,
                    y,
                    800,
                    50
                )
            )

            text(
                surface,
                rival.name,
                (100, y + 12),
                18,
                WHITE,
                True,
            )

            text(
                surface,
                rival.species,
                (300, y + 12),
                16,
                PURPLE,
            )

            text(
                surface,
                f"Power {rival.power}",
                (500, y + 12),
                16,
                YELLOW,
            )

            text(
                surface,
                rival.personality,
                (700, y + 12),
                15,
                GREY,
            )

            y += 60

        self.draw_buttons(surface)


class FightScreen(BaseScreen):
    def __init__(self, app):
        super().__init__(app)

        self.buttons = []

        y = 130

        for rival in app.state.rivals:
            self.buttons.append(
                Button(
                    (550, y, 300, 45),
                    f"Fight {rival.name}",
                    lambda rival=rival:
                        app.fight(rival),
                )
            )

            y += 55

        self.buttons.append(
            Button(
                (30, 560, 140, 45),
                "Back",
                lambda:
                    app.set_screen("main"),
            )
        )

    def draw(self, surface):
        surface.fill(BG)

        centered(
            surface,
            "CHOOSE A RIVAL",
            30,
            34,
            WHITE,
            True,
        )

        player = self.app.state.player

        panel(
            surface,
            pygame.Rect(
                80,
                120,
                400,
                380
            )
        )

        text(
            surface,
            player.name,
            (110, 150),
            25,
            WHITE,
            True,
        )

        text(
            surface,
            player.species,
            (110, 190),
            18,
            PURPLE,
        )

        text(
            surface,
            f"Power: {player.power}",
            (110, 235),
            20,
            YELLOW,
        )

        text(
            surface,
            f"Energy: {player.energy}",
            (110, 275),
            18,
            BLUE,
        )

        text(
            surface,
            f"Wins: {player.wins}",
            (110, 320),
            18,
            GREEN,
        )

        self.draw_buttons(surface)


class StatusScreen(BaseScreen):
    def __init__(self, app):
        super().__init__(app)

        self.buttons = [
            Button(
                (30, 560, 140, 45),
                "Back",
                lambda:
                    app.set_screen("main"),
            ),
            Button(
                (180, 560, 140, 45),
                "Save",
                app.save,
            ),
        ]

    def draw(self, surface):
        surface.fill(BG)

        centered(
            surface,
            "TUNG STATUS",
            30,
            34,
            WHITE,
            True,
        )

        p = self.app.state.player

        panel(
            surface,
            pygame.Rect(
                100,
                120,
                760,
                390
            )
        )

        stats = [
            ("Name", p.name, WHITE),
            ("Species", p.species, PURPLE),
            ("Day", p.day, WHITE),
            ("HP", f"{p.hp}/{p.max_hp}", RED),
            ("Energy",
             f"{p.energy}/{p.max_energy}",
             BLUE),
            ("Might", p.might, WHITE),
            ("Agility", p.agility, WHITE),
            ("Power", p.power, YELLOW),
            ("XP", p.xp, BLUE),
            ("Wins", p.wins, GREEN),
            ("Losses", p.losses, RED),
            ("Location", p.location, ORANGE),
        ]

        y = 150

        for label, value, colour in stats:
            text(
                surface,
                f"{label}:",
                (150, y),
                18,
                GREY,
            )

            text(
                surface,
                value,
                (330, y),
                18,
                colour,
                True,
            )

            y += 28

        self.draw_buttons(surface)


class TravelScreen(BaseScreen):
    def __init__(self, app):
        super().__init__(app)

        self.buttons = []

        locations = list(
            app.locations.keys()
        )

        for index, location in enumerate(
            locations
        ):
            self.buttons.append(
                Button(
                    (
                        500,
                        130 + index * 65,
                        350,
                        48
                    ),
                    location,
                    lambda location=location:
                        app.travel(location),
                )
            )

        self.buttons.append(
            Button(
                (30, 560, 140, 45),
                "Back",
                lambda:
                    app.set_screen("main"),
            )
        )

    def draw(self, surface):
        surface.fill(BG)

        centered(
            surface,
            "TRAVEL",
            30,
            34,
            WHITE,
            True,
        )

        panel(
            surface,
            pygame.Rect(
                80,
                120,
                380,
                390
            )
        )

        text(
            surface,
            "Choose a location",
            (115, 155),
            23,
            WHITE,
            True,
        )

        y = 210

        for name, data in self.app.locations.items():
            text(
                surface,
                name,
                (115, y),
                18,
                ORANGE,
            )

            text(
                surface,
                data["description"],
                (115, y + 25),
                13,
                GREY,
            )

            y += 75

        self.draw_buttons(surface)


class LeaderboardScreen(BaseScreen):
    def __init__(self, app):
        super().__init__(app)

        self.buttons = [
            Button(
                (30, 560, 140, 45),
                "Back",
                lambda:
                    app.set_screen("main"),
            )
        ]

    def draw(self, surface):
        surface.fill(BG)

        centered(
            surface,
            "LEADERBOARD",
            30,
            34,
            WHITE,
            True,
        )

        entries = sorted(
            self.app.state.leaderboard.items(),
            key=lambda item: item[1],
            reverse=True,
        )

        if not entries:
            centered(
                surface,
                "No scores yet.",
                250,
                20,
                GREY,
            )

        y = 130

        for index, (name, score) in enumerate(
            entries[:10],
            start=1
        ):
            panel(
                surface,
                pygame.Rect(
                    150,
                    y,
                    660,
                    45
                )
            )

            text(
                surface,
                f"{index}.",
                (175, y + 12),
                18,
                YELLOW,
                True,
            )

            text(
                surface,
                name,
                (230, y + 12),
                18,
                WHITE,
            )

            text(
                surface,
                str(score),
                (700, y + 12),
                18,
                GREEN,
                True,
            )

            y += 55

        self.draw_buttons(surface)


class MessageScreen(BaseScreen):
    def __init__(self, app, title, message):
        super().__init__(app)

        self.title = title
        self.message = message

        self.buttons = [
            Button(
                (410, 480, 140, 45),
                "Continue",
                lambda:
                    app.set_screen("main"),
            )
        ]

    def draw(self, surface):
        surface.fill(BG)

        panel(
            surface,
            pygame.Rect(
                120,
                150,
                720,
                360
            )
        )

        centered(
            surface,
            self.title,
            195,
            32,
            WHITE,
            True,
        )

        lines = self.message.split(
            "\n"
        )

        y = 270

        for line in lines:
            centered(
                surface,
                line,
                y,
                18,
                GREY,
            )
            y += 30

        self.draw_buttons(surface)
# Tung Tangle

A small Pygame adventure game where you train, explore,
fight rivals, collect items and evolve your Tung.

## Requirements

- Python 3.10+
- Pygame

## Installation

Install the dependency:

```bash
pip install -r requirements.txt
python main.py
