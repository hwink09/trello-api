// Params socket sẽ được lấy từ thư viện socket.io
export const inviteUserToBoardSocket = (socket) => {
  // Lắng nghe sự kiện mà client emit lên server
  socket.on('FE_USER_INVITED_TO_BOARD', (data) => {
    // Cách làm nhanh và đơn giản nhất là emit ngược lại một sự kiện về cho mọi client khác (trừ client hiện tại), rồi để FE check
    // data có dạng { invitation: {...} } nên cần lấy ra invitation
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', data.invitation)
  })
}