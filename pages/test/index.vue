<script setup lang="ts">
const { status, data, send, open, close } = useWebSocket(
  'ws://localhost:3000/api/websocket'
);
const messages = ref<string[]>([]);

watch(data, async (newData) => {
  if (newData instanceof Blob) {
    const text = await newData.text();
    messages.value.push('server:', text);
    console.log(data.value);
  } else if (typeof newData === 'string') {
    messages.value.push('server:', newData);
    console.log(data.value);
  } else if (newData) {
    messages.value.push('server:', JSON.stringify(newData));
  }
});
const type = ref('');
const roomId = ref('');
const team = ref('');

function sendData() {
  send(
    JSON.stringify({
      roomId: roomId.value,
      type: type.value,
      team: team.value
    })
  );
}
</script>

<template>
  <div>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
    <input v-model="type" placeholder="Nhập type..." />
    <input v-model="roomId" placeholder="Nhập roomId..." />
    <input v-model="team" placeholder="Nhập team..." />
    <button @click="sendData">Gửi</button>
  </div>
</template>
