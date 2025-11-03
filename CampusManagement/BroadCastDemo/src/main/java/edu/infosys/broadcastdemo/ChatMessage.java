package edu.infosys.broadcastdemo;

public class ChatMessage {
	
	private String type;  // "QUESTION" or "ANSWER"
    private String sender;
    private String content;
    public ChatMessage() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ChatMessage(String type, String sender, String content) {
		super();
		this.type = type;
		this.sender = sender;
		this.content = content;
	}
	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * @return the sender
	 */
	public String getSender() {
		return sender;
	}
	/**
	 * @param sender the sender to set
	 */
	public void setSender(String sender) {
		this.sender = sender;
	}
	/**
	 * @return the content
	 */
	public String getContent() {
		return content;
	}
	/**
	 * @param content the content to set
	 */
	public void setContent(String content) {
		this.content = content;
	}
	
}
