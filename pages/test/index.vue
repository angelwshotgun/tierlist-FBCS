<script setup lang="ts">
import { useWebSocket } from '@vueuse/core';
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid'; // Thư viện tạo UUID

// Kết nối WebSocket
const { status, data, send } = useWebSocket('ws://localhost:3001/api/websocket');

const roomId = ref('');
const isConnected = ref(false);
const messages = ref<string[]>([]);
const timers = ref([600, 600]);
const activeTimer = ref(0); // 0 = Timer 1, 1 = Timer 2

// Theo dõi tin nhắn từ server
watch(data, (newData) => {
  if (newData) {
    try {
      const parsed = JSON.parse(newData);
      if (parsed.type === 'joined') {
        isConnected.value = true;
      } else if (parsed.type === 'timer') {
        timers.value = parsed.timers;
      }
      messages.value.push(`server: ${JSON.stringify(parsed)}`);
    } catch (err) {
      messages.value.push(`server: ${newData}`);
    }
  }
});

// Tạo phòng mới với UUID
function createRoom() {
  roomId.value = uuidv4(); // Tạo UUID mới
  joinRoom();
}

// Tham gia phòng WebSocket
function joinRoom() {
  if (!roomId.value) {
    alert('Vui lòng nhập UUID của phòng!');
    return;
  }
  send(JSON.stringify({ type: 'join', roomId: roomId.value }));
}

// Chuyển bộ đếm thời gian
function switchTimer() {
  send(JSON.stringify({ type: 'switch', roomId: roomId.value }));
}
</script>

<template>
  <div class="container">
    <h2>WebSocket Game</h2>

    <!-- Tạo phòng hoặc tham gia -->
    <div v-if="!isConnected" class="join-room">
      <input v-model="roomId" placeholder="Nhập Room ID (UUID)" />
      <button @click="joinRoom">Tham gia</button>
      <button @click="createRoom">Tạo phòng mới</button>
    </div>

    <!-- Giao diện sau khi tham gia -->
    <div v-else class="game">
      <h3>Room ID: {{ roomId }}</h3>

      <div class="timers">
        <div :class="{ active: activeTimer === 0 }">
          ⏳ Timer 1: {{ timers[0] }}s
        </div>
        <div :class="{ active: activeTimer === 1 }">
          ⏳ Timer 2: {{ timers[1] }}s
        </div>
      </div>

      <button @click="switchTimer">Chuyển lượt</button>

      <ul class="messages">
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.join-room input {
  padding: 8px;
  margin-right: 10px;
}
.join-room button {
  padding: 8px;
  margin: 5px;
}
.game .timers {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}
.timers div {
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  width: 100px;
  text-align: center;
  border: 2px solid #000;
  border-radius: 5px;
}
.active {
  background: lightgreen;
}
button {
  padding: 10px;
  margin: 10px;
  font-size: 16px;
}
.messages {
  margin-top: 20px;
  text-align: left;
  max-height: 200px;
  overflow-y: auto;
}
</style>
