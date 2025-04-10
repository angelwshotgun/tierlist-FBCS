import { defineWebSocketHandler } from 'h3';
import { v4 as uuidv4 } from 'uuid';

const rooms = new Map(); // Lưu trữ thông tin phòng

export default defineWebSocketHandler({
  open(peer) {
    peer.send({ type: 'info', message: 'Please provide a roomId to join.' });
  },

  message(peer, message) {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'join') {
        // Client yêu cầu tham gia phòng
        const { roomId } = data;

        if (!roomId) {
          peer.send({ type: 'error', message: 'Invalid roomId' });
          return;
        }

        if (!rooms.has(roomId)) {
          rooms.set(roomId, {
            clients: [],
            timers: [600, 600], // Bộ đếm thời gian của hai client
            activeTimer: 0, // 0 = timer 1, 1 = timer 2
            interval: null,
          });
        }

        const room = rooms.get(roomId);
        room.clients.push(peer);
        peer.roomId = roomId;

        peer.send({ type: 'joined', roomId, message: 'Joined room successfully!' });

        if (room.clients.length === 1) {
          startTimer(roomId);
        }
      }

      if (data.type === 'switch') {
        // Khi client bấm, chuyển đổi bộ đếm
        const { roomId } = data;
        switchTimer(roomId);
      }
    } catch (err) {
      peer.send({ type: 'error', message: 'Invalid message format' });
    }
  },

  close(peer) {
    const roomId = peer.roomId;
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.clients = room.clients.filter((client) => client !== peer);

      if (room.clients.length === 0) {
        clearInterval(room.interval);
        rooms.delete(roomId);
      }
    }
  },
});

// Hàm bắt đầu bộ đếm thời gian
function startTimer(roomId: any) {
  const room = rooms.get(roomId);
  if (!room) return;

  if (room.interval) clearInterval(room.interval);

  room.interval = setInterval(() => {
    if (room.timers[room.activeTimer] > 0) {
      room.timers[room.activeTimer]--;
    }

    // Gửi cập nhật thời gian cho client
    room.clients.forEach((peer: { send: (arg0: { type: string; timers: any; }) => void; }) => {
      peer.send({ type: 'timer', timers: room.timers });
    });

    if (room.timers[room.activeTimer] === 0) {
      clearInterval(room.interval);
    }
  }, 1000);
}

// Chuyển đổi bộ đếm thời gian
function switchTimer(roomId: any) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.activeTimer = room.activeTimer === 0 ? 1 : 0;
  startTimer(roomId);
}
