package edu.infosys.lostAndFoundApplication.dao;

import edu.infosys.lostAndFoundApplication.bean.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, String> {

    @Query("SELECT l FROM LostItem l WHERE l.username = ?1")
    List<LostItem> findByUsername(String username);

    @Query(value = "SELECT MAX(CAST(SUBSTRING(lost_item_id, 2) AS UNSIGNED)) FROM lost_item", nativeQuery = true)
    Long findMaxIdNumber();
    
/* // Keyword search (LIKE for partial match)
    @Query("SELECT l FROM LostItem l WHERE " +
           "LOWER(l.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.color) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "+
           "LOWER(l.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
     List<LostItem> searchByKeyword(String keyword);
 
    // Fuzzy matching using SOUNDEX
    @Query(value = "SELECT * FROM lost_item WHERE " +
            "SOUNDEX(item_name) = SOUNDEX(:keyword) OR " +
            "SOUNDEX(color) = SOUNDEX(:keyword) OR " +
            "SOUNDEX(brand) = SOUNDEX(:keyword) OR " +
            "SOUNDEX(location) = SOUNDEX(:keyword) OR " +
            "SOUNDEX(category) = SOUNDEX(:keyword)", nativeQuery = true)
    List<LostItem> fuzzySearchBySoundex(String keyword);*/

}