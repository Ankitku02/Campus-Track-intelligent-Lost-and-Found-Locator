package edu.infosys.lostAndFoundApplication.controller;

import edu.infosys.lostAndFoundApplication.bean.ChatMessage;
import edu.infosys.lostAndFoundApplication.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class ChatController {

    private static final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setType("CHAT");
        chatService.saveMessage(chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String username = chatMessage.getSender();
        headerAccessor.getSessionAttributes().put("username", username);
        onlineUsers.add(username);
        chatMessage.setType("JOIN");
        chatMessage.setContent("👋 " + username + " joined the chat");
        messagingTemplate.convertAndSend("/topic/online", onlineUsers);
        chatService.saveMessage(chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat.leaveUser")
    @SendTo("/topic/public")
    public ChatMessage removeUser(@Payload ChatMessage chatMessage) {
        onlineUsers.remove(chatMessage.getSender());
        chatMessage.setType("LEAVE");
        chatMessage.setContent("❌ " + chatMessage.getSender() + " left the chat");
        messagingTemplate.convertAndSend("/topic/online", onlineUsers);
        chatService.saveMessage(chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat.onlineUsers")
    @SendTo("/topic/online")
    public Set<String> onlineList() {
        return onlineUsers;
    }
}
