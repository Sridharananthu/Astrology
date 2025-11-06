import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private connectedUsers: Map<string, string> = new Map(); // socket.id -> userId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    this.connectedUsers.set(client.id, userId);
    console.log(`User ${userId} joined`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { senderId: string; receiverId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Message from ${data.senderId} -> ${data.receiverId}: ${data.message}`);
    client.broadcast.emit('message', data);
  }
  @SubscribeMessage('callUser')
handleCallUser(
  @MessageBody() data: { to: string; offer: RTCSessionDescriptionInit },
  @ConnectedSocket() client: Socket,
) {
  client.to(data.to).emit('incomingCall', { from: client.id, offer: data.offer });
}

@SubscribeMessage('answerCall')
handleAnswerCall(
  @MessageBody() data: { to: string; answer: RTCSessionDescriptionInit },
  @ConnectedSocket() client: Socket,
) {
  client.to(data.to).emit('callAccepted', { answer: data.answer });
}

@SubscribeMessage('iceCandidate')
handleIceCandidate(
  @MessageBody() data: { to: string; candidate: RTCIceCandidate },
  @ConnectedSocket() client: Socket,
) {
  client.to(data.to).emit('iceCandidate', data.candidate);
}

}