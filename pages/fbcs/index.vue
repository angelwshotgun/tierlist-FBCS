<template>
  <div class="min-h-screen bg-slate-900 text-white p-4 flex flex-col gap-4">
    <h1 class="text-center mb-4 text-gray-200 text-2xl">
      Honkai Star Rail Ban Pick
    </h1>

    <div class="flex justify-between items-start md:flex-row flex-col">
      <div
        class="w-full md:w-32 text-center bg-slate-800 rounded-lg p-4 flex flex-col items-center mb-4 md:mb-0"
      >
        <h2 class="mt-0 mb-2 text-lg">Opponent</h2>
        <div
          class="w-20 h-20 rounded-full bg-slate-700 overflow-hidden mb-2 flex items-center justify-center"
        >
          <img
            src="/images/icon/avatar/Profile_Picture_Acheron_-_Ambush.png"
            alt="Player 2"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="font-bold">Player2</div>
      </div>

      <div class="flex-1 mx-0 md:mx-4">
        <h3 class="text-center my-2 text-base">Ban List</h3>
        <div class="flex justify-between mb-4">
          <div class="flex gap-2">
            <div
              v-for="(char, index) in opponentBans"
              :key="`opponent-ban-${index}`"
              class="w-16 md:w-[70px] h-20 md:h-[90px] bg-slate-700 rounded-lg flex flex-col items-center justify-center overflow-hidden relative"
              :class="{ 'bg-slate-800 border-2 border-slate-600': char }"
            >
              <img
                v-if="char"
                :src="char.image"
                :alt="char.name"
                class="w-full h-[70%] object-cover"
              />
              <div
                v-if="char"
                class="text-xs text-center p-1 whitespace-nowrap overflow-hidden text-ellipsis w-full bg-black bg-opacity-70"
              >
                {{ char.name }}
              </div>
              <div v-else class="text-slate-500 text-xl">--</div>
            </div>
          </div>

          <div class="flex gap-2">
            <div
              v-for="(char, index) in playerBans"
              :key="`player-ban-${index}`"
              class="w-16 md:w-[70px] h-20 md:h-[90px] bg-slate-700 rounded-lg flex flex-col items-center justify-center overflow-hidden relative"
              :class="{ 'bg-slate-800 border-2 border-slate-600': char }"
            >
              <img
                v-if="char"
                :src="char.image"
                :alt="char.name"
                class="w-full h-[70%] object-cover"
              />
              <div
                v-if="char"
                class="text-xs text-center p-1 whitespace-nowrap overflow-hidden text-ellipsis w-full bg-black bg-opacity-70"
              >
                {{ char.name }}
              </div>
              <div v-else class="text-slate-500 text-xl">--</div>
            </div>
          </div>
        </div>

        <h3 class="text-center my-2 text-base">Pick List</h3>
        <div class="flex justify-between mb-4">
          <div class="flex gap-2 flex-wrap md:flex-nowrap">
            <div
              v-for="(char, index) in opponentPicks"
              :key="`opponent-pick-${index}`"
              class="w-16 md:w-[70px] h-20 md:h-[90px] bg-slate-700 rounded-lg flex flex-col items-center justify-center overflow-hidden relative"
              :class="{
                'bg-slate-800 border-2 border-slate-600': char,
                'border-2 border-yellow-400':
                  selectedSlot === `opponent-pick-${index}`,
              }"
            >
              <img
                v-if="char"
                :src="char.image"
                :alt="char.name"
                class="w-full h-[70%] object-cover"
              />
              <div
                v-if="char"
                class="text-xs text-center p-1 whitespace-nowrap overflow-hidden text-ellipsis w-full bg-black bg-opacity-70"
              >
                {{ char.name }}
              </div>
              <div v-else class="text-slate-500 text-xl">--</div>
            </div>
          </div>

          <div class="flex gap-2 flex-wrap md:flex-nowrap">
            <div
              v-for="(char, index) in playerPicks"
              :key="`player-pick-${index}`"
              class="w-16 md:w-[70px] h-20 md:h-[90px] bg-slate-700 rounded-lg flex flex-col items-center justify-center overflow-hidden relative"
              :class="{
                'bg-slate-800 border-2 border-slate-600': char,
                'border-2 border-yellow-400':
                  selectedSlot === `player-pick-${index}`,
              }"
            >
              <img
                v-if="char"
                :src="char.image"
                :alt="char.name"
                class="w-full h-[70%] object-cover"
              />
              <div
                v-if="char"
                class="text-xs text-center p-1 whitespace-nowrap overflow-hidden text-ellipsis w-full bg-black bg-opacity-70"
              >
                {{ char.name }}
              </div>
              <div v-else class="text-slate-500 text-xl">--</div>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-4 my-4">
          <button
            label="BAN"
            class="p-button-rounded bg-red-500 border-0"
            @click="handleBan"
          />
          <button
            label="PICK"
            class="p-button-rounded bg-blue-500 border-0"
            @click="handlePick"
          />
        </div>

        <div class="flex justify-center gap-8 my-4">
          <div class="flex justify-center gap-4 my-4">
            <span
            v-for="element in elements"
            :key="element.name"
            class="h-10 w-10 p-1 rounded border-[2px] border-solid border-slate-800 flex items-center justify-center"
          >
            <img 
              :src="'/images/icon/element/' + element.name + '.png'" 
              class="w-full h-full object-contain mx-auto my-auto"
            ></img>
          </span>
          </div>
          <div class="flex justify-center gap-4 my-4">
            <span
            v-for="element in paths"
            :key="element.name"
            class="h-10 w-10 p-1 rounded border-[2px] border-solid border-slate-800 flex items-center justify-center"
          >
            <img 
              :src="'/images/icon/path/' + element.name + '.png'" 
              class="w-full h-full object-contain mx-auto my-auto"
            ></img>
          </span>
          </div>
        </div>
      </div>

      <div
        class="w-full md:w-32 text-center bg-slate-800 rounded-lg p-4 flex flex-col items-center"
      >
        <h2 class="mt-0 mb-2 text-lg">You</h2>
        <div
          class="w-20 h-20 rounded-full bg-slate-700 overflow-hidden mb-2 flex items-center justify-center"
        >
          <img
            src="/images/icon/avatar/Profile_Picture_Tribbie_-_Delicacies.png"
            alt="Player 1"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="font-bold">Player1</div>
      </div>
    </div>

    <div
      class="flex flex-wrap justify-center gap-2 mt-4"
    >
      <div
      v-for="character in charactersData"
      :key="character.id"
      class="w-[80px] h-[100px] bg-slate-800 rounded-lg overflow-hidden relative cursor-pointer transition-transform duration-200 hover:-translate-y-1"
      :class="{
        'opacity-50 pointer-events-none':
        isBanned(character) || isPicked(character),
        'border-2 border-blue-500': isPicked(character),
      }"
      @click="selectCharacter(character)"
      >
      <img
        :src="urlImg + character.icon"
        :alt="character.name"
        class="w-full h-[79%] object-cover"
      />
      <div
        class="text-xs text-center p-1 whitespace-nowrap overflow-hidden text-ellipsis w-full bg-black bg-opacity-70"
      >
        {{ character.name }}
      </div>

      <!-- <div
        v-if="character.rarity"
        class="absolute top-0 left-0 bg-black bg-opacity-70 p-0.5 text-xs text-yellow-400"
      >
        <i v-for="n in character.rarity" :key="n" class="pi pi-star-fill"></i>
      </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { GameDataService } from '~/services/GameDataService.ts';

definePageMeta({
  layout: false,
  auth: false,
});
const urlImg = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/';

// Game state
const playerBans = ref([null, null, null, null]);
const opponentBans = ref([
  null,
  null,
  null,
  null,
]);
const playerPicks = ref([
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
]);
const opponentPicks = ref([
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
]);

const elements = ref([
  { name: 'Fire', icon: 'pi pi-wind' },
  { name: 'Ice', icon: 'pi pi-snowflake' },
  { name: 'Imaginary', icon: 'pi pi-leaf' },
  { name: 'Physical', icon: 'pi pi-bolt' },
  { name: 'Quantum', icon: 'pi pi-mountain' },
  { name: 'Thunder', icon: 'pi pi-water' },
  { name: 'Wind', icon: 'pi pi-fire' },
]);
const paths = ref([
  { name: 'Abundance' },
  { name: 'Destruction' },
  { name: 'Erudition' },
  { name: 'Harmony' },
  { name: 'Hunt' },
  { name: 'Joy' },
  { name: 'Remembrance' },
  { name: 'Nihility' },
  { name: 'Preservation' },
  ]);
const selectedCharacter = ref(null);
const selectedSlot = ref(null);
const currentAction = ref(null); // 'ban' or 'pick'

// Check if a character is banned
const isBanned = (character) => {
  return [...playerBans.value, ...opponentBans.value].some(
    (ban) => ban && ban.id === character.id
  );
};

// Check if a character is picked
const isPicked = (character) => {
  return [...playerPicks.value, ...opponentPicks.value].some(
    (pick) => pick && pick.id === character.id
  );
};

// Select a character from the grid
const selectCharacter = (character) => {
  if (isBanned(character) || isPicked(character)) return;
  selectedCharacter.value = character;
};

// Handle ban action
const handleBan = () => {
  currentAction.value = 'ban';
  // Logic for ban action
};

// Handle pick action
const handlePick = () => {
  currentAction.value = 'pick';
  // Logic for pick action
};

const { data: charactersData, pending, error } = useDataApi();
console.log(charactersData.value);

</script>
