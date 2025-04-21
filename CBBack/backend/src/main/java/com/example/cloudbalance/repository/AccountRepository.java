package com.example.cloudbalance.repository;

import com.example.cloudbalance.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface AccountRepository extends JpaRepository<AccountEntity,Long> {
    List<AccountEntity> findByOrphanTrue();

}
