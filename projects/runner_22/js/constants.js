"use strict"

const LEVELS = 10
const GRAVITY = 0.05
const PARTICLE_DAMPING = 0.92

const TITLE_SIZE = 8
const INSTRUCTION_SIZE = 3
const BLOCK_SIZE = 100
const MAX_VELOCITY = 0.6
const REFRESH_PAUSE = 80

const BUTTON_SIZE = 100
const BUTTON_THICKNESS = 20
const BUTTON_COLOR = [0.7, 0.7, 0.7]
const BUTTON_PRESS_COLOR = [1, 1, 1]

const TEXT_COLOR = [1, 1, 1]
const TEXT_BAD_COLOR = [1, 0, 0]
const TEXT_SIZE = 5

const TRANSITION_SPEED = 0.02
const TRANSITION_COLOR = [0, 0, 0]

const MESSAGE_LIFETIME = 500
const MESSAGE_SIZE = 20

const CAMERA_SHAKE = 0.3
const CAMERA_SPEED = 0.08
const CAMERA_SHAKE_DURATION = 10

const WORLD_INITIAL_SIZE = 7
const WORLD_SIZE_INCREMENT = 2

const SMOKE_LIFETIME = 300
const SMOKE_MIN_SIZE = 0.1
const SMOKE_MAX_SIZE = 0.5
const SMOKE_GROWTH_SPEED = 0.01
const SMOKE_SPEED = 0.02
const SMOKE_COLLISION_RESPONSE = 0.01
const SMOKE_HEALTH_DECREASE = 0.001

const BUBBLE_LIFETIME = 200
const BUBBLE_MIN_SIZE = 0
const BUBBLE_MAX_SIZE = 0.1
const BUBBLE_GROWTH_SPEED = 0.01
const BUBBLE_SPEED = 0.01
const BUBBLE_COLOR = [0.4, 0.6, 1]

const PLANT_MIN_STEMS = 2
const PLANT_MAX_STEMS = 30
const PLANT_BOUNDARY_SIZE = 4
const PLANT_COLOR = [0, 1, 0]
const PLANT_FOLIAGE_GROWTH_SPEED = 0.1
const PLANT_FOLIAGE_MIN_SIZE = 0.1
const PLANT_FOLIAGE_MAX_SIZE = 0.15
const PLANT_FLOWER_POLLEN_COLOR = [1, 0.7, 0]
const PLANT_STEM_LENGTH = 0.3
const PLANT_LEAF_CHANCE = 3
const PLANT_FLOWER_CHANCE = 15
const PLANT_MIN_CHANCE = 1
const PLANT_MAX_CHANCE = 3
const PLANT_HEALTH_INCREASE = 0.0001
const PLANT_LEAF_BUBBLE_TIMER = 100
const PLANT_MIN_LEVEL = 3

const ITEM_SIZE = 0.3
const ITEM_SPEED = 0.2
const ITEM_WOBBLE = 0.05
const ITEM_COLOR = [0.5, 0.9, 0]
const ITEM_PUFF_COLOR = [0.9, 0.9, 0.9]

const BOMB_SIZE = 0.2
const BOMB_TIMER = 100
const BOMB_EXPLOSION_SIZE = 4
const BOMB_VERTICAL_SPEED = 0.2
const BOMB_HORIZONTAL_SPEED = 0.3

const SPARK_LIFETIME = 50
const SPARK_DENSITY = 10
const SPARK_SPEED = 0.05
const SPARK_SIZE = 0.4
const SPARK_WOBBLE = 0.05

const MACHINE_SIZE = 1
const MACHINE_FIRST_COLOR = [0.3, 0.3, 0.3]
const MACHINE_SECOND_COLOR = [0.5, 0.5, 0.5]
const MACHINE_GOOD_COLOR = [0, 0.9, 0]
const MACHINE_GOOD_SHADOW = [0, 1, 0]
const MACHINE_BAD_COLOR = [0.9, 0, 0]
const MACHINE_BAD_SHADOW = [1, 0, 0]
const MACHINE_SHADOW_BLUR = 20

const BELCHER_EMIT_INTERVAL = 1
const BELCHER_MIN_LEVEL = 4
const BELCHER_SMOKE_COLOR = [0.4, 0.3, 0]
const BELCHER_CHANCE = 20

const CHIMNEY_EMIT_INTERVAL = 2
const CHIMNEY_MIN_LEVEL = 2
const CHIMNEY_SMOKE_COLOR = [0, 0, 0]
const CHIMNEY_CHANCE = 10

const GENERATOR_EMIT_INTERVAL = 5
const GENERATOR_ROTATE_SPEED = 0.05
const GENERATOR_MIN_LEVEL = 5
const GENERATOR_CHANCE = 20

const LITTER_MIN_SIZE = 0.3
const LITTER_MAX_SIZE = 0.4
const LITTER_MIN_SEGMENTS = 6
const LITTER_MAX_SEGMENTS = 10
const LITTER_MIN_COUNT = 1
const LITTER_MAX_COUNT = 5

const PUFF_SIZE = 0.2
const PUFF_LIFETIME = 30
const PUFF_SPEED = 0.03

const WALL_SIZE = 1
const WALL_COLOR = [0.6, 0.6, 0.6]

const WATER_SIZE = 1
const WATER_COLOR = [0.3, 0.5, 0.9]

const LIFT_SIZE = 0.8
const LIFT_SPEED = 0.05
const LIFT_COLOR = [0.9, 0.9, 0.9]

const FISH_EYE_SIZE = 0.2
const FISH_FIN_SIZE = 0.3
const FISH_MIN_SIZE = 0.1
const FISH_MAX_SIZE = 0.35
const FISH_SPEED = 0.05
const FISH_BUBBLE_TIMER = 100
const FISH_EYE_COLOR = [0, 0, 0]
const FISH_MIN_LEVEL = 6

const CHARACTER_SPEED = 0.16
const CHARACTER_WOBBLE = 0.4
const CHARACTER_SPRING_SPEED = 0.13
const CHARACTER_ROTATE_SPEED = 0.2
const CHARACTER_PUFF_COLOR = [0.3, 0.3, 0.3]
const CHARACTER_FOOT_SIZE = 0.13
const CHARACTER_FOOT_DISTANCE = 0.6

const DUCK_HEAD_SIZE = 0.7
const DUCK_EYE_SIZE = 0.2
const DUCK_COLOR = [1, 0.7, 0]
const DUCK_SECOND_COLOR = [1, 0.5, 0]
const DUCK_EYE_COLOR = [0, 0, 0]
const DUCK_MIN_SIZE = 0.15
const DUCK_MAX_SIZE = 0.3
const DUCK_BOB_SPEED = 0.05
const DUCK_PECK_SPEED = 0.3
const DUCK_MIN_LEVEL = 3

const EGG_SIZE = 0.2
const EGG_VERTICAL_SPEED = 0.05
const EGG_HORIZONTAL_SPEED = 0.05
const EGG_HATCH_SPEED = 0.05
const EGG_HATCH_TIMER = 200
const EGG_COLOR = [0.8, 0.8, 0.7]

const PLAYER_SIZE = 0.6
const PLAYER_COLOR = [0.63, 0.5, 0]
const PLAYER_JUMP_FORCE = 0.4
const PLAYER_BLINK_SPEED = 0.3
const PLAYER_SQUINT_SPEED = 0.1
const PLAYER_FOOT_COLOR = [0.4, 0.4, 0.4]
const PLAYER_EYE_SIZE = 0.3
const PLAYER_EYE_COLOR = [0.9, 0.9, 0.9]
const PLAYER_EYE_LEVEL = 0.15
const PLAYER_PUPIL_SIZE = 0.13
const PLAYER_PUPIL_COLOR = [0, 0, 0]
const PLAYER_PUPIL_SPEED = 0.5
const PLAYER_SHADOW_COLOR = [1, 1, 1]
const PLAYER_SHADOW_BLUR = 100
const PLAYER_HEALTH_INCREASE = 0.0003

// const SKY_RED = 220
// const SKY_GREEN = 240
// const SKY_BLUE = 255