package edu.infosys.lostAndFoundApplication.service;

import edu.infosys.lostAndFoundApplication.bean.LostItem;
import edu.infosys.lostAndFoundApplication.dao.LostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LostItemService {

    @Autowired
    private LostItemRepository lostItemRepository;

    public synchronized String generateNextLostItemId() {
        Long maxId = lostItemRepository.findMaxIdNumber();
        long nextId = (maxId == null) ? 1 : maxId + 1;
        return String.format("L%04d", nextId);
    }

    public LostItem addLostItem(LostItem lostItem) {
        lostItem.setLostItemId(generateNextLostItemId());
        return lostItemRepository.save(lostItem);
    }

    public List<LostItem> getAllLostItems() {
        return lostItemRepository.findAll();
    }

    public Optional<LostItem> getLostItemById(String id) {
        return lostItemRepository.findById(id);
    }

    public void deleteLostItem(String id) {
        lostItemRepository.deleteById(id);
    }

    public List<LostItem> getLostItemsByUsername(String username) {
        return lostItemRepository.findByUsername(username);
    }
}