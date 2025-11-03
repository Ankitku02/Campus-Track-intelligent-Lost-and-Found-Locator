package edu.infosys.lostAndFoundApplication.controller;

import edu.infosys.lostAndFoundApplication.bean.ChatMessage;
import edu.infosys.lostAndFoundApplication.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    private final ChatService chatService;

    public ChatRestController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/messages")
    public List<ChatMessage> getAllMessages() {
        return chatService.getAllMessages();
    }
}

