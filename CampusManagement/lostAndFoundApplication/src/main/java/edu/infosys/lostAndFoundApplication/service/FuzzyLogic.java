package edu.infosys.lostAndFoundApplication.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import edu.infosys.lostAndFoundApplication.bean.FoundItem;
import edu.infosys.lostAndFoundApplication.bean.LostItem;
import edu.infosys.lostAndFoundApplication.dao.FuzzyLogicRepository; // MODIFIED IMPORT
import edu.infosys.lostAndFoundApplication.dao.LostItemRepository;

@Service
public class FuzzyLogic {

    @Autowired
    private LostItemRepository lostItemRepository;

    @Autowired
    private FuzzyLogicRepository fuzzyLogicRepository; // MODIFIED DEPENDENCY

    private final JaroWinklerSimilarity jaro = new JaroWinklerSimilarity();

    public List<FoundItem> findMatchingFoundItems(String lostItemId, double threshold) {
        Optional<LostItem> lostItemOptional = lostItemRepository.findById(lostItemId);

        if (lostItemOptional.isEmpty()) {
            return Collections.emptyList();
        }
        LostItem lostItem = lostItemOptional.get();
        String usernameOfLoser = lostItem.getUsername();

        List<FoundItem> foundItemsFromOthers = fuzzyLogicRepository.findFoundItemsExcludingUser(usernameOfLoser);

        List<FoundItem> matches = new ArrayList<>();

        for (FoundItem foundItem : foundItemsFromOthers) {
            double itemNameScore = jaro.apply(lostItem.getItemName(), foundItem.getItemName());
            double brandScore = jaro.apply(lostItem.getBrand(), foundItem.getBrand());
            double colorScore = jaro.apply(lostItem.getColor(), foundItem.getColor());
            double categoryScore = jaro.apply(lostItem.getCategory(), foundItem.getCategory());

            double averageScore = (itemNameScore * 0.5) + (brandScore * 0.2) + (colorScore * 0.2) + (categoryScore * 0.1);

            if (averageScore >= threshold) {
                matches.add(foundItem);
            }
        }
        return matches;
    }
}