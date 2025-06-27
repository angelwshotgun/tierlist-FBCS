const gameState = new Map(); // Store game state for each room

export default defineWebSocketHandler({
  open(peer) {
    peer.send({ user: 'server', message: `Welcome ${peer}!` });
    peer.publish('chat', { user: 'server', message: `${peer} joined!` });
    peer.subscribe('chat');
  },
  error(peer, err) {
    console.error(err);
  },
  upgrade(peer) {
    console.log('upgrade');
  },

  message(peer, message) {
    try {
      const data = JSON.parse(message.toString());
      console.log(data);
      switch (data.type) {
        case 'chat':
          peer.publish('chat', data);
          break;
        case 'create':
          const roomId = data.roomId;
          peer.context.roomId = roomId;
          peer.subscribe(roomId);
          gameState.set(roomId, {
            players: [],
            gameData: {
              phase: [
                {
                  order: 0,
                  team: 'team1',
                  type: 'select',
                  data: 'character',
                  index: 0,
                },
                {
                  order: 1,
                  team: 'team2',
                  type: 'select',
                  data: 'character',
                  index: 0,
                },
                {
                  order: 2,
                  team: 'team2',
                  type: 'select',
                  data: 'character',
                  index: 1,
                },
                {
                  order: 3,
                  team: 'team1',
                  type: 'select',
                  data: 'character',
                  index: 1,
                },
                {
                  order: 4,
                  team: 'team1',
                  type: 'ban',
                  data: 'character',
                  index: 0,
                },
                {
                  order: 5,
                  team: 'team2',
                  type: 'ban',
                  data: 'character',
                  index: 1,
                },
                {
                  order: 6,
                  team: 'team2',
                  type: 'ban',
                  data: 'lightcone',
                  index: 2,
                },
                {
                  order: 7,
                  team: 'team1',
                  type: 'ban',
                  data: 'lightcone',
                  index: 3,
                },
                {
                  order: 8,
                  team: 'team2',
                  type: 'select',
                  data: 'character',
                  index: 2,
                },
                {
                  order: 9,
                  team: 'team1',
                  type: 'select',
                  data: 'character',
                  index: 2,
                },
                {
                  order: 10,
                  team: 'team1',
                  type: 'select',
                  data: 'character',
                  index: 3,
                },
                {
                  order: 11,
                  team: 'team2',
                  type: 'select',
                  data: 'character',
                  index: 3,
                },
                {
                  order: 12,
                  team: 'team2',
                  type: 'select',
                  data: 'character',
                  index: 4,
                },
                {
                  order: 13,
                  team: 'team1',
                  type: 'select',
                  data: 'character',
                  index: 4,
                },
                {
                  order: 14,
                  team: 'team1',
                  type: 'select',
                  data: 'character',
                  index: 5,
                },
                {
                  order: 15,
                  team: 'team2',
                  type: 'select',
                  data: 'character',
                  index: 5,
                },
                {
                  order: 16,
                  team: 'team2',
                  type: 'select',
                  data: 'character',
                  index: 6,
                },
                {
                  order: 17,
                  team: 'team1',
                  type: 'select',
                  data: 'character',
                  index: 6,
                },
                {
                  order: 18,
                  team: 'team1',
                  type: 'select',
                  data: 'character',
                  index: 7,
                },
                {
                  order: 19,
                  team: 'team2',
                  type: 'select',
                  data: 'character',
                  index: 7,
                },
              ],
              currentPhase: 0,
              team1: {
                characters: [
                  {
                    name: '',
                    e: 0,
                    point: 0,
                  },
                ],
                lightcones: [
                  {
                    name: '',
                    s: 1,
                    point: 0,
                  },
                ],
                buff: '',
              },
              team2: {
                characters: [
                  {
                    name: '',
                    e: 0,
                    point: 0,
                  },
                ],
                lightcones: [
                  {
                    name: '',
                    s: 1,
                    point: 0,
                  },
                ],
                buff: '',
              },
              timer: [900, 900],
            },
            lastUpdate: Date.now(),
            activeTimer: null,
            timerPaused: true,
          });
          peer.publish('chat', {
            type: 'room_created',
            roomId: roomId,
          });
          peer.send({
            user: 'server',
            message: `Phòng: ${roomId} đã được tạo!`,
          });
          startTimerForRoom(roomId, peer);
          break;
        case 'join':
          const targetRoom = data.roomId;
          peer.context.team = data.team;
          peer.context.roomId = data.roomId;
          peer.subscribe(targetRoom);
          // Add player to room state
          if (gameState.has(targetRoom)) {
            const roomState = gameState.get(targetRoom);
            roomState.players.push({
              team: data.team,
              peerId: peer.id,
            });
            gameState.set(targetRoom, roomState);
          }
          peer.publish(targetRoom, {
            user: 'server',
            message: `${peer.context.team} tham gia phòng ${targetRoom}`,
          });
          peer.send({
            user: 'server',
            message: `Bạn đã tham gia phòng ${targetRoom}`,
          });
          break;
        case 'leave':
          peer.publish('chat', data);
          break;
        case 'select':
          peer.publish('chat', data);
          break;
        case 'data':
          if (peer.context.roomId) {
            // Get game state
            const roomState = gameState.get(peer.context.roomId);
            if (roomState) {
              peer.send({
                user: peer.context.team,
                data: peer.context.roomId,
                gameState: JSON.stringify(gameState.get(peer.context.roomId)),
              });
            }
          } else {
            peer.send({ user: 'server', message: `error!` });
          }
          break;
        case 'select_character':
          const currentRoomId = peer.context.roomId;
          const roomState = gameState.get(currentRoomId);

          if (!roomState) {
            peer.send({ user: 'server', message: 'Room not found!' });
            return;
          }

          // Get current phase information
          const currentPhaseIndex = roomState.gameData.currentPhase;
          const currentPhase = roomState.gameData.phase[currentPhaseIndex];

          // Check if it's the correct team's turn
          if (currentPhase.team !== peer.context.team) {
            peer.send({
              user: 'server',
              message: `It's not your team's turn! Current turn: ${currentPhase.team}`,
            });
            return;
          }

          // Process the selection based on the phase type
          if (currentPhase.type === 'select') {
            // Handle character or lightcone selection
            if (currentPhase.data === 'character') {
              const characterIndex = currentPhase.index;
              const selectedCharacter = {
                name: data.characterName,
                e: data.eidolon || 0,
                point: data.point || 0,
              };

              // Add the selected character to the appropriate team
              if (currentPhase.team === 'team1') {
                roomState.gameData.team1.characters[characterIndex] =
                  selectedCharacter;
              } else {
                roomState.gameData.team2.characters[characterIndex] =
                  selectedCharacter;
              }

              // Broadcast the selection to the room
              peer.publish(roomId, {
                type: 'character_selected',
                team: currentPhase.team,
                character: selectedCharacter,
                index: characterIndex,
              });
            } else if (currentPhase.data === 'lightcone') {
              const lightconeIndex = currentPhase.index;
              const selectedLightcone = {
                name: data.lightconeName,
                s: data.superimposition || 1,
                point: data.point || 0,
              };

              // Add the selected lightcone to the appropriate team
              if (currentPhase.team === 'team1') {
                roomState.gameData.team1.lightcones[lightconeIndex] =
                  selectedLightcone;
              } else {
                roomState.gameData.team2.lightcones[lightconeIndex] =
                  selectedLightcone;
              }

              // Broadcast the selection to the room
              peer.publish(roomId, {
                type: 'lightcone_selected',
                team: currentPhase.team,
                lightcone: selectedLightcone,
                index: lightconeIndex,
              });
            }
          } else if (currentPhase.type === 'ban') {
            // Handle character or lightcone banning
            if (currentPhase.data === 'character') {
              // Record the banned character
              const bannedCharacter = data.characterName;

              // Broadcast the ban to the room
              peer.publish(roomId, {
                type: 'character_banned',
                team: currentPhase.team,
                character: bannedCharacter,
                index: currentPhase.index,
              });
            } else if (currentPhase.data === 'lightcone') {
              // Record the banned lightcone
              const bannedLightcone = data.lightconeName;

              // Broadcast the ban to the room
              peer.publish(roomId, {
                type: 'lightcone_banned',
                team: currentPhase.team,
                lightcone: bannedLightcone,
                index: currentPhase.index,
              });
            }
          }

          // Update last activity timestamp
          roomState.lastUpdate = Date.now();

          // Move to the next phase if available
          if (currentPhaseIndex < roomState.gameData.phase.length - 1) {
            roomState.gameData.currentPhase++;

            // Notify clients about phase change
            peer.publish(roomId, {
              type: 'phase_changed',
              currentPhase: roomState.gameData.currentPhase,
              phaseInfo:
                roomState.gameData.phase[roomState.gameData.currentPhase],
            });
          } else {
            // Game draft is complete
            peer.publish(roomId, {
              type: 'draft_complete',
              team1: roomState.gameData.team1,
              team2: roomState.gameData.team2,
            });
          }

          // Update the game state in the map
          gameState.set(roomId, roomState);

          // Inform all clients of the updated game state
          peer.publish(roomId, {
            type: 'game_state_updated',
            gameState: roomState.gameData,
          });
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
    }
  },
  close(peer) {
    if (peer.context.roomId) {
      // Remove player from game state
      const roomState = gameState.get(peer.context.roomId);
      if (roomState) {
        roomState.players = roomState.players.filter(
          (p: { peerId: string }) => p.peerId !== peer.id
        );
        gameState.set(peer.context.roomId, roomState);
      }
      peer.publish(peer.context.roomId.toString(), {
        user: 'server',
        message: `${peer} left!`,
        gameState: gameState.get(peer.context.roomId),
      });
    } else {
      peer.publish('chat', { user: 'server', message: `${peer} left!` });
    }
  },
});

function startTimerForRoom(roomId: string, peer: any) {
  const roomState = gameState.get(roomId);
  if (!roomState) return;

  if (roomState.activeTimer) clearInterval(roomState.activeTimer);

  roomState.timerPaused = false;

  const timer = setInterval(() => {
    const now = Date.now();
    const currentPhase =
      roomState.gameData.phase[roomState.gameData.currentPhase];
    const currentTeam = currentPhase.team;

    // team1 -> index 0, team2 -> index 1
    const teamIndex = currentTeam === 'team1' ? 0 : 1;

    // Trừ thời gian mỗi giây
    roomState.gameData.timer[teamIndex] -= 1;

    // Gửi update thời gian còn lại
    peer.publish(roomId, {
      type: 'timer',
      timer: roomState.gameData.timer,
      currentTeam: currentTeam,
    });
    peer.publish(roomId, {
      type: 'timer',
      timer: roomState.gameData.timer,
      currentTeam: currentTeam,
    });
    console.log(roomId);
    console.log(roomState.gameData.timer);
    
    // Hết thời gian: auto skip phase
    if (roomState.gameData.timer[teamIndex] <= 0) {
      clearInterval(timer);
      roomState.timerPaused = true;

      peer.publish(roomId, {
        type: 'timer',
        timer: roomState.gameData.timer,
        currentTeam: currentTeam,
      });

      // Tự động chuyển phase nếu có
      if (
        roomState.gameData.currentPhase <
        roomState.gameData.phase.length - 1
      ) {
        roomState.gameData.currentPhase++;
        peer.publish(roomId, {
          type: 'timer',
          timer: roomState.gameData.timer,
          currentTeam: currentTeam,
        });

        startTimerForRoom(roomId, peer); // Bắt đầu lại timer cho phase mới
      } else {
        peer.publish(roomId, {
          type: 'timer',
          timer: roomState.gameData.timer,
          currentTeam: currentTeam,
        });
      }
    }

    const stateToSave = { ...roomState };
    delete stateToSave.activeTimer;
    gameState.set(roomId, stateToSave);
  }, 1000);

  roomState.activeTimer = timer;
  const stateToSave = { ...roomState };
  delete stateToSave.activeTimer;
  gameState.set(roomId, stateToSave);
}
