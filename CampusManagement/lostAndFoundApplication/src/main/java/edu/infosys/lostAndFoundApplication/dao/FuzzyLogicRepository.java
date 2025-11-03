package edu.infosys.lostAndFoundApplication.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import edu.infosys.lostAndFoundApplication.bean.FoundItem;

@Repository
public interface FuzzyLogicRepository extends JpaRepository<FoundItem,String> {

    
	 @Query("SELECT f FROM FoundItem f WHERE f.username <> ?1")
	    List<FoundItem> findFoundItemsExcludingUser(String username);
}