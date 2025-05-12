package com.example.cloudbalance.repository;

import com.example.cloudbalance.entity.UserEntity;
import com.example.cloudbalance.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {
    Optional<UserEntity> findByEmail(String email);
    long countByAccounts_IdAndIdNot(Long accountId, Long userIdToExclude);
    List<UserEntity> findAllByRole(Role role);

}
