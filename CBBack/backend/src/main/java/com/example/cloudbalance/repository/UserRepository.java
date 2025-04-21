package com.example.cloudbalance.repository;

import com.example.cloudbalance.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {
    Optional<UserEntity> findByEmail(String email);
    long countByAccounts_IdAndIdNot(Long accountId, Long userIdToExclude);



}
